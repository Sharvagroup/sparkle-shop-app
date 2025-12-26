-- Allow users to insert their own admin role during registration
CREATE POLICY "Users can insert their own admin role during registration"
ON public.user_roles
FOR INSERT
WITH CHECK (auth.uid() = user_id);