"use client";
import { useState, useEffect, useCallback, useRef, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useLocale } from "@/context/LocaleContext";
import { tours as staticTours } from "@/lib/tours-data";
import type { NormalizedTour } from "@/lib/tat-api";

// TAT numeric IDs matching SearchWidget exactly
const COUNTRIES_WITH_IDS = [
  { id: "115", key: "country_turkey" },
  { id: "43",  key: "country_egypt" },
  { id: "34",  key: "country_greece" },
  { id: "49",  key: "country_spain" },
  { id: "92",  key: "country_uae" },
  { id: "113", key: "country_thailand" },
  { id: "134", key: "country_croatia" },
  { id: "79",  key: "country_maldives" },
  { id: "47",  key: "country_bali" },
  { id: "8",   key: "country_austria" },
  { id: "48",  key: "country_italy" },
  { id: "135", key: "country_montenegro" },
  { id: "13",  key: "country_bulgaria" },
  { id: "114", key: "country_tunisia" },
  { id: "75",  key: "country_morocco" },
  { id: "54",  key: "country_cyprus" },
  { id: "29",  key: "country_vietnam" },
];

const sortOptions = [
  { value: "popular",    labelKey: "search_sort_popular"    },
  { value: "price_asc",  labelKey: "search_sort_price_asc"  },
  { value: "price_desc", labelKey: "search_sort_price_desc" },
  { value: "rating",     labelKey: "search_sort_rating"     },
];

const MEAL_LABELS: Record<string, string> = {
  BB: "BB", HB: "HB", FB: "FB", AI: "AI", UAI: "UAI",
};

function StarRating({ stars }: { stars: number }) {
  return (
    <span className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <svg key={i} className={`w-3 h-3 ${i < stars ? "text-amber-400" : "text-slate-200"}`} fill="currentColor" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </span>
  );
}

function TourCardSkeleton() {
  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-100 animate-pulse">
      <div className="aspect-[16/9] bg-slate-200" />
      <div className="p-4 space-y-3">
        <div className="flex justify-between items-start">
          <div className="space-y-1.5 flex-1">
            <div className="h-4 bg-slate-200 rounded w-3/4" />
            <div className="h-3 bg-slate-100 rounded w-1/2" />
          </div>
          <div className="space-y-1 text-right ml-3">
            <div className="h-3 bg-slate-100 rounded w-8 ml-auto" />
            <div className="h-6 bg-slate-200 rounded w-20 ml-auto" />
          </div>
        </div>
        <div className="pt-3 border-t border-slate-50 flex justify-between">
          <div className="h-3 bg-slate-100 rounded w-16" />
          <div className="h-3 bg-slate-100 rounded w-20" />
        </div>
      </div>
    </div>
  );
}

type DisplayTour = {
  id: string | number;
  slug?: string;
  destination: string;
  hotel?: string;
  countryKey?: string;
  countryName?: string;
  resort?: string;
  nights: number;
  dateFrom?: string;
  price: number;
  currency?: string;
  rating: number;
  hotelStars?: number;
  meal?: string;
  operator?: string;
  instant?: boolean;
  departureCity?: string;
  reviews?: number;
  gradient: string;
  emoji: string;
  tagKey: string;
  imageUrl?: string;
};


const COUNTRY_ID_TO_KEY: Record<string, string> = {
  "115": "country_turkey",
  "43": "country_egypt",
  "34": "country_greece",
  "49": "country_spain",
  "92": "country_uae",
  "113": "country_thailand",
  "134": "country_croatia",
  "79": "country_maldives",
  "47": "country_bali",
  "8": "country_austria",
  "48": "country_italy",
  "135": "country_montenegro",
  "13": "country_bulgaria",
  "114": "country_tunisia",
  "75": "country_morocco",
  "54": "country_cyprus",
  "29": "country_vietnam",
};

function fromNormalized(t: NormalizedTour): DisplayTour {
  return {
    id: t.id,
    slug: t.id,
    destination: t.destination,
    hotel: t.hotel,
    countryName: t.countryName,
    countryKey: COUNTRY_ID_TO_KEY[t.countryId] || undefined,
    resort: t.resort,
    nights: t.nights,
    dateFrom: t.dateFrom,
    price: t.price,
    currency: t.currency,
    rating: t.rating,
    hotelStars: t.hotelStars,
    meal: t.meal,
    operator: t.operator,
    instant: t.instant,
    departureCity: t.departureCity,
    gradient: t.gradient,
    emoji: t.emoji,
    tagKey: t.tagKey,
    imageUrl: (t as any).imageUrl,
  };
}

function fromStatic(): DisplayTour[] {
  return staticTours.map((tour) => ({
    id: tour.id,
    slug: tour.slug,
    destination: tour.destination,
    countryKey: tour.countryKey,
    nights: tour.nights,
    price: tour.price,
    rating: tour.rating,
    reviews: tour.reviews,
    gradient: tour.gradient,
    emoji: tour.emoji,
    tagKey: tour.tagKey,
  }));
}

function SearchContent() {
  const { t } = useLocale();
  const searchParams = useSearchParams();

  // Read all params from URL (set by SearchWidget)
  const [country,       setCountry]       = useState(searchParams.get("country")       ?? "");
  const [departureCity, setDepartureCity] = useState(searchParams.get("departureCity") ?? "");
  const [dateFrom,      setDateFrom]      = useState(searchParams.get("dateFrom")      ?? "");
  const [nightsFrom,    setNightsFrom]    = useState(searchParams.get("nightsFrom")    ?? "");
  const [nightsTo,      setNightsTo]      = useState(searchParams.get("nightsTo")      ?? "");
  const [stars,         setStars]         = useState(searchParams.get("stars")         ?? "");
  const [meal,          setMeal]          = useState(searchParams.get("meal")          ?? "");
  const [transport,     setTransport]     = useState(searchParams.get("transport")     ?? "");
  const [adults,        setAdults]        = useState(searchParams.get("adults")        ?? "2");
  const [children,      setChildren]      = useState(searchParams.get("children")      ?? "0");
  const [maxPrice,      setMaxPrice]      = useState(0);
  const [sortBy,        setSortBy]        = useState("popular");
  const [filtersOpen,   setFiltersOpen]   = useState(false);

  const [tours,    setTours]    = useState<DisplayTour[]>([]);
  const [total,    setTotal]    = useState(0);
  const [loading,  setLoading]  = useState(true);
  const [usingApi, setUsingApi] = useState(false);
  const [apiReady, setApiReady] = useState<boolean | null>(null);

  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const doFetch = useCallback((params: {
    country: string; departureCity: string; dateFrom: string;
    nightsFrom: string; nightsTo: string; stars: string; meal: string;
    transport: string; adults: string; children: string;
    maxPrice: number; sortBy: string;
  }) => {
    setLoading(true);
    const p = new URLSearchParams();

    if (params.country)       p.set("country",      params.country);
    if (params.departureCity) p.set("departureCity", params.departureCity);
    if (params.dateFrom)      p.set("dateFrom",      params.dateFrom);
    if (params.nightsFrom)    p.set("nightsFrom",    params.nightsFrom);
    if (params.nightsTo)      p.set("nightsTo",      params.nightsTo);
    if (params.stars)         p.set("stars",         params.stars);
    if (params.meal)          p.set("meal",          params.meal);
    if (params.transport)     p.set("transport",     params.transport);
    if (params.adults !== "2")  p.set("adults",   params.adults);
    if (params.children !== "0") p.set("children", params.children);
    if (params.maxPrice > 0)  p.set("priceTo",       String(params.maxPrice));
    p.set("sort",  params.sortBy === "popular" ? "price_asc" : params.sortBy);
    p.set("limit", "30");

    fetch(`/api/tours?${p.toString()}`)
      .then(r => r.json())
      .then(data => {
        if (data.tours && Array.isArray(data.tours) && data.tours.length > 0) {
          setTours(data.tours.map(fromNormalized));
          setTotal(data.total ?? data.tours.length);
          setUsingApi(true);
          setApiReady(true);
        } else {
          setApiReady(false);
          setTours(fromStatic());
          setTotal(fromStatic().length);
          setUsingApi(false);
        }
        setLoading(false);
      })
      .catch(() => {
        setApiReady(false);
        setTours(fromStatic());
        setTotal(fromStatic().length);
        setUsingApi(false);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      doFetch({ country, departureCity, dateFrom, nightsFrom, nightsTo, stars, meal, transport, adults, children, maxPrice, sortBy });
    }, 400);
    return () => { if (debounceRef.current) clearTimeout(debounceRef.current); };
  }, [country, departureCity, dateFrom, nightsFrom, nightsTo, stars, meal, transport, adults, children, maxPrice, sortBy, doFetch]);

  const resetFilters = () => {
    setCountry(""); setDepartureCity(""); setDateFrom("");
    setNightsFrom(""); setNightsTo(""); setStars(""); setMeal("");
    setTransport(""); setAdults("2"); setChildren("0");
    setMaxPrice(0); setSortBy("popular");
  };

  const formatPrice = (price: number, currency?: string) => {
    if (!currency || currency === "UAH" || currency === "uah")
      return `€${price.toLocaleString("de-DE")}`;
    if (currency === "EUR" || currency === "eur")
      return `€${price.toLocaleString("de-DE")}`;
    if (currency === "USD" || currency === "usd")
      return `$${price.toLocaleString("de-DE")}`;
    return `${price.toLocaleString("de-DE")} ${currency}`;
  };

  const formatDate = (d?: string) => {
    if (!d) return "";
    try {
      return new Date(d).toLocaleDateString("de-DE", { day: "2-digit", month: "2-digit", year: "numeric" });
    } catch { return d; }
  };

  return (
    <main className="min-h-screen bg-slate-50">
      <Header />

      {/* ── Top bar ── */}
      <div className="bg-white border-b border-slate-100 shadow-sm sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex flex-wrap gap-2 items-center">

            {/* Active filter chips */}
            {country && (
              <span className="flex items-center gap-1 bg-blue-50 text-blue-700 border border-blue-200 rounded-full px-3 py-1 text-xs font-semibold">
                {COUNTRIES_WITH_IDS.find(c => c.id === country) ? t(COUNTRIES_WITH_IDS.find(c => c.id === country)!.key) : country}
                <button onClick={() => setCountry("")} className="hover:text-blue-900 ml-0.5">×</button>
              </span>
            )}
            {dateFrom && (
              <span className="flex items-center gap-1 bg-blue-50 text-blue-700 border border-blue-200 rounded-full px-3 py-1 text-xs font-semibold">
                {formatDate(dateFrom)}
                <button onClick={() => setDateFrom("")} className="hover:text-blue-900 ml-0.5">×</button>
              </span>
            )}
            {(nightsFrom || nightsTo) && (
              <span className="flex items-center gap-1 bg-blue-50 text-blue-700 border border-blue-200 rounded-full px-3 py-1 text-xs font-semibold">
                {nightsFrom}–{nightsTo} {t("hot_nights")}
                <button onClick={() => { setNightsFrom(""); setNightsTo(""); }} className="hover:text-blue-900 ml-0.5">×</button>
              </span>
            )}
            {meal && (
              <span className="flex items-center gap-1 bg-blue-50 text-blue-700 border border-blue-200 rounded-full px-3 py-1 text-xs font-semibold">
                {MEAL_LABELS[meal] ?? meal}
                <button onClick={() => setMeal("")} className="hover:text-blue-900 ml-0.5">×</button>
              </span>
            )}
            {stars && (
              <span className="flex items-center gap-1 bg-amber-50 text-amber-700 border border-amber-200 rounded-full px-3 py-1 text-xs font-semibold">
                {stars}★
                <button onClick={() => setStars("")} className="hover:text-amber-900 ml-0.5">×</button>
              </span>
            )}

            <div className="ml-auto flex items-center gap-2">
              {/* Sort */}
              <select
                value={sortBy}
                onChange={e => setSortBy(e.target.value)}
                className="bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-sm text-slate-700 outline-none focus:border-blue-400 cursor-pointer"
              >
                {sortOptions.map(opt => (
                  <option key={opt.value} value={opt.value}>{t(opt.labelKey)}</option>
                ))}
              </select>

              {/* Mobile filters toggle */}
              <button
                onClick={() => setFiltersOpen(!filtersOpen)}
                className="lg:hidden flex items-center gap-1.5 bg-blue-50 text-blue-600 border border-blue-200 rounded-lg px-3 py-1.5 text-sm font-medium"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2a1 1 0 01-.293.707L13 13.414V19a1 1 0 01-.553.894l-4 2A1 1 0 017 21v-7.586L3.293 6.707A1 1 0 013 6V4z" />
                </svg>
                {t("search_filter_title")}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">

          {/* ── Sidebar ── */}
          <aside className={`lg:w-60 flex-shrink-0 ${filtersOpen ? "block" : "hidden lg:block"}`}>
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 sticky top-20">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-slate-800 text-sm">{t("search_filter_title")}</h3>
                <button onClick={resetFilters} className="text-xs text-blue-600 hover:text-blue-700 font-medium">
                  {t("search_reset_filters")}
                </button>
              </div>

              {/* Country */}
              <div className="mb-4">
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">{t("sw_country")}</label>
                <div className="space-y-1">
                  <button onClick={() => setCountry("")} className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors ${!country ? "bg-blue-50 text-blue-700" : "text-slate-600 hover:bg-slate-50"}`}>
                    {t("sw_country_all")}
                  </button>
                  {COUNTRIES_WITH_IDS.map(c => (
                    <button key={c.id + c.key} onClick={() => setCountry(c.id)}
                      className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors ${country === c.id ? "bg-blue-50 text-blue-700" : "text-slate-600 hover:bg-slate-50"}`}>
                      {t(c.key)}
                    </button>
                  ))}
                </div>
              </div>

              {/* Nights */}
              <div className="mb-4">
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">{t("sw_nights")}</label>
                <div className="flex items-center gap-2">
                  <input type="number" min={1} max={30} value={nightsFrom} onChange={e => setNightsFrom(e.target.value)}
                    placeholder="von" className="w-16 text-sm bg-slate-50 border border-slate-200 rounded-lg px-2 py-1.5 outline-none focus:border-blue-400 text-center" />
                  <span className="text-slate-400">—</span>
                  <input type="number" min={1} max={30} value={nightsTo} onChange={e => setNightsTo(e.target.value)}
                    placeholder="bis" className="w-16 text-sm bg-slate-50 border border-slate-200 rounded-lg px-2 py-1.5 outline-none focus:border-blue-400 text-center" />
                </div>
              </div>

              {/* Max price */}
              <div className="mb-4">
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                  {t("search_filter_price")} {maxPrice > 0 && <span className="text-blue-600 normal-case font-semibold ml-1">{`bis €${maxPrice.toLocaleString("de-DE")}`}</span>}
                </label>
                <input type="range"
                  min={200}
                  max={5000}
                  step={50}
                  value={maxPrice || (5000)}
                  onChange={e => setMaxPrice(Number(e.target.value))}
                  className="w-full accent-blue-500" />
                <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                  <span>{"€200"}</span>
                  <span>{"€5.000"}</span>
                </div>
              </div>

              {/* Stars */}
              <div className="mb-4">
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">{t("sw_stars")}</label>
                <div className="flex gap-1.5">
                  {["", "3", "4", "5"].map(s => (
                    <button key={s} onClick={() => setStars(s)}
                      className={`flex-1 py-1.5 rounded-lg text-xs font-bold border transition-all ${
                        stars === s ? "bg-amber-400 text-white border-amber-400" : "border-slate-200 text-slate-500 hover:border-amber-300"
                      }`}>
                      {s ? `${s}★` : t("sw_stars_all")}
                    </button>
                  ))}
                </div>
              </div>

              {/* Meal */}
              <div className="mb-4">
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">{t("sw_meal")}</label>
                <select value={meal} onChange={e => setMeal(e.target.value)} className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg px-2 py-1.5 outline-none focus:border-blue-400">
                  <option value="">{t("sw_meal_any")}</option>
                  <option value="BB">{t("sw_meal_bb")}</option>
                  <option value="HB">{t("sw_meal_hb")}</option>
                  <option value="FB">{t("sw_meal_fb")}</option>
                  <option value="AI">{t("sw_meal_ai")}</option>
                  <option value="UAI">{t("sw_meal_uai")}</option>
                </select>
              </div>

              {/* Transport */}
              <div className="mb-4">
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">{t("sw_transport")}</label>
                <div className="flex gap-1.5">
                  {[{ id: "", k: "sw_transport_any" }, { id: "fly", k: "sw_transport_fly" }, { id: "bus", k: "sw_transport_bus" }].map(tr => (
                    <button key={tr.id} onClick={() => setTransport(tr.id)}
                      className={`flex-1 py-1.5 rounded-lg text-xs font-bold border transition-all ${
                        transport === tr.id ? "bg-blue-500 text-white border-blue-500" : "border-slate-200 text-slate-500 hover:border-blue-300"
                      }`}>
                      {t(tr.k)}
                    </button>
                  ))}
                </div>
              </div>

              {/* Source badge */}
              {apiReady !== null && (
                <div className={`mt-2 px-3 py-1.5 rounded-lg text-xs font-medium ${usingApi ? "bg-emerald-50 text-emerald-700 border border-emerald-200" : "bg-amber-50 text-amber-700 border border-amber-200"}`}>
                  {usingApi ? "✓ CRM TAT API" : "⚠ Demo-Daten"}
                </div>
              )}
            </div>
          </aside>

          {/* ── Results ── */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-5">
              <p className="text-sm text-slate-500">
                {loading
                  ? <span className="inline-flex items-center gap-1.5 text-slate-400"><span className="w-3.5 h-3.5 border-2 border-blue-400 border-t-transparent rounded-full animate-spin inline-block" />{t("search_loading")}</span>
                  : <><span className="font-bold text-slate-800">{total}</span> {t("search_results_found")}</>}
              </p>
            </div>

            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                {Array.from({ length: 6 }).map((_, i) => <TourCardSkeleton key={i} />)}
              </div>
            ) : tours.length === 0 ? (
              <div className="text-center py-20">
                <div className="text-5xl mb-4">🔍</div>
                <h3 className="text-xl font-bold text-slate-800 mb-2">{t("search_no_results")}</h3>
                <p className="text-slate-400 mb-5">{t("search_no_results_sub")}</p>
                <button onClick={resetFilters} className="bg-blue-600 text-white font-semibold px-6 py-2.5 rounded-xl hover:bg-blue-700 transition-colors">
                  {t("search_reset_filters")}
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                {tours.map(tour => {
                  const href = tour.slug ? `/tours/${tour.slug}` : "/search";
                  const countryLabel = tour.countryKey ? t(tour.countryKey) : (tour.countryName ?? "");
                  const priceDisplay = formatPrice(tour.price, tour.currency);

                  return (
                    <Link key={tour.id} href={href}
                      className="group bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col">

                      {/* Image area */}
                      <div className={`relative bg-gradient-to-br ${tour.gradient} aspect-[16/9] flex items-center justify-center overflow-hidden flex-shrink-0`}>
                        {(tour as any).imageUrl ? (
                          <img src={(tour as any).imageUrl} alt={tour.hotel || tour.destination} className="absolute inset-0 w-full h-full object-cover" loading="lazy" />
                        ) : (
                          <>
                            <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
                            <span className="text-5xl drop-shadow-lg group-hover:scale-110 transition-transform duration-300">{tour.emoji}</span>
                          </>
                        )}

                        {/* Rating */}
                        {tour.rating > 0 && (
                          <div className="absolute top-3 left-3 bg-white/95 rounded-full px-2.5 py-1 flex items-center gap-1 shadow-sm">
                            <svg className="w-3 h-3 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                            <span className="text-xs font-bold text-slate-700">{tour.rating}</span>
                          </div>
                        )}

                        {/* Tag */}
                        <div className="absolute top-3 right-3 bg-white/20 backdrop-blur-sm text-white text-xs font-bold px-2 py-0.5 rounded-full border border-white/30">
                          {t(tour.tagKey)}
                        </div>

                        {/* Instant badge */}
                        {tour.instant && (
                          <div className="absolute bottom-3 left-3 bg-green-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                            Sofortbestätigung
                          </div>
                        )}
                      </div>

                      {/* Body */}
                      <div className="p-4 flex flex-col flex-1">
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1 min-w-0">
                            <h3 className="font-bold text-slate-800 truncate">{tour.hotel || tour.destination}</h3>
                            <div className="flex items-center gap-1 mt-0.5 flex-wrap">
                              <svg className="w-3 h-3 text-slate-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                              </svg>
                              <span className="text-xs text-slate-400">{countryLabel}{tour.resort ? `, ${tour.resort}` : ""}</span>
                            </div>
                            {tour.hotelStars && tour.hotelStars > 0 ? (
                              <div className="mt-1"><StarRating stars={tour.hotelStars} /></div>
                            ) : null}
                          </div>
                          <div className="text-right flex-shrink-0">
                            <div className="text-[10px] text-slate-400">{t("hot_from")}</div>
                            <div className="text-lg font-extrabold text-slate-800">{priceDisplay}</div>
                            <div className="text-[10px] text-slate-400">{t("tour_per_person")}</div>
                          </div>
                        </div>

                        {/* Details row */}
                        <div className="flex items-center gap-3 mt-3 pt-3 border-t border-slate-50 flex-wrap">
                          <span className="flex items-center gap-1 text-xs text-slate-400">
                            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                            </svg>
                            {tour.nights} {t("hot_nights")}
                          </span>
                          {tour.dateFrom && (
                            <span className="text-xs text-slate-400">
                              {formatDate(tour.dateFrom)}
                            </span>
                          )}
                          {tour.meal && (
                            <span className="bg-slate-100 text-slate-600 text-[10px] font-bold px-1.5 py-0.5 rounded">
                              {tour.meal}
                            </span>
                          )}
                          {tour.operator && (
                            <span className="text-xs text-slate-400 ml-auto truncate max-w-[80px]">{tour.operator}</span>
                          )}
                        </div>

                        <div className="mt-3 pt-2">
                          <span className="text-xs text-blue-600 font-semibold group-hover:underline">
                            {t("tour_book_now")} →
                          </span>
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <SearchContent />
    </Suspense>
  );
}
