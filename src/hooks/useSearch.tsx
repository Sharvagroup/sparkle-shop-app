import React, { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useSiteSetting } from "@/hooks/useSiteSettings";

export interface SearchSettings {
  enabled: boolean;
  placeholder: string;
  showRecentSearches: boolean;
  recentSearchLimit: number;
  showProductSuggestions: boolean;
  suggestionLimit: number;
  showCategorySuggestions: boolean;
  showCollectionSuggestions: boolean;
  minSearchLength: number;
  highlightMatches: boolean;
  searchInDescription: boolean;
  searchInMaterial: boolean;
}

export const defaultSearchSettings: SearchSettings = {
  enabled: true,
  placeholder: "Search for jewellery...",
  showRecentSearches: true,
  recentSearchLimit: 5,
  showProductSuggestions: true,
  suggestionLimit: 6,
  showCategorySuggestions: true,
  showCollectionSuggestions: true,
  minSearchLength: 2,
  highlightMatches: true,
  searchInDescription: true,
  searchInMaterial: true,
};

export const useSearchSettings = () => {
  return useSiteSetting<SearchSettings>("search");
};

// Hook to manage recent searches (localStorage)
const RECENT_SEARCHES_KEY = "recent_searches";

export const useRecentSearches = (limit: number = 5) => {
  const [recentSearches, setRecentSearches] = useState<string[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem(RECENT_SEARCHES_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setRecentSearches(Array.isArray(parsed) ? parsed.slice(0, limit) : []);
      } catch {
        setRecentSearches([]);
      }
    }
  }, [limit]);

  const addSearch = (query: string) => {
    const trimmed = query.trim();
    if (!trimmed) return;

    setRecentSearches((prev) => {
      const filtered = prev.filter((s) => s.toLowerCase() !== trimmed.toLowerCase());
      const updated = [trimmed, ...filtered].slice(0, limit);
      localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(updated));
      return updated;
    });
  };

  const removeSearch = (query: string) => {
    setRecentSearches((prev) => {
      const updated = prev.filter((s) => s !== query);
      localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(updated));
      return updated;
    });
  };

  const clearSearches = () => {
    setRecentSearches([]);
    localStorage.removeItem(RECENT_SEARCHES_KEY);
  };

  return { recentSearches, addSearch, removeSearch, clearSearches };
};

export interface SearchSuggestion {
  type: "product" | "category" | "collection";
  id: string;
  name: string;
  slug: string;
  image?: string;
  price?: number;
}

// Hook to get search suggestions
export const useSearchSuggestions = (query: string, settings: SearchSettings | null) => {
  const effectiveSettings = settings || defaultSearchSettings;
  const trimmedQuery = query.trim().toLowerCase();
  const shouldSearch = trimmedQuery.length >= effectiveSettings.minSearchLength;

  return useQuery({
    queryKey: ["search-suggestions", trimmedQuery, effectiveSettings],
    queryFn: async (): Promise<SearchSuggestion[]> => {
      if (!shouldSearch) return [];

      const suggestions: SearchSuggestion[] = [];

      // Fetch products
      if (effectiveSettings.showProductSuggestions) {
        let productQuery = supabase
          .from("products")
          .select("id, name, slug, images, price")
          .eq("is_active", true)
          .limit(effectiveSettings.suggestionLimit);

        // Build OR filter for product search
        const filters: string[] = [`name.ilike.%${trimmedQuery}%`];
        if (effectiveSettings.searchInDescription) {
          filters.push(`description.ilike.%${trimmedQuery}%`);
        }
        if (effectiveSettings.searchInMaterial) {
          filters.push(`material.ilike.%${trimmedQuery}%`);
        }

        productQuery = productQuery.or(filters.join(","));

        const { data: products } = await productQuery;

        if (products) {
          products.forEach((p) => {
            suggestions.push({
              type: "product",
              id: p.id,
              name: p.name,
              slug: p.slug,
              image: p.images?.[0],
              price: p.price,
            });
          });
        }
      }

      // Fetch categories
      if (effectiveSettings.showCategorySuggestions) {
        const { data: categories } = await supabase
          .from("categories")
          .select("id, name, slug, image_url")
          .eq("is_active", true)
          .ilike("name", `%${trimmedQuery}%`)
          .limit(4);

        if (categories) {
          categories.forEach((c) => {
            suggestions.push({
              type: "category",
              id: c.id,
              name: c.name,
              slug: c.slug,
              image: c.image_url || undefined,
            });
          });
        }
      }

      // Fetch collections
      if (effectiveSettings.showCollectionSuggestions) {
        const { data: collections } = await supabase
          .from("collections")
          .select("id, name, slug, image_url")
          .eq("is_active", true)
          .ilike("name", `%${trimmedQuery}%`)
          .limit(4);

        if (collections) {
          collections.forEach((c) => {
            suggestions.push({
              type: "collection",
              id: c.id,
              name: c.name,
              slug: c.slug,
              image: c.image_url || undefined,
            });
          });
        }
      }

      return suggestions;
    },
    enabled: shouldSearch,
    staleTime: 30000, // 30 seconds
  });
};

// Utility function to highlight matching text
export const highlightMatch = (text: string, query: string): React.ReactNode => {
  if (!query.trim()) return text;

  const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`, "gi");
  const parts = text.split(regex);

  return parts.map((part, i) =>
    regex.test(part) ? (
      <mark key={i} className="bg-primary/20 text-primary font-medium rounded-sm px-0.5">
        {part}
      </mark>
    ) : (
      part
    )
  );
};
