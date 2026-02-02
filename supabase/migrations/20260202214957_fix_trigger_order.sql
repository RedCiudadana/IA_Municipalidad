/*
  # Corregir orden de triggers para creación de usuario

  1. Problema
    - El trigger create_user_config se ejecuta antes que create_user_profile
    - configuracion_usuario tiene FK a usuarios, causando error

  2. Solución
    - Eliminar trigger create_user_config
    - Modificar create_user_profile para crear ambos (perfil y config)
    - O crear trigger con prioridad correcta

  3. Implementación
    - Unificar creación de perfil y configuración en un solo trigger
*/

-- Eliminar triggers existentes
DROP TRIGGER IF EXISTS on_auth_user_created_config ON auth.users;
DROP TRIGGER IF EXISTS on_auth_user_created_profile ON auth.users;

-- Función unificada para crear perfil y configuración
CREATE OR REPLACE FUNCTION create_user_profile_and_config()
RETURNS TRIGGER AS $$
BEGIN
  -- Primero crear perfil en tabla usuarios
  INSERT INTO usuarios (
    id, 
    email, 
    nombre, 
    cargo,
    fecha_ingreso
  )
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(
      NEW.raw_user_meta_data->>'nombre',
      NEW.raw_user_meta_data->>'name', 
      split_part(NEW.email, '@', 1)
    ),
    COALESCE(
      NEW.raw_user_meta_data->>'cargo',
      'Usuario'
    ),
    CURRENT_DATE
  )
  ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    nombre = COALESCE(EXCLUDED.nombre, usuarios.nombre),
    updated_at = now();

  -- Luego crear configuración
  INSERT INTO configuracion_usuario (usuario_id)
  VALUES (NEW.id)
  ON CONFLICT (usuario_id) DO NOTHING;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Crear trigger unificado
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION create_user_profile_and_config();
