import type { Metadata } from "next";
import { tours } from "@/lib/tours-data";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const tour = tours.find((t) => t.slug === slug);

  if (!tour) {
    return {
      title: "Tour nicht gefunden – Monotours24",
    };
  }

  const description = `${tour.destination}: ${tour.nights} Nächte ab €${tour.price} pro Person. ${tour.description.slice(0, 120)}…`;

  return {
    title: `${tour.destination} – ${tour.nights} Nächte ab €${tour.price} | Monotours24`,
    description,
    openGraph: {
      title: `${tour.destination} bei Monotours24`,
      description,
      type: "website",
      siteName: "Monotours24",
    },
    twitter: {
      card: "summary_large_image",
      title: `${tour.destination} – ab €${tour.price}`,
      description,
    },
  };
}

export default function TourLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
