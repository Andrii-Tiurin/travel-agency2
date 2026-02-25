import { NextResponse } from "next/server";
import {
  loadApiConfig,
  buildOtpuskQueryString,
  extractTours,
  NormalizedTour,
  OtpuskApiResponse,
  TourSearchParams,
} from "@/lib/tat-api";

// Cache hot tours for 1 hour
export const revalidate = 3600;

// Popular destination country IDs for Otpusk API
const POPULAR_COUNTRIES = [
  "115", // Turkey
  "43",  // Egypt
  "70",  // Spain
  "39",  // Greece
  "15",  // Bulgaria
];

export async function GET() {
  const config = loadApiConfig();

  // If API not configured — return empty with flag
  if (!config.authKey) {
    return NextResponse.json({
      tours: [],
      configured: false,
      source: "unconfigured",
    });
  }

  const settings = config.hotToursSettings;

  // Build date range: departure in next N days
  const today = new Date();
  const dateFrom = formatDate(addDays(today, settings.departureDaysFrom ?? 1));
  const dateTo = formatDate(addDays(today, settings.departureDaysTo ?? 14));

  // Determine which countries to search
  const countries =
    settings.priorityCountries?.length > 0
      ? settings.priorityCountries
      : POPULAR_COUNTRIES.slice(0, 2); // Default: Turkey, Egypt

  const allTours: NormalizedTour[] = [];

  // Fetch tours for each country with polling (progressive loading)
  const fetches = countries.map(async (countryId) => {
    const params: TourSearchParams = {
      country: countryId,
      departureCity: "870" || "870", // Default Berlin if not set
      dateFrom,
      dateTo,
      nightsFrom: 7,
      nightsTo: 14,
      adults: 2,
      children: 0,
      meal: "uai,ai,fb,hb",
      transport: "air",
      number: 0,
    };

    // Poll up to 5 times with 2s delay to get results (progressive API)
    let tours: NormalizedTour[] = [];
    for (let pollNum = 0; pollNum < 5; pollNum++) {
      params.number = pollNum;
      const qs = buildOtpuskQueryString(config, params);
      const url = `${config.endpoint}?${qs}`;

      try {
        const res = await fetch(url, {
          headers: {
            Accept: "application/json",
            "User-Agent": "Monotours24/1.0",
          },
          signal: AbortSignal.timeout(12000),
        });

        if (!res.ok) break;

        const data = (await res.json()) as OtpuskApiResponse;
        tours = extractTours(data);

        // If we have enough tours or search is complete, stop polling
        if (tours.length >= 10 || data.lastResult) {
          break;
        }

        // Wait 2 seconds before next poll
        await new Promise((resolve) => setTimeout(resolve, 2000));
      } catch {
        break;
      }
    }

    return tours;
  });

  const results = await Promise.all(fetches);
  for (const tours of results) {
    allTours.push(...tours);
  }

  // Sort by price ascending
  const sortedTours = allTours.sort((a, b) => a.price - b.price);

  // Deduplicate by hotel name (keep cheapest offer per hotel)
  const seen = new Set<string>();
  const uniqueTours: NormalizedTour[] = [];
  for (const t of sortedTours) {
    if (!seen.has(t.hotel)) {
      seen.add(t.hotel);
      uniqueTours.push(t);
    }
    if (uniqueTours.length >= 12) break;
  }

  return NextResponse.json({
    tours: uniqueTours,
    configured: true,
    total: uniqueTours.length,
    source: "otpusk",
    cachedAt: new Date().toISOString(),
  });
}

function formatDate(d: Date): string {
  return d.toISOString().split("T")[0];
}

function addDays(d: Date, days: number): Date {
  const r = new Date(d);
  r.setDate(r.getDate() + days);
  return r;
}
