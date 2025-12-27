import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/hooks/use-toast";

export interface CartItem {
  id: string;
  user_id: string;
  product_id: string;
  quantity: number;
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
          product:products(id, name, price, original_price, images, slug, stock_quantity)
        `)
        .eq("user_id", user.id);

      if (error) throw error;
      return data as CartItem[];
    },
    enabled: !!user,
  });
};

export const useAddToCart = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async ({ productId, quantity = 1 }: { productId: string; quantity?: number }) => {
      if (!user) throw new Error("Please sign in to add items to cart");

      // Check if item already exists in cart
      const { data: existingItem } = await supabase
        .from("cart")
        .select("id, quantity")
        .eq("user_id", user.id)
        .eq("product_id", productId)
        .maybeSingle();

      if (existingItem) {
        // Update quantity
        const { data, error } = await supabase
          .from("cart")
          .update({ quantity: existingItem.quantity + quantity })
          .eq("id", existingItem.id)
          .select()
          .single();

        if (error) throw error;
        return data;
      } else {
        // Insert new item
        const { data, error } = await supabase
          .from("cart")
          .insert({ user_id: user.id, product_id: productId, quantity })
          .select()
          .single();

        if (error) throw error;
        return data;
      }
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
