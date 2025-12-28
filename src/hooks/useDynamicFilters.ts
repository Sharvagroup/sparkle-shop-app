import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

// Fetch distinct materials from products table
export const useMaterials = () => {
  return useQuery({
    queryKey: ["product-materials"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("products")
        .select("material")
        .eq("is_active", true)
        .not("material", "is", null);

      if (error) throw error;

      // Extract unique materials
      const uniqueMaterials = [...new Set(data.map((p) => p.material).filter(Boolean))] as string[];
      return uniqueMaterials.sort();
    },
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
  });
};
