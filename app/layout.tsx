import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { LocaleProvider } from "@/context/LocaleContext";

const inter = Inter({
  subsets: ["latin", "cyrillic"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Monotours24 – Alle Reisen an einem Ort",
  description:
    "Entdecke unvergessliche Reiseziele weltweit – günstige Preise, garantierte Touren, persönlicher Service. Monotours24 – dein Reisepartner.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="de">
      <body className={`${inter.variable} font-sans antialiased bg-white`}>
        <LocaleProvider>{children}</LocaleProvider>
      </body>
    </html>
  );
}
