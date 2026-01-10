-- Drop the foreign key constraint on owner_id to allow sample data
ALTER TABLE public.properties DROP CONSTRAINT IF EXISTS properties_owner_id_fkey;