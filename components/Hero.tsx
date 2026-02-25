"use client";
import Link from "next/link";
import { useLocale } from "@/context/LocaleContext";

export default function Hero() {
  const { t } = useLocale();

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-sky-50 via-blue-50 to-cyan-50 pt-16 pb-12">
      {/* Decorative blobs */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-200/30 rounded-full blur-3xl -translate-y-1/2" />
      <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-cyan-200/30 rounded-full blur-3xl translate-y-1/2" />
      <div className="absolute top-1/2 left-0 w-64 h-64 bg-sky-100/50 rounded-full blur-2xl -translate-y-1/2" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
          {/* Left: text */}
          <div className="flex-1 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 bg-white/70 backdrop-blur-sm border border-blue-100 rounded-full px-4 py-1.5 mb-6 shadow-sm">
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              <span className="text-xs font-semibold text-slate-600 uppercase tracking-widest">{t("hero_badge")}</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-800 leading-tight tracking-tight mb-5">
              {t("hero_title")}
            </h1>

            <p className="text-lg text-slate-500 leading-relaxed mb-8 max-w-lg mx-auto lg:mx-0">
              {t("hero_subtitle")}
            </p>

            <div className="flex flex-col sm:flex-row items-center lg:items-start gap-3 justify-center lg:justify-start">
              <Link
                href="/search"
                className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-semibold px-7 py-3.5 rounded-full shadow-lg shadow-blue-200 hover:shadow-xl hover:scale-105 transition-all"
              >
                {t("hero_cta")}
              </Link>
              <button className="flex items-center gap-2 text-slate-600 font-medium px-5 py-3.5 rounded-full border border-slate-200 hover:border-blue-300 hover:text-blue-600 bg-white/60 hover:bg-white transition-all">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {t("hero_video")}
              </button>
            </div>

            {/* Stats */}
            <div className="flex items-center gap-6 mt-10 justify-center lg:justify-start">
              {[
                { value: "50K+", labelKey: "hero_stat_travelers" },
                { value: "4.9",  labelKey: "hero_stat_rating"    },
                { value: "60+",  labelKey: "hero_stat_countries" },
              ].map((stat) => (
                <div key={stat.labelKey} className="text-center">
                  <div className="text-2xl font-extrabold text-slate-800">{stat.value}</div>
                  <div className="text-xs text-slate-400 font-medium">{t(stat.labelKey)}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Right: illustration */}
          <div className="flex-1 w-full max-w-md lg:max-w-none">
            <div className="relative">
              <div className="rounded-3xl overflow-hidden shadow-2xl shadow-blue-200/60 ring-1 ring-white/50">
                <div className="aspect-[4/3] bg-gradient-to-br from-blue-400 via-cyan-400 to-teal-300 relative overflow-hidden">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <svg viewBox="0 0 400 300" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <rect width="400" height="300" fill="url(#skyGrad)" />
                      <circle cx="320" cy="60" r="35" fill="#FDE68A" opacity="0.9" />
                      <circle cx="320" cy="60" r="45" fill="#FDE68A" opacity="0.3" />
                      <ellipse cx="80" cy="80" rx="40" ry="20" fill="white" opacity="0.7" />
                      <ellipse cx="100" cy="70" rx="30" ry="20" fill="white" opacity="0.7" />
                      <ellipse cx="200" cy="50" rx="50" ry="18" fill="white" opacity="0.5" />
                      <ellipse cx="230" cy="42" rx="35" ry="18" fill="white" opacity="0.5" />
                      <path d="M0 180 Q100 160 200 180 Q300 200 400 170 L400 300 L0 300 Z" fill="#0EA5E9" opacity="0.6" />
                      <path d="M0 200 Q100 185 200 200 Q300 215 400 195 L400 300 L0 300 Z" fill="#0284C7" opacity="0.7" />
                      <ellipse cx="200" cy="195" rx="80" ry="20" fill="#D97706" opacity="0.8" />
                      <ellipse cx="200" cy="195" rx="70" ry="15" fill="#F59E0B" opacity="0.9" />
                      <rect x="196" y="130" width="8" height="65" rx="4" fill="#92400E" />
                      <ellipse cx="200" cy="128" rx="30" ry="15" fill="#16A34A" opacity="0.9" transform="rotate(-15 200 128)" />
                      <ellipse cx="200" cy="128" rx="28" ry="13" fill="#22C55E" opacity="0.8" transform="rotate(15 200 128)" />
                      <ellipse cx="200" cy="120" rx="20" ry="10" fill="#4ADE80" opacity="0.9" transform="rotate(-5 200 120)" />
                      <g transform="translate(120 100) rotate(-20)">
                        <path d="M0 0 L40 -8 L45 0 L40 8 L0 0Z" fill="white" opacity="0.95" />
                        <path d="M15 -8 L25 -20 L30 -18 L20 -5Z" fill="white" opacity="0.85" />
                        <path d="M15 8 L25 20 L30 18 L20 5Z" fill="white" opacity="0.85" />
                        <path d="M35 -4 L42 -10 L44 -8 L37 -2Z" fill="white" opacity="0.75" />
                      </g>
                      <path d="M280 185 L320 185 L315 200 L285 200 Z" fill="white" opacity="0.9" />
                      <rect x="298" y="170" width="3" height="16" fill="white" opacity="0.8" />
                      <path d="M298 170 L315 178 L298 178 Z" fill="#EF4444" opacity="0.8" />
                      <defs>
                        <linearGradient id="skyGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#BAE6FD" />
                          <stop offset="100%" stopColor="#7DD3FC" />
                        </linearGradient>
                      </defs>
                    </svg>
                  </div>
                </div>
              </div>

              {/* Floating cards */}
              <div className="absolute -bottom-4 -left-4 bg-white rounded-2xl shadow-xl p-3.5 flex items-center gap-3 border border-slate-50">
                <div className="w-10 h-10 rounded-xl bg-green-100 flex items-center justify-center flex-shrink-0">
                  <svg className="w-5 h-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-800">{t("hero_booking_confirmed")}</div>
                  <div className="text-xs text-slate-400">{t("hero_booking_subtitle")}</div>
                </div>
              </div>

              <div className="absolute -top-4 -right-4 bg-white rounded-2xl shadow-xl p-3.5 border border-slate-50">
                <div className="flex items-center gap-1 mb-1">
                  {[1,2,3,4,5].map(i => (
                    <svg key={i} className="w-3 h-3 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <div className="text-xs font-bold text-slate-800">4.9 / 5.0</div>
                <div className="text-xs text-slate-400">{t("hero_reviews_count")}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
