"use client";
import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import RevealSection from "@/components/RevealSection";
import { useLocale } from "@/context/LocaleContext";

const subjects = [
  "contact_subject_general",
  "contact_subject_booking",
  "contact_subject_complaint",
  "contact_subject_press",
];

const contactInfo = [
  {
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
    labelKey: "contact_address",
    value: "Reisestraße 42, 10115 Berlin, Deutschland",
    color: "bg-blue-100 text-blue-600",
  },
  {
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
      </svg>
    ),
    labelKey: "contact_phone_label",
    value: "+49 30 123 456 78",
    color: "bg-green-100 text-green-600",
  },
  {
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    ),
    labelKey: "contact_email",
    value: "info@monotours24.de",
    color: "bg-violet-100 text-violet-600",
  },
  {
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    labelKey: "contact_hours",
    value: "",
    valueKey: "contact_hours_val",
    color: "bg-amber-100 text-amber-600",
  },
  {
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
      </svg>
    ),
    labelKey: "contact_emergency",
    value: "+49 800 000 0000",
    color: "bg-rose-100 text-rose-600",
  },
];

export default function ContactPage() {
  const { t } = useLocale();
  const [form, setForm] = useState({ name: "", email: "", subject: subjects[0], message: "" });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <main className="min-h-screen bg-slate-50">
      <Header />

      {/* Hero */}
      <section className="bg-gradient-to-br from-sky-50 via-blue-50 to-cyan-50 pt-16 pb-20 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-blue-200/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />
        <div className="relative max-w-3xl mx-auto px-4 sm:px-6 text-center">
          <RevealSection>
            <div className="inline-flex items-center gap-2 bg-white/70 border border-blue-100 rounded-full px-4 py-1.5 mb-6 shadow-sm">
              <svg className="w-4 h-4 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <span className="text-xs font-semibold text-slate-600 uppercase tracking-widest">{t("nav_contact")}</span>
            </div>
            <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-800 tracking-tight mb-5">
              {t("contact_title")}
            </h1>
            <p className="text-lg text-slate-500 leading-relaxed">{t("contact_subtitle")}</p>
          </RevealSection>
        </div>
      </section>

      {/* Main */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">

          {/* Contact form — wider */}
          <div className="lg:col-span-3">
            <RevealSection variant="left">
              <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-8">
                <h2 className="text-xl font-bold text-slate-800 mb-6">{t("contact_form_title")}</h2>

                {submitted ? (
                  <div className="text-center py-10">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <svg className="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <h3 className="text-xl font-bold text-slate-800 mb-2">{t("contact_success_title")}</h3>
                    <p className="text-slate-400">{t("contact_success_sub")}</p>
                    <button
                      onClick={() => { setSubmitted(false); setForm({ name: "", email: "", subject: subjects[0], message: "" }); }}
                      className="mt-6 text-sm text-blue-600 hover:underline font-medium"
                    >
                      Weitere Nachricht senden
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <div>
                        <label className="block text-xs font-semibold text-slate-600 mb-1.5">{t("contact_name")} *</label>
                        <input
                          type="text"
                          required
                          value={form.name}
                          onChange={(e) => setForm({ ...form, name: e.target.value })}
                          className="w-full px-4 py-3 text-sm bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-600 mb-1.5">{t("contact_email")} *</label>
                        <input
                          type="email"
                          required
                          value={form.email}
                          onChange={(e) => setForm({ ...form, email: e.target.value })}
                          className="w-full px-4 py-3 text-sm bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-600 mb-1.5">{t("contact_subject")}</label>
                      <select
                        value={form.subject}
                        onChange={(e) => setForm({ ...form, subject: e.target.value })}
                        className="w-full px-4 py-3 text-sm bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-blue-400 transition-all"
                      >
                        {subjects.map((s) => (
                          <option key={s} value={s}>{t(s)}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-600 mb-1.5">{t("contact_message")} *</label>
                      <textarea
                        required
                        rows={6}
                        value={form.message}
                        onChange={(e) => setForm({ ...form, message: e.target.value })}
                        className="w-full px-4 py-3 text-sm bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all resize-none"
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-blue-200 hover:shadow-xl hover:scale-[1.02] transition-all flex items-center justify-center gap-2"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                      </svg>
                      {t("contact_submit")}
                    </button>
                  </form>
                )}
              </div>
            </RevealSection>
          </div>

          {/* Sidebar info */}
          <div className="lg:col-span-2 space-y-5">
            <RevealSection variant="right">
              <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6">
                <h2 className="text-lg font-bold text-slate-800 mb-5">{t("contact_info_title")}</h2>
                <div className="space-y-4">
                  {contactInfo.map((item) => (
                    <div key={item.labelKey} className="flex items-start gap-3">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${item.color}`}>
                        {item.icon}
                      </div>
                      <div>
                        <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-0.5">{t(item.labelKey)}</div>
                        <div className="text-sm font-medium text-slate-700">
                          {"valueKey" in item && item.valueKey ? t(item.valueKey) : item.value}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </RevealSection>

            {/* Map */}
            <RevealSection variant="right" delay={100}>
              <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
                <iframe
                  src="https://www.openstreetmap.org/export/embed.html?bbox=13.37%2C52.51%2C13.42%2C52.53&layer=mapnik&marker=52.52%2C13.405"
                  className="w-full h-48 border-0"
                  title="Monotours24 Standort"
                  loading="lazy"
                />
                <div className="p-4 flex items-center gap-2">
                  <svg className="w-4 h-4 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  </svg>
                  <span className="text-sm text-slate-600 font-medium">Reisestraße 42, 10115 Berlin</span>
                </div>
              </div>
            </RevealSection>

            {/* Social links */}
            <RevealSection variant="right" delay={200}>
              <div className="bg-gradient-to-br from-blue-500 to-cyan-500 rounded-3xl p-6 text-white shadow-xl shadow-blue-200">
                <h3 className="font-bold text-lg mb-3">Social Media</h3>
                <p className="text-blue-100 text-sm mb-4">Folgen Sie uns für Reiseinspirationen und exklusive Angebote.</p>
                <div className="flex gap-3">
                  {["Instagram", "Facebook", "X"].map((s) => (
                    <a
                      key={s}
                      href="#"
                      className="flex-1 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-center py-2 rounded-xl text-sm font-semibold transition-colors border border-white/20"
                    >
                      {s}
                    </a>
                  ))}
                </div>
              </div>
            </RevealSection>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}
