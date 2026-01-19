-- Allow public to update their own newsletter subscription verification status
CREATE POLICY "Anyone can verify their subscription by token"
ON public.newsletter_subscriptions
FOR UPDATE
USING (true)
WITH CHECK (
  -- Only allow updating verification fields
  is_verified = true AND verified_at IS NOT NULL
);