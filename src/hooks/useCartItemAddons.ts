import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/hooks/use-toast";

export interface CartItemAddon {
  id: string;
  cart_item_id: string;
  addon_product_id: string;
  quantity: number;
  selected_options: Record<string, any>;
  created_at: string;
  // Joined addon product
  addon_product?: {
    id: string;
    name: string;
    price: number;
    images: string[] | null;
  };
}

export interface CartItemAddonInput {
  cart_item_id: string;
  addon_product_id: string;
  quantity?: number;
  selected_options?: Record<string, any>;
}

// Fetch addons for a specific cart item
export const useCartItemAddons = (cartItemId: string) => {
  return useQuery({
    queryKey: ["cart-item-addons", cartItemId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("cart_item_addons")
        .select(`
          *,
          addon_product:products(id, name, price, images)
        `)
        .eq("cart_item_id", cartItemId);

      if (error) throw error;
      return data as CartItemAddon[];
    },
    enabled: !!cartItemId,
  });
};

// Fetch all cart item addons for a user
export const useAllCartAddons = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["all-cart-addons", user?.id],
    queryFn: async () => {
      if (!user) return [];

      // First get all cart items for the user
      const { data: cartItems, error: cartError } = await supabase
        .from("cart")
        .select("id")
        .eq("user_id", user.id);

      if (cartError) throw cartError;
      if (!cartItems?.length) return [];

      const cartItemIds = cartItems.map((item) => item.id);

      // Then get all addons for those cart items
      const { data, error } = await supabase
        .from("cart_item_addons")
        .select(`
          *,
          addon_product:products(id, name, price, images)
        `)
        .in("cart_item_id", cartItemIds);

      if (error) throw error;
      return data as CartItemAddon[];
    },
    enabled: !!user,
  });
};

// Add addon to cart item
export const useAddCartItemAddon = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (addon: CartItemAddonInput) => {
      const { data, error } = await supabase
        .from("cart_item_addons")
        .insert({
          ...addon,
          selected_options: addon.selected_options || {},
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["cart-item-addons", variables.cart_item_id] });
      queryClient.invalidateQueries({ queryKey: ["all-cart-addons"] });
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
    onError: (error) => {
      toast({ title: "Failed to add add-on", description: error.message, variant: "destructive" });
    },
  });
};

// Update cart item addon
export const useUpdateCartItemAddon = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, cart_item_id, ...addon }: Partial<CartItemAddonInput> & { id: string; cart_item_id: string }) => {
      const { data, error } = await supabase
        .from("cart_item_addons")
        .update(addon)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return { data, cart_item_id };
    },
    onSuccess: (result) => {
      queryClient.invalidateQueries({ queryKey: ["cart-item-addons", result.cart_item_id] });
      queryClient.invalidateQueries({ queryKey: ["all-cart-addons"] });
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
    onError: (error) => {
      toast({ title: "Failed to update add-on", description: error.message, variant: "destructive" });
    },
  });
};

// Remove addon from cart item
export const useRemoveCartItemAddon = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, cart_item_id }: { id: string; cart_item_id: string }) => {
      const { error } = await supabase.from("cart_item_addons").delete().eq("id", id);
      if (error) throw error;
      return { cart_item_id };
    },
    onSuccess: (result) => {
      queryClient.invalidateQueries({ queryKey: ["cart-item-addons", result.cart_item_id] });
      queryClient.invalidateQueries({ queryKey: ["all-cart-addons"] });
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
    onError: (error) => {
      toast({ title: "Failed to remove add-on", description: error.message, variant: "destructive" });
    },
  });
};

// Clear all addons for a cart item
export const useClearCartItemAddons = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (cartItemId: string) => {
      const { error } = await supabase.from("cart_item_addons").delete().eq("cart_item_id", cartItemId);
      if (error) throw error;
      return { cartItemId };
    },
    onSuccess: (result) => {
      queryClient.invalidateQueries({ queryKey: ["cart-item-addons", result.cartItemId] });
      queryClient.invalidateQueries({ queryKey: ["all-cart-addons"] });
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
  });
};
