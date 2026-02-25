import { NextRequest, NextResponse } from "next/server";
import {
  loadApiConfig,
  buildOtpuskQueryString,
  extractTours,
  NormalizedTour,
  OtpuskApiResponse,
  TourSearchParams,
} from "@/lib/tat-api";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const config = loadApiConfig();

  // Require authKey to be configured
  if (!config.authKey) {
    return NextResponse.json(
      {
        error: "API не настроено в админке",
        hint: "Перейдите в /admin/settings и заполните Auth Key (access_token)",
        tours: [],
      },
      { status: 503 }
    );
  }

  // Parse search params from request
  const sp = req.nextUrl.searchParams;

  const params: TourSearchParams = {
    country: sp.get("country") ?? undefined,
    dateFrom: sp.get("dateFrom") ?? undefined,
    dateTo: sp.get("dateTo") ?? undefined,
    nightsFrom: sp.get("nightsFrom") ? Number(sp.get("nightsFrom")) : undefined,
    nightsTo: sp.get("nightsTo") ? Number(sp.get("nightsTo")) : undefined,
    adults: sp.get("adults") ? Number(sp.get("adults")) : 2,
    children: sp.get("children") ? Number(sp.get("children")) : 0,
    departureCity: sp.get("departureCity") || "870",
    stars: sp.get("stars") ?? undefined,
    meal: sp.get("meal") ?? undefined,
    transport: sp.get("transport") ?? "air",
    page: sp.get("page") ? Number(sp.get("page")) : 1,
    number: 0,
  };

  // If no country specified, default to Turkey
  if (!params.country) {
    params.country = "115";
  }

  // If no dates specified, default to next 30 days
  if (!params.dateFrom) {
    const today = new Date();
    params.dateFrom = today.toISOString().split("T")[0];
  }
  if (!params.dateTo) {
    const from = new Date(params.dateFrom);
    from.setDate(from.getDate() + 30);
    params.dateTo = from.toISOString().split("T")[0];
  }

  // Default nights
  if (!params.nightsFrom) params.nightsFrom = 7;
  if (!params.nightsTo) params.nightsTo = 14;

  try {
    // Poll up to 4 times to get results (progressive API)
    let allTours: NormalizedTour[] = [];
    let totalFromApi = 0;

    for (let pollNum = 0; pollNum < 4; pollNum++) {
      params.number = pollNum;
      const qs = buildOtpuskQueryString(config, params);
      const url = `${config.endpoint}?${qs}`;

      const res = await fetch(url, {
        headers: {
          Accept: "application/json",
          "User-Agent": "Monotours24/1.0",
        },
        signal: AbortSignal.timeout(12000),
        cache: "no-store",
      });

      if (!res.ok) {
        const body = await res.text();
        return NextResponse.json(
          {
            error: `Otpusk API вернул ${res.status}`,
            detail: body.slice(0, 300),
            tours: [],
          },
          { status: res.status }
        );
      }

      const data = (await res.json()) as OtpuskApiResponse;
      allTours = extractTours(data);
      totalFromApi = data.total ?? 0;

      // If we have enough tours or search is complete, stop polling
      if (allTours.length >= 20 || data.lastResult) {
        break;
      }

      // Wait 2 seconds before next poll
      await new Promise((resolve) => setTimeout(resolve, 2000));
    }

    // Apply client-side filtering
    let filteredTours = allTours;

    // Price filtering
    const priceFrom = sp.get("priceFrom") ? Number(sp.get("priceFrom")) : undefined;
    const priceTo = sp.get("priceTo") ? Number(sp.get("priceTo")) : undefined;
    if (priceFrom !== undefined && priceFrom > 0) {
      filteredTours = filteredTours.filter((tour) => tour.price >= priceFrom);
    }
    if (priceTo !== undefined && priceTo > 0) {
      filteredTours = filteredTours.filter((tour) => tour.price <= priceTo);
    }

    // Sorting
    const sortParam = sp.get("sort") as TourSearchParams["sort"];
    if (sortParam === "price_desc") {
      filteredTours.sort((a, b) => b.price - a.price);
    } else if (sortParam === "rating") {
      filteredTours.sort((a, b) => b.rating - a.rating);
    } else {
      // Default: price ascending
      filteredTours.sort((a, b) => a.price - b.price);
    }

    // Apply limit
    const limit = sp.get("limit") ? Number(sp.get("limit")) : 20;
    const paginatedTours = filteredTours.slice(0, limit);

    return NextResponse.json({
      tours: paginatedTours,
      total: totalFromApi || paginatedTours.length,
      source: "otpusk",
    });
  } catch (err) {
    return NextResponse.json(
      {
        error: "Ошибка соединения с Otpusk API",
        detail: err instanceof Error ? err.message : String(err),
        tours: [],
      },
      { status: 502 }
    );
  }
}
