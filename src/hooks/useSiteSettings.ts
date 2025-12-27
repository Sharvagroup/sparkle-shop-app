import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import type { Json } from "@/integrations/supabase/types";

export interface BrandingSettings {
  siteName: string;
  tagline: string;
  logoUrl: string;
  faviconUrl: string;
  loadingImageUrl: string;
}

export interface ContactSettings {
  email: string;
  phone: string;
  address: string;
  whatsapp: string;
}

export interface SocialSettings {
  facebook: string;
  instagram: string;
  twitter: string;
  pinterest: string;
  youtube: string;
}

export interface ThemeSettings {
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  fontHeading: string;
  fontBody: string;
  darkMode: boolean;
}

export interface HomepageSettings {
  sections: string[];
}

export interface SeoSettings {
  metaTitle: string;
  metaDescription: string;
  ogImage: string;
}

export interface SiteSetting {
  id: string;
  key: string;
  value: Record<string, unknown>;
  category: string | null;
  created_at: string;
  updated_at: string;
}

export const useSiteSettings = () => {
  return useQuery({
    queryKey: ["site-settings"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("site_settings")
        .select("*");

      if (error) throw error;
      
      const settings: Record<string, Record<string, unknown>> = {};
      (data as SiteSetting[]).forEach((item) => {
        settings[item.key] = item.value;
      });
      
      return settings;
    },
  });
};

export const useSiteSetting = <T>(key: string) => {
  return useQuery({
    queryKey: ["site-settings", key],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("site_settings")
        .select("*")
        .eq("key", key)
        .maybeSingle();

      if (error) throw error;
      return data?.value as T | null;
    },
  });
};

export const useUpdateSiteSetting = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ key, value, category }: { key: string; value: Record<string, unknown>; category?: string }) => {
      const { data, error } = await supabase
        .from("site_settings")
        .upsert([{ key, value: value as unknown as Json, category: category || "general" }], { onConflict: "key" })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["site-settings"] });
      toast({ title: "Settings saved successfully" });
    },
    onError: (error) => {
      toast({ title: "Failed to save settings", description: error.message, variant: "destructive" });
    },
  });
};

export const uploadSiteAsset = async (file: File, folder: string = ""): Promise<string> => {
  const fileExt = file.name.split(".").pop();
  const fileName = `${folder ? folder + "/" : ""}${crypto.randomUUID()}.${fileExt}`;

  const { error: uploadError } = await supabase.storage
    .from("site-assets")
    .upload(fileName, file);

  if (uploadError) throw uploadError;

  const { data } = supabase.storage.from("site-assets").getPublicUrl(fileName);
  return data.publicUrl;
};
