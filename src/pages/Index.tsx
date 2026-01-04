import { useMemo } from "react";
import PromoBanner from "@/components/layout/PromoBanner";
import Header from "@/components/layout/Header";
import Hero from "@/components/sections/Hero";
import OffersBanner from "@/components/sections/OffersBanner";
import Categories from "@/components/sections/Categories";
import NewArrivals from "@/components/sections/NewArrivals";
import BestSellers from "@/components/sections/BestSellers";
import CelebritySpecials from "@/components/sections/CelebritySpecials";
import Offers from "@/components/sections/Offers";
import Testimonials from "@/components/sections/Testimonials";
import Footer from "@/components/layout/Footer";
import WhatsAppButton from "@/components/ui/WhatsAppButton";
import { useSiteSetting } from "@/hooks/useSiteSettings";
import SEO from "@/components/SEO";

interface HomepageSettings {
  sections: string[];
  hidden?: string[];
}

const sectionComponents: Record<string, React.ComponentType> = {
  hero: Hero,
  offers_banner: OffersBanner,
  sale_banner: OffersBanner, // Alias for backward compatibility
  categories: Categories,
  offers: Offers,
  new_arrivals: NewArrivals,
  best_sellers: BestSellers,
  celebrity_specials: CelebritySpecials,
  testimonials: Testimonials,
};

const defaultSections = [
  "hero",
  "offers_banner",
  "categories",
  "offers",
  "new_arrivals",
  "best_sellers",
  "celebrity_specials",
  "testimonials",
];

const Index = () => {
  const { data: homepageSettings } = useSiteSetting<HomepageSettings>("homepage");

  const sectionsToRender = useMemo(() => {
    const sections = homepageSettings?.sections || defaultSections;
    const hiddenSet = new Set(homepageSettings?.hidden || []);
    
    return sections
      .filter((key) => !hiddenSet.has(key))
      .map((key) => ({ key, Component: sectionComponents[key] }))
      .filter((item) => item.Component);
  }, [homepageSettings]);

  return (
    <div className="min-h-screen bg-background">
      <SEO />
      <PromoBanner />
      <Header />
      <main>
        {sectionsToRender.map(({ key, Component }) => (
          <Component key={key} />
        ))}
      </main>
      <Footer />
      <WhatsAppButton />
    </div>
  );
};

export default Index;
