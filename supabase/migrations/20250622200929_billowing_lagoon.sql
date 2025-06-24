/*
  # Learning Space Schema

  1. New Tables
    - `classrooms`
      - `id` (uuid, primary key)
      - `name` (text, not null)
      - `description` (text, syllabus content)
      - `color` (text, hex color)
      - `user_id` (uuid, foreign key to auth.users)
      - `created_at` (timestamp)
    - `modules`
      - `id` (uuid, primary key)
      - `classroom_id` (uuid, foreign key to classrooms)
      - `title` (text, not null)
      - `description` (text, module content)
      - `step_number` (integer, order)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on both tables
    - Users can only access their own classrooms and modules
    - Cascade delete when classrooms are removed

  3. Sample Data
    - Creates dummy classrooms and modules for abcd1234@gmail.com if user exists
*/

-- Create classrooms table
CREATE TABLE IF NOT EXISTS public.classrooms (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text DEFAULT '',
  color text DEFAULT '#3B82F6',
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now()
);

-- Create modules table
CREATE TABLE IF NOT EXISTS public.modules (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  classroom_id uuid NOT NULL REFERENCES public.classrooms(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text DEFAULT '',
  step_number integer NOT NULL DEFAULT 1,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.classrooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.modules ENABLE ROW LEVEL SECURITY;

-- RLS Policies for classrooms
CREATE POLICY "Users can view own classrooms"
  ON public.classrooms
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own classrooms"
  ON public.classrooms
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own classrooms"
  ON public.classrooms
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own classrooms"
  ON public.classrooms
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- RLS Policies for modules
CREATE POLICY "Users can view own modules"
  ON public.modules
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.classrooms 
      WHERE classrooms.id = modules.classroom_id 
      AND classrooms.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert own modules"
  ON public.modules
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.classrooms 
      WHERE classrooms.id = modules.classroom_id 
      AND classrooms.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update own modules"
  ON public.modules
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.classrooms 
      WHERE classrooms.id = modules.classroom_id 
      AND classrooms.user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.classrooms 
      WHERE classrooms.id = modules.classroom_id 
      AND classrooms.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete own modules"
  ON public.modules
  FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.classrooms 
      WHERE classrooms.id = modules.classroom_id 
      AND classrooms.user_id = auth.uid()
    )
  );

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_classrooms_user_id ON public.classrooms(user_id);
CREATE INDEX IF NOT EXISTS idx_modules_classroom_id ON public.modules(classroom_id);
CREATE INDEX IF NOT EXISTS idx_modules_step_number ON public.modules(classroom_id, step_number);

-- Insert dummy data for user abcd1234@gmail.com
-- Note: This will only work if the user exists in auth.users
DO $$
DECLARE
  dummy_user_id uuid;
  classroom1_id uuid;
  classroom2_id uuid;
  classroom3_id uuid;
BEGIN
  -- Try to find the user by email (limit to 1 to avoid multiple rows error)
  SELECT id INTO dummy_user_id 
  FROM auth.users 
  WHERE email = 'abcd1234@gmail.com'
  LIMIT 1;
  
  -- If user exists, create dummy classrooms
  IF dummy_user_id IS NOT NULL THEN
    -- Insert first classroom and get its ID
    INSERT INTO public.classrooms (name, description, color, user_id) 
    VALUES (
      'Introduction to Web Development', 
      'Learn the fundamentals of HTML, CSS, and JavaScript. This comprehensive course covers everything from basic syntax to building interactive web applications. Perfect for beginners who want to start their journey in web development.', 
      '#3B82F6', 
      dummy_user_id
    )
    RETURNING id INTO classroom1_id;
    
    -- Insert second classroom and get its ID
    INSERT INTO public.classrooms (name, description, color, user_id) 
    VALUES (
      'Advanced React Patterns', 
      'Master advanced React concepts including hooks, context, performance optimization, and modern patterns. Dive deep into component composition, state management, and building scalable React applications.', 
      '#10B981', 
      dummy_user_id
    )
    RETURNING id INTO classroom2_id;
    
    -- Insert third classroom and get its ID
    INSERT INTO public.classrooms (name, description, color, user_id) 
    VALUES (
      'Database Design & SQL', 
      'Comprehensive guide to database design principles, normalization, and SQL queries. Learn to design efficient database schemas and write complex queries for real-world applications.', 
      '#F59E0B', 
      dummy_user_id
    )
    RETURNING id INTO classroom3_id;
    
    -- Insert dummy modules for classroom 1
    INSERT INTO public.modules (classroom_id, title, description, step_number) VALUES
    (classroom1_id, 'HTML Fundamentals', 'Learn the basic structure of HTML documents, semantic elements, and best practices for markup.', 1),
    (classroom1_id, 'CSS Styling', 'Master CSS selectors, properties, flexbox, and grid for beautiful responsive designs.', 2),
    (classroom1_id, 'JavaScript Basics', 'Introduction to JavaScript syntax, variables, functions, and DOM manipulation.', 3),
    (classroom1_id, 'Building Your First Website', 'Put it all together to create a complete, responsive website from scratch.', 4);
    
    -- Insert dummy modules for classroom 2
    INSERT INTO public.modules (classroom_id, title, description, step_number) VALUES
    (classroom2_id, 'Advanced Hooks Patterns', 'Deep dive into useCallback, useMemo, useRef, and custom hooks.', 1),
    (classroom2_id, 'Context & State Management', 'Learn when and how to use React Context effectively for state management.', 2),
    (classroom2_id, 'Performance Optimization', 'Techniques for optimizing React apps including code splitting and memoization.', 3);
    
    -- Insert dummy modules for classroom 3
    INSERT INTO public.modules (classroom_id, title, description, step_number) VALUES
    (classroom3_id, 'Database Fundamentals', 'Understanding relational databases, tables, and relationships.', 1),
    (classroom3_id, 'SQL Queries', 'Writing SELECT, INSERT, UPDATE, and DELETE statements with confidence.', 2),
    (classroom3_id, 'Advanced SQL', 'Joins, subqueries, indexes, and query optimization techniques.', 3),
    (classroom3_id, 'Database Design', 'Normalization, schema design, and best practices for scalable databases.', 4);
    
  END IF;
END $$;