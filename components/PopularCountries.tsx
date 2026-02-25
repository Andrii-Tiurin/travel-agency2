"use client";
import Link from "next/link";
import { useLocale } from "@/context/LocaleContext";

const countries = [
  { nameKey: "country_thailand", slug: "thailand", price: 799, gradient: "from-orange-400 to-rose-400", bg: "from-orange-50 to-rose-50", border: "border-rose-100", tours: 48, emoji: "🇹🇭" },
  { nameKey: "country_turkey",   slug: "turkey",   price: 549, gradient: "from-red-500 to-orange-400",  bg: "from-red-50 to-orange-50",  border: "border-orange-100", tours: 72, emoji: "🇹🇷" },
  { nameKey: "country_spain",    slug: "spain",    price: 649, gradient: "from-yellow-400 to-orange-400", bg: "from-yellow-50 to-orange-50", border: "border-yellow-100", tours: 56, emoji: "🇪🇸" },
  { nameKey: "country_italy",    slug: "italy",    price: 749, gradient: "from-green-500 to-emerald-400", bg: "from-green-50 to-emerald-50", border: "border-emerald-100", tours: 63, emoji: "🇮🇹" },
  { nameKey: "country_japan",    slug: "japan",    price: 1299, gradient: "from-pink-500 to-rose-400",  bg: "from-pink-50 to-rose-50",   border: "border-pink-100", tours: 34, emoji: "🇯🇵" },
  { nameKey: "country_portugal", slug: "portugal", price: 599, gradient: "from-blue-500 to-indigo-400", bg: "from-blue-50 to-indigo-50", border: "border-indigo-100", tours: 41, emoji: "🇵🇹" },
];

export default function PopularCountries() {
  const { t } = useLocale();

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-20 mb-20">
      <div className="flex items-end justify-between mb-8">
        <div>
          <p className="text-xs font-semibold text-blue-500 uppercase tracking-widest mb-1">{t("countries_worldwide")}</p>
          <h2 className="text-3xl font-extrabold text-slate-800 tracking-tight">{t("countries_title")}</h2>
          <p className="text-slate-400 mt-1">{t("countries_subtitle")}</p>
        </div>
        <Link
          href="/search"
          className="hidden sm:flex items-center gap-1.5 text-sm font-semibold text-blue-600 hover:text-blue-700 transition-colors"
        >
          {t("countries_show_all")}
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
          </svg>
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {countries.map((country) => (
          <Link
            key={country.nameKey}
            href={`/search?country=${country.slug}`}
            className={`group relative bg-gradient-to-br ${country.bg} ${country.border} border rounded-2xl p-5 hover:shadow-xl hover:-translate-y-0.5 transition-all duration-200 overflow-hidden`}
          >
            <div className={`absolute -top-8 -right-8 w-28 h-28 bg-gradient-to-br ${country.gradient} opacity-20 rounded-full blur-xl group-hover:opacity-30 transition-opacity`} />

            <div className="relative flex items-center gap-4">
              <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${country.gradient} flex items-center justify-center text-2xl shadow-md flex-shrink-0 group-hover:scale-110 transition-transform`}>
                {country.emoji}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-bold text-slate-800 text-[15px]">{t(country.nameKey)}</h3>
                    <p className="text-xs text-slate-400 mt-0.5">{country.tours} {t("countries_tours_available")}</p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <div className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">{t("countries_from")}</div>
                    <div className="text-lg font-extrabold text-slate-800">€{country.price}</div>
                  </div>
                </div>

                <div className="flex items-center gap-1 mt-2">
                  {[1,2,3,4,5].map(i => (
                    <div key={i} className={`h-1 flex-1 rounded-full bg-gradient-to-r ${country.gradient} ${i > 4 ? "opacity-30" : ""}`} />
                  ))}
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
