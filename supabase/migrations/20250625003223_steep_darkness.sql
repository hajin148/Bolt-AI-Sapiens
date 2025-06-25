/*
  # Prompt System Schema

  1. New Tables
    - `prompt_sessions`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to auth.users)
      - `main_prompt` (text, Gemini가 추출한 핵심 학습 주제)
      - `title` (text, 세션 제목)
      - `tags` (text[], 태그 배열)
      - `is_favorited` (boolean, 즐겨찾기 여부)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    - `prompt_messages`
      - `id` (uuid, primary key)
      - `session_id` (uuid, foreign key to prompt_sessions)
      - `sender` (enum, 'user' 또는 'ai')
      - `content` (text, 메시지 내용)
      - `created_at` (timestamp)
    - `learning_space_links`
      - `id` (uuid, primary key)
      - `prompt_session_id` (uuid, foreign key to prompt_sessions)
      - `classroom_id` (uuid, foreign key to classrooms)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on all tables
    - Users can only access their own sessions and messages

  3. Performance
    - Add indexes for session_id and user_id queries
*/

-- Create sender enum if not exists
DO $$ BEGIN
    CREATE TYPE message_sender AS ENUM ('user', 'ai');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Create prompt_sessions table
CREATE TABLE IF NOT EXISTS public.prompt_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  main_prompt text,
  title text NOT NULL DEFAULT 'New Conversation',
  tags text[] DEFAULT '{}',
  is_favorited boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create prompt_messages table
CREATE TABLE IF NOT EXISTS public.prompt_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id uuid NOT NULL REFERENCES public.prompt_sessions(id) ON DELETE CASCADE,
  sender message_sender NOT NULL,
  content text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create learning_space_links table
CREATE TABLE IF NOT EXISTS public.learning_space_links (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  prompt_session_id uuid NOT NULL REFERENCES public.prompt_sessions(id) ON DELETE CASCADE,
  classroom_id uuid NOT NULL REFERENCES public.classrooms(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.prompt_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.prompt_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.learning_space_links ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DO $$
BEGIN
  -- Drop prompt_sessions policies
  DROP POLICY IF EXISTS "Users can view own sessions" ON public.prompt_sessions;
  DROP POLICY IF EXISTS "Users can insert own sessions" ON public.prompt_sessions;
  DROP POLICY IF EXISTS "Users can update own sessions" ON public.prompt_sessions;
  DROP POLICY IF EXISTS "Users can delete own sessions" ON public.prompt_sessions;
  
  -- Drop prompt_messages policies
  DROP POLICY IF EXISTS "Users can view own messages" ON public.prompt_messages;
  DROP POLICY IF EXISTS "Users can insert own messages" ON public.prompt_messages;
  DROP POLICY IF EXISTS "Users can update own messages" ON public.prompt_messages;
  DROP POLICY IF EXISTS "Users can delete own messages" ON public.prompt_messages;
  
  -- Drop learning_space_links policies
  DROP POLICY IF EXISTS "Users can view own links" ON public.learning_space_links;
  DROP POLICY IF EXISTS "Users can insert own links" ON public.learning_space_links;
  DROP POLICY IF EXISTS "Users can delete own links" ON public.learning_space_links;
END $$;

-- RLS Policies for prompt_sessions
CREATE POLICY "Users can view own sessions"
  ON public.prompt_sessions
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own sessions"
  ON public.prompt_sessions
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own sessions"
  ON public.prompt_sessions
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own sessions"
  ON public.prompt_sessions
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- RLS Policies for prompt_messages
CREATE POLICY "Users can view own messages"
  ON public.prompt_messages
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.prompt_sessions 
      WHERE prompt_sessions.id = prompt_messages.session_id 
      AND prompt_sessions.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert own messages"
  ON public.prompt_messages
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.prompt_sessions 
      WHERE prompt_sessions.id = prompt_messages.session_id 
      AND prompt_sessions.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update own messages"
  ON public.prompt_messages
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.prompt_sessions 
      WHERE prompt_sessions.id = prompt_messages.session_id 
      AND prompt_sessions.user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.prompt_sessions 
      WHERE prompt_sessions.id = prompt_messages.session_id 
      AND prompt_sessions.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete own messages"
  ON public.prompt_messages
  FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.prompt_sessions 
      WHERE prompt_sessions.id = prompt_messages.session_id 
      AND prompt_sessions.user_id = auth.uid()
    )
  );

-- RLS Policies for learning_space_links
CREATE POLICY "Users can view own links"
  ON public.learning_space_links
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.prompt_sessions 
      WHERE prompt_sessions.id = learning_space_links.prompt_session_id 
      AND prompt_sessions.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert own links"
  ON public.learning_space_links
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.prompt_sessions 
      WHERE prompt_sessions.id = learning_space_links.prompt_session_id 
      AND prompt_sessions.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete own links"
  ON public.learning_space_links
  FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.prompt_sessions 
      WHERE prompt_sessions.id = learning_space_links.prompt_session_id 
      AND prompt_sessions.user_id = auth.uid()
    )
  );

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_prompt_sessions_user_id ON public.prompt_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_prompt_sessions_updated_at ON public.prompt_sessions(updated_at DESC);
CREATE INDEX IF NOT EXISTS idx_prompt_messages_session_id ON public.prompt_messages(session_id);
CREATE INDEX IF NOT EXISTS idx_prompt_messages_created_at ON public.prompt_messages(session_id, created_at);
CREATE INDEX IF NOT EXISTS idx_learning_space_links_session ON public.learning_space_links(prompt_session_id);
CREATE INDEX IF NOT EXISTS idx_learning_space_links_classroom ON public.learning_space_links(classroom_id);

-- Create or replace trigger function for updating updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for prompt_sessions
DROP TRIGGER IF EXISTS update_prompt_sessions_updated_at ON public.prompt_sessions;
CREATE TRIGGER update_prompt_sessions_updated_at
    BEFORE UPDATE ON public.prompt_sessions
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();