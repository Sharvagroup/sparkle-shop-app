import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface CollectionTheme {
  card_style?: 'minimal' | 'bordered' | 'shadow';
  image_aspect?: 'square' | '4:3' | '16:9';
  overlay_color?: string;
  overlay_opacity?: number;
  content_position?: 'bottom' | 'center';
  font_size?: 'small' | 'base' | 'large';
  font_weight?: 'normal' | 'medium' | 'bold';
  hover_effect?: 'none' | 'lift' | 'glow' | 'zoom';
}

export interface Collection {
  id: string;
  name: string;
  description: string | null;
  slug: string;
  image_url: string | null;
  display_order: number;
  is_active: boolean;
  theme: CollectionTheme | null;
  created_at: string;
  updated_at: string;
}

export interface CollectionInput {
  name: string;
  description?: string | null;
  slug: string;
  image_url?: string | null;
  display_order?: number;
  is_active?: boolean;
  theme?: CollectionTheme | null;
}

// Fetch all active collections (for frontend)
export const useCollections = () => {
  return useQuery({
    queryKey: ['collections'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('collections')
        .select('*')
        .eq('is_active', true)
        .order('display_order', { ascending: true });

      if (error) throw error;
      return data as Collection[];
    },
  });
};

// Fetch all collections including inactive (for admin)
export const useAdminCollections = () => {
  return useQuery({
    queryKey: ['admin-collections'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('collections')
        .select('*')
        .order('display_order', { ascending: true });

      if (error) throw error;
      return data as Collection[];
    },
  });
};

// Create collection mutation
export const useCreateCollection = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (collection: CollectionInput) => {
      const { data, error } = await supabase
        .from('collections')
        .insert(collection as any)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['collections'] });
      queryClient.invalidateQueries({ queryKey: ['admin-collections'] });
    },
  });
};

// Update collection mutation
export const useUpdateCollection = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...collection }: CollectionInput & { id: string }) => {
      const { data, error } = await supabase
        .from('collections')
        .update(collection as any)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['collections'] });
      queryClient.invalidateQueries({ queryKey: ['admin-collections'] });
    },
  });
};

// Delete collection mutation
export const useDeleteCollection = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('collections').delete().eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['collections'] });
      queryClient.invalidateQueries({ queryKey: ['admin-collections'] });
    },
  });
};

// Upload collection image
export const uploadCollectionImage = async (file: File): Promise<string> => {
  const fileExt = file.name.split('.').pop();
  const fileName = `${crypto.randomUUID()}.${fileExt}`;

  const { error: uploadError } = await supabase.storage
    .from('collection-images')
    .upload(fileName, file);

  if (uploadError) throw uploadError;

  const { data } = supabase.storage
    .from('collection-images')
    .getPublicUrl(fileName);

  return data.publicUrl;
};
