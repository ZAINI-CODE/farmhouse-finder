-- Add listing lifecycle fields to properties table
-- This enables classified-style ad lifecycle: draft → pending_approval → published/rejected → expired

-- Create listing status enum
CREATE TYPE public.listing_status AS ENUM ('draft', 'pending_approval', 'published', 'rejected', 'expired');

-- Add lifecycle columns to properties
ALTER TABLE public.properties
ADD COLUMN IF NOT EXISTS status listing_status NOT NULL DEFAULT 'published',
ADD COLUMN IF NOT EXISTS expires_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS is_featured BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN IF NOT EXISTS featured_until TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS rejection_reason TEXT,
ADD COLUMN IF NOT EXISTS submitted_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS approved_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS approved_by UUID REFERENCES auth.users(id);

-- Add lifecycle columns to vendors
ALTER TABLE public.vendors
ADD COLUMN IF NOT EXISTS status listing_status NOT NULL DEFAULT 'published',
ADD COLUMN IF NOT EXISTS expires_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS is_featured BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN IF NOT EXISTS featured_until TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS rejection_reason TEXT,
ADD COLUMN IF NOT EXISTS submitted_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS approved_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS approved_by UUID REFERENCES auth.users(id);

-- Create listing_promotions table for tracking featured/highlighted listings
CREATE TABLE public.listing_promotions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  listing_type TEXT NOT NULL CHECK (listing_type IN ('property', 'vendor')),
  listing_id UUID NOT NULL,
  promotion_type TEXT NOT NULL CHECK (promotion_type IN ('featured', 'highlighted')),
  price DECIMAL(10,2),
  starts_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT true,
  payment_status TEXT DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'refunded')),
  granted_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Create admin_actions table for audit trail
CREATE TABLE public.admin_actions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  action_type TEXT NOT NULL CHECK (action_type IN ('approve_listing', 'reject_listing', 'approve_user', 'reject_user', 'suspend_user', 'ban_user', 'grant_promotion', 'moderate_content')),
  target_type TEXT NOT NULL CHECK (target_type IN ('property', 'vendor', 'user', 'booking', 'review', 'message')),
  target_id UUID NOT NULL,
  reason TEXT,
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Enable RLS on new tables
ALTER TABLE public.listing_promotions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_actions ENABLE ROW LEVEL SECURITY;

-- RLS policies for listing_promotions
CREATE POLICY "Anyone can view active promotions" ON public.listing_promotions
  FOR SELECT USING (is_active = true);

CREATE POLICY "Owners can view their property promotions" ON public.listing_promotions
  FOR SELECT USING (
    listing_type = 'property' AND
    EXISTS (SELECT 1 FROM public.properties WHERE id = listing_id AND owner_id = auth.uid())
  );

CREATE POLICY "Vendors can view their vendor promotions" ON public.listing_promotions
  FOR SELECT USING (
    listing_type = 'vendor' AND
    EXISTS (SELECT 1 FROM public.vendors WHERE id = listing_id AND user_id = auth.uid())
  );

CREATE POLICY "Admins can manage all promotions" ON public.listing_promotions
  FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- RLS policies for admin_actions
CREATE POLICY "Admins can view all actions" ON public.admin_actions
  FOR SELECT USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can create actions" ON public.admin_actions
  FOR INSERT WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Update properties policies to include status filtering
DROP POLICY IF EXISTS "Anyone can view active properties" ON public.properties;
CREATE POLICY "Anyone can view published properties" ON public.properties
  FOR SELECT USING (
    status = 'published' AND 
    is_active = true AND 
    (expires_at IS NULL OR expires_at > now())
  );

-- Owners can view all their own properties regardless of status
CREATE POLICY "Owners can view own properties" ON public.properties
  FOR SELECT USING (auth.uid() = owner_id);

-- Update vendors policies to include status filtering
DROP POLICY IF EXISTS "Anyone can view active vendors" ON public.vendors;
CREATE POLICY "Anyone can view published vendors" ON public.vendors
  FOR SELECT USING (
    status = 'published' AND 
    is_active = true AND 
    (expires_at IS NULL OR expires_at > now())
  );

-- Vendors can view their own profile regardless of status
CREATE POLICY "Vendors can view own profile" ON public.vendors
  FOR SELECT USING (auth.uid() = user_id);

-- Create update trigger for listing_promotions
CREATE TRIGGER update_listing_promotions_updated_at 
  BEFORE UPDATE ON public.listing_promotions 
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Create function to automatically expire listings
CREATE OR REPLACE FUNCTION public.expire_old_listings()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Expire properties
  UPDATE public.properties
  SET status = 'expired'
  WHERE status = 'published'
    AND expires_at IS NOT NULL
    AND expires_at < now();
    
  -- Expire vendors
  UPDATE public.vendors
  SET status = 'expired'
  WHERE status = 'published'
    AND expires_at IS NOT NULL
    AND expires_at < now();
    
  -- Deactivate expired promotions
  UPDATE public.listing_promotions
  SET is_active = false
  WHERE is_active = true
    AND expires_at < now();
END;
$$;

-- Create function to auto-set featured flags based on active promotions
CREATE OR REPLACE FUNCTION public.sync_featured_flags()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Update property featured flags
  UPDATE public.properties p
  SET 
    is_featured = EXISTS (
      SELECT 1 FROM public.listing_promotions lp
      WHERE lp.listing_type = 'property'
        AND lp.listing_id = p.id
        AND lp.promotion_type = 'featured'
        AND lp.is_active = true
        AND lp.expires_at > now()
    ),
    featured_until = (
      SELECT MAX(lp.expires_at)
      FROM public.listing_promotions lp
      WHERE lp.listing_type = 'property'
        AND lp.listing_id = p.id
        AND lp.promotion_type = 'featured'
        AND lp.is_active = true
        AND lp.expires_at > now()
    );
    
  -- Update vendor featured flags
  UPDATE public.vendors v
  SET 
    is_featured = EXISTS (
      SELECT 1 FROM public.listing_promotions lp
      WHERE lp.listing_type = 'vendor'
        AND lp.listing_id = v.id
        AND lp.promotion_type = 'featured'
        AND lp.is_active = true
        AND lp.expires_at > now()
    ),
    featured_until = (
      SELECT MAX(lp.expires_at)
      FROM public.listing_promotions lp
      WHERE lp.listing_type = 'vendor'
        AND lp.listing_id = v.id
        AND lp.promotion_type = 'featured'
        AND lp.is_active = true
        AND lp.expires_at > now()
    );
END;
$$;

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_properties_status ON public.properties(status);
CREATE INDEX IF NOT EXISTS idx_properties_featured ON public.properties(is_featured, featured_until) WHERE is_featured = true;
CREATE INDEX IF NOT EXISTS idx_properties_expires_at ON public.properties(expires_at) WHERE expires_at IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_vendors_status ON public.vendors(status);
CREATE INDEX IF NOT EXISTS idx_vendors_featured ON public.vendors(is_featured, featured_until) WHERE is_featured = true;
CREATE INDEX IF NOT EXISTS idx_vendors_expires_at ON public.vendors(expires_at) WHERE expires_at IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_listing_promotions_listing ON public.listing_promotions(listing_type, listing_id, is_active);
CREATE INDEX IF NOT EXISTS idx_admin_actions_target ON public.admin_actions(target_type, target_id);

-- Comments for documentation
COMMENT ON COLUMN public.properties.status IS 'Listing lifecycle status: draft, pending_approval, published, rejected, expired';
COMMENT ON COLUMN public.properties.expires_at IS 'When the listing will automatically expire (typically 30 days after publishing)';
COMMENT ON COLUMN public.properties.is_featured IS 'Whether listing is currently featured (auto-synced from active promotions)';
COMMENT ON COLUMN public.properties.featured_until IS 'When featured status expires (auto-synced from active promotions)';
COMMENT ON TABLE public.listing_promotions IS 'Tracks featured and highlighted listing promotions for monetization';
COMMENT ON TABLE public.admin_actions IS 'Audit trail for all admin moderation actions';
