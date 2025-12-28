-- Add theme column to categories
ALTER TABLE categories ADD COLUMN IF NOT EXISTS theme jsonb DEFAULT '{}'::jsonb;

-- Add theme column to collections  
ALTER TABLE collections ADD COLUMN IF NOT EXISTS theme jsonb DEFAULT '{}'::jsonb;

-- Add theme column to offers
ALTER TABLE offers ADD COLUMN IF NOT EXISTS theme jsonb DEFAULT '{}'::jsonb;

-- Add theme column to products
ALTER TABLE products ADD COLUMN IF NOT EXISTS theme jsonb DEFAULT '{}'::jsonb;