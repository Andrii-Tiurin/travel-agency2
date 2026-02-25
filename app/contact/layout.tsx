import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Kontakt | Monotours24",
  description:
    "Kontaktieren Sie unser Team – per Formular, Telefon oder E-Mail. Wir antworten innerhalb von 24 Stunden.",
  openGraph: {
    title: "Kontakt – Monotours24",
    description: "Unser Team ist Mo–Fr 9–18 Uhr und per Notfall-Hotline 24/7 für Sie erreichbar.",
    type: "website",
    siteName: "Monotours24",
  },
};

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
