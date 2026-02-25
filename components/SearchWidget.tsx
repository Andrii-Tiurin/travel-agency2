"use client";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { useLocale } from "@/context/LocaleContext";

// TAT numeric country IDs (parameter: ci)
const COUNTRIES = [
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
  { id: "13", key: "country_portugal" },
] as const;

// TAT departure city IDs (parameter: dc)
const DEPARTURE_CITIES = [
  { id: "870",  key: "city_berlin" },
  { id: "882",  key: "city_muenchen" },
  { id: "876",  key: "city_frankfurt" },
  { id: "875",  key: "city_duesseldorf" },
  { id: "879",  key: "city_hamburg" },
  { id: "873",  key: "city_koeln" },
  { id: "884",  key: "city_stuttgart" },
  { id: "877",  key: "city_hannover" },
  { id: "883",  key: "city_nuernberg" },
  { id: "874",  key: "city_dresden" },
  { id: "880",  key: "city_leipzig" },
  { id: "1491", key: "city_dortmund" },
  { id: "872",  key: "city_bremen" },
];

const NIGHTS_OPTIONS = [3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 21];

function SearchWidgetInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { t } = useLocale();

  // Pre-fill from URL params (so widget stays in sync after navigation)
  const [country,       setCountry]       = useState(searchParams.get("country")       ?? "");
  const [departureCity, setDepartureCity] = useState(searchParams.get("departureCity") ?? "");
  const [dateFrom,      setDateFrom]      = useState(searchParams.get("dateFrom")      ?? "");
  const [dateTo,        setDateTo]        = useState(searchParams.get("dateTo")        ?? "");
  const [nightsFrom,    setNightsFrom]    = useState(searchParams.get("nightsFrom")    ?? "7");
  const [nightsTo,      setNightsTo]      = useState(searchParams.get("nightsTo")      ?? "10");
  const [adults,        setAdults]        = useState(searchParams.get("adults")        ?? "2");
  const [children,      setChildren]      = useState(searchParams.get("children")      ?? "0");
  const [stars,         setStars]         = useState(searchParams.get("stars")         ?? "");
  const [meal,          setMeal]          = useState(searchParams.get("meal")          ?? "");
  const [transport,     setTransport]     = useState(searchParams.get("transport")     ?? "");
  const [showMore,      setShowMore]      = useState(
    !!(searchParams.get("stars") || searchParams.get("meal") || searchParams.get("transport"))
  );

  const handleSearch = () => {
    const p = new URLSearchParams();
    if (country)          p.set("country",      country);
    if (departureCity)    p.set("departureCity", departureCity);
    if (dateFrom)         p.set("dateFrom",      dateFrom);
    if (dateTo)           p.set("dateTo",        dateTo);
    if (nightsFrom !== "7")  p.set("nightsFrom", nightsFrom);
    if (nightsTo  !== "10") p.set("nightsTo",    nightsTo);
    if (adults    !== "2")  p.set("adults",      adults);
    if (children  !== "0")  p.set("children",    children);
    if (stars)            p.set("stars",         stars);
    if (meal)             p.set("meal",          meal);
    if (transport)        p.set("transport",     transport);
    router.push(`/search?${p.toString()}`);
  };

  const labelClass = "text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1 flex items-center gap-1";
  const selectClass = "w-full text-sm font-medium text-slate-700 bg-transparent outline-none cursor-pointer";

  const mealOptions = [
    { id: "",    key: "sw_meal_any" },
    { id: "BB",  key: "sw_meal_bb" },
    { id: "HB",  key: "sw_meal_hb" },
    { id: "FB",  key: "sw_meal_fb" },
    { id: "AI",  key: "sw_meal_ai" },
    { id: "UAI", key: "sw_meal_uai" },
  ];

  const starOptions = [
    { id: "",  key: "sw_stars_all" },
    { id: "3", label: "3★" },
    { id: "4", label: "4★" },
    { id: "5", label: "5★" },
  ];

  const transportOptions = [
    { id: "",    key: "sw_transport_any" },
    { id: "fly", key: "sw_transport_fly" },
    { id: "bus", key: "sw_transport_bus" },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 relative z-10">
      <div className="bg-white rounded-2xl shadow-xl shadow-blue-100/60 border border-slate-100 overflow-hidden">

        {/* ── Main row ── */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 divide-y lg:divide-y-0 lg:divide-x divide-slate-100">

          {/* Destination (country) */}
          <div className="px-4 py-3.5 col-span-2 md:col-span-1">
            <label className={labelClass}>
              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 004 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064" />
              </svg>
              {t("sw_country")}
            </label>
            <select value={country} onChange={e => setCountry(e.target.value)} className={selectClass}>
              <option value="">{t("sw_country_all")}</option>
              {COUNTRIES.map(c => (
                <option key={c.id + c.key} value={c.id}>{t(c.key)}</option>
              ))}
            </select>
          </div>

          {/* Departure city */}
          <div className="px-4 py-3.5">
            <label className={labelClass}>
              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
              {t("sw_departure")}
            </label>
            <select value={departureCity} onChange={e => setDepartureCity(e.target.value)} className={selectClass}>
              <option value="">{t("sw_departure_all")}</option>
              {DEPARTURE_CITIES.map(c => (
                <option key={c.id} value={c.id}>{t(c.key)}</option>
              ))}
            </select>
          </div>

          {/* Date from */}
          <div className="px-4 py-3.5">
            <label className={labelClass}>
              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              {t("sw_date_from")}
            </label>
            <input
              type="date"
              value={dateFrom}
              onChange={e => setDateFrom(e.target.value)}
              min={new Date().toISOString().split("T")[0]}
              className={selectClass}
            />
          </div>

          {/* Nights */}
          <div className="px-4 py-3.5">
            <label className={labelClass}>
              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
              </svg>
              {t("sw_nights")}
            </label>
            <div className="flex items-center gap-1">
              <select value={nightsFrom} onChange={e => setNightsFrom(e.target.value)} className="text-sm font-medium text-slate-700 bg-transparent outline-none cursor-pointer">
                {NIGHTS_OPTIONS.map(n => <option key={n} value={n}>{n}</option>)}
              </select>
              <span className="text-slate-300">—</span>
              <select value={nightsTo} onChange={e => setNightsTo(e.target.value)} className="text-sm font-medium text-slate-700 bg-transparent outline-none cursor-pointer">
                {NIGHTS_OPTIONS.map(n => <option key={n} value={n}>{n}</option>)}
              </select>
            </div>
          </div>

          {/* Guests */}
          <div className="px-4 py-3.5">
            <label className={labelClass}>
              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              {t("sw_guests")}
            </label>
            <div className="flex items-center gap-1 text-sm font-medium text-slate-700">
              <select value={adults} onChange={e => setAdults(e.target.value)} className="bg-transparent outline-none cursor-pointer">
                {[1,2,3,4,5,6].map(n => <option key={n} value={n}>{n} {t("sw_adults")}</option>)}
              </select>
              <span className="text-slate-300">+</span>
              <select value={children} onChange={e => setChildren(e.target.value)} className="bg-transparent outline-none cursor-pointer">
                {[0,1,2,3].map(n => <option key={n} value={n}>{n} {t("sw_children")}</option>)}
              </select>
            </div>
          </div>

          {/* Search button */}
          <div className="px-3 py-3 flex items-center col-span-2 md:col-span-1 lg:col-span-1">
            <button
              onClick={handleSearch}
              className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white font-bold px-4 py-3 rounded-xl shadow-lg shadow-blue-200 hover:shadow-xl hover:scale-[1.02] transition-all flex items-center justify-center gap-2"
            >
              <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              {t("search_button")}
            </button>
          </div>
        </div>

        {/* ── More filters toggle ── */}
        <div className="border-t border-slate-100">
          <button
            onClick={() => setShowMore(!showMore)}
            className="w-full px-5 py-2 flex items-center justify-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-blue-600 transition-colors"
          >
            <svg className={`w-3.5 h-3.5 transition-transform ${showMore ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
            </svg>
            {showMore ? t("sw_less_filters") : `${t("sw_more_filters")} — ${t("sw_stars")}, ${t("sw_meal")}, ${t("sw_transport")}`}
          </button>

          {showMore && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 px-5 pb-4 pt-2 border-t border-slate-50">

              {/* Stars */}
              <div>
                <label className={labelClass + " mb-2"}>{t("sw_stars")}</label>
                <div className="flex gap-1.5 flex-wrap">
                  {starOptions.map(s => (
                    <button
                      key={s.id}
                      onClick={() => setStars(s.id)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-all ${
                        stars === s.id
                          ? "bg-amber-400 text-white border-amber-400"
                          : "border-slate-200 text-slate-500 hover:border-amber-300 bg-white"
                      }`}
                    >
                      {"label" in s ? s.label : t(s.key!)}
                    </button>
                  ))}
                </div>
              </div>

              {/* Meal */}
              <div>
                <label className={labelClass + " mb-2"}>{t("sw_meal")}</label>
                <select
                  value={meal}
                  onChange={e => setMeal(e.target.value)}
                  className="w-full text-sm bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 outline-none focus:border-blue-400 transition-colors"
                >
                  {mealOptions.map(m => (
                    <option key={m.id} value={m.id}>{t(m.key)}</option>
                  ))}
                </select>
              </div>

              {/* Transport */}
              <div>
                <label className={labelClass + " mb-2"}>{t("sw_transport")}</label>
                <div className="flex gap-2">
                  {transportOptions.map(tr => (
                    <button
                      key={tr.id}
                      onClick={() => setTransport(tr.id)}
                      className={`flex-1 py-1.5 rounded-lg text-xs font-bold border transition-all ${
                        transport === tr.id
                          ? "bg-blue-500 text-white border-blue-500"
                          : "border-slate-200 text-slate-500 hover:border-blue-300 bg-white"
                      }`}
                    >
                      {t(tr.key)}
                    </button>
                  ))}
                </div>
              </div>

            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Must wrap in Suspense because useSearchParams() requires it
export default function SearchWidget() {
  return (
    <Suspense fallback={
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        <div className="bg-white rounded-2xl shadow-xl border border-slate-100 h-20 animate-pulse" />
      </div>
    }>
      <SearchWidgetInner />
    </Suspense>
  );
}
