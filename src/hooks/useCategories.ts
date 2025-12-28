import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface CategoryTheme {
  display_shape?: 'circle' | 'square' | 'rounded';
  image_size?: 'small' | 'medium' | 'large';
  font_size?: 'small' | 'base' | 'large';
  font_weight?: 'normal' | 'medium' | 'bold';
  hover_effect?: 'none' | 'lift' | 'glow' | 'border';
  hover_border_color?: string;
  overlay_opacity?: number;
  overlay_color?: string;
  text_position?: 'below' | 'overlay';
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  image_url: string | null;
  parent_id: string | null;
  display_order: number;
  is_active: boolean;
  theme: CategoryTheme | null;
  created_at: string;
  updated_at: string;
}

export interface CategoryInput {
  name: string;
  slug: string;
  image_url?: string | null;
  parent_id?: string | null;
  display_order?: number;
  is_active?: boolean;
  theme?: CategoryTheme | null;
}

// Fetch all active categories (for frontend)
export const useCategories = () => {
  return useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .eq('is_active', true)
        .order('display_order', { ascending: true });

      if (error) throw error;
      return data as Category[];
    },
  });
};

// Fetch all categories including inactive (for admin)
export const useAdminCategories = () => {
  return useQuery({
    queryKey: ['admin-categories'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('display_order', { ascending: true });

      if (error) throw error;
      return data as Category[];
    },
  });
};

// Create category mutation
export const useCreateCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (category: CategoryInput) => {
      const { data, error } = await supabase
        .from('categories')
        .insert(category as any)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      queryClient.invalidateQueries({ queryKey: ['admin-categories'] });
    },
  });
};

// Update category mutation
export const useUpdateCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...category }: CategoryInput & { id: string }) => {
      const { data, error } = await supabase
        .from('categories')
        .update(category as any)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      queryClient.invalidateQueries({ queryKey: ['admin-categories'] });
    },
  });
};

// Delete category mutation
export const useDeleteCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('categories').delete().eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      queryClient.invalidateQueries({ queryKey: ['admin-categories'] });
    },
  });
};

// Upload category image
export const uploadCategoryImage = async (file: File): Promise<string> => {
  const fileExt = file.name.split('.').pop();
  const fileName = `${crypto.randomUUID()}.${fileExt}`;

  const { error: uploadError } = await supabase.storage
    .from('category-images')
    .upload(fileName, file);

  if (uploadError) throw uploadError;

  const { data } = supabase.storage
    .from('category-images')
    .getPublicUrl(fileName);

  return data.publicUrl;
};