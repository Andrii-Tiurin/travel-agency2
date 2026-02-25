import Header from "@/components/Header";
import Hero from "@/components/Hero";
import SearchWidget from "@/components/SearchWidget";
import InfoCards from "@/components/InfoCards";
import HotTours from "@/components/HotTours";
import Newsletter from "@/components/Newsletter";
import PopularCountries from "@/components/PopularCountries";
import Footer from "@/components/Footer";
import RevealSection from "@/components/RevealSection";

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-50">
      <Header />
      <Hero />
      <SearchWidget />
      <div className="mt-16">
        <RevealSection variant="stagger">
          <InfoCards />
        </RevealSection>
        <RevealSection>
          <HotTours />
        </RevealSection>
        <RevealSection>
          <Newsletter />
        </RevealSection>
        <RevealSection>
          <PopularCountries />
        </RevealSection>
      </div>
      <Footer />
    </main>
  );
}
