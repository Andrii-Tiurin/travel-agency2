"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useLocale } from "@/context/LocaleContext";
import { tours as staticTours } from "@/lib/tours-data";
import type { NormalizedTour } from "@/lib/tat-api";

function TourCardSkeleton() {
  return (
    <div className="rounded-2xl overflow-hidden shadow-md animate-pulse">
      <div className="aspect-[4/3] bg-slate-200" />
      <div className="bg-white p-4 space-y-3">
        <div className="flex justify-between items-start">
          <div className="space-y-1.5">
            <div className="h-4 bg-slate-200 rounded w-28" />
            <div className="h-3 bg-slate-100 rounded w-20" />
          </div>
          <div className="space-y-1 text-right">
            <div className="h-3 bg-slate-100 rounded w-10 ml-auto" />
            <div className="h-5 bg-slate-200 rounded w-16 ml-auto" />
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
  destination: string;
  countryKey?: string;
  countryName?: string;
  nights: number;
  price: number;
  currency?: string;
  rating: number;
  reviews?: number;
  gradient: string;
  emoji: string;
  tagKey: string;
  slug?: string;
};

function toDisplayTour(t: NormalizedTour): DisplayTour {
  return {
    id: t.id,
    destination: t.destination,
    countryName: t.countryName,
    nights: t.nights,
    price: t.price,
    currency: t.currency,
    rating: t.rating,
    gradient: t.gradient,
    emoji: t.emoji,
    tagKey: t.tagKey,
    slug: t.id,
  };
}

export default function HotTours() {
  const { t } = useLocale();
  const [tours, setTours] = useState<DisplayTour[]>([]);
  const [loading, setLoading] = useState(true);
  const [usingApi, setUsingApi] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);

    fetch("/api/hot-tours")
      .then((r) => r.json())
      .then((data) => {
        if (cancelled) return;
        if (data.configured && Array.isArray(data.tours) && data.tours.length > 0) {
          setTours(data.tours.slice(0, 4).map(toDisplayTour));
          setUsingApi(true);
        } else {
          // fallback to static data
          setTours(
            staticTours.slice(0, 4).map((tour) => ({
              id: tour.id,
              destination: tour.destination,
              countryKey: tour.countryKey,
              nights: tour.nights,
              price: tour.price,
              rating: tour.rating,
              reviews: tour.reviews,
              gradient: tour.gradient,
              emoji: tour.emoji,
              tagKey: tour.tagKey,
              slug: tour.slug,
            }))
          );
          setUsingApi(false);
        }
        setLoading(false);
      })
      .catch(() => {
        if (cancelled) return;
        setTours(
          staticTours.slice(0, 4).map((tour) => ({
            id: tour.id,
            destination: tour.destination,
            countryKey: tour.countryKey,
            nights: tour.nights,
            price: tour.price,
            rating: tour.rating,
            reviews: tour.reviews,
            gradient: tour.gradient,
            emoji: tour.emoji,
            tagKey: tour.tagKey,
            slug: tour.slug,
          }))
        );
        setLoading(false);
      });

    return () => { cancelled = true; };
  }, []);

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-20">
      <div className="flex items-end justify-between mb-8">
        <div>
          <p className="text-xs font-semibold text-blue-500 uppercase tracking-widest mb-1">{t("hot_tours_this_week")}</p>
          <h2 className="text-3xl font-extrabold text-slate-800 tracking-tight">{t("hot_tours_title")}</h2>
          <p className="text-slate-400 mt-1">{t("hot_tours_subtitle")}</p>
        </div>
        <Link
          href="/search"
          className="hidden sm:flex items-center gap-1.5 text-sm font-semibold text-blue-600 hover:text-blue-700 transition-colors"
        >
          {t("hot_tours_show_all")}
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
          </svg>
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {loading
          ? Array.from({ length: 4 }).map((_, i) => <TourCardSkeleton key={i} />)
          : tours.map((tour) => {
              const href = tour.slug ? `/tours/${tour.slug}` : "/search";
              const countryLabel = tour.countryKey ? t(tour.countryKey) : tour.countryName ?? "";
              const priceDisplay = tour.currency && tour.currency !== "UAH" && tour.currency !== "uah"
                ? `${tour.currency} ${tour.price.toLocaleString()}`
                : usingApi
                  ? `${tour.price.toLocaleString()} ₴`
                  : `€${tour.price}`;

              return (
                <Link
                  key={tour.id}
                  href={href}
                  className="group rounded-2xl overflow-hidden shadow-md hover:shadow-2xl hover:-translate-y-1 transition-all duration-300"
                >
                  {/* Card image area */}
                  <div className={`relative bg-gradient-to-br ${tour.gradient} aspect-[4/3] flex items-center justify-center overflow-hidden`}>
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
                    <div className="absolute bottom-0 left-0 w-24 h-24 bg-black/10 rounded-full translate-y-1/2 -translate-x-1/2" />
                    <span className="text-6xl drop-shadow-lg relative z-10 group-hover:scale-110 transition-transform duration-300">
                      {tour.emoji}
                    </span>
                    {/* Rating badge */}
                    {tour.rating > 0 && (
                      <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-sm rounded-full px-3 py-1 flex items-center gap-1.5 shadow-sm">
                        <svg className="w-3.5 h-3.5 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                        <span className="text-xs font-bold text-slate-700">{tour.rating}</span>
                      </div>
                    )}
                    {/* Tag */}
                    <div className="absolute top-3 right-3 bg-white/20 backdrop-blur-sm text-white text-xs font-bold px-2.5 py-1 rounded-full border border-white/30">
                      {t(tour.tagKey)}
                    </div>
                  </div>

                  {/* Card body */}
                  <div className="bg-white p-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-bold text-slate-800 text-[15px]">{tour.destination}</h3>
                        <div className="flex items-center gap-1 mt-0.5">
                          <svg className="w-3.5 h-3.5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          </svg>
                          <span className="text-xs text-slate-400 font-medium">{countryLabel}</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-xs text-slate-400 font-medium">{t("hot_from")}</div>
                        <div className="text-lg font-extrabold text-slate-800">{priceDisplay}</div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between mt-3 pt-3 border-t border-slate-50">
                      <div className="flex items-center gap-1.5 text-xs text-slate-400">
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                        </svg>
                        {tour.nights} {t("hot_nights")}
                      </div>
                      {tour.reviews !== undefined && (
                        <div className="text-xs text-slate-400">{tour.reviews.toLocaleString()} {t("hot_reviews")}</div>
                      )}
                    </div>
                  </div>
                </Link>
              );
            })}
      </div>
    </section>
  );
}
