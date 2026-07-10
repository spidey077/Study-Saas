-- Add language and subscription_tier columns to users table
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS language TEXT DEFAULT 'english' CHECK (language IN ('english', 'urdu')),
ADD COLUMN IF NOT EXISTS subscription_tier TEXT DEFAULT 'free' CHECK (subscription_tier IN ('free', 'tier1', 'tier2')),
ADD COLUMN IF NOT EXISTS role TEXT DEFAULT 'user' CHECK (role IN ('user', 'admin'));

-- Add exam_type column to subjects table
ALTER TABLE subjects 
ADD COLUMN IF NOT EXISTS exam_type TEXT DEFAULT 'pakistani' CHECK (exam_type IN ('pakistani', 'international'));

-- Add specific_exam column to subjects table for exam-specific subject validation
ALTER TABLE subjects
ADD COLUMN IF NOT EXISTS specific_exam TEXT;

-- Add index on exam_type for faster queries
CREATE INDEX IF NOT EXISTS idx_subjects_exam_type ON subjects(exam_type);

-- Add index on specific_exam for faster queries
CREATE INDEX IF NOT EXISTS idx_subjects_specific_exam ON subjects(specific_exam);

-- Add index on language for faster queries
CREATE INDEX IF NOT EXISTS idx_users_language ON users(language);

-- Add index on subscription_tier for faster queries
CREATE INDEX IF NOT EXISTS idx_users_subscription_tier ON users(subscription_tier);

-- Add index on role for faster queries
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
