/*
  # Initial Schema for Construction Project Transactions

  1. New Tables
    - `projects`
      - `id` (uuid, primary key)
      - `name` (text) - Project name
      - `description` (text) - Project description
      - `start_date` (date) - Project start date
      - `end_date` (date, nullable) - Project end date
      - `budget` (numeric) - Total project budget
      - `user_id` (uuid) - Reference to auth.users
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

    - `transactions`
      - `id` (uuid, primary key)
      - `project_id` (uuid) - Reference to projects
      - `type` (text) - 'INCOME' or 'EXPENSE'
      - `category` (text) - Transaction category
      - `amount` (numeric) - Transaction amount
      - `description` (text) - Transaction description
      - `date` (date) - Transaction date
      - `user_id` (uuid) - Reference to auth.users
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users to manage their own data
*/

-- Create projects table
CREATE TABLE projects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  start_date date NOT NULL,
  end_date date,
  budget numeric NOT NULL DEFAULT 0,
  user_id uuid NOT NULL REFERENCES auth.users(id),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create transactions table
CREATE TABLE transactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  type text NOT NULL CHECK (type IN ('INCOME', 'EXPENSE')),
  category text NOT NULL,
  amount numeric NOT NULL,
  description text,
  date date NOT NULL,
  user_id uuid NOT NULL REFERENCES auth.users(id),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;

-- Create policies for projects
CREATE POLICY "Users can manage their own projects"
  ON projects
  USING (auth.uid() = user_id);

-- Create policies for transactions
CREATE POLICY "Users can manage their own transactions"
  ON transactions
  USING (auth.uid() = user_id);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
CREATE TRIGGER update_projects_updated_at
  BEFORE UPDATE ON projects
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_transactions_updated_at
  BEFORE UPDATE ON transactions
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();