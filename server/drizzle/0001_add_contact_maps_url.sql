-- Optional: link to Google Maps for the school's location (address rows).
ALTER TABLE "tbl_contact_info" ADD COLUMN IF NOT EXISTS "maps_url" text;
