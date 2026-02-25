import { buildOtpuskQueryString, OtpuskApiResponse } from "@/lib/tat-api";

// ─── Otpusk TourScanner service ─────────────────────────────────────────────
// All external requests to api.otpusk.com go through here.
// Frontend must NEVER call api.otpusk.com directly.

interface TestConnectionParams {
  endpoint: string;
  authKey: string;
  currency?: string;
}

export interface TatTestResult {
  success: boolean;
  message?: string;
  error?: string;
  details?: string;
  url?: string;
  httpStatus?: number;
  responseSnippet?: string;
  durationMs?: number;
}

// Last request info for /debug endpoint
const debugState = {
  lastUrl: "",
  lastStatus: 0,
  lastError: "",
  lastTestedAt: "",
};

export function buildTourscannerUrl(params: TestConnectionParams): string {
  const qp = new URLSearchParams();
  if (params.authKey) qp.set("access_token", params.authKey);
  qp.set("currencyLocal", params.currency || "eur");
  qp.set("group", "1");
  qp.set("availableFlight", "yes");
  qp.set("stopSale", "yes,request");
  qp.set("lang", "eng");
  qp.set("data", "extlinks");
  qp.set("number", "0"); // Just for testing connection, get first batch
  qp.set("page", "1"); // Just for testing connection
  // Add minimal required params for a valid request
  qp.set("from", "870"); // Example: Berlin
  qp.set("to", "115"); // Example: Turkey
  const today = new Date();
  const checkIn = today.toISOString().split("T")[0];
  const checkTo = new Date(today.setDate(today.getDate() + 7)).toISOString().split("T")[0];
  qp.set("checkIn", checkIn);
  qp.set("checkTo", checkTo);
  qp.set("nights", "7");
  qp.set("nightsTo", "7");
  qp.set("people", "200"); // 2 adults, 0 children

  return `${params.endpoint.replace(/\/$/, "")}?${qp.toString()}`;
}

export function validateTatResponse(
  status: number,
  body: string
): { ok: boolean; reason?: string } {
  if (status === 401) return { ok: false, reason: "Неверный токен авторизации (401 Unauthorized)" };
  if (status === 403) return { ok: false, reason: "Доступ запрещён (403 Forbidden) — проверьте access_token" };
  if (status === 404) return { ok: false, reason: "Эндпоинт не найден (404) — проверьте URL" };
  if (status >= 500)  return { ok: false, reason: `Ошибка сервера Otpusk (${status})` };
  if (status !== 200) return { ok: false, reason: `Неожиданный HTTP статус: ${status}` };

  try {
    const data = JSON.parse(body) as OtpuskApiResponse;
    if (data.error) {
      return { ok: false, reason: `API вернул ошибку: ${data.error} - ${data.message}` };
    }
    // Check for expected fields to confirm it's a valid Otpusk response
    if (!data.hotels || !data.results) {
      return { ok: false, reason: "Ответ API не содержит ожидаемых данных (hotels или results)" };
    }
  } catch (e) {
    return { ok: false, reason: `Невалидный JSON ответ: ${e}` };
  }

  return { ok: true };
}

export async function testConnection(
  params: TestConnectionParams
): Promise<TatTestResult> {
  const url = buildTourscannerUrl(params);
  debugState.lastUrl = url;
  debugState.lastTestedAt = new Date().toISOString();

  console.log("[OTPUSK] Testing connection...");
  console.log("[OTPUSK] Request URL:", url.replace(/access_token=[^&]+/, "access_token=***"));

  const start = Date.now();

  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 15000);

    const res = await fetch(url, {
      method: "GET",
      headers: {
        "User-Agent": "Monotours24/1.0",
        Accept: "application/json",
      },
      redirect: "follow",
      signal: controller.signal,
    });

    clearTimeout(timer);
    const durationMs = Date.now() - start;
    debugState.lastStatus = res.status;
    debugState.lastError = "";

    const body = await res.text();
    const snippet = body.slice(0, 500);

    console.log(`[OTPUSK] Response: HTTP ${res.status} in ${durationMs}ms`);

    const validation = validateTatResponse(res.status, body);
    if (!validation.ok) {
      debugState.lastError = validation.reason ?? "Validation failed";
      return {
        success: false,
        error: "Connection failed",
        details: validation.reason,
        url: url.replace(/access_token=[^&]+/, "access_token=***"),
        httpStatus: res.status,
        responseSnippet: snippet,
        durationMs,
      };
    }

    return {
      success: true,
      message: "Otpusk API connected",
      url: url.replace(/access_token=[^&]+/, "access_token=***"),
      httpStatus: res.status,
      responseSnippet: snippet,
      durationMs,
    };
  } catch (err) {
    const durationMs = Date.now() - start;
    let details = err instanceof Error ? err.message : String(err);

    if (details.includes("fetch failed") || details.includes("ECONNREFUSED")) {
      details = `Сетевая ошибка / соединение отклонено: ${details}`;
    } else if (details.includes("ENOTFOUND") || details.includes("getaddrinfo")) {
      details = `DNS не разрешён — хост недоступен: ${details}`;
    } else if (details.includes("aborted") || details.includes("AbortError")) {
      details = "Таймаут 15 сек — сервер не ответил";
    } else if (details.includes("ETIMEDOUT")) {
      details = `Таймаут соединения: ${details}`;
    }

    console.error("[OTPUSK] Connection error:", details);
    debugState.lastError = details;
    debugState.lastStatus = 0;

    return {
      success: false,
      error: "Connection failed",
      details,
      url: url.replace(/access_token=[^&]+/, "access_token=***"),
      httpStatus: 0,
      durationMs,
    };
  }
}

export function getDebugState() {
  return { ...debugState };
}
