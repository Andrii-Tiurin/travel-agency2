import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Touren suchen & buchen | Monotours24",
  description:
    "Entdecke hunderte von Touren weltweit. Filtere nach Preis, Land und Reisedauer – finde deine Traumreise bei Monotours24.",
  openGraph: {
    title: "Touren suchen | Monotours24",
    description: "Hunderte von Touren weltweit – günstig, garantiert, unvergesslich.",
    type: "website",
    siteName: "Monotours24",
  },
};

export default function SearchLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
