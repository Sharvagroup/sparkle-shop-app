import { useSiteSetting, useUpdateSiteSetting } from "@/hooks/useSiteSettings";
import { useCallback } from "react";

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
  const updateSetting = useUpdateSiteSetting();

  const mergedTitles = { ...defaultTitles, ...titles };

  const updateTitle = useCallback(async (key: string, value: string) => {
    const updatedTitles = { ...mergedTitles, [key]: value };
    await updateSetting.mutateAsync({
      key: "section_titles",
      value: updatedTitles as unknown as Record<string, unknown>,
      category: "homepage",
    });
  }, [mergedTitles, updateSetting]);

  return {
    titles: mergedTitles,
    isLoading,
    updateTitle,
  };
};
