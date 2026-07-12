-- Ensure user settings columns exist
ALTER TABLE users
ADD COLUMN IF NOT EXISTS reminder_enabled boolean DEFAULT true,
ADD COLUMN IF NOT EXISTS reminder_time text DEFAULT '09:00',
ADD COLUMN IF NOT EXISTS summary_enabled boolean DEFAULT true;
