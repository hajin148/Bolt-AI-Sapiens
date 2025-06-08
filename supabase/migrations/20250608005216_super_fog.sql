/*
  # Fix isPaid column naming in user_profiles table

  1. Changes
    - Rename `ispaid` column to `is_paid` for consistency with naming conventions
    - Ensure the column has proper default value and constraints
  
  2. Security
    - No changes to existing RLS policies needed
    - Column rename maintains all existing permissions
*/

-- Rename the ispaid column to is_paid for better naming consistency
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'user_profiles' AND column_name = 'ispaid'
  ) THEN
    ALTER TABLE user_profiles RENAME COLUMN ispaid TO is_paid;
  END IF;
END $$;

-- Ensure the column exists with proper constraints if it doesn't exist yet
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'user_profiles' AND column_name = 'is_paid'
  ) THEN
    ALTER TABLE user_profiles ADD COLUMN is_paid boolean DEFAULT false;
  END IF;
END $$;