-- Drop the unique constraint to allow multiple cart entries for the same product with different options
ALTER TABLE cart DROP CONSTRAINT IF EXISTS cart_user_id_product_id_key;