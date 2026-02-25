import { NextRequest, NextResponse } from "next/server";
import { saveApiConfig, loadApiConfig, ApiConfig } from "@/lib/tat-api";

export const dynamic = "force-dynamic";

// Simple token-based protection: reads ADMIN_SECRET from env or falls back to
// a default that the user should change. If not set, any request is accepted
// (dev mode convenience).
function isAuthorized(req: NextRequest): boolean {
  const secret = process.env.ADMIN_SECRET;
  if (!secret) return true; // no secret configured → open in dev
  const auth = req.headers.get("x-admin-secret") ?? req.nextUrl.searchParams.get("secret");
  return auth === secret;
}

export async function POST(req: NextRequest) {
  if (!isAuthorized(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: Partial<ApiConfig>;
  try {
    body = (await req.json()) as Partial<ApiConfig>;
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  // Merge with existing config (don't wipe fields not sent)
  const current = loadApiConfig();
  const updated: ApiConfig = {
    ...current,
    endpoint: body.endpoint ?? current.endpoint,
    agencyId: body.agencyId ?? current.agencyId,
    domainId: body.domainId ?? current.domainId,
    authKey: body.authKey ?? current.authKey,
    currency: body.currency ?? current.currency,
    hotToursSettings: {
      ...current.hotToursSettings,
      ...(body.hotToursSettings ?? {}),
    },
  };

  try {
    saveApiConfig(updated);
    return NextResponse.json({ ok: true, saved: updated });
  } catch (err) {
    return NextResponse.json(
      { error: "Не удалось сохранить конфиг", detail: String(err) },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  if (!isAuthorized(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const config = loadApiConfig();
  // Mask auth key in response
  return NextResponse.json({
    ...config,
    authKey: config.authKey ? "••••••••" : "",
  });
}
