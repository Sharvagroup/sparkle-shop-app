import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export interface DiscountCodeUsage {
  id: string;
  discount_code_id: string;
  user_id: string;
  order_id: string | null;
  used_at: string;
}

// Check if current user has already used a specific discount code
export const useHasUsedDiscountCode = (discountCodeId: string | null) => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["discount-code-usage", discountCodeId, user?.id],
    queryFn: async () => {
      if (!user || !discountCodeId) return false;

      const { data, error } = await supabase
        .from("discount_code_usages")
        .select("id")
        .eq("discount_code_id", discountCodeId)
        .eq("user_id", user.id)
        .maybeSingle();

      if (error) throw error;
      return !!data;
    },
    enabled: !!user && !!discountCodeId,
  });
};

// Record discount code usage after successful order
export const useRecordDiscountUsage = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async ({ discountCodeId, orderId }: { discountCodeId: string; orderId: string }) => {
      if (!user) throw new Error("Not authenticated");

      const { data, error } = await supabase
        .from("discount_code_usages")
        .insert({
          discount_code_id: discountCodeId,
          user_id: user.id,
          order_id: orderId,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["discount-code-usage"] });
    },
  });
};

// Get user's discount code usage history
export const useMyDiscountUsages = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["discount-code-usages", user?.id],
    queryFn: async () => {
      if (!user) return [];

      const { data, error } = await supabase
        .from("discount_code_usages")
        .select("*")
        .eq("user_id", user.id)
        .order("used_at", { ascending: false });

      if (error) throw error;
      return data as DiscountCodeUsage[];
    },
    enabled: !!user,
  });
};
