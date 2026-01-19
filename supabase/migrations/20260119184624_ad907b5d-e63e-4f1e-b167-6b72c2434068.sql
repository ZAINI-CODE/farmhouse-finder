-- Add verification columns to newsletter_subscriptions
ALTER TABLE public.newsletter_subscriptions
ADD COLUMN IF NOT EXISTS is_verified BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN IF NOT EXISTS verification_token UUID DEFAULT gen_random_uuid(),
ADD COLUMN IF NOT EXISTS verified_at TIMESTAMP WITH TIME ZONE;