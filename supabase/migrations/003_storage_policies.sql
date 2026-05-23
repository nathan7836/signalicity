-- Create the photos storage bucket
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'signalements-photos',
  'signalements-photos',
  false,
  10485760, -- 10MB
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/heic']
);

-- Anyone authenticated can upload photos (citizens creating signalements)
CREATE POLICY storage_upload_photos ON storage.objects
  FOR INSERT
  WITH CHECK (
    bucket_id = 'signalements-photos'
    AND auth.role() = 'authenticated'
  );

-- Admins, agents, managers and elected can view ALL photos
CREATE POLICY storage_admin_read_photos ON storage.objects
  FOR SELECT
  USING (
    bucket_id = 'signalements-photos'
    AND EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid()
      AND role IN ('admin', 'agent', 'manager', 'elected')
    )
  );

-- Citizens can view photos of their own signalements only
CREATE POLICY storage_citizen_read_own_photos ON storage.objects
  FOR SELECT
  USING (
    bucket_id = 'signalements-photos'
    AND EXISTS (
      SELECT 1 FROM signalements
      WHERE signalements.user_id = auth.uid()
      AND (
        signalements.photo_url LIKE '%' || storage.objects.name
        OR signalements.photo_after_url LIKE '%' || storage.objects.name
      )
    )
  );

-- Anonymous/guest users can view photos via signed URLs (handled by service role)
-- No direct policy needed - the API generates signed URLs for guests

-- Agents can upload "after" photos
CREATE POLICY storage_agent_update_photos ON storage.objects
  FOR UPDATE
  USING (
    bucket_id = 'signalements-photos'
    AND EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid()
      AND role IN ('admin', 'agent', 'manager')
    )
  );

-- Admins can delete photos
CREATE POLICY storage_admin_delete_photos ON storage.objects
  FOR DELETE
  USING (
    bucket_id = 'signalements-photos'
    AND EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid()
      AND role = 'admin'
    )
  );
