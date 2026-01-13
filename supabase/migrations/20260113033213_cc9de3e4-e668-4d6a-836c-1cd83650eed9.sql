-- Create messages table for booking conversations
CREATE TABLE public.messages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  booking_id UUID NOT NULL REFERENCES public.bookings(id) ON DELETE CASCADE,
  sender_id UUID NOT NULL,
  content TEXT NOT NULL,
  is_read BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

-- Users can view messages for their own bookings
CREATE POLICY "Users can view messages for own bookings"
ON public.messages
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.bookings
    WHERE bookings.id = messages.booking_id
    AND bookings.user_id = auth.uid()
  )
);

-- Property owners can view messages for bookings on their properties
CREATE POLICY "Owners can view messages for their property bookings"
ON public.messages
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.bookings
    JOIN public.properties ON properties.id = bookings.property_id
    WHERE bookings.id = messages.booking_id
    AND properties.owner_id = auth.uid()
  )
);

-- Users can send messages for their own bookings
CREATE POLICY "Users can send messages for own bookings"
ON public.messages
FOR INSERT
WITH CHECK (
  auth.uid() = sender_id
  AND EXISTS (
    SELECT 1 FROM public.bookings
    WHERE bookings.id = booking_id
    AND bookings.user_id = auth.uid()
  )
);

-- Property owners can send messages for bookings on their properties
CREATE POLICY "Owners can send messages for their property bookings"
ON public.messages
FOR INSERT
WITH CHECK (
  auth.uid() = sender_id
  AND EXISTS (
    SELECT 1 FROM public.bookings
    JOIN public.properties ON properties.id = bookings.property_id
    WHERE bookings.id = booking_id
    AND properties.owner_id = auth.uid()
  )
);

-- Users can mark messages as read for their bookings
CREATE POLICY "Users can update message read status for own bookings"
ON public.messages
FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM public.bookings
    WHERE bookings.id = messages.booking_id
    AND bookings.user_id = auth.uid()
  )
);

-- Owners can mark messages as read for their property bookings
CREATE POLICY "Owners can update message read status"
ON public.messages
FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM public.bookings
    JOIN public.properties ON properties.id = bookings.property_id
    WHERE bookings.id = messages.booking_id
    AND properties.owner_id = auth.uid()
  )
);

-- Enable realtime for messages
ALTER PUBLICATION supabase_realtime ADD TABLE public.messages;

-- Create index for faster queries
CREATE INDEX idx_messages_booking_id ON public.messages(booking_id);
CREATE INDEX idx_messages_created_at ON public.messages(created_at);