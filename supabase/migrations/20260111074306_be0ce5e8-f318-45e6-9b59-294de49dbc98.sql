-- Add new columns to product_addons table for enhanced addon/suggestion/bundle system

-- custom_options: Admin-defined option values for addon (e.g., {"weight": 30})
ALTER TABLE public.product_addons 
ADD COLUMN IF NOT EXISTS custom_options JSONB DEFAULT '{}';

-- bundle_discount_percent: Discount % applied when bought as bundle (e.g., 10 = 10% off)
ALTER TABLE public.product_addons 
ADD COLUMN IF NOT EXISTS bundle_discount_percent NUMERIC;

-- bundle_discount_amount: Fixed discount amount for bundle (alternative to %)
ALTER TABLE public.product_addons 
ADD COLUMN IF NOT EXISTS bundle_discount_amount NUMERIC;

-- Add comment for documentation
COMMENT ON COLUMN public.product_addons.custom_options IS 'Admin-defined option values for addon type (e.g., weight: 30g as sample)';
COMMENT ON COLUMN public.product_addons.bundle_discount_percent IS 'Percentage discount when product is bought as bundle';
COMMENT ON COLUMN public.product_addons.bundle_discount_amount IS 'Fixed amount discount when product is bought as bundle';