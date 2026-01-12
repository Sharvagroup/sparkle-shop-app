-- Remove hardcoded branding defaults from site_settings
-- This migration updates the default values inserted by previous migrations
-- to use empty strings instead of "SHARVA" and "Exquisite Jewellery"

-- Update branding settings if they still have the old hardcoded values
UPDATE public.site_settings
SET value = jsonb_set(
  value,
  '{siteName}',
  '""'::jsonb
)
WHERE key = 'branding'
  AND value->>'siteName' = 'SHARVA';

UPDATE public.site_settings
SET value = jsonb_set(
  value,
  '{tagline}',
  '""'::jsonb
)
WHERE key = 'branding'
  AND value->>'tagline' = 'Exquisite Jewellery';

-- Update SEO settings if they still have the old hardcoded values
UPDATE public.site_settings
SET value = jsonb_set(
  value,
  '{metaTitle}',
  '"loading"'::jsonb
)
WHERE key = 'seo'
  AND value->>'metaTitle' = 'SHARVA - Exquisite Jewellery';

UPDATE public.site_settings
SET value = jsonb_set(
  value,
  '{metaDescription}',
  '""'::jsonb
)
WHERE key = 'seo'
  AND value->>'metaDescription' LIKE '%SHARVA%';

-- Update contact settings if they still have the old hardcoded values
UPDATE public.site_settings
SET value = jsonb_set(
  value,
  '{email}',
  '""'::jsonb
)
WHERE key = 'contact'
  AND value->>'email' = 'support@sharva.com';

UPDATE public.site_settings
SET value = jsonb_set(
  value,
  '{phone}',
  '""'::jsonb
)
WHERE key = 'contact'
  AND value->>'phone' = '+91 1234567890';

UPDATE public.site_settings
SET value = jsonb_set(
  value,
  '{address}',
  '""'::jsonb
)
WHERE key = 'contact'
  AND value->>'address' = '123 Main Street, Mumbai, India';
