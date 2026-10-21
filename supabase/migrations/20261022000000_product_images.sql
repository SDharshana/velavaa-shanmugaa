-- Public product images.
-- Only verified administrators can upload or modify images.

INSERT INTO storage.buckets (
  id,
  name,
  public,
  file_size_limit,
  allowed_mime_types
)
VALUES (
  'product-images',
  'product-images',
  true,
  5242880,
  ARRAY['image/jpeg', 'image/png', 'image/webp']
)
ON CONFLICT (id)
DO UPDATE SET
  public = true,
  file_size_limit = 5242880,
  allowed_mime_types =
    ARRAY['image/jpeg', 'image/png', 'image/webp'];

DROP POLICY IF EXISTS "Sambrani public image read"
ON storage.objects;

CREATE POLICY "Sambrani public image read"
ON storage.objects
FOR SELECT TO anon, authenticated
USING (bucket_id = 'product-images');

DROP POLICY IF EXISTS "Sambrani admin image insert"
ON storage.objects;

CREATE POLICY "Sambrani admin image insert"
ON storage.objects
FOR INSERT TO authenticated
WITH CHECK (
  bucket_id = 'product-images'
  AND public.is_admin()
);

DROP POLICY IF EXISTS "Sambrani admin image update"
ON storage.objects;

CREATE POLICY "Sambrani admin image update"
ON storage.objects
FOR UPDATE TO authenticated
USING (
  bucket_id = 'product-images'
  AND public.is_admin()
)
WITH CHECK (
  bucket_id = 'product-images'
  AND public.is_admin()
);

DROP POLICY IF EXISTS "Sambrani admin image delete"
ON storage.objects;

CREATE POLICY "Sambrani admin image delete"
ON storage.objects
FOR DELETE TO authenticated
USING (
  bucket_id = 'product-images'
  AND public.is_admin()
);
