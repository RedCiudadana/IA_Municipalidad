/*
  # Improve handle_new_user function with better error handling

  1. Changes
    - Add better error handling
    - Add ON CONFLICT to prevent failures if profile exists
    - Add exception handling to log errors
  
  2. Security
    - Maintains SECURITY DEFINER for privilege elevation
    - Still secure and only runs on new user creation
*/

-- Recreate the function with better error handling
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
BEGIN
  -- Insert into usuarios with conflict handling
  INSERT INTO public.usuarios (id, email, nombre, cargo, fecha_ingreso)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'nombre', 'Usuario'),
    COALESCE(NEW.raw_user_meta_data->>'cargo', 'Sin cargo'),
    CURRENT_DATE
  )
  ON CONFLICT (id) DO NOTHING;
  
  -- Insert into configuracion_usuario with conflict handling
  INSERT INTO public.configuracion_usuario (usuario_id)
  VALUES (NEW.id)
  ON CONFLICT (usuario_id) DO NOTHING;
  
  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    -- Log the error but don't fail the user creation
    RAISE WARNING 'Error in handle_new_user: %', SQLERRM;
    RETURN NEW;
END;
$$;
