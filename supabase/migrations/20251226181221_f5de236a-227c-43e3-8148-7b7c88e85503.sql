-- Create collections table
CREATE TABLE public.collections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  slug TEXT NOT NULL UNIQUE,
  image_url TEXT,
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.collections ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Anyone can view active collections"
ON public.collections
FOR SELECT
USING (is_active = true);

CREATE POLICY "Admins can view all collections"
ON public.collections
FOR SELECT
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can insert collections"
ON public.collections
FOR INSERT
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update collections"
ON public.collections
FOR UPDATE
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete collections"
ON public.collections
FOR DELETE
USING (has_role(auth.uid(), 'admin'::app_role));

-- Create trigger for updated_at
CREATE TRIGGER update_collections_updated_at
BEFORE UPDATE ON public.collections
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create storage bucket for collection images
INSERT INTO storage.buckets (id, name, public) VALUES ('collection-images', 'collection-images', true);

-- Storage policies for collection-images bucket
CREATE POLICY "Collection images are publicly accessible"
ON storage.objects FOR SELECT
USING (bucket_id = 'collection-images');

CREATE POLICY "Admins can upload collection images"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'collection-images' AND has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update collection images"
ON storage.objects FOR UPDATE
USING (bucket_id = 'collection-images' AND has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete collection images"
ON storage.objects FOR DELETE
USING (bucket_id = 'collection-images' AND has_role(auth.uid(), 'admin'::app_role));