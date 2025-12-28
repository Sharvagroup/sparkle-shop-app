import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface ProductTheme {
  badge_style?: 'default' | 'rounded' | 'pill';
  badge_color?: string;
  image_fit?: 'cover' | 'contain';
  highlight_color?: string;
  featured_border?: boolean;
  hover_effect?: 'none' | 'lift' | 'glow' | 'zoom';
  card_style?: 'minimal' | 'bordered' | 'shadow';
}

export interface Product {
  id: string;
  name: string;
  sku: string | null;
  slug: string;
  description: string | null;
  long_description: string | null;
  category_id: string | null;
  collection_id: string | null;
  is_new_arrival: boolean;
  is_best_seller: boolean;
  is_celebrity_special: boolean;
  price: number;
  original_price: number | null;
  images: string[];
  video_url: string | null;
  material: string | null;
  care_instructions: string | null;
  stock_quantity: number;
  low_stock_threshold: number;
  badge: 'new' | 'sale' | 'trending' | null;
  display_order: number;
  is_active: boolean;
  rating: number;
  review_count: number;
  theme: ProductTheme | null;
  created_at: string;
  updated_at: string;
  // Joined relations
  category?: { id: string; name: string; slug: string } | null;
  collection?: { id: string; name: string; slug: string } | null;
}

export interface ProductInput {
  name: string;
  sku?: string | null;
  slug: string;
  description?: string | null;
  long_description?: string | null;
  category_id?: string | null;
  collection_id?: string | null;
  is_new_arrival?: boolean;
  is_best_seller?: boolean;
  is_celebrity_special?: boolean;
  price: number;
  original_price?: number | null;
  images?: string[];
  video_url?: string | null;
  material?: string | null;
  care_instructions?: string | null;
  stock_quantity?: number;
  low_stock_threshold?: number;
  badge?: 'new' | 'sale' | 'trending' | null;
  display_order?: number;
  is_active?: boolean;
  theme?: ProductTheme | null;
}

export interface ProductFilters {
  categoryId?: string;
  collectionId?: string;
  isNewArrival?: boolean;
  isBestSeller?: boolean;
  isCelebritySpecial?: boolean;
  minPrice?: number;
  maxPrice?: number;
  material?: string;
  inStock?: boolean;
}

// Fetch active products with filters (for frontend)
export const useProducts = (filters?: ProductFilters) => {
  return useQuery({
    queryKey: ['products', filters],
    queryFn: async () => {
      let query = supabase
        .from('products')
        .select(`
          *,
          category:categories(id, name, slug),
          collection:collections(id, name, slug)
        `)
        .eq('is_active', true)
        .order('display_order', { ascending: true });

      if (filters?.categoryId) {
        query = query.eq('category_id', filters.categoryId);
      }
      if (filters?.collectionId) {
        query = query.eq('collection_id', filters.collectionId);
      }
      if (filters?.isNewArrival) {
        query = query.eq('is_new_arrival', true);
      }
      if (filters?.isBestSeller) {
        query = query.eq('is_best_seller', true);
      }
      if (filters?.isCelebritySpecial) {
        query = query.eq('is_celebrity_special', true);
      }
      if (filters?.minPrice !== undefined) {
        query = query.gte('price', filters.minPrice);
      }
      if (filters?.maxPrice !== undefined) {
        query = query.lte('price', filters.maxPrice);
      }
      if (filters?.material) {
        query = query.ilike('material', `%${filters.material}%`);
      }
      if (filters?.inStock) {
        query = query.gt('stock_quantity', 0);
      }

      const { data, error } = await query;

      if (error) throw error;
      return data as Product[];
    },
  });
};

// Fetch all products including inactive (for admin)
export const useAdminProducts = () => {
  return useQuery({
    queryKey: ['admin-products'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('products')
        .select(`
          *,
          category:categories(id, name, slug),
          collection:collections(id, name, slug)
        `)
        .order('display_order', { ascending: true });

      if (error) throw error;
      return data as Product[];
    },
  });
};

// Fetch single product by slug
export const useProduct = (slug: string) => {
  return useQuery({
    queryKey: ['product', slug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('products')
        .select(`
          *,
          category:categories(id, name, slug),
          collection:collections(id, name, slug)
        `)
        .eq('slug', slug)
        .maybeSingle();

      if (error) throw error;
      return data as Product | null;
    },
    enabled: !!slug,
  });
};

// Create product mutation
export const useCreateProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (product: ProductInput) => {
      const { data, error } = await supabase
        .from('products')
        .insert(product as any)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      queryClient.invalidateQueries({ queryKey: ['admin-products'] });
    },
  });
};

// Update product mutation
export const useUpdateProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...product }: ProductInput & { id: string }) => {
      const { data, error } = await supabase
        .from('products')
        .update(product as any)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      queryClient.invalidateQueries({ queryKey: ['admin-products'] });
    },
  });
};

// Delete product mutation
export const useDeleteProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('products').delete().eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      queryClient.invalidateQueries({ queryKey: ['admin-products'] });
    },
  });
};

// Upload product images
export const uploadProductImages = async (files: File[]): Promise<string[]> => {
  const uploadPromises = files.map(async (file) => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${crypto.randomUUID()}.${fileExt}`;

    const { error: uploadError } = await supabase.storage
      .from('product-images')
      .upload(fileName, file);

    if (uploadError) throw uploadError;

    const { data } = supabase.storage
      .from('product-images')
      .getPublicUrl(fileName);

    return data.publicUrl;
  });

  return Promise.all(uploadPromises);
};

// Delete product image from storage
export const deleteProductImage = async (imageUrl: string): Promise<void> => {
  const fileName = imageUrl.split('/').pop();
  if (!fileName) return;

  const { error } = await supabase.storage
    .from('product-images')
    .remove([fileName]);

  if (error) throw error;
};
