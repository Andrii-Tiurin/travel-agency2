"use client";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import RevealSection from "@/components/RevealSection";
import { useLocale } from "@/context/LocaleContext";
import Link from "next/link";

const team = [
  { name: "Maria Schneider", role: "CEO & Gründerin", emoji: "👩‍💼", years: 14 },
  { name: "Thomas Weber", role: "Head of Travel", emoji: "🧳", years: 10 },
  { name: "Aiko Tanaka", role: "Asia & Pacific", emoji: "🗺️", years: 7 },
  { name: "Carlos Ruiz", role: "Lateinamerika", emoji: "🌎", years: 5 },
  { name: "Sophie Martin", role: "Europa & Mittelmeer", emoji: "🏛️", years: 8 },
  { name: "Dmitri Volkov", role: "Osteuropa & Russland", emoji: "🎡", years: 6 },
];

const values = [
  { titleKey: "about_val_trust", descKey: "about_val_trust_desc", icon: "🤝", color: "from-blue-500 to-cyan-400", bg: "bg-blue-50", border: "border-blue-100" },
  { titleKey: "about_val_quality", descKey: "about_val_quality_desc", icon: "⭐", color: "from-amber-400 to-orange-400", bg: "bg-amber-50", border: "border-amber-100" },
  { titleKey: "about_val_service", descKey: "about_val_service_desc", icon: "💎", color: "from-violet-500 to-fuchsia-400", bg: "bg-violet-50", border: "border-violet-100" },
  { titleKey: "about_val_passion", descKey: "about_val_passion_desc", icon: "❤️", color: "from-rose-500 to-pink-400", bg: "bg-rose-50", border: "border-rose-100" },
];

const stats = [
  { value: "14+", labelKey: "about_years" },
  { value: "500K+", labelKey: "about_customers" },
  { value: "500+", labelKey: "about_destinations" },
  { value: "4.9", labelKey: "about_rating_label" },
];

export default function AboutPage() {
  const { t } = useLocale();

  return (
    <main className="min-h-screen bg-white">
      <Header />

      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-sky-50 via-blue-50 to-cyan-50 pt-20 pb-24">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-200/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-cyan-200/20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/3" />
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <RevealSection>
            <div className="inline-flex items-center gap-2 bg-white/70 border border-blue-100 rounded-full px-4 py-1.5 mb-6 shadow-sm">
              <span className="w-2 h-2 bg-blue-400 rounded-full" />
              <span className="text-xs font-semibold text-slate-600 uppercase tracking-widest">{t("about_badge")}</span>
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-800 tracking-tight mb-6">
              {t("about_title")}
            </h1>
            <p className="text-xl text-slate-500 leading-relaxed max-w-2xl mx-auto">
              {t("about_subtitle")}
            </p>
          </RevealSection>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-white border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
          <RevealSection variant="stagger" className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat) => (
              <div key={stat.labelKey} className="text-center">
                <div className="text-4xl sm:text-5xl font-extrabold bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent mb-2">
                  {stat.value}
                </div>
                <div className="text-sm font-medium text-slate-500">{t(stat.labelKey)}</div>
              </div>
            ))}
          </RevealSection>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          <RevealSection variant="left">
            <div className="bg-gradient-to-br from-blue-500 to-cyan-500 rounded-3xl p-8 text-white h-full shadow-xl shadow-blue-200">
              <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center mb-5 text-2xl">🎯</div>
              <h2 className="text-2xl font-extrabold mb-4">{t("about_mission_title")}</h2>
              <p className="text-blue-100 leading-relaxed text-lg">{t("about_mission_text")}</p>
            </div>
          </RevealSection>
          <RevealSection variant="right">
            <div className="bg-gradient-to-br from-violet-500 to-fuchsia-500 rounded-3xl p-8 text-white h-full shadow-xl shadow-violet-200">
              <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center mb-5 text-2xl">🌍</div>
              <h2 className="text-2xl font-extrabold mb-4">{t("about_vision_title")}</h2>
              <p className="text-violet-100 leading-relaxed text-lg">{t("about_vision_text")}</p>
            </div>
          </RevealSection>
        </div>
      </section>

      {/* Values */}
      <section className="bg-slate-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <RevealSection className="text-center mb-12">
            <h2 className="text-3xl font-extrabold text-slate-800 tracking-tight">{t("about_values_title")}</h2>
          </RevealSection>
          <RevealSection variant="stagger" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {values.map((v) => (
              <div key={v.titleKey} className={`${v.bg} ${v.border} border rounded-2xl p-6 hover:shadow-lg hover:-translate-y-0.5 transition-all`}>
                <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${v.color} flex items-center justify-center text-xl shadow-md mb-4`}>
                  {v.icon}
                </div>
                <h3 className="font-bold text-slate-800 text-lg mb-2">{t(v.titleKey)}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">{t(v.descKey)}</p>
              </div>
            ))}
          </RevealSection>
        </div>
      </section>

      {/* Team */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <RevealSection className="text-center mb-12">
          <h2 className="text-3xl font-extrabold text-slate-800 tracking-tight mb-3">{t("about_team_title")}</h2>
          <p className="text-slate-400">{t("about_team_subtitle")}</p>
        </RevealSection>
        <RevealSection variant="stagger" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {team.map((member) => (
            <div key={member.name} className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition-all group">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-100 to-cyan-100 flex items-center justify-center text-3xl mb-4 group-hover:scale-110 transition-transform shadow-sm">
                {member.emoji}
              </div>
              <h3 className="font-bold text-slate-800 text-lg">{member.name}</h3>
              <p className="text-blue-600 font-medium text-sm mt-0.5">{member.role}</p>
              <p className="text-xs text-slate-400 mt-2">{member.years} Jahre bei Monotours24</p>
            </div>
          ))}
        </RevealSection>
      </section>

      {/* CTA */}
      <section className="bg-gradient-to-br from-blue-500 via-blue-600 to-cyan-600 py-20">
        <RevealSection className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-4 tracking-tight">
            Bereit für Ihr nächstes Abenteuer?
          </h2>
          <p className="text-blue-100 text-lg mb-8 leading-relaxed">
            Entdecken Sie hunderte von Touren und finden Sie Ihre Traumreise.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/search"
              className="bg-white text-blue-600 font-bold px-8 py-3.5 rounded-full shadow-lg hover:shadow-xl hover:scale-105 transition-all"
            >
              {t("hero_cta")}
            </Link>
            <Link
              href="/contact"
              className="border-2 border-white/50 text-white font-semibold px-8 py-3.5 rounded-full hover:bg-white/10 transition-all"
            >
              {t("nav_contact")}
            </Link>
          </div>
        </RevealSection>
      </section>

      <Footer />
    </main>
  );
}
