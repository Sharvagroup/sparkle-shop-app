import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

export interface DiscountCode {
  id: string;
  code: string;
  discount_type: "percentage" | "fixed";
  discount_value: number;
  min_order_amount: number | null;
  max_uses: number | null;
  use_count: number;
  is_active: boolean;
  starts_at: string | null;
  expires_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface DiscountCodeInput {
  code: string;
  discount_type: "percentage" | "fixed";
  discount_value: number;
  min_order_amount?: number | null;
  max_uses?: number | null;
  is_active?: boolean;
  starts_at?: string | null;
  expires_at?: string | null;
}

export interface AppliedDiscount {
  code: string;
  type: "percentage" | "fixed";
  value: number;
  discountAmount: number;
}

// Fetch all discount codes (admin)
export const useDiscountCodes = () => {
  return useQuery({
    queryKey: ["discount-codes"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("discount_codes")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as DiscountCode[];
    },
  });
};

// Validate a discount code for a given cart total
export const useValidateDiscountCode = () => {
  return useMutation({
    mutationFn: async ({ code, cartTotal }: { code: string; cartTotal: number }) => {
      const { data, error } = await supabase
        .from("discount_codes")
        .select("*")
        .eq("code", code.toUpperCase().trim())
        .eq("is_active", true)
        .maybeSingle();

      if (error) throw error;
      if (!data) throw new Error("Invalid discount code");

      const discountCode = data as DiscountCode;

      // Check if code has expired
      if (discountCode.expires_at && new Date(discountCode.expires_at) < new Date()) {
        throw new Error("This discount code has expired");
      }

      // Check if code has started
      if (discountCode.starts_at && new Date(discountCode.starts_at) > new Date()) {
        throw new Error("This discount code is not yet active");
      }

      // Check usage limit
      if (discountCode.max_uses && discountCode.use_count >= discountCode.max_uses) {
        throw new Error("This discount code has reached its usage limit");
      }

      // Check minimum order amount
      if (discountCode.min_order_amount && cartTotal < discountCode.min_order_amount) {
        throw new Error(`Minimum order amount of ₹${discountCode.min_order_amount} required`);
      }

      // Calculate discount amount
      let discountAmount = 0;
      if (discountCode.discount_type === "percentage") {
        discountAmount = (cartTotal * discountCode.discount_value) / 100;
      } else {
        discountAmount = Math.min(discountCode.discount_value, cartTotal);
      }

      return {
        code: discountCode.code,
        type: discountCode.discount_type,
        value: discountCode.discount_value,
        discountAmount,
      } as AppliedDiscount;
    },
  });
};

// Increment usage count after successful order
export const useIncrementDiscountUsage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (code: string) => {
      const { data: current, error: fetchError } = await supabase
        .from("discount_codes")
        .select("use_count")
        .eq("code", code)
        .maybeSingle();

      if (fetchError) throw fetchError;
      if (!current) return;

      const { error } = await supabase
        .from("discount_codes")
        .update({ use_count: (current.use_count || 0) + 1 })
        .eq("code", code);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["discount-codes"] });
    },
  });
};

// Create discount code
export const useCreateDiscountCode = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: DiscountCodeInput) => {
      const { data, error } = await supabase
        .from("discount_codes")
        .insert({ ...input, code: input.code.toUpperCase().trim() })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["discount-codes"] });
      toast({ title: "Discount code created" });
    },
    onError: (error: Error) => {
      toast({ title: "Failed to create discount code", description: error.message, variant: "destructive" });
    },
  });
};

// Update discount code
export const useUpdateDiscountCode = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...input }: Partial<DiscountCodeInput> & { id: string }) => {
      const updateData = input.code ? { ...input, code: input.code.toUpperCase().trim() } : input;
      const { data, error } = await supabase
        .from("discount_codes")
        .update(updateData)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["discount-codes"] });
      toast({ title: "Discount code updated" });
    },
    onError: (error: Error) => {
      toast({ title: "Failed to update discount code", description: error.message, variant: "destructive" });
    },
  });
};

// Delete discount code
export const useDeleteDiscountCode = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("discount_codes").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["discount-codes"] });
      toast({ title: "Discount code deleted" });
    },
    onError: (error: Error) => {
      toast({ title: "Failed to delete discount code", description: error.message, variant: "destructive" });
    },
  });
};
