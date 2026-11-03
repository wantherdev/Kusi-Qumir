-- Only catalogue photographs belong in this public bucket.
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES ('tour-images', 'tour-images', true, 5242880, ARRAY['image/jpeg', 'image/png', 'image/webp']);

-- New immutable names prevent replacing an image already referenced by a tour.
-- Public delivery uses Storage's public endpoint, without public listing policies.
CREATE POLICY "administrators_upload_tour_images" ON storage.objects
FOR INSERT TO authenticated
WITH CHECK (
  bucket_id = 'tour-images'
  AND name ~ '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}\.(jpg|png|webp)$'
  AND EXISTS (
    SELECT 1 FROM public."TourAdministrator"
    WHERE user_id = (SELECT auth.uid())
  )
);
