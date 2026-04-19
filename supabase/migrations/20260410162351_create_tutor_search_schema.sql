
/*
  # Tutor Search App - Initial Schema

  ## Overview
  This migration creates the initial database schema for a tutor search application in Bishkek.

  ## New Tables

  ### subject_categories
  - `id` (uuid, primary key)
  - `name` (text) - Category name (e.g., "Иностранные языки", "Школьные предметы")
  - `name_en` (text) - English version
  - `sort_order` (int) - Display order
  - `created_at` (timestamp)

  ### subjects
  - `id` (uuid, primary key)
  - `category_id` (uuid) - Foreign key to subject_categories
  - `name` (text) - Subject name in Russian
  - `name_en` (text) - English version
  - `sort_order` (int)
  - `created_at` (timestamp)

  ### tutor_profiles
  - `id` (uuid, primary key, FK to auth.users)
  - `full_name` (text)
  - `bio` (text)
  - `phone` (text)
  - `district` (text) - District in Bishkek
  - `experience_years` (int)
  - `price_per_hour` (int) - KGS per hour
  - `photo_url` (text)
  - `is_online` (bool) - Can teach online
  - `is_home` (bool) - Can come to student's home
  - `is_verified` (bool) - Admin verified
  - `is_active` (bool)
  - `created_at` (timestamp)
  - `updated_at` (timestamp)

  ### tutor_subjects
  - Many-to-many between tutor_profiles and subjects

  ## Security
  - RLS enabled on all tables
  - Public read for categories, subjects
  - Authenticated read for tutor_profiles (active ones publicly readable)
  - Tutors can only manage their own profile
*/

-- Subject categories
CREATE TABLE IF NOT EXISTS subject_categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  name_en text NOT NULL,
  sort_order int DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE subject_categories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read subject categories"
  ON subject_categories FOR SELECT
  TO anon, authenticated
  USING (true);

-- Subjects
CREATE TABLE IF NOT EXISTS subjects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id uuid REFERENCES subject_categories(id) ON DELETE CASCADE,
  name text NOT NULL,
  name_en text NOT NULL,
  sort_order int DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE subjects ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read subjects"
  ON subjects FOR SELECT
  TO anon, authenticated
  USING (true);

-- Tutor profiles
CREATE TABLE IF NOT EXISTS tutor_profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name text NOT NULL DEFAULT '',
  bio text DEFAULT '',
  phone text DEFAULT '',
  district text DEFAULT '',
  experience_years int DEFAULT 0,
  price_per_hour int DEFAULT 0,
  photo_url text DEFAULT '',
  is_online bool DEFAULT true,
  is_home bool DEFAULT false,
  is_verified bool DEFAULT false,
  is_active bool DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE tutor_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active tutor profiles"
  ON tutor_profiles FOR SELECT
  TO anon, authenticated
  USING (is_active = true);

CREATE POLICY "Tutors can insert own profile"
  ON tutor_profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Tutors can update own profile"
  ON tutor_profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Tutor subjects (many-to-many)
CREATE TABLE IF NOT EXISTS tutor_subjects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tutor_id uuid REFERENCES tutor_profiles(id) ON DELETE CASCADE,
  subject_id uuid REFERENCES subjects(id) ON DELETE CASCADE,
  UNIQUE(tutor_id, subject_id)
);

ALTER TABLE tutor_subjects ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view tutor subjects"
  ON tutor_subjects FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Tutors can insert own subjects"
  ON tutor_subjects FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = tutor_id);

CREATE POLICY "Tutors can delete own subjects"
  ON tutor_subjects FOR DELETE
  TO authenticated
  USING (auth.uid() = tutor_id);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_subjects_category ON subjects(category_id);
CREATE INDEX IF NOT EXISTS idx_tutor_subjects_tutor ON tutor_subjects(tutor_id);
CREATE INDEX IF NOT EXISTS idx_tutor_subjects_subject ON tutor_subjects(subject_id);
CREATE INDEX IF NOT EXISTS idx_tutor_profiles_active ON tutor_profiles(is_active);

-- Seed subject categories
INSERT INTO subject_categories (name, name_en, sort_order) VALUES
  ('Иностранные языки', 'Foreign Languages', 1),
  ('Школьные предметы', 'School Subjects', 2),
  ('Математика и точные науки', 'Math & Exact Sciences', 3),
  ('Университетские предметы', 'University Subjects', 4),
  ('Подготовка к экзаменам', 'Exam Preparation', 5)
  ('Логопед', 'Speech therapist', 6)
  
ON CONFLICT DO NOTHING;

-- Seed subjects
DO $$
DECLARE
  v_lang_id uuid;
  v_school_id uuid;
  v_math_id uuid;
  v_uni_id uuid;
  v_arts_id uuid;
  v_exam_id uuid;
BEGIN
  SELECT id INTO v_lang_id FROM subject_categories WHERE name_en = 'Foreign Languages';
  SELECT id INTO v_school_id FROM subject_categories WHERE name_en = 'School Subjects';
  SELECT id INTO v_math_id FROM subject_categories WHERE name_en = 'Math & Exact Sciences';
  SELECT id INTO v_uni_id FROM subject_categories WHERE name_en = 'University Subjects';
  SELECT id INTO v_arts_id FROM subject_categories WHERE name_en = 'Music & Arts';
  SELECT id INTO v_exam_id FROM subject_categories WHERE name_en = 'Exam Preparation';

  -- Foreign Languages
  INSERT INTO subjects (category_id, name, name_en, sort_order) VALUES
    (v_lang_id, 'Английский язык', 'English', 1),
    (v_lang_id, 'Немецкий язык', 'German', 2),
    (v_lang_id, 'Китайский язык', 'Chinese', 3),
    (v_lang_id, 'Русский язык', 'Russian', 4),
    (v_lang_id, 'Кыргызский язык', 'Kyrgyz', 5),
    (v_lang_id, 'Турецкий язык', 'Turkish', 6),
    (v_lang_id, 'Японский язык', 'Japanese', 7)
  ON CONFLICT DO NOTHING;

  -- School Subjects
  INSERT INTO subjects (category_id, name, name_en, sort_order) VALUES
    (v_school_id, 'Математика', 'Mathematics', 1),
    (v_school_id, 'Физика', 'Physics', 2),
    (v_school_id, 'Химия', 'Chemistry', 3),
    (v_school_id, 'Биология', 'Biology', 4),
    (v_school_id, 'История', 'History', 5),
    (v_school_id, 'География', 'Geography', 6),
    (v_school_id, 'Литература', 'Literature', 7),
    (v_school_id, 'Геометрия', 'Geometry', 8),
    (v_school_id, 'Информатика', 'Computer Science', 9),
    (v_school_id, 'Обществознание', 'Social Studies', 10)
  ON CONFLICT DO NOTHING;

  -- Math & Exact Sciences
  INSERT INTO subjects (category_id, name, name_en, sort_order) VALUES
    (v_math_id, 'Алгебра', 'Algebra', 1),
    (v_math_id, 'Тригонометрия', 'Trigonometry', 2),
    (v_math_id, 'Статистика', 'Statistics', 3),
    (v_math_id, 'Программирование', 'Programming', 4),
    (v_math_id, 'Робототехника', 'Robotics', 5)
  ON CONFLICT DO NOTHING;

  -- University Subjects
  INSERT INTO subjects (category_id, name, name_en, sort_order) VALUES
    (v_uni_id, 'Высшая математика', 'Calculus', 1),
    (v_uni_id, 'Экономика', 'Economics', 2),
    (v_uni_id, 'Бухгалтерский учет', 'Accounting', 3),
    (v_uni_id, 'Право', 'Law', 4),
    (v_uni_id, 'Психология', 'Psychology', 5)
  ON CONFLICT DO NOTHING;

  -- Music & Arts
  INSERT INTO subjects (category_id, name, name_en, sort_order) VALUES
    (v_arts_id, 'Фортепиано', 'Piano', 1),
    (v_arts_id, 'Гитара', 'Guitar', 2),
    (v_arts_id, 'Вокал', 'Vocals', 3),
    (v_arts_id, 'Рисование', 'Drawing', 4),
    (v_arts_id, 'Скрипка', 'Violin', 5)
  ON CONFLICT DO NOTHING;

  -- Exam Preparation
  INSERT INTO subjects (category_id, name, name_en, sort_order) VALUES
    (v_exam_id, 'Подготовка к ОРТ', 'ORT Preparation', 1),
    (v_exam_id, 'Подготовка к IELTS', 'IELTS Preparation', 2),
    (v_exam_id, 'Подготовка к TOEFL', 'TOEFL Preparation', 3),
    (v_exam_id, 'Подготовка к SAT', 'SAT Preparation', 4),
    (v_exam_id, 'Подготовка к ЕГЭ', 'EGE Preparation', 5)
  ON CONFLICT DO NOTHING;
END $$;
