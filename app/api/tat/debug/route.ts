import { NextRequest, NextResponse } from "next/server";
import { getDebugState, buildTourscannerUrl } from "@/lib/services/tat.service";
import { loadApiConfig } from "@/lib/tat-api";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  // Optional: protect with ADMIN_SECRET
  const secret = process.env.ADMIN_SECRET;
  if (secret) {
    const auth = req.headers.get("x-admin-secret") ?? req.nextUrl.searchParams.get("secret");
    if (auth !== secret) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  }

  const config = loadApiConfig();
  const debug = getDebugState();

  return NextResponse.json({
    constructedUrl: buildTourscannerUrl({
      endpoint: config.endpoint,
      agencyId: config.agencyId,
      domainId: config.domainId,
      authKey: config.authKey ? "***" : "",
      currency: config.currency,
    }),
    savedConfig: {
      endpoint: config.endpoint,
      agencyId: config.agencyId,
      domainId: config.domainId,
      authKey: config.authKey ? "••••••••" : "(not set)",
      currency: config.currency,
    },
    lastRequest: {
      url: debug.lastUrl.replace(/ca=[^&]+/, "ca=***"),
      httpStatus: debug.lastStatus,
      error: debug.lastError || null,
      testedAt: debug.lastTestedAt || null,
    },
  });
}
