import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/hooks/use-toast";

export interface Review {
  id: string;
  product_id: string;
  user_id: string;
  rating: number;
  title: string | null;
  review_text: string;
  images: string[] | null;
  is_approved: boolean | null;
  show_on_homepage: boolean | null;
  sentiment_tag: "positive" | "negative" | "neutral" | null;
  admin_notes: string | null;
  created_at: string;
  updated_at: string;
  product?: {
    id: string;
    name: string;
    slug: string;
    images: string[] | null;
  };
  profile?: {
    full_name: string | null;
  };
}

export type ReviewInsert = {
  product_id: string;
  rating: number;
  title?: string;
  review_text: string;
  images?: string[];
};

export type ReviewUpdate = Partial<{
  is_approved: boolean;
  show_on_homepage: boolean;
  sentiment_tag: "positive" | "negative" | "neutral" | null;
  admin_notes: string;
}>;

// Get all reviews for admin
export const useAllReviews = () => {
  return useQuery({
    queryKey: ["reviews", "all"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("reviews")
        .select(`
          *,
          product:products(id, name, slug, images),
          profile:profiles(full_name)
        `)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as Review[];
    },
  });
};

// Get approved reviews for product
export const useProductReviews = (productId: string) => {
  return useQuery({
    queryKey: ["reviews", "product", productId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("reviews")
        .select(`
          *,
          profile:profiles(full_name)
        `)
        .eq("product_id", productId)
        .eq("is_approved", true)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as Review[];
    },
    enabled: !!productId,
  });
};

// Get reviews to show on homepage (testimonials)
export const useHomepageReviews = () => {
  return useQuery({
    queryKey: ["reviews", "homepage"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("reviews")
        .select(`
          *,
          profile:profiles(full_name),
          product:products(name)
        `)
        .eq("is_approved", true)
        .eq("show_on_homepage", true)
        .order("created_at", { ascending: false })
        .limit(6);

      if (error) throw error;
      return data as Review[];
    },
  });
};

export const useCreateReview = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (review: ReviewInsert) => {
      if (!user) throw new Error("Please sign in to write a review");

      const { data, error } = await supabase
        .from("reviews")
        .insert({
          ...review,
          user_id: user.id,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reviews"] });
      toast({ title: "Review submitted! It will be visible after approval." });
    },
    onError: (error) => {
      toast({ title: "Failed to submit review", description: error.message, variant: "destructive" });
    },
  });
};

export const useUpdateReview = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...updates }: ReviewUpdate & { id: string }) => {
      const { data, error } = await supabase
        .from("reviews")
        .update(updates)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reviews"] });
      toast({ title: "Review updated successfully" });
    },
    onError: (error) => {
      toast({ title: "Failed to update review", description: error.message, variant: "destructive" });
    },
  });
};

export const useDeleteReview = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("reviews").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reviews"] });
      toast({ title: "Review deleted successfully" });
    },
    onError: (error) => {
      toast({ title: "Failed to delete review", description: error.message, variant: "destructive" });
    },
  });
};

export const uploadReviewImage = async (file: File, userId: string): Promise<string> => {
  const fileExt = file.name.split(".").pop();
  const fileName = `${crypto.randomUUID()}.${fileExt}`;
  const filePath = `${userId}/${fileName}`;

  const { error: uploadError } = await supabase.storage
    .from("review-images")
    .upload(filePath, file);

  if (uploadError) throw uploadError;

  const { data } = supabase.storage.from("review-images").getPublicUrl(filePath);
  return data.publicUrl;
};
