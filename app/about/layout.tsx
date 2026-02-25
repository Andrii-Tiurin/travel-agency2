import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Über uns | Monotours24",
  description:
    "Seit 2010 begeistert Monotours24 über 500.000 Reisende weltweit. Erfahren Sie mehr über unser Team, unsere Werte und unsere Mission.",
  openGraph: {
    title: "Über uns – Monotours24",
    description: "Ihr persönlicher Reisepartner seit 2010. Vertrauen, Qualität und Leidenschaft.",
    type: "website",
    siteName: "Monotours24",
  },
};

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
