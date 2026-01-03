import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

export interface ProductAddon {
  id: string;
  product_id: string;
  addon_product_id: string;
  addon_type: "addon" | "suggestion" | "bundle";
  price_override: number | null;
  display_order: number;
  is_active: boolean;
  created_at: string;
  // Joined addon product details
  addon_product?: {
    id: string;
    name: string;
    price: number;
    images: string[] | null;
    slug: string;
  };
}

export interface ProductAddonInput {
  product_id: string;
  addon_product_id: string;
  addon_type?: "addon" | "suggestion" | "bundle";
  price_override?: number | null;
  display_order?: number;
  is_active?: boolean;
}

// Fetch addons for a specific product
export const useProductAddons = (productId: string) => {
  return useQuery({
    queryKey: ["product-addons", productId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("product_addons")
        .select(`
          *,
          addon_product:products!product_addons_addon_product_id_fkey(id, name, price, images, slug)
        `)
        .eq("product_id", productId)
        .eq("is_active", true)
        .order("display_order", { ascending: true });

      if (error) throw error;
      return data as ProductAddon[];
    },
    enabled: !!productId,
  });
};

// Fetch all addons for a product (admin - including inactive)
export const useAdminProductAddons = (productId: string) => {
  return useQuery({
    queryKey: ["admin-product-addons", productId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("product_addons")
        .select(`
          *,
          addon_product:products!product_addons_addon_product_id_fkey(id, name, price, images, slug)
        `)
        .eq("product_id", productId)
        .order("display_order", { ascending: true });

      if (error) throw error;
      return data as ProductAddon[];
    },
    enabled: !!productId,
  });
};

// Add addon to product
export const useAddProductAddon = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (addon: ProductAddonInput) => {
      const { data, error } = await supabase
        .from("product_addons")
        .insert(addon)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["product-addons", variables.product_id] });
      queryClient.invalidateQueries({ queryKey: ["admin-product-addons", variables.product_id] });
      toast({ title: "Add-on added" });
    },
    onError: (error) => {
      toast({ title: "Failed to add add-on", description: error.message, variant: "destructive" });
    },
  });
};

// Update product addon
export const useUpdateProductAddon = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, product_id, ...addon }: Partial<ProductAddonInput> & { id: string; product_id: string }) => {
      const { data, error } = await supabase
        .from("product_addons")
        .update(addon)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return { data, product_id };
    },
    onSuccess: (result) => {
      queryClient.invalidateQueries({ queryKey: ["product-addons", result.product_id] });
      queryClient.invalidateQueries({ queryKey: ["admin-product-addons", result.product_id] });
      toast({ title: "Add-on updated" });
    },
    onError: (error) => {
      toast({ title: "Failed to update add-on", description: error.message, variant: "destructive" });
    },
  });
};

// Remove addon from product
export const useRemoveProductAddon = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, product_id }: { id: string; product_id: string }) => {
      const { error } = await supabase.from("product_addons").delete().eq("id", id);
      if (error) throw error;
      return { product_id };
    },
    onSuccess: (result) => {
      queryClient.invalidateQueries({ queryKey: ["product-addons", result.product_id] });
      queryClient.invalidateQueries({ queryKey: ["admin-product-addons", result.product_id] });
      toast({ title: "Add-on removed" });
    },
    onError: (error) => {
      toast({ title: "Failed to remove add-on", description: error.message, variant: "destructive" });
    },
  });
};
