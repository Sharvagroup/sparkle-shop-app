import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/hooks/use-toast";

export interface CartItem {
  id: string;
  user_id: string;
  product_id: string;
  quantity: number;
  selected_options: Record<string, any>;
  created_at: string;
  updated_at: string;
  product?: {
    id: string;
    name: string;
    price: number;
    original_price: number | null;
    images: string[] | null;
    slug: string;
    stock_quantity: number | null;
    enabled_options: string[] | null;
    has_addons: boolean | null;
    pricing_by_option_id: string | null;
    base_unit_value: number | null;
  };
}

export const useCart = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["cart", user?.id],
    queryFn: async () => {
      if (!user) return [];

      const { data, error } = await supabase
        .from("cart")
        .select(`
          *,
          product:products(id, name, price, original_price, images, slug, stock_quantity, enabled_options, has_addons, pricing_by_option_id, base_unit_value)
        `)
        .eq("user_id", user.id);

      if (error) throw error;
      return data as CartItem[];
    },
    enabled: !!user,
  });
};

// Check if a product already exists in cart
export const useCheckCartCollision = () => {
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (productId: string) => {
      if (!user) return [];

      const { data, error } = await supabase
        .from("cart")
        .select("id, quantity, selected_options")
        .eq("user_id", user.id)
        .eq("product_id", productId);

      if (error) throw error;
      return data || [];
    },
  });
};

export const useAddToCart = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async ({ 
      productId, 
      quantity = 1, 
      selectedOptions = {},
      mode = 'add',
      existingItemId
    }: { 
      productId: string; 
      quantity?: number;
      selectedOptions?: Record<string, any>;
      mode?: 'add' | 'replace' | 'separate';
      existingItemId?: string;
    }) => {
      if (!user) throw new Error("Please sign in to add items to cart");

      // Mode: replace - update existing cart item
      if (mode === 'replace' && existingItemId) {
        const { data, error } = await supabase
          .from("cart")
          .update({ 
            quantity,
            selected_options: selectedOptions
          })
          .eq("id", existingItemId)
          .select()
          .single();

        if (error) throw error;
        return data;
      }

      // Mode: separate - always insert new
      if (mode === 'separate') {
        const { data, error } = await supabase
          .from("cart")
          .insert({ 
            user_id: user.id, 
            product_id: productId, 
            quantity,
            selected_options: selectedOptions
          })
          .select()
          .single();

        if (error) throw error;
        return data;
      }

      // Mode: add (default) - check for existing with same options
      const { data: existingItems } = await supabase
        .from("cart")
        .select("id, quantity, selected_options")
        .eq("user_id", user.id)
        .eq("product_id", productId);

      // Find item with matching options
      const matchingItem = existingItems?.find(
        item => JSON.stringify(item.selected_options || {}) === JSON.stringify(selectedOptions)
      );

      if (matchingItem) {
        // Update quantity for matching item
        const { data, error } = await supabase
          .from("cart")
          .update({ quantity: matchingItem.quantity + quantity })
          .eq("id", matchingItem.id)
          .select()
          .single();

        if (error) throw error;
        return data;
      }

      // No matching item, insert new
      const { data, error } = await supabase
        .from("cart")
        .insert({ 
          user_id: user.id, 
          product_id: productId, 
          quantity,
          selected_options: selectedOptions
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
      toast({ title: "Added to cart" });
    },
    onError: (error) => {
      toast({ title: "Failed to add to cart", description: error.message, variant: "destructive" });
    },
  });
};

export const useUpdateCartItem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, quantity }: { id: string; quantity: number }) => {
      if (quantity < 1) {
        const { error } = await supabase.from("cart").delete().eq("id", id);
        if (error) throw error;
        return null;
      }

      const { data, error } = await supabase
        .from("cart")
        .update({ quantity })
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
    onError: (error) => {
      toast({ title: "Failed to update cart", description: error.message, variant: "destructive" });
    },
  });
};

export const useRemoveFromCart = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("cart").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
      toast({ title: "Item removed from cart" });
    },
    onError: (error) => {
      toast({ title: "Failed to remove item", description: error.message, variant: "destructive" });
    },
  });
};

export const useClearCart = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async () => {
      if (!user) throw new Error("Not authenticated");

      const { error } = await supabase.from("cart").delete().eq("user_id", user.id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
  });
};
