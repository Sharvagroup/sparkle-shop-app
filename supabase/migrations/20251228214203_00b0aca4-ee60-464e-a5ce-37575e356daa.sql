-- Create discount_codes table for promo code functionality
CREATE TABLE public.discount_codes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code text UNIQUE NOT NULL,
  discount_type text NOT NULL DEFAULT 'percentage' CHECK (discount_type IN ('percentage', 'fixed')),
  discount_value numeric NOT NULL DEFAULT 0,
  min_order_amount numeric DEFAULT 0,
  max_uses integer DEFAULT NULL,
  use_count integer DEFAULT 0,
  is_active boolean DEFAULT true,
  starts_at timestamptz DEFAULT now(),
  expires_at timestamptz DEFAULT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.discount_codes ENABLE ROW LEVEL SECURITY;

-- Anyone can check active discount codes (for validation)
CREATE POLICY "Anyone can read active discount codes" 
ON public.discount_codes 
FOR SELECT 
USING (is_active = true AND (starts_at IS NULL OR starts_at <= now()) AND (expires_at IS NULL OR expires_at >= now()));

-- Admins can view all discount codes
CREATE POLICY "Admins can view all discount codes" 
ON public.discount_codes 
FOR SELECT 
USING (public.has_role(auth.uid(), 'admin'));

-- Admins can insert discount codes
CREATE POLICY "Admins can insert discount codes" 
ON public.discount_codes 
FOR INSERT 
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Admins can update discount codes
CREATE POLICY "Admins can update discount codes" 
ON public.discount_codes 
FOR UPDATE 
USING (public.has_role(auth.uid(), 'admin'));

-- Admins can delete discount codes
CREATE POLICY "Admins can delete discount codes" 
ON public.discount_codes 
FOR DELETE 
USING (public.has_role(auth.uid(), 'admin'));

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_discount_codes_updated_at
BEFORE UPDATE ON public.discount_codes
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Add discount_code column to orders table
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS discount_code text DEFAULT NULL;