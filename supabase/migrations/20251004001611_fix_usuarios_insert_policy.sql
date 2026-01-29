/*
  # Fix RLS policy for user registration

  1. Changes
    - Add INSERT policy to allow users to create their own profile during registration
    - Policy checks that the user is creating a profile for their own auth.uid()
  
  2. Security
    - Users can only insert their own profile (auth.uid() = id)
    - Maintains security while allowing registration
*/

-- Add INSERT policy for usuarios table
CREATE POLICY "Users can insert own profile during registration"
  ON usuarios FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);
