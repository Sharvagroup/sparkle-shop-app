import { useSiteSetting } from "@/hooks/useSiteSettings";

export interface SectionTitles {
  categories: string;
  offers: string;
  offersBanner: string;
  newArrivals: string;
  bestSellers: string;
  celebritySpecials: string;
  testimonials: string;
}

const defaultTitles: SectionTitles = {
  categories: "Shop By Category",
  offers: "Special Offers",
  offersBanner: "Featured Offer",
  newArrivals: "New Arrivals",
  bestSellers: "Best Sellers",
  celebritySpecials: "Celebrity Specials",
  testimonials: "Our Happy Customers",
};

export const useSectionTitles = () => {
  const { data: titles, isLoading } = useSiteSetting<SectionTitles>("section_titles");

  return {
    titles: { ...defaultTitles, ...titles },
    isLoading,
  };
};
