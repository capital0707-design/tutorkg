/*
  # Create sessions table for Jitsi Meet video meetings

  1. New Tables
    - `sessions`
      - `id` (uuid, primary key)
      - `tutor_id` (uuid, foreign key to tutor profile)
      - `student_id` (uuid, foreign key to student user)
      - `room_name` (text, unique Jitsi room identifier)
      - `title` (text, meeting title)
      - `scheduled_at` (timestamp, when meeting is scheduled)
      - `started_at` (timestamp, when meeting started)
      - `ended_at` (timestamp, when meeting ended)
      - `status` (text, scheduled/in_progress/completed/cancelled)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on `sessions` table
    - Tutors can create and manage their sessions
    - Students can view and join their assigned sessions
*/

CREATE TABLE IF NOT EXISTS sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tutor_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  student_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  room_name text UNIQUE NOT NULL,
  title text NOT NULL,
  scheduled_at timestamptz NOT NULL,
  started_at timestamptz,
  ended_at timestamptz,
  status text NOT NULL DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'in_progress', 'completed', 'cancelled')),
  created_at timestamptz DEFAULT now()
);

ALTER TABLE sessions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Tutors can create and manage their sessions"
  ON sessions FOR ALL
  TO authenticated
  USING (auth.uid() = tutor_id)
  WITH CHECK (auth.uid() = tutor_id);

CREATE POLICY "Students can view their sessions"
  ON sessions FOR SELECT
  TO authenticated
  USING (auth.uid() = student_id);

CREATE POLICY "Students cannot modify sessions"
  ON sessions FOR INSERT
  TO authenticated
  WITH CHECK (false);

CREATE INDEX idx_sessions_tutor ON sessions(tutor_id);
CREATE INDEX idx_sessions_student ON sessions(student_id);
CREATE INDEX idx_sessions_status ON sessions(status);
