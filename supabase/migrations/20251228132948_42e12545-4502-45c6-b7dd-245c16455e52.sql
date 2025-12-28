-- Add offer_type column to offers table
ALTER TABLE offers 
ADD COLUMN offer_type TEXT DEFAULT 'special_offer';

-- Add check constraint for valid offer types
ALTER TABLE offers 
ADD CONSTRAINT offers_offer_type_check 
CHECK (offer_type IN ('offer_banner', 'special_offer'));

-- Create index for faster filtering by type
CREATE INDEX idx_offers_offer_type ON offers(offer_type);

-- Add scroll_offer_enabled and scroll_offer_speed to site_settings if not exists
INSERT INTO site_settings (key, value, category)
VALUES 
  ('scroll_offer_enabled', 'true', 'offers'),
  ('scroll_offer_speed', '"medium"', 'offers')
ON CONFLICT (key) DO NOTHING;