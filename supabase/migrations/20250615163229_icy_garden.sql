/*
  # YouTube News Schema

  1. New Tables
    - `youtube_channels`
      - `channel_id` (text, primary key)
      - `name` (text, not null)
      - `added_at` (timestamp)
    - `youtube_digests`
      - `video_id` (text, primary key)
      - `channel_id` (text, foreign key)
      - `lang` (enum)
      - `title` (text, not null)
      - `thumbnail` (text)
      - `published_at` (timestamp)
      - `summary` (text, ≤40 words)
      - `article_content` (text, Markdown 500-700 words)
      - `fetched_at` (timestamp)

  2. Security
    - Enable RLS on both tables
    - Public read access for youtube_digests
    - Admin-only access for youtube_channels
*/

-- Create language enum
CREATE TYPE lang_code AS ENUM ('en','ko','es','ja','zh','others');

-- Create youtube_channels table
CREATE TABLE IF NOT EXISTS public.youtube_channels (
  channel_id text PRIMARY KEY,
  name text NOT NULL,
  added_at timestamptz DEFAULT now()
);

-- Create youtube_digests table
CREATE TABLE IF NOT EXISTS public.youtube_digests (
  video_id text PRIMARY KEY,
  channel_id text REFERENCES public.youtube_channels(channel_id) ON DELETE CASCADE,
  lang lang_code DEFAULT 'en',
  title text NOT NULL,
  thumbnail text,
  published_at timestamptz,
  summary text,          -- ≤40 words
  article_content text,  -- Markdown, 500–700 words
  fetched_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.youtube_channels ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.youtube_digests ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Public read youtube_digests"
  ON public.youtube_digests
  FOR SELECT
  USING (true);

CREATE POLICY "Admin full access youtube_channels"
  ON public.youtube_channels
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles 
      WHERE user_id = auth.uid() 
      AND is_paid = true
    )
  );

CREATE POLICY "Admin full access youtube_digests"
  ON public.youtube_digests
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles 
      WHERE user_id = auth.uid() 
      AND is_paid = true
    )
  );

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_youtube_digests_published_at ON public.youtube_digests(published_at DESC);
CREATE INDEX IF NOT EXISTS idx_youtube_digests_channel_id ON public.youtube_digests(channel_id);
CREATE INDEX IF NOT EXISTS idx_youtube_digests_lang ON public.youtube_digests(lang);