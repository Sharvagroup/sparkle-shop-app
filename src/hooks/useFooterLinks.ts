import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

export interface FooterLink {
  id: string;
  section: string;
  label: string;
  url: string;
  icon: string | null;
  is_external: boolean | null;
  display_order: number | null;
  is_active: boolean | null;
  created_at: string;
  updated_at: string;
}

export type FooterLinkInsert = Omit<FooterLink, "id" | "created_at" | "updated_at">;
export type FooterLinkUpdate = Partial<FooterLinkInsert>;

export const useFooterLinks = () => {
  return useQuery({
    queryKey: ["footer-links"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("footer_links")
        .select("*")
        .order("section")
        .order("display_order", { ascending: true });

      if (error) throw error;
      return data as FooterLink[];
    },
  });
};

export const useActiveFooterLinks = () => {
  return useQuery({
    queryKey: ["footer-links", "active"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("footer_links")
        .select("*")
        .eq("is_active", true)
        .order("section")
        .order("display_order", { ascending: true });

      if (error) throw error;
      return data as FooterLink[];
    },
  });
};

export const useCreateFooterLink = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (link: FooterLinkInsert) => {
      const { data, error } = await supabase
        .from("footer_links")
        .insert(link)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["footer-links"] });
      toast({ title: "Footer link created successfully" });
    },
    onError: (error) => {
      toast({ title: "Failed to create footer link", description: error.message, variant: "destructive" });
    },
  });
};

export const useUpdateFooterLink = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...data }: FooterLinkUpdate & { id: string }) => {
      const { data: result, error } = await supabase
        .from("footer_links")
        .update(data)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["footer-links"] });
      toast({ title: "Footer link updated successfully" });
    },
    onError: (error) => {
      toast({ title: "Failed to update footer link", description: error.message, variant: "destructive" });
    },
  });
};

export const useDeleteFooterLink = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("footer_links").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["footer-links"] });
      toast({ title: "Footer link deleted successfully" });
    },
    onError: (error) => {
      toast({ title: "Failed to delete footer link", description: error.message, variant: "destructive" });
    },
  });
};
