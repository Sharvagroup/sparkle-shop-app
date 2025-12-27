-- Create banners table
CREATE TABLE public.banners (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  subtitle TEXT,
  image_url TEXT NOT NULL,
  link_url TEXT,
  button_text TEXT DEFAULT 'Shop Now',
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.banners ENABLE ROW LEVEL SECURITY;

-- Public can view active banners
CREATE POLICY "Anyone can view active banners"
ON public.banners
FOR SELECT
USING (is_active = true);

-- Admins can view all banners
CREATE POLICY "Admins can view all banners"
ON public.banners
FOR SELECT
USING (has_role(auth.uid(), 'admin'));

-- Admins can insert banners
CREATE POLICY "Admins can insert banners"
ON public.banners
FOR INSERT
WITH CHECK (has_role(auth.uid(), 'admin'));

-- Admins can update banners
CREATE POLICY "Admins can update banners"
ON public.banners
FOR UPDATE
USING (has_role(auth.uid(), 'admin'));

-- Admins can delete banners
CREATE POLICY "Admins can delete banners"
ON public.banners
FOR DELETE
USING (has_role(auth.uid(), 'admin'));

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_banners_updated_at
BEFORE UPDATE ON public.banners
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create storage bucket for banner images
INSERT INTO storage.buckets (id, name, public) VALUES ('banner-images', 'banner-images', true);

-- Storage policies for banner images
CREATE POLICY "Banner images are publicly accessible"
ON storage.objects
FOR SELECT
USING (bucket_id = 'banner-images');

CREATE POLICY "Admins can upload banner images"
ON storage.objects
FOR INSERT
WITH CHECK (bucket_id = 'banner-images' AND has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update banner images"
ON storage.objects
FOR UPDATE
USING (bucket_id = 'banner-images' AND has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete banner images"
ON storage.objects
FOR DELETE
USING (bucket_id = 'banner-images' AND has_role(auth.uid(), 'admin'));