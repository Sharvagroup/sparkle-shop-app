import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/hooks/use-toast";
import type { Json } from "@/integrations/supabase/types";

export interface ShippingAddress {
  firstName: string;
  lastName: string;
  address: string;
  apartment?: string;
  city: string;
  state: string;
  pinCode: string;
  country: string;
  phone: string;
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string;
  quantity: number;
  price: number;
  total: number;
  product_snapshot: {
    name: string;
    image: string;
    slug: string;
  } | null;
  created_at: string;
}

export interface Order {
  id: string;
  order_number: string;
  user_id: string;
  status: "pending" | "confirmed" | "processing" | "shipped" | "delivered" | "cancelled" | "refunded";
  payment_status: "pending" | "paid" | "failed" | "refunded";
  payment_method: string | null;
  subtotal: number;
  discount_amount: number | null;
  shipping_amount: number | null;
  tax_amount: number | null;
  total_amount: number;
  shipping_address: Json | null;
  billing_address: Json | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
  items?: OrderItem[];
  profile?: {
    full_name: string | null;
    phone: string | null;
  };
}

export type OrderInsert = {
  payment_method: string;
  subtotal: number;
  discount_amount?: number;
  shipping_amount?: number;
  tax_amount?: number;
  total_amount: number;
  shipping_address: ShippingAddress;
  billing_address?: ShippingAddress;
  notes?: string;
  items: {
    product_id: string;
    quantity: number;
    price: number;
    total: number;
    product_snapshot: {
      name: string;
      image: string;
      slug: string;
    };
  }[];
};

// For customers - get their orders
export const useMyOrders = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["orders", "my", user?.id],
    queryFn: async () => {
      if (!user) return [];

      const { data, error } = await supabase
        .from("orders")
        .select(`
          *,
          items:order_items(*)
        `)
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as unknown as Order[];
    },
    enabled: !!user,
  });
};

// For admin - get all orders
export const useAllOrders = () => {
  return useQuery({
    queryKey: ["orders", "all"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("orders")
        .select(`
          *,
          items:order_items(*),
          profile:profiles(full_name, phone)
        `)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as unknown as Order[];
    },
  });
};

export const useCreateOrder = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (orderData: OrderInsert) => {
      if (!user) throw new Error("Please sign in to place an order");

      // Create order
      const { data: order, error: orderError } = await supabase
        .from("orders")
        .insert([{
          user_id: user.id,
          order_number: `ORD-${Date.now()}`, // Temporary, will be overwritten by trigger
          payment_method: orderData.payment_method,
          subtotal: orderData.subtotal,
          discount_amount: orderData.discount_amount || 0,
          shipping_amount: orderData.shipping_amount || 0,
          tax_amount: orderData.tax_amount || 0,
          total_amount: orderData.total_amount,
          shipping_address: orderData.shipping_address as unknown as Json,
          billing_address: (orderData.billing_address || orderData.shipping_address) as unknown as Json,
          notes: orderData.notes,
          payment_status: "paid" as const,
          status: "confirmed" as const,
        }])
        .select()
        .single();

      if (orderError) throw orderError;

      // Create order items
      const orderItems = orderData.items.map((item) => ({
        order_id: order.id,
        product_id: item.product_id,
        quantity: item.quantity,
        price: item.price,
        total: item.total,
        product_snapshot: item.product_snapshot as unknown as Json,
      }));

      const { error: itemsError } = await supabase
        .from("order_items")
        .insert(orderItems);

      if (itemsError) throw itemsError;

      return order;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      queryClient.invalidateQueries({ queryKey: ["cart"] });
      toast({ title: "Order placed successfully!" });
    },
    onError: (error) => {
      toast({ title: "Failed to place order", description: error.message, variant: "destructive" });
    },
  });
};

export const useUpdateOrderStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, status, payment_status }: { id: string; status?: Order["status"]; payment_status?: Order["payment_status"] }) => {
      const updates: Record<string, string> = {};
      if (status) updates.status = status;
      if (payment_status) updates.payment_status = payment_status;

      const { data, error } = await supabase
        .from("orders")
        .update(updates)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      toast({ title: "Order updated successfully" });
    },
    onError: (error) => {
      toast({ title: "Failed to update order", description: error.message, variant: "destructive" });
    },
  });
};
