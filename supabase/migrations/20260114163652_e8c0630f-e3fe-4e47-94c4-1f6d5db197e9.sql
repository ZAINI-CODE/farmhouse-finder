-- Fix 1: Add explicit denial for anonymous users on profiles table
CREATE POLICY "Deny anonymous access to profiles" 
ON public.profiles 
FOR SELECT 
TO anon 
USING (false);

-- Fix 2: Create a secure view for vendors that excludes sensitive contact info for public
-- First, create a view that hides email/phone from public access
CREATE VIEW public.vendors_public
WITH (security_invoker = on) AS
SELECT 
  id,
  user_id,
  is_verified,
  is_active,
  rating,
  reviews_count,
  created_at,
  updated_at,
  business_name,
  description,
  category,
  location,
  website,
  price_range,
  images,
  specialties
  -- Excludes: phone, email (sensitive contact info)
FROM public.vendors
WHERE is_active = true;

-- Fix 3: Create a secure view for properties that excludes owner_id for public access
CREATE VIEW public.properties_public
WITH (security_invoker = on) AS
SELECT 
  id,
  bathrooms,
  is_active,
  rating,
  reviews_count,
  created_at,
  updated_at,
  price_per_day,
  max_guests,
  bedrooms,
  amenities,
  images,
  title,
  description,
  location,
  address
  -- Excludes: owner_id (sensitive)
FROM public.properties
WHERE is_active = true;

-- Fix 4: Create a secure view for reviews that hides user_id for public display
CREATE VIEW public.reviews_public
WITH (security_invoker = on) AS
SELECT 
  id,
  item_id,
  booking_id,
  rating,
  created_at,
  updated_at,
  item_type,
  comment,
  title
  -- Excludes: user_id (for privacy)
FROM public.reviews;