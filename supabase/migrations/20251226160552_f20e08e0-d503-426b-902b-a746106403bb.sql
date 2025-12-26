-- Add is_verified column to user_roles table
ALTER TABLE public.user_roles
ADD COLUMN is_verified BOOLEAN NOT NULL DEFAULT false;

-- Update RLS policy to only allow verified admins to access admin features
DROP POLICY IF EXISTS "Admins can view all roles" ON public.user_roles;

CREATE POLICY "Verified admins can view all roles"
ON public.user_roles
FOR SELECT
TO authenticated
USING (
  has_role(auth.uid(), 'admin') AND 
  EXISTS (
    SELECT 1 FROM public.user_roles 
    WHERE user_id = auth.uid() 
    AND role = 'admin' 
    AND is_verified = true
  )
);

-- Create a function to check if admin is verified
CREATE OR REPLACE FUNCTION public.is_admin_verified(_user_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = 'admin'
      AND is_verified = true
  )
$$;