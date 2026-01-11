-- Add show_in_main_listing column to categories
ALTER TABLE public.categories 
ADD COLUMN IF NOT EXISTS show_in_main_listing BOOLEAN DEFAULT true;

-- Add comment
COMMENT ON COLUMN public.categories.show_in_main_listing IS 'If false, products in this category will not appear in main product listings (but can be used as addons)';
