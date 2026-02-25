"use client";
import { useState } from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useLocale } from "@/context/LocaleContext";
import { tours } from "@/lib/tours-data";
import { use } from "react";

export default function TourPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const { t } = useLocale();
  const tour = tours.find((t) => t.slug === slug);

  const [formState, setFormState] = useState({
    name: "", email: "", phone: "", guests: "2", date: "", message: "",
  });
  const [submitted, setSubmitted] = useState(false);

  if (!tour) notFound();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  const relatedTours = tours.filter((t) => t.id !== tour.id).slice(0, 3);

  return (
    <main className="min-h-screen bg-slate-50">
      <Header />

      {/* Hero */}
      <div className={`relative bg-gradient-to-br ${tour.gradient} overflow-hidden`}>
        <div className="absolute inset-0 bg-black/20" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/4 blur-3xl" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
          <div className="flex flex-col lg:flex-row items-center gap-10">
            <div className="flex-1 text-white">
              {/* Breadcrumb */}
              <nav className="flex items-center gap-2 text-white/70 text-sm mb-6">
                <Link href="/" className="hover:text-white transition-colors">Home</Link>
                <span>/</span>
                <Link href="/search" className="hover:text-white transition-colors">{t("nav_tours")}</Link>
                <span>/</span>
                <span className="text-white font-medium">{tour.destination}</span>
              </nav>

              <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-3 py-1 mb-4 border border-white/30">
                <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                <span className="text-sm font-semibold">{tour.rating} · {tour.reviews.toLocaleString()} {t("tour_reviews")}</span>
              </div>

              <h1 className="text-4xl sm:text-5xl font-extrabold mb-4 tracking-tight drop-shadow-sm">
                {tour.destination}
              </h1>
              <p className="text-white/90 text-lg leading-relaxed max-w-xl mb-6">
                {tour.description}
              </p>

              <div className="flex flex-wrap gap-4">
                <div className="flex items-center gap-2 bg-white/15 backdrop-blur-sm rounded-xl px-4 py-2 border border-white/20">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                  </svg>
                  <span className="text-sm font-medium">{tour.nights} {t("tour_nights")}</span>
                </div>
                <div className="flex items-center gap-2 bg-white/15 backdrop-blur-sm rounded-xl px-4 py-2 border border-white/20">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3l14 9-14 9V3z" />
                  </svg>
                  <span className="text-sm font-medium">{t("tour_departure")}: {tour.departure}</span>
                </div>
                <div className="flex items-center gap-2 bg-white/15 backdrop-blur-sm rounded-xl px-4 py-2 border border-white/20">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  </svg>
                  <span className="text-sm font-medium">{t(tour.countryKey)}</span>
                </div>
              </div>
            </div>

            {/* Price card */}
            <div className="w-full lg:w-80 flex-shrink-0">
              <div className="bg-white rounded-3xl p-6 shadow-2xl shadow-black/20">
                <div className="text-center mb-5">
                  <p className="text-sm text-slate-400 font-medium">{t("hot_from")}</p>
                  <div className="text-5xl font-extrabold text-slate-800 tracking-tight">€{tour.price}</div>
                  <p className="text-sm text-slate-400 mt-1">{t("tour_per_person")}</p>
                </div>

                <a
                  href="#booking"
                  className="block w-full bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white font-bold py-3.5 rounded-2xl text-center shadow-lg shadow-blue-200 hover:shadow-xl hover:scale-105 transition-all mb-3"
                >
                  {t("tour_book_now")}
                </a>

                {/* What's included quick list */}
                <div className="mt-4 space-y-2">
                  {tour.included.slice(0, 3).map((item) => (
                    <div key={item} className="flex items-center gap-2 text-xs text-slate-600">
                      <svg className="w-4 h-4 text-green-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                      </svg>
                      {item}
                    </div>
                  ))}
                  {tour.included.length > 3 && (
                    <p className="text-xs text-blue-500 font-medium pl-6">+{tour.included.length - 3} mehr</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col lg:flex-row gap-10">
          {/* Left: details */}
          <div className="flex-1 min-w-0 space-y-8">
            {/* What's included */}
            <section className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
              <h2 className="text-xl font-bold text-slate-800 mb-5 flex items-center gap-2">
                <span className="w-7 h-7 bg-green-100 rounded-lg flex items-center justify-center">
                  <svg className="w-4 h-4 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                  </svg>
                </span>
                {t("tour_included")}
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {tour.included.map((item) => (
                  <div key={item} className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl">
                    <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <svg className="w-4 h-4 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span className="text-sm font-medium text-slate-700">{item}</span>
                  </div>
                ))}
              </div>
            </section>

            {/* Program */}
            <section className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
              <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
                <span className="w-7 h-7 bg-blue-100 rounded-lg flex items-center justify-center">
                  <svg className="w-4 h-4 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </span>
                {t("tour_program")}
              </h2>
              <div className="space-y-0">
                {tour.program.map((day, idx) => (
                  <div key={idx} className="relative flex gap-4 pb-6 last:pb-0">
                    {/* Timeline line */}
                    {idx < tour.program.length - 1 && (
                      <div className="absolute left-5 top-10 bottom-0 w-0.5 bg-slate-100" />
                    )}
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center text-white text-xs font-bold flex-shrink-0 shadow-sm z-10">
                      {idx + 1}
                    </div>
                    <div className="flex-1 pt-1.5">
                      <h3 className="font-bold text-slate-800 mb-1">
                        {t("tour_day")} {idx + 1}: {day.title}
                      </h3>
                      <p className="text-sm text-slate-500 leading-relaxed">{day.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* Right: booking form */}
          <div className="lg:w-96 flex-shrink-0">
            <div id="booking" className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 sticky top-24">
              <h2 className="text-xl font-bold text-slate-800 mb-5">{t("booking_title")}</h2>

              {submitted ? (
                <div className="text-center py-6">
                  <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <svg className="w-7 h-7 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <p className="font-bold text-slate-800 mb-1">{t("booking_success")}</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  {[
                    { key: "name", labelKey: "booking_name", type: "text", required: true },
                    { key: "email", labelKey: "booking_email", type: "email", required: true },
                    { key: "phone", labelKey: "booking_phone", type: "tel", required: false },
                    { key: "date", labelKey: "booking_date", type: "date", required: true },
                  ].map((field) => (
                    <div key={field.key}>
                      <label className="block text-xs font-semibold text-slate-600 mb-1.5">{t(field.labelKey)}</label>
                      <input
                        type={field.type}
                        required={field.required}
                        value={formState[field.key as keyof typeof formState]}
                        onChange={(e) => setFormState({ ...formState, [field.key]: e.target.value })}
                        className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all"
                      />
                    </div>
                  ))}

                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1.5">{t("booking_guests")}</label>
                    <select
                      value={formState.guests}
                      onChange={(e) => setFormState({ ...formState, guests: e.target.value })}
                      className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-blue-400 transition-all"
                    >
                      {["1","2","3","4","5","6"].map((n) => (
                        <option key={n} value={n}>{n} {n === "1" ? t("guests_1").split(" ")[1] : t("guests_2").split(" ")[1]}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1.5">{t("booking_message")}</label>
                    <textarea
                      rows={3}
                      value={formState.message}
                      onChange={(e) => setFormState({ ...formState, message: e.target.value })}
                      className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-blue-200 hover:shadow-xl hover:scale-105 transition-all"
                  >
                    {t("booking_submit")}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>

        {/* Related tours */}
        <section className="mt-16">
          <h2 className="text-2xl font-extrabold text-slate-800 mb-6">{t("hot_tours_title")}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {relatedTours.map((related) => (
              <Link
                key={related.id}
                href={`/tours/${related.slug}`}
                className="group bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
              >
                <div className={`bg-gradient-to-br ${related.gradient} aspect-[16/9] flex items-center justify-center relative overflow-hidden`}>
                  <span className="text-4xl group-hover:scale-110 transition-transform duration-300 drop-shadow-lg">{related.emoji}</span>
                  <div className="absolute top-2 right-2 bg-white/20 text-white text-xs font-bold px-2 py-0.5 rounded-full border border-white/30">
                    {t(related.tagKey)}
                  </div>
                </div>
                <div className="p-4 flex items-center justify-between">
                  <div>
                    <h3 className="font-bold text-slate-800 text-sm">{related.destination}</h3>
                    <p className="text-xs text-slate-400">{related.nights} {t("hot_nights")}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-xs text-slate-400">{t("hot_from")}</div>
                    <div className="font-extrabold text-slate-800">€{related.price}</div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </div>

      <Footer />
    </main>
  );
}
