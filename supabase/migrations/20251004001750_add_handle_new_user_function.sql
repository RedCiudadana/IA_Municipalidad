/*
  # Add function to handle new user creation

  1. Changes
    - Create a function that automatically creates user profile
    - This function runs with elevated privileges (security definer)
    - Trigger on auth.users to create profile in usuarios table
  
  2. Security
    - Function is secure and only creates profile for new users
    - RLS policies still apply for normal operations
*/

-- Drop existing policies that might conflict
DROP POLICY IF EXISTS "Users can insert own profile during registration" ON usuarios;

-- Create a function to handle new user creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
BEGIN
  INSERT INTO public.usuarios (id, email, nombre, cargo, fecha_ingreso)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'nombre', 'Usuario'),
    COALESCE(NEW.raw_user_meta_data->>'cargo', 'Sin cargo'),
    CURRENT_DATE
  );
  
  INSERT INTO public.configuracion_usuario (usuario_id)
  VALUES (NEW.id);
  
  RETURN NEW;
END;
$$;

-- Create trigger on auth.users
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();
