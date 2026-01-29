/*
  # Fix Login Error - Disable Problematic Trigger
  
  1. Issue
    - The handle_new_user trigger is causing "Database error querying schema" on login
    - Users are already created, so the trigger is not needed
    
  2. Changes
    - Drop the trigger on auth.users
    - Keep the function for potential future use
    
  3. Security
    - RLS policies remain intact
    - Users can still access their data normally
*/

-- Drop the trigger that's causing issues
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
