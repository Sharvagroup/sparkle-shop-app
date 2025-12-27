-- =====================
-- ANNOUNCEMENTS TABLE (Blogs/Community)
-- =====================
CREATE TABLE public.announcements (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  excerpt TEXT,
  content TEXT NOT NULL,
  featured_image TEXT,
  category TEXT DEFAULT 'general',
  is_published BOOLEAN DEFAULT false,
  published_at TIMESTAMP WITH TIME ZONE,
  author_id UUID REFERENCES public.profiles(id),
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.announcements ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view published announcements" ON public.announcements
  FOR SELECT USING (is_published = true);

CREATE POLICY "Admins can view all announcements" ON public.announcements
  FOR SELECT USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can insert announcements" ON public.announcements
  FOR INSERT WITH CHECK (has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update announcements" ON public.announcements
  FOR UPDATE USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete announcements" ON public.announcements
  FOR DELETE USING (has_role(auth.uid(), 'admin'));

CREATE TRIGGER update_announcements_updated_at
  BEFORE UPDATE ON public.announcements
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- =====================
-- FOOTER LINKS TABLE
-- =====================
CREATE TABLE public.footer_links (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  section TEXT NOT NULL, -- e.g., 'company', 'customer_service', 'policies', 'social'
  label TEXT NOT NULL,
  url TEXT NOT NULL,
  icon TEXT, -- for social links
  is_external BOOLEAN DEFAULT false,
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.footer_links ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active footer links" ON public.footer_links
  FOR SELECT USING (is_active = true);

CREATE POLICY "Admins can view all footer links" ON public.footer_links
  FOR SELECT USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can insert footer links" ON public.footer_links
  FOR INSERT WITH CHECK (has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update footer links" ON public.footer_links
  FOR UPDATE USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete footer links" ON public.footer_links
  FOR DELETE USING (has_role(auth.uid(), 'admin'));

CREATE TRIGGER update_footer_links_updated_at
  BEFORE UPDATE ON public.footer_links
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- =====================
-- SITE SETTINGS TABLE (Key-Value store)
-- =====================
CREATE TABLE public.site_settings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  key TEXT NOT NULL UNIQUE,
  value JSONB NOT NULL DEFAULT '{}',
  category TEXT DEFAULT 'general',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view site settings" ON public.site_settings
  FOR SELECT USING (true);

CREATE POLICY "Admins can insert site settings" ON public.site_settings
  FOR INSERT WITH CHECK (has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update site settings" ON public.site_settings
  FOR UPDATE USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete site settings" ON public.site_settings
  FOR DELETE USING (has_role(auth.uid(), 'admin'));

CREATE TRIGGER update_site_settings_updated_at
  BEFORE UPDATE ON public.site_settings
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Insert default site settings
INSERT INTO public.site_settings (key, value, category) VALUES
  ('branding', '{"siteName": "SHARVA", "tagline": "Exquisite Jewellery", "logoUrl": "", "faviconUrl": "", "loadingImageUrl": ""}', 'branding'),
  ('contact', '{"email": "support@sharva.com", "phone": "+91 1234567890", "address": "123 Main Street, Mumbai, India", "whatsapp": ""}', 'contact'),
  ('social', '{"facebook": "", "instagram": "", "twitter": "", "pinterest": "", "youtube": ""}', 'social'),
  ('theme', '{"primaryColor": "45 93% 47%", "secondaryColor": "0 0% 9%", "accentColor": "45 93% 47%", "fontHeading": "Cormorant Garamond", "fontBody": "Inter", "darkMode": false}', 'theme'),
  ('homepage', '{"sections": ["hero", "sale_banner", "categories", "offers", "new_arrivals", "best_sellers", "celebrity_specials", "testimonials"]}', 'homepage'),
  ('seo', '{"metaTitle": "SHARVA - Exquisite Jewellery", "metaDescription": "Discover handcrafted jewellery at SHARVA", "ogImage": ""}', 'seo');

-- =====================
-- STORAGE BUCKETS
-- =====================
INSERT INTO storage.buckets (id, name, public) VALUES ('announcement-images', 'announcement-images', true);
INSERT INTO storage.buckets (id, name, public) VALUES ('site-assets', 'site-assets', true);

-- Storage policies for announcement-images
CREATE POLICY "Anyone can view announcement images" ON storage.objects
  FOR SELECT USING (bucket_id = 'announcement-images');

CREATE POLICY "Admins can upload announcement images" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'announcement-images' AND has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update announcement images" ON storage.objects
  FOR UPDATE USING (bucket_id = 'announcement-images' AND has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete announcement images" ON storage.objects
  FOR DELETE USING (bucket_id = 'announcement-images' AND has_role(auth.uid(), 'admin'));

-- Storage policies for site-assets
CREATE POLICY "Anyone can view site assets" ON storage.objects
  FOR SELECT USING (bucket_id = 'site-assets');

CREATE POLICY "Admins can upload site assets" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'site-assets' AND has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update site assets" ON storage.objects
  FOR UPDATE USING (bucket_id = 'site-assets' AND has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete site assets" ON storage.objects
  FOR DELETE USING (bucket_id = 'site-assets' AND has_role(auth.uid(), 'admin'));