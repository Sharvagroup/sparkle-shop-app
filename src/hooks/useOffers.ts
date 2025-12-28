import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

export type OfferType = "offer_banner" | "special_offer";

export interface OfferTheme {
  content_position?: 'left' | 'center' | 'right';
  overlay_opacity?: number;
  overlay_color?: string;
  edge_fade?: boolean;
  button_shape?: 'rounded' | 'box';
  image_fit?: 'cover' | 'contain' | 'fill';
  image_zoom?: number;
  text_color?: string;
  card_style?: 'minimal' | 'bordered' | 'shadow';
}

export interface Offer {
  id: string;
  title: string;
  subtitle: string | null;
  description: string | null;
  image_url: string;
  link_url: string | null;
  button_text: string | null;
  discount_code: string | null;
  discount_type: string | null;
  discount_value: number | null;
  min_cart_value: number | null;
  terms_conditions: string | null;
  start_date: string | null;
  end_date: string | null;
  display_order: number | null;
  is_active: boolean | null;
  offer_type: OfferType | null;
  theme: OfferTheme | null;
  created_at: string;
  updated_at: string;
}

export type OfferInsert = Omit<Offer, "id" | "created_at" | "updated_at" | "theme"> & { theme?: OfferTheme | null };
export type OfferUpdate = Partial<OfferInsert>;

export const useOffers = () => {
  return useQuery({
    queryKey: ["offers"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("offers")
        .select("*")
        .order("display_order", { ascending: true });

      if (error) throw error;
      return data as Offer[];
    },
  });
};

export const useActiveOffers = () => {
  return useQuery({
    queryKey: ["offers", "active"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("offers")
        .select("*")
        .eq("is_active", true)
        .order("display_order", { ascending: true });

      if (error) throw error;
      return data as Offer[];
    },
  });
};

// Get only Offer Banner type offers (for carousel below hero)
export const useOfferBanners = () => {
  return useQuery({
    queryKey: ["offers", "offer_banner"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("offers")
        .select("*")
        .eq("is_active", true)
        .eq("offer_type", "offer_banner")
        .order("display_order", { ascending: true });

      if (error) throw error;
      return data as Offer[];
    },
  });
};

// Get only Special Offer type offers (for grid with popups)
export const useSpecialOffers = () => {
  return useQuery({
    queryKey: ["offers", "special_offer"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("offers")
        .select("*")
        .eq("is_active", true)
        .eq("offer_type", "special_offer")
        .order("display_order", { ascending: true });

      if (error) throw error;
      return data as Offer[];
    },
  });
};

// Get scroll text combined from all active offers
export const useScrollOfferText = () => {
  return useQuery({
    queryKey: ["offers", "scroll_text"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("offers")
        .select("title, discount_code, offer_type")
        .eq("is_active", true)
        .order("display_order", { ascending: true });

      if (error) throw error;
      
      // Combine titles and discount codes into scroll text
      const texts = (data || []).map((offer) => {
        let text = offer.title;
        if (offer.discount_code) {
          text += ` - Use code: ${offer.discount_code}`;
        }
        return text;
      });
      
      return texts;
    },
  });
};

export const useCreateOffer = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (offer: OfferInsert) => {
      const { data, error } = await supabase
        .from("offers")
        .insert(offer as any)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["offers"] });
      toast({ title: "Offer created successfully" });
    },
    onError: (error) => {
      toast({ title: "Failed to create offer", description: error.message, variant: "destructive" });
    },
  });
};

export const useUpdateOffer = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...offer }: OfferUpdate & { id: string }) => {
      const { data, error } = await supabase
        .from("offers")
        .update(offer as any)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["offers"] });
      toast({ title: "Offer updated successfully" });
    },
    onError: (error) => {
      toast({ title: "Failed to update offer", description: error.message, variant: "destructive" });
    },
  });
};

export const useDeleteOffer = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("offers").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["offers"] });
      toast({ title: "Offer deleted successfully" });
    },
    onError: (error) => {
      toast({ title: "Failed to delete offer", description: error.message, variant: "destructive" });
    },
  });
};

export const uploadOfferImage = async (file: File): Promise<string> => {
  const fileExt = file.name.split(".").pop();
  const fileName = `${crypto.randomUUID()}.${fileExt}`;
  const filePath = `${fileName}`;

  const { error: uploadError } = await supabase.storage
    .from("offer-images")
    .upload(filePath, file);

  if (uploadError) throw uploadError;

  const { data } = supabase.storage.from("offer-images").getPublicUrl(filePath);
  return data.publicUrl;
};
