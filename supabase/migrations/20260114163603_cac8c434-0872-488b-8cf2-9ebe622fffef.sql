-- Drop existing policies on profiles
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;

-- Recreate policies with proper security
-- Users can only view their own profile
CREATE POLICY "Users can view own profile" 
ON public.profiles 
AS RESTRICTIVE
FOR SELECT 
USING (auth.uid() = user_id);

-- Users can only update their own profile
CREATE POLICY "Users can update own profile" 
ON public.profiles 
AS RESTRICTIVE
FOR UPDATE 
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Users can only insert their own profile
CREATE POLICY "Users can insert own profile" 
ON public.profiles 
AS RESTRICTIVE
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Add admin access (PERMISSIVE so admins can manage all profiles)
CREATE POLICY "Admins can manage all profiles" 
ON public.profiles 
FOR ALL 
USING (has_role(auth.uid(), 'admin'))
WITH CHECK (has_role(auth.uid(), 'admin'));