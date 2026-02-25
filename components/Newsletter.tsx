"use client";
import { useState } from "react";
import { useLocale } from "@/context/LocaleContext";

export default function Newsletter() {
  const { t } = useLocale();
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) setSubmitted(true);
  };

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-20">
      <div className="relative overflow-hidden bg-gradient-to-br from-blue-500 via-blue-600 to-cyan-600 rounded-3xl p-8 sm:p-12 shadow-2xl shadow-blue-200">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-cyan-400/20 rounded-full translate-y-1/2 -translate-x-1/2 blur-xl" />

        <div className="relative">
          <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-16">
            {/* Text */}
            <div className="text-center lg:text-left flex-1">
              <div className="inline-flex items-center gap-2 bg-white/20 rounded-full px-3 py-1 mb-4">
                <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
                <span className="text-white/90 text-xs font-semibold uppercase tracking-wider">Newsletter</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-3 tracking-tight">
                {t("newsletter_title")}
              </h2>
              <p className="text-blue-100 leading-relaxed max-w-md mx-auto lg:mx-0">
                {t("newsletter_subtitle")}
              </p>

              <div className="flex flex-wrap items-center gap-4 mt-5 justify-center lg:justify-start">
                {[
                  { key: "newsletter_no_spam" },
                  { key: "newsletter_unsubscribe" },
                  { key: "newsletter_exclusive" },
                ].map(({ key }) => (
                  <div key={key} className="flex items-center gap-1.5">
                    <svg className="w-4 h-4 text-cyan-300 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-xs text-blue-100 font-medium">{t(key)}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Form */}
            <div className="w-full lg:w-auto lg:min-w-[440px]">
              {submitted ? (
                <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-8 text-center border border-white/30">
                  <div className="w-14 h-14 bg-green-400 rounded-full flex items-center justify-center mx-auto mb-3">
                    <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <p className="text-white font-bold text-lg">{t("newsletter_success_title")}</p>
                  <p className="text-blue-100 text-sm mt-1">{t("newsletter_success_sub")}</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-2 shadow-2xl flex flex-col sm:flex-row gap-2">
                  <div className="flex-1 flex items-center gap-3 px-4 py-2">
                    <svg className="w-5 h-5 text-slate-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder={t("newsletter_placeholder")}
                      required
                      className="flex-1 text-sm text-slate-700 placeholder-slate-300 bg-transparent outline-none"
                    />
                  </div>
                  <button
                    type="submit"
                    className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white font-semibold px-6 py-3 rounded-xl shadow-lg hover:shadow-xl hover:scale-105 transition-all whitespace-nowrap"
                  >
                    {t("newsletter_button")}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
