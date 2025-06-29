/*
  # Module Progress Tracking

  1. New Tables
    - `module_progress`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to auth.users)
      - `module_id` (uuid, foreign key to modules)
      - `is_completed` (boolean, default false)
      - `completed_at` (timestamp, nullable)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on module_progress table
    - Users can only access their own progress records

  3. Performance
    - Add indexes for user_id and module_id queries
    - Unique constraint on (user_id, module_id)
*/

-- Create module_progress table
CREATE TABLE IF NOT EXISTS public.module_progress (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  module_id uuid NOT NULL REFERENCES public.modules(id) ON DELETE CASCADE,
  is_completed boolean NOT NULL DEFAULT false,
  completed_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id, module_id)
);

-- Enable RLS
ALTER TABLE public.module_progress ENABLE ROW LEVEL SECURITY;

-- RLS Policies for module_progress
CREATE POLICY "Users can view own progress"
  ON public.module_progress
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own progress"
  ON public.module_progress
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own progress"
  ON public.module_progress
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own progress"
  ON public.module_progress
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_module_progress_user_id ON public.module_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_module_progress_module_id ON public.module_progress(module_id);
CREATE INDEX IF NOT EXISTS idx_module_progress_completed ON public.module_progress(user_id, is_completed);

-- Create trigger for updated_at
DROP TRIGGER IF EXISTS update_module_progress_updated_at ON public.module_progress;
CREATE TRIGGER update_module_progress_updated_at
    BEFORE UPDATE ON public.module_progress
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();