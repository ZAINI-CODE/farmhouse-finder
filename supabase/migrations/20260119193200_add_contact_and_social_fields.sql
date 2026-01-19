-- Add contact and social media fields to properties and vendors tables
-- This enables direct contact options and social sharing features

-- Add contact and social fields to properties
ALTER TABLE public.properties
ADD COLUMN IF NOT EXISTS contact_phone TEXT,
ADD COLUMN IF NOT EXISTS contact_email TEXT,
ADD COLUMN IF NOT EXISTS whatsapp_number TEXT,
ADD COLUMN IF NOT EXISTS facebook_url TEXT,
ADD COLUMN IF NOT EXISTS instagram_url TEXT,
ADD COLUMN IF NOT EXISTS website_url TEXT;

-- Add additional social fields to vendors (some already exist)
ALTER TABLE public.vendors
ADD COLUMN IF NOT EXISTS whatsapp_number TEXT,
ADD COLUMN IF NOT EXISTS facebook_url TEXT,
ADD COLUMN IF NOT EXISTS instagram_url TEXT;

-- Add user suspension fields to profiles
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS is_suspended BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN IF NOT EXISTS suspension_reason TEXT,
ADD COLUMN IF NOT EXISTS suspended_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS suspended_by UUID REFERENCES auth.users(id);

-- Add email verification enforcement
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS email_verified BOOLEAN NOT NULL DEFAULT true; -- Default true for existing users

-- Comments for documentation
COMMENT ON COLUMN public.properties.contact_phone IS 'Phone number for direct contact (may be different from owner profile phone)';
COMMENT ON COLUMN public.properties.whatsapp_number IS 'WhatsApp number for click-to-chat functionality';
COMMENT ON COLUMN public.properties.facebook_url IS 'Facebook page/profile URL for the property';
COMMENT ON COLUMN public.properties.instagram_url IS 'Instagram profile URL for the property';
COMMENT ON COLUMN public.vendors.whatsapp_number IS 'WhatsApp number for click-to-chat functionality';
COMMENT ON COLUMN public.profiles.is_suspended IS 'Whether the user account is suspended by admin';
COMMENT ON COLUMN public.profiles.email_verified IS 'Whether the user email is verified (required for posting)';
