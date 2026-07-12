-- Add prediction columns to subjects table
ALTER TABLE subjects
ADD COLUMN IF NOT EXISTS predicted_score integer,
ADD COLUMN IF NOT EXISTS prediction_status text,
ADD COLUMN IF NOT EXISTS prediction_action text,
ADD COLUMN IF NOT EXISTS prediction_updated_at timestamptz;
