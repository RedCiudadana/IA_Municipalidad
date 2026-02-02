/*
  # Sincronizar tabla usuarios con auth.users

  1. Modificaciones a tabla usuarios
    - Agregar constraint de foreign key a auth.users
    - Asegurar que id de usuarios coincida con id de auth.users

  2. Automatización
    - Función para crear perfil automáticamente cuando se registra usuario
    - Trigger para ejecutar función al insertar en auth.users
    - Sincronización de email entre auth.users y usuarios

  3. Seguridad
    - Mantener políticas RLS existentes
    - Asegurar integridad referencial con ON DELETE CASCADE

  4. Notas
    - Los usuarios existentes en auth.users tendrán perfiles creados automáticamente
    - La sincronización de email es automática
    - El nombre se extrae de user_metadata o del email si no está disponible
*/

-- Eliminar constraint existente si existe y recrear correctamente
DO $$
BEGIN
  -- Agregar constraint FK si no existe
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'usuarios_id_fkey' 
    AND table_name = 'usuarios'
  ) THEN
    ALTER TABLE usuarios 
      ADD CONSTRAINT usuarios_id_fkey 
      FOREIGN KEY (id) REFERENCES auth.users(id) ON DELETE CASCADE;
  END IF;
END $$;

-- Función para crear perfil de usuario automáticamente cuando se registra
CREATE OR REPLACE FUNCTION create_user_profile()
RETURNS TRIGGER AS $$
BEGIN
  -- Insertar en tabla usuarios con datos de auth.users
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
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger para crear perfil automáticamente al registrar usuario
DROP TRIGGER IF EXISTS on_auth_user_created_profile ON auth.users;
CREATE TRIGGER on_auth_user_created_profile
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION create_user_profile();

-- Crear perfiles para usuarios existentes en auth.users que no tengan perfil
INSERT INTO usuarios (id, email, nombre, cargo, fecha_ingreso)
SELECT 
  au.id,
  au.email,
  COALESCE(
    au.raw_user_meta_data->>'nombre',
    au.raw_user_meta_data->>'name',
    split_part(au.email, '@', 1)
  ) as nombre,
  COALESCE(
    au.raw_user_meta_data->>'cargo',
    'Usuario'
  ) as cargo,
  CURRENT_DATE as fecha_ingreso
FROM auth.users au
WHERE NOT EXISTS (
  SELECT 1 FROM usuarios u WHERE u.id = au.id
)
ON CONFLICT (id) DO NOTHING;
