import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

export interface Announcement {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string;
  featured_image: string | null;
  category: string | null;
  is_published: boolean | null;
  published_at: string | null;
  author_id: string | null;
  display_order: number | null;
  created_at: string;
  updated_at: string;
}

export type AnnouncementInsert = Omit<Announcement, "id" | "created_at" | "updated_at">;
export type AnnouncementUpdate = Partial<AnnouncementInsert>;

export const useAnnouncements = () => {
  return useQuery({
    queryKey: ["announcements"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("announcements")
        .select("*")
        .order("display_order", { ascending: true });

      if (error) throw error;
      return data as Announcement[];
    },
  });
};

export const usePublishedAnnouncements = () => {
  return useQuery({
    queryKey: ["announcements", "published"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("announcements")
        .select("*")
        .eq("is_published", true)
        .order("published_at", { ascending: false });

      if (error) throw error;
      return data as Announcement[];
    },
  });
};

export const useAnnouncement = (slug: string) => {
  return useQuery({
    queryKey: ["announcements", slug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("announcements")
        .select("*")
        .eq("slug", slug)
        .maybeSingle();

      if (error) throw error;
      return data as Announcement | null;
    },
    enabled: !!slug,
  });
};

export const useCreateAnnouncement = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (announcement: AnnouncementInsert) => {
      const { data, error } = await supabase
        .from("announcements")
        .insert(announcement)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["announcements"] });
      toast({ title: "Announcement created successfully" });
    },
    onError: (error) => {
      toast({ title: "Failed to create announcement", description: error.message, variant: "destructive" });
    },
  });
};

export const useUpdateAnnouncement = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...data }: AnnouncementUpdate & { id: string }) => {
      const { data: result, error } = await supabase
        .from("announcements")
        .update(data)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["announcements"] });
      toast({ title: "Announcement updated successfully" });
    },
    onError: (error) => {
      toast({ title: "Failed to update announcement", description: error.message, variant: "destructive" });
    },
  });
};

export const useDeleteAnnouncement = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("announcements").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["announcements"] });
      toast({ title: "Announcement deleted successfully" });
    },
    onError: (error) => {
      toast({ title: "Failed to delete announcement", description: error.message, variant: "destructive" });
    },
  });
};

export const uploadAnnouncementImage = async (file: File): Promise<string> => {
  const fileExt = file.name.split(".").pop();
  const fileName = `${crypto.randomUUID()}.${fileExt}`;

  const { error: uploadError } = await supabase.storage
    .from("announcement-images")
    .upload(fileName, file);

  if (uploadError) throw uploadError;

  const { data } = supabase.storage.from("announcement-images").getPublicUrl(fileName);
  return data.publicUrl;
};
