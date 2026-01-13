-- Add per-product shipping text and trust badges columns
ALTER TABLE public.products 
ADD COLUMN IF NOT EXISTS shipping_text TEXT,
ADD COLUMN IF NOT EXISTS trust_badges JSONB;