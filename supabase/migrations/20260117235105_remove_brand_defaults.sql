-- Remove brand-specific defaults from site_settings
-- This migration updates existing rows to empty strings or generic placeholders
-- only if they match the old hardcoded brand-specific values.

-- Update branding settings - remove SHARVA and Exquisite Jewellery
UPDATE public.site_settings
SET
  value = jsonb_set(
    jsonb_set(
      jsonb_set(
        jsonb_set(
          jsonb_set(
            jsonb_set(
              jsonb_set(
                value,
                '{siteName}',
                to_jsonb('')
              ),
              '{tagline}',
              to_jsonb('')
            ),
            '{logoUrl}',
            to_jsonb('')
          ),
          '{faviconUrl}',
          to_jsonb('')
        ),
        '{loadingImageUrl}',
        to_jsonb('')
      ),
      '{authBackgroundImage}',
      to_jsonb('')
    )
  )
WHERE
  key = 'branding'
  AND (
    value->>'siteName' = 'SHARVA'
    OR value->>'tagline' = 'Exquisite Jewellery'
  );

-- Update contact settings - remove support@sharva.com and Mumbai address
UPDATE public.site_settings
SET
  value = jsonb_set(
    jsonb_set(
      jsonb_set(
        jsonb_set(
          value,
          '{email}',
          to_jsonb('')
        ),
        '{phone}',
        to_jsonb('')
      ),
      '{address}',
      to_jsonb('')
    ),
    '{whatsapp}',
    to_jsonb('')
  )
WHERE
  key = 'contact'
  AND (
    value->>'email' = 'support@sharva.com'
    OR value->>'phone' = '+91 1234567890'
    OR value->>'address' LIKE '%Mumbai%'
    OR value->>'address' LIKE '%India%'
  );

-- Update SEO settings - remove SHARVA from metaTitle and metaDescription
UPDATE public.site_settings
SET
  value = jsonb_set(
    jsonb_set(
      jsonb_set(
        jsonb_set(
          jsonb_set(
            value,
            '{metaTitle}',
            to_jsonb('')
          ),
          '{metaDescription}',
          to_jsonb('')
        ),
        '{ogImage}',
        to_jsonb('')
      ),
      '{metaKeywords}',
      to_jsonb('')
    ),
    '{twitterHandle}',
    to_jsonb('')
  )
WHERE
  key = 'seo'
  AND (
    value->>'metaTitle' LIKE '%SHARVA%'
    OR value->>'metaDescription' LIKE '%SHARVA%'
    OR value->>'metaDescription' LIKE '%jewellery%'
    OR value->>'metaDescription' LIKE '%jewelry%'
  );

-- Update theme settings - remove brand-specific font defaults if they match
UPDATE public.site_settings
SET
  value = jsonb_set(
    jsonb_set(
      value,
      '{fontHeading}',
      to_jsonb('')
    ),
    '{fontBody}',
      to_jsonb('')
    )
WHERE
  key = 'theme'
  AND (
    value->>'fontHeading' = 'Cormorant Garamond'
    OR value->>'fontBody' = 'Inter'
  );
