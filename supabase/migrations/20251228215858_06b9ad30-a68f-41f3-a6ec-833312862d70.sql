-- Create discount_code_usages table to track per-user usage
CREATE TABLE public.discount_code_usages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  discount_code_id uuid NOT NULL REFERENCES public.discount_codes(id) ON DELETE CASCADE,
  user_id uuid NOT NULL,
  order_id uuid REFERENCES public.orders(id) ON DELETE SET NULL,
  used_at timestamp with time zone NOT NULL DEFAULT now(),
  UNIQUE (discount_code_id, user_id)
);

-- Enable RLS
ALTER TABLE public.discount_code_usages ENABLE ROW LEVEL SECURITY;

-- Users can view their own usage records
CREATE POLICY "Users can view their own discount usage"
ON public.discount_code_usages
FOR SELECT
USING (auth.uid() = user_id);

-- Users can insert their own usage records
CREATE POLICY "Users can record their discount usage"
ON public.discount_code_usages
FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Admins can view all usage records
CREATE POLICY "Admins can view all discount usages"
ON public.discount_code_usages
FOR SELECT
USING (has_role(auth.uid(), 'admin'::app_role));

-- Admins can delete usage records
CREATE POLICY "Admins can delete discount usages"
ON public.discount_code_usages
FOR DELETE
USING (has_role(auth.uid(), 'admin'::app_role));

-- Create function to decrement stock after order
CREATE OR REPLACE FUNCTION public.decrement_product_stock()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE public.products
  SET stock_quantity = GREATEST(0, COALESCE(stock_quantity, 0) - NEW.quantity)
  WHERE id = NEW.product_id;
  RETURN NEW;
END;
$$;

-- Create trigger to auto-decrement stock when order_items are inserted
CREATE TRIGGER decrement_stock_on_order_item
AFTER INSERT ON public.order_items
FOR EACH ROW
EXECUTE FUNCTION public.decrement_product_stock();