import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

export interface ProductOption {
  id: string;
  name: string;
  type: "number" | "select" | "text" | "boolean";
  unit: string | null;
  is_mandatory: boolean;
  is_enabled: boolean;
  min_value: number | null;
  max_value: number | null;
  step_value: number | null;
  select_options: string[];
  display_order: number;
  created_at: string;
  updated_at: string;
}

export interface ProductOptionInput {
  name: string;
  type: "number" | "select" | "text" | "boolean";
  unit?: string | null;
  is_mandatory?: boolean;
  is_enabled?: boolean;
  min_value?: number | null;
  max_value?: number | null;
  step_value?: number | null;
  select_options?: string[];
  display_order?: number;
}

// Fetch all product options (for frontend - only enabled)
export const useProductOptions = () => {
  return useQuery({
    queryKey: ["product-options"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("product_options")
        .select("*")
        .eq("is_enabled", true)
        .order("display_order", { ascending: true });

      if (error) throw error;
      return data as ProductOption[];
    },
  });
};

// Fetch all product options (for admin - including disabled)
export const useAdminProductOptions = () => {
  return useQuery({
    queryKey: ["admin-product-options"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("product_options")
        .select("*")
        .order("display_order", { ascending: true });

      if (error) throw error;
      return data as ProductOption[];
    },
  });
};

// Create product option
export const useCreateProductOption = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (option: ProductOptionInput) => {
      const { data, error } = await supabase
        .from("product_options")
        .insert({
          ...option,
          select_options: option.select_options || [],
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["product-options"] });
      queryClient.invalidateQueries({ queryKey: ["admin-product-options"] });
      toast({ title: "Product option created" });
    },
    onError: (error) => {
      toast({ title: "Failed to create option", description: error.message, variant: "destructive" });
    },
  });
};

// Update product option
export const useUpdateProductOption = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...option }: ProductOptionInput & { id: string }) => {
      const { data, error } = await supabase
        .from("product_options")
        .update({
          ...option,
          select_options: option.select_options || [],
        })
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["product-options"] });
      queryClient.invalidateQueries({ queryKey: ["admin-product-options"] });
      toast({ title: "Product option updated" });
    },
    onError: (error) => {
      toast({ title: "Failed to update option", description: error.message, variant: "destructive" });
    },
  });
};

// Delete product option
export const useDeleteProductOption = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("product_options").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["product-options"] });
      queryClient.invalidateQueries({ queryKey: ["admin-product-options"] });
      toast({ title: "Product option deleted" });
    },
    onError: (error) => {
      toast({ title: "Failed to delete option", description: error.message, variant: "destructive" });
    },
  });
};
