import { NextRequest, NextResponse } from "next/server";
import { testConnection } from "@/lib/services/tat.service";
import { loadApiConfig } from "@/lib/tat-api";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  let body: {
    endpoint?: string;
    agencyId?: string;
    domainId?: string;
    authKey?: string;
    currency?: string;
  };

  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ success: false, error: "Invalid JSON" }, { status: 400 });
  }

  // Fall back to saved config for any missing fields
  // (authKey is never pre-filled in the UI, so if blank use stored one)
  const saved = loadApiConfig();

  const params = {
    endpoint: body.endpoint || saved.endpoint,
    agencyId: body.agencyId || saved.agencyId,
    domainId: body.domainId || saved.domainId,
    // If authKey is blank in the form (masked "••••••••"), use stored key
    authKey: (body.authKey && body.authKey !== "••••••••")
      ? body.authKey
      : saved.authKey,
    currency: body.currency || saved.currency,
  };

  const result = await testConnection(params);

  // Never leak the actual token in the response
  return NextResponse.json(result, { status: result.success ? 200 : 502 });
}

// Also allow GET for quick manual testing
export async function GET() {
  const saved = loadApiConfig();
  const result = await testConnection({
    endpoint: saved.endpoint,
    agencyId: saved.agencyId,
    domainId: saved.domainId,
    authKey: saved.authKey,
    currency: saved.currency,
  });
  return NextResponse.json(result, { status: result.success ? 200 : 502 });
}
