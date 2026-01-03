-- Create product_options table (Global configurable options for products)
CREATE TABLE public.product_options (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  type TEXT NOT NULL DEFAULT 'number',
  unit TEXT,
  is_mandatory BOOLEAN DEFAULT false,
  is_enabled BOOLEAN DEFAULT true,
  min_value NUMERIC,
  max_value NUMERIC,
  step_value NUMERIC DEFAULT 1,
  select_options JSONB DEFAULT '[]',
  display_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create product_addons table (Product-to-product relationships)
CREATE TABLE public.product_addons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  addon_product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  addon_type TEXT DEFAULT 'suggestion',
  price_override NUMERIC,
  display_order INT DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(product_id, addon_product_id)
);

-- Add columns to products table
ALTER TABLE public.products 
ADD COLUMN enabled_options JSONB DEFAULT '[]',
ADD COLUMN has_addons BOOLEAN DEFAULT false;

-- Add column to cart table for selected options
ALTER TABLE public.cart 
ADD COLUMN selected_options JSONB DEFAULT '{}';

-- Create cart_item_addons table
CREATE TABLE public.cart_item_addons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cart_item_id UUID NOT NULL REFERENCES public.cart(id) ON DELETE CASCADE,
  addon_product_id UUID NOT NULL REFERENCES public.products(id),
  quantity INT DEFAULT 1,
  selected_options JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS on all new tables
ALTER TABLE public.product_options ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_addons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cart_item_addons ENABLE ROW LEVEL SECURITY;

-- RLS for product_options (admin can manage, anyone can view enabled)
CREATE POLICY "Admins can insert product options" ON public.product_options
FOR INSERT WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update product options" ON public.product_options
FOR UPDATE USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete product options" ON public.product_options
FOR DELETE USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can view all product options" ON public.product_options
FOR SELECT USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Anyone can view enabled product options" ON public.product_options
FOR SELECT USING (is_enabled = true);

-- RLS for product_addons (admin can manage, anyone can view active)
CREATE POLICY "Admins can insert product addons" ON public.product_addons
FOR INSERT WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update product addons" ON public.product_addons
FOR UPDATE USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete product addons" ON public.product_addons
FOR DELETE USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can view all product addons" ON public.product_addons
FOR SELECT USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Anyone can view active product addons" ON public.product_addons
FOR SELECT USING (is_active = true);

-- RLS for cart_item_addons (users can manage their own)
CREATE POLICY "Users can view their cart addons" ON public.cart_item_addons
FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM public.cart 
    WHERE cart.id = cart_item_addons.cart_item_id 
    AND cart.user_id = auth.uid()
  )
);

CREATE POLICY "Users can insert their cart addons" ON public.cart_item_addons
FOR INSERT WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.cart 
    WHERE cart.id = cart_item_addons.cart_item_id 
    AND cart.user_id = auth.uid()
  )
);

CREATE POLICY "Users can update their cart addons" ON public.cart_item_addons
FOR UPDATE USING (
  EXISTS (
    SELECT 1 FROM public.cart 
    WHERE cart.id = cart_item_addons.cart_item_id 
    AND cart.user_id = auth.uid()
  )
);

CREATE POLICY "Users can delete their cart addons" ON public.cart_item_addons
FOR DELETE USING (
  EXISTS (
    SELECT 1 FROM public.cart 
    WHERE cart.id = cart_item_addons.cart_item_id 
    AND cart.user_id = auth.uid()
  )
);

-- Create trigger for updated_at on product_options
CREATE TRIGGER update_product_options_updated_at
BEFORE UPDATE ON public.product_options
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Seed default product options
INSERT INTO public.product_options (name, type, unit, is_mandatory, is_enabled, min_value, max_value, step_value, display_order) VALUES
('Quantity', 'number', 'pcs', true, true, 1, 100, 1, 1),
('Weight', 'number', 'g', false, true, 1, 10000, 1, 2),
('Size', 'select', null, false, true, null, null, null, 3),
('Color', 'select', null, false, true, null, null, null, 4);

-- Set default select options for Size and Color
UPDATE public.product_options SET select_options = '["XS", "S", "M", "L", "XL", "XXL"]' WHERE name = 'Size';
UPDATE public.product_options SET select_options = '["Red", "Blue", "Green", "Black", "White", "Gold", "Silver"]' WHERE name = 'Color';