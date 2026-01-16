-- Add unit_price column to cart_item_addons to persist calculated prices (including discounts)
ALTER TABLE cart_item_addons 
ADD COLUMN unit_price NUMERIC;