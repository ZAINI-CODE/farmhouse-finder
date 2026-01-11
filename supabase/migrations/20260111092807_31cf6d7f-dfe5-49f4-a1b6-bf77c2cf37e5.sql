-- Create reviews table for properties and vendors
CREATE TABLE public.reviews (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  item_id UUID NOT NULL,
  item_type TEXT NOT NULL CHECK (item_type IN ('property', 'vendor')),
  booking_id UUID,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  title TEXT,
  comment TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, item_id, item_type)
);

-- Enable RLS
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

-- Anyone can view reviews (they're public)
CREATE POLICY "Anyone can view reviews" 
ON public.reviews 
FOR SELECT 
USING (true);

-- Authenticated users can create reviews
CREATE POLICY "Users can create reviews" 
ON public.reviews 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Users can update their own reviews
CREATE POLICY "Users can update own reviews" 
ON public.reviews 
FOR UPDATE 
USING (auth.uid() = user_id);

-- Users can delete their own reviews
CREATE POLICY "Users can delete own reviews" 
ON public.reviews 
FOR DELETE 
USING (auth.uid() = user_id);

-- Admins can manage all reviews
CREATE POLICY "Admins can manage all reviews" 
ON public.reviews 
FOR ALL 
USING (has_role(auth.uid(), 'admin'::app_role));

-- Create trigger for updating timestamps
CREATE TRIGGER update_reviews_updated_at
BEFORE UPDATE ON public.reviews
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create function to update property/vendor ratings
CREATE OR REPLACE FUNCTION public.update_item_rating()
RETURNS TRIGGER AS $$
BEGIN
  -- Update property rating if it's a property review
  IF NEW.item_type = 'property' THEN
    UPDATE public.properties 
    SET 
      rating = (SELECT ROUND(AVG(rating)::numeric, 1) FROM public.reviews WHERE item_id = NEW.item_id AND item_type = 'property'),
      reviews_count = (SELECT COUNT(*) FROM public.reviews WHERE item_id = NEW.item_id AND item_type = 'property')
    WHERE id = NEW.item_id;
  -- Update vendor rating if it's a vendor review
  ELSIF NEW.item_type = 'vendor' THEN
    UPDATE public.vendors 
    SET 
      rating = (SELECT ROUND(AVG(rating)::numeric, 1) FROM public.reviews WHERE item_id = NEW.item_id AND item_type = 'vendor'),
      reviews_count = (SELECT COUNT(*) FROM public.reviews WHERE item_id = NEW.item_id AND item_type = 'vendor')
    WHERE id = NEW.item_id;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Create trigger to auto-update ratings when reviews are added/updated
CREATE TRIGGER update_rating_on_review
AFTER INSERT OR UPDATE ON public.reviews
FOR EACH ROW
EXECUTE FUNCTION public.update_item_rating();

-- Create function to update ratings on review delete
CREATE OR REPLACE FUNCTION public.update_item_rating_on_delete()
RETURNS TRIGGER AS $$
BEGIN
  IF OLD.item_type = 'property' THEN
    UPDATE public.properties 
    SET 
      rating = COALESCE((SELECT ROUND(AVG(rating)::numeric, 1) FROM public.reviews WHERE item_id = OLD.item_id AND item_type = 'property'), 0),
      reviews_count = (SELECT COUNT(*) FROM public.reviews WHERE item_id = OLD.item_id AND item_type = 'property')
    WHERE id = OLD.item_id;
  ELSIF OLD.item_type = 'vendor' THEN
    UPDATE public.vendors 
    SET 
      rating = COALESCE((SELECT ROUND(AVG(rating)::numeric, 1) FROM public.reviews WHERE item_id = OLD.item_id AND item_type = 'vendor'), 0),
      reviews_count = (SELECT COUNT(*) FROM public.reviews WHERE item_id = OLD.item_id AND item_type = 'vendor')
    WHERE id = OLD.item_id;
  END IF;
  
  RETURN OLD;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Create trigger for delete
CREATE TRIGGER update_rating_on_review_delete
AFTER DELETE ON public.reviews
FOR EACH ROW
EXECUTE FUNCTION public.update_item_rating_on_delete();