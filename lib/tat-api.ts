import path from "path";
import fs from "fs";

// ─── Config types ────────────────────────────────────────────────────────────

export interface HotToursSettings {
  minPrice: number;
  maxPrice: number;
  priorityCountries: string[]; // country IDs for param 'to'
  instantConfirmOnly: boolean;
  departureDaysFrom: number;
  departureDaysTo: number;
}

export interface ApiConfig {
  endpoint: string;
  agencyId: string; // Kept for reference, not used in Otpusk API calls
  domainId: string; // Kept for reference, not used in Otpusk API calls
  authKey: string; // This will be the access_token for Otpusk API
  currency: string;
  hotToursSettings: HotToursSettings;
}

// ─── Otpusk API response types ──────────────────────────────────────────────

export interface OtpuskHotel {
  n: string; // name
  s: string; // stars
  r: number; // rating
  w: number; // reviews count
  f: string; // photo path
  fc: number; // photo count
  c: { i: number; n: string }; // city
  ds: { n: string }; // district
  pr: { n: string }; // province
  t: { i: number; n: string }; // country
  e: string[]; // amenities
  g: { a: string; o: string }; // geo
}

export interface OtpuskOffer {
  i: string; // offer_id
  hi: number; // hotel ID
  oi: number; // operator ID
  d: string; // departure date
  dt: string; // return date
  n: number; // nights
  f: string; // food code
  fn: string; // food name
  r: string; // room type
  p: number; // price per person
  u: string; // currency
  t: string; // transport
  a: number; // adults
  h: number; // children
  ss: { avia: number; hotel: number }; // availability
  o: string[]; // included services
  to: { from: unknown[]; to: unknown[] }; // flight details
}

export interface OtpuskResultEntry {
  [hotelId: string]: {
    p: number; // min price in target currency
    po: number; // min price original
    offers: { [offerId: string]: OtpuskOffer };
  };
}

export interface OtpuskApiResponse {
  lastResult: boolean;
  cnt: { id: number; name: string }; // country
  dept: { id: number; name: string }; // departure city
  total: number;
  hotels: { [hotelId: string]: OtpuskHotel };
  results: { [operatorId: string]: OtpuskResultEntry };
  _persent: number;
  progress: { [operatorId: string]: boolean };
  error?: string;
  message?: string;
}

// ─── Search params passed from frontend ──────────────────────────────────────

export interface TourSearchParams {
  country?: string; // country ID
  resort?: string; // resort ID
  hotel?: string; // hotel name/id
  dateFrom?: string; // departure date YYYY-MM-DD
  dateTo?: string; // departure date range end
  nightsFrom?: number;
  nightsTo?: number;
  priceFrom?: number;
  priceTo?: number;
  adults?: number;
  children?: number;
  departureCity?: string; // departure city ID
  stars?: string; // hotel stars
  meal?: string; // meal types comma-separated (uai,ai,fb,hb,bb,ob)
  transport?: string; // air / bus
  instant?: boolean;
  sort?: "price_asc" | "price_desc" | "rating" | "popular" | "discount";
  page?: number;
  limit?: number;
  number?: number; // polling number for progressive loading
}

// ─── Config loader ────────────────────────────────────────────────────────────

const CONFIG_PATH = path.join(process.cwd(), "data", "api-config.json");

const DEFAULT_CONFIG: ApiConfig = {
  endpoint: "https://api.otpusk.com/api/2.6/tours/getResults",
  agencyId: "",
  domainId: "",
  authKey: "29ae6-32ef8-d106b-7ea88-5f40d", // Default access_token from HAR
  currency: "eur",
  hotToursSettings: {
    minPrice: 0,
    maxPrice: 0,
    priorityCountries: [],
    instantConfirmOnly: false,
    departureDaysFrom: 1,
    departureDaysTo: 14,
  },
};

export function loadApiConfig(): ApiConfig {
  try {
    if (!fs.existsSync(CONFIG_PATH)) return DEFAULT_CONFIG;
    const raw = fs.readFileSync(CONFIG_PATH, "utf-8");
    const parsed = JSON.parse(raw) as Partial<ApiConfig>;
    return {
      ...DEFAULT_CONFIG,
      ...parsed,
      hotToursSettings: {
        ...DEFAULT_CONFIG.hotToursSettings,
        ...(parsed.hotToursSettings ?? {}),
      },
    };
  } catch {
    return DEFAULT_CONFIG;
  }
}

export function saveApiConfig(config: ApiConfig): void {
  if (!fs.existsSync(path.dirname(CONFIG_PATH))) {
    fs.mkdirSync(path.dirname(CONFIG_PATH), { recursive: true });
  }
  fs.writeFileSync(CONFIG_PATH, JSON.stringify(config, null, 2), "utf-8");
}

// ─── Build query string for Otpusk API ──────────────────────────────────────────

export function buildOtpuskQueryString(
  config: ApiConfig,
  params: TourSearchParams
): string {
  const qp = new URLSearchParams();

  // Auth
  if (config.authKey) qp.set("access_token", config.authKey);

  // Map TourSearchParams to Otpusk API parameters
  if (params.departureCity) qp.set("from", params.departureCity); // departure city ID
  if (params.country) qp.set("to", params.country); // country ID
  if (params.dateFrom) qp.set("checkIn", params.dateFrom); // YYYY-MM-DD
  if (params.dateTo) qp.set("checkTo", params.dateTo); // YYYY-MM-DD
  if (params.nightsFrom) qp.set("nights", String(params.nightsFrom));
  if (params.nightsTo) qp.set("nightsTo", String(params.nightsTo));

  // People: "202" = 2 adults, 2 children (ages)
  let peopleCode = "";
  if (params.adults) {
    peopleCode += String(params.adults);
  } else {
    peopleCode += "2"; // Default to 2 adults if not specified
  }
  if (params.children !== undefined && params.children > 0) {
    // Assuming children ages are not provided, so just append number of children
    // Otpusk API expects specific ages, but for now, we'll just append the count
    // This might need refinement if actual child ages are introduced in TourSearchParams
    peopleCode += String(params.children);
  } else {
    peopleCode += "0"; // Default to 0 children
  }
  qp.set("people", peopleCode);

  if (params.meal) qp.set("food", params.meal); // uai,ai,fb,hb,bb,ob
  if (params.transport) qp.set("transport", params.transport); // air or bus
  qp.set("currencyLocal", config.currency || "eur"); // eur, uah, usd

  qp.set("group", "1"); // group by hotel
  qp.set("availableFlight", "yes");
  qp.set("stopSale", "yes,request");
  qp.set("lang", "eng"); // Default language

  if (params.number !== undefined) qp.set("number", String(params.number)); // polling number
  qp.set("data", "extlinks");
  // Rating: Assuming stars maps to min-max rating. Otpusk uses 5-10 for 5 stars, 4-5 for 4 stars etc.
  if (params.stars) {
    const stars = Number(params.stars);
    if (!isNaN(stars) && stars > 0) {
      qp.set("rating", `${stars}-${stars + 5}`); // Example: 5 stars -> 5-10 rating
    }
  }

  if (params.page) qp.set("page", String(params.page));

  // Otpusk API does not seem to have direct parameters for hotel name, resort, price range, instant confirmation, or sort.
  // These might need to be filtered client-side or handled differently if critical.

  return qp.toString();
}

// ─── Normalize Otpusk response to our internal Tour type ─────────────────────────

export interface NormalizedTour {
  id: string;
  destination: string;
  countryId: string;
  countryName: string;
  resort: string;
  hotel: string;
  hotelStars: number;
  nights: number;
  dateFrom: string;
  price: number;
  currency: string;
  discount: number;
  discountPercent: number;
  rating: number;
  meal: string;
  operator: string;
  instant: boolean;
  departureCity: string;
  gradient: string;
  emoji: string;
  tagKey: string;
  imageUrl?: string; // New field for image URL
}

const GRADIENTS = [
  "from-blue-500 via-blue-400 to-cyan-400",
  "from-teal-500 via-emerald-400 to-green-400",
  "from-violet-500 via-purple-400 to-fuchsia-400",
  "from-emerald-500 via-teal-400 to-cyan-400",
  "from-orange-400 via-amber-400 to-yellow-400",
  "from-pink-500 via-rose-400 to-red-400",
  "from-blue-500 via-indigo-400 to-violet-400",
  "from-yellow-400 via-orange-400 to-red-400",
];

const EMOJIS = ["🏝️", "🌴", "🏰", "🌿", "🗺️", "⛩️", "🏛️", "🎡", "🐘", "🫐"];

function pickGradient(id: string | number): string {
  const n = Math.abs(Number(String(id).replace(/\D/g, "")) || 0);
  return GRADIENTS[n % GRADIENTS.length];
}

function pickEmoji(id: string | number): string {
  const n = Math.abs(Number(String(id).replace(/\D/g, "")) || 0);
  return EMOJIS[n % EMOJIS.length];
}

// This function might need adjustment based on how 'hot' is defined for Otpusk tours
function pickTagKey(tour: NormalizedTour): string {
  if (tour.discountPercent && Number(tour.discountPercent) >= 20) return "hot_tag_deal";
  if (tour.instant) return "hot_tag_popular";
  const df = tour.dateFrom ?? "";
  const daysDiff = df
    ? Math.ceil((new Date(df).getTime() - Date.now()) / 86400000)
    : 999;
  if (daysDiff <= 7) return "hot_tag_trending";
  return "hot_tag_new";
}

export function normalizeOtpuskTour(
  hotel: OtpuskHotel,
  offer: OtpuskOffer,
  operatorId: string
): NormalizedTour {
  const id = `${offer.hi}-${offer.oi}-${offer.i}`;
  const price = offer.p;
  const currency = offer.u.toUpperCase();

  // Otpusk API doesn't directly provide discount, so setting to 0 for now
  const discount = 0;
  const discountPercent = 0;

  const hotelStars = Number(hotel.s) || 0;
  const rating = hotel.r || 0;

  const imageUrl = hotel.f ? `https://newimg.otpusk.com/2/${hotel.f}` : undefined;

  return {
    id,
    destination: hotel.n, // Hotel name as destination
    countryId: String(hotel.t.i),
    countryName: hotel.t.n,
    resort: hotel.c.n, // City name as resort
    hotel: hotel.n,
    hotelStars,
    nights: offer.n,
    dateFrom: offer.d,
    price,
    currency,
    discount,
    discountPercent,
    rating,
    meal: offer.fn, // Food name
    operator: operatorId, // Using operator ID as operator name for now
    instant: offer.ss.hotel === 9 && offer.ss.avia === 9, // Assuming 9 means available/instant
    departureCity: "", // Otpusk API response doesn't directly provide departure city name in offer
    gradient: pickGradient(id),
    emoji: pickEmoji(id),
    tagKey: pickTagKey({
      id,
      destination: hotel.n,
      countryId: String(hotel.t.i),
      countryName: hotel.t.n,
      resort: hotel.c.n,
      hotel: hotel.n,
      hotelStars,
      nights: offer.n,
      dateFrom: offer.d,
      price,
      currency,
      discount,
      discountPercent,
      rating,
      meal: offer.fn,
      operator: operatorId,
      instant: offer.ss.hotel === 9 && offer.ss.avia === 9,
      departureCity: "",
      gradient: pickGradient(id),
      emoji: pickEmoji(id),
      tagKey: "",
      imageUrl,
    }),
    imageUrl,
  };
}

export function extractTours(apiResponse: OtpuskApiResponse): NormalizedTour[] {
  const tours: NormalizedTour[] = [];
  if (!apiResponse.hotels || !apiResponse.results) {
    return tours;
  }

  for (const operatorId in apiResponse.results) {
    const operatorResults = apiResponse.results[operatorId];
    for (const hotelId in operatorResults) {
      const hotelOffers = operatorResults[hotelId];
      const hotel = apiResponse.hotels[hotelId];

      if (hotel && hotelOffers && hotelOffers.offers) {
        for (const offerId in hotelOffers.offers) {
          const offer = hotelOffers.offers[offerId];
          tours.push(normalizeOtpuskTour(hotel, offer, operatorId));
        }
      }
    }
  }
  return tours;
}
