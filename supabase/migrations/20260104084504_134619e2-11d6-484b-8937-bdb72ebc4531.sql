-- Add payment_status and transaction_id columns to bookings table
ALTER TABLE public.bookings 
ADD COLUMN IF NOT EXISTS payment_status text DEFAULT 'pending',
ADD COLUMN IF NOT EXISTS transaction_id text,
ADD COLUMN IF NOT EXISTS payment_method text,
ADD COLUMN IF NOT EXISTS payment_verified_at timestamp with time zone,
ADD COLUMN IF NOT EXISTS payment_verified_by uuid;

-- Add comment for documentation
COMMENT ON COLUMN public.bookings.payment_status IS 'pending, pending_verification, verified, failed';
COMMENT ON COLUMN public.bookings.transaction_id IS 'Bank transaction reference ID';
COMMENT ON COLUMN public.bookings.payment_method IS 'Bank or wallet used for payment';
COMMENT ON COLUMN public.bookings.payment_verified_at IS 'When the payment was verified';
COMMENT ON COLUMN public.bookings.payment_verified_by IS 'User ID of person who verified payment';