-- Add theme column to banners table for per-banner styling options
ALTER TABLE public.banners ADD COLUMN IF NOT EXISTS theme jsonb DEFAULT '{}'::jsonb;

-- Add comment for documentation
COMMENT ON COLUMN public.banners.theme IS 'Per-banner theme settings: content_position, overlay_opacity, edge_fade, button_shape, height_override';