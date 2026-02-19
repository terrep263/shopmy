-- Initialize default branding settings if none exist
INSERT INTO "BrandingSettings" (id, primary_color, site_name, created_at, updated_at)
SELECT 
  gen_random_uuid(),
  '#c71f37',
  'Shop My Neighborhood',
  NOW(),
  NOW()
WHERE NOT EXISTS (SELECT 1 FROM "BrandingSettings");
