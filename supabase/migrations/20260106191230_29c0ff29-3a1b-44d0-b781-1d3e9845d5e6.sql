-- Add pricing strategy columns to products table
ALTER TABLE public.products 
ADD COLUMN IF NOT EXISTS pricing_by_option_id UUID REFERENCES public.product_options(id) ON DELETE SET NULL,
ADD COLUMN IF NOT EXISTS base_unit_value NUMERIC;

-- Add comment for documentation
COMMENT ON COLUMN public.products.pricing_by_option_id IS 'Product option used to calculate dynamic pricing (e.g., weight, size)';
COMMENT ON COLUMN public.products.base_unit_value IS 'The base unit value that the product price applies to (e.g., 200 for 200g)';