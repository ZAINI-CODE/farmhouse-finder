-- Move pg_graphql extension to the required 'graphql' schema
CREATE SCHEMA IF NOT EXISTS graphql;
DROP EXTENSION IF EXISTS pg_graphql;
CREATE EXTENSION IF NOT EXISTS pg_graphql SCHEMA graphql;

-- Add INSERT policy for booking_services - users can create booking services for their own bookings
CREATE POLICY "Users can create booking services for own bookings" 
ON public.booking_services 
FOR INSERT 
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.bookings 
    WHERE bookings.id = booking_id 
    AND bookings.user_id = auth.uid()
  )
);

-- Add UPDATE policy for booking_services - vendors can update their own booking services
CREATE POLICY "Vendors can update their booking services" 
ON public.booking_services 
FOR UPDATE 
USING (
  EXISTS (
    SELECT 1 FROM public.vendors 
    WHERE vendors.id = booking_services.vendor_id 
    AND vendors.user_id = auth.uid()
  )
);