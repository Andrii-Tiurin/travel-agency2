"use client";
import { useLocale } from "@/context/LocaleContext";

export default function InfoCards() {
  const { t } = useLocale();

  const cards = [
    {
      icon: (
        <svg className="w-7 h-7 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
        </svg>
      ),
      bg: "bg-blue-50",
      border: "border-blue-100",
      iconBg: "bg-blue-100",
      badge: "100%",
      badgeColor: "text-blue-700 bg-blue-100",
      titleKey: "info_guaranteed_title",
      descKey: "info_guaranteed_desc",
    },
    {
      icon: (
        <svg className="w-7 h-7 text-cyan-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064" />
        </svg>
      ),
      bg: "bg-cyan-50",
      border: "border-cyan-100",
      iconBg: "bg-cyan-100",
      badge: "500+",
      badgeColor: "text-cyan-700 bg-cyan-100",
      titleKey: "info_excursions_title",
      descKey: "info_excursions_desc",
    },
    {
      icon: (
        <svg className="w-7 h-7 text-violet-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      bg: "bg-violet-50",
      border: "border-violet-100",
      iconBg: "bg-violet-100",
      badgeKey: "info_bestprice_badge",
      badgeColor: "text-violet-700 bg-violet-100",
      titleKey: "info_bestprice_title",
      descKey: "info_bestprice_desc",
    },
    {
      icon: (
        <svg className="w-7 h-7 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      ),
      bg: "bg-emerald-50",
      border: "border-emerald-100",
      iconBg: "bg-emerald-100",
      badge: "24/7",
      badgeColor: "text-emerald-700 bg-emerald-100",
      titleKey: "info_support_title",
      descKey: "info_support_desc",
    },
  ];

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {cards.map((card) => (
          <div
            key={card.titleKey}
            className={`${card.bg} ${card.border} border rounded-2xl p-5 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200`}
          >
            <div className="flex items-start justify-between mb-4">
              <div className={`${card.iconBg} w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0`}>
                {card.icon}
              </div>
              <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${card.badgeColor}`}>
                {"badgeKey" in card ? t(card.badgeKey as string) : card.badge}
              </span>
            </div>
            <h3 className="font-bold text-slate-800 mb-1.5 text-[15px]">{t(card.titleKey)}</h3>
            <p className="text-sm text-slate-500 leading-relaxed">{t(card.descKey)}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
