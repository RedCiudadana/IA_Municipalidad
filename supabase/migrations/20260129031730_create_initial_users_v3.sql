/*
  # Crear Usuarios Iniciales del Sistema
  
  1. Usuarios Creados
    - jherrera@redciudadana.org.gt (Administrador Red Ciudadana)
    - municipalidad@muniguate.gob.gt (Usuario Municipalidad)
    - admin@muniguate.gob.gt (Administrador del Sistema)
    
  2. Seguridad
    - Contraseñas encriptadas usando crypt de pgcrypto
    - Usuarios confirmados automáticamente
    - Perfiles de usuario creados en tabla usuarios
    
  3. Notas
    - Los usuarios pueden cambiar sus contraseñas desde la interfaz
    - Todos los usuarios tienen acceso completo al sistema
    - Contraseña para todos: redciudadana
*/

-- Habilitar extensión pgcrypto si no está habilitada
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Insertar usuarios en auth.users
DO $$
DECLARE
  user1_id uuid := 'a1111111-1111-1111-1111-111111111111'::uuid;
  user2_id uuid := 'b2222222-2222-2222-2222-222222222222'::uuid;
  user3_id uuid := 'c3333333-3333-3333-3333-333333333333'::uuid;
  encrypted_password text;
  user_exists boolean;
BEGIN
  -- Encriptar la contraseña 'redciudadana'
  encrypted_password := crypt('redciudadana', gen_salt('bf'));

  -- Usuario 1: jherrera@redciudadana.org.gt
  SELECT EXISTS(SELECT 1 FROM auth.users WHERE email = 'jherrera@redciudadana.org.gt') INTO user_exists;
  IF NOT user_exists THEN
    INSERT INTO auth.users (
      id,
      instance_id,
      email,
      encrypted_password,
      email_confirmed_at,
      created_at,
      updated_at,
      raw_app_meta_data,
      raw_user_meta_data,
      aud,
      role,
      is_sso_user
    ) VALUES (
      user1_id,
      '00000000-0000-0000-0000-000000000000',
      'jherrera@redciudadana.org.gt',
      encrypted_password,
      now(),
      now(),
      now(),
      '{"provider":"email","providers":["email"]}'::jsonb,
      '{"nombre":"Jorge Herrera"}'::jsonb,
      'authenticated',
      'authenticated',
      false
    );
  END IF;

  -- Usuario 2: municipalidad@muniguate.gob.gt
  SELECT EXISTS(SELECT 1 FROM auth.users WHERE email = 'municipalidad@muniguate.gob.gt') INTO user_exists;
  IF NOT user_exists THEN
    INSERT INTO auth.users (
      id,
      instance_id,
      email,
      encrypted_password,
      email_confirmed_at,
      created_at,
      updated_at,
      raw_app_meta_data,
      raw_user_meta_data,
      aud,
      role,
      is_sso_user
    ) VALUES (
      user2_id,
      '00000000-0000-0000-0000-000000000000',
      'municipalidad@muniguate.gob.gt',
      encrypted_password,
      now(),
      now(),
      now(),
      '{"provider":"email","providers":["email"]}'::jsonb,
      '{"nombre":"Usuario Municipalidad"}'::jsonb,
      'authenticated',
      'authenticated',
      false
    );
  END IF;

  -- Usuario 3: admin@muniguate.gob.gt
  SELECT EXISTS(SELECT 1 FROM auth.users WHERE email = 'admin@muniguate.gob.gt') INTO user_exists;
  IF NOT user_exists THEN
    INSERT INTO auth.users (
      id,
      instance_id,
      email,
      encrypted_password,
      email_confirmed_at,
      created_at,
      updated_at,
      raw_app_meta_data,
      raw_user_meta_data,
      aud,
      role,
      is_sso_user
    ) VALUES (
      user3_id,
      '00000000-0000-0000-0000-000000000000',
      'admin@muniguate.gob.gt',
      encrypted_password,
      now(),
      now(),
      now(),
      '{"provider":"email","providers":["email"]}'::jsonb,
      '{"nombre":"Administrador"}'::jsonb,
      'authenticated',
      'authenticated',
      false
    );
  END IF;

  -- Crear perfiles en tabla usuarios
  INSERT INTO usuarios (
    id,
    email,
    nombre,
    cargo,
    departamento,
    fecha_ingreso
  ) VALUES 
    (
      user1_id,
      'jherrera@redciudadana.org.gt',
      'Jorge Herrera',
      'Coordinador de Proyecto',
      'Red Ciudadana',
      CURRENT_DATE
    ),
    (
      user2_id,
      'municipalidad@muniguate.gob.gt',
      'Usuario Municipalidad',
      'Abogado Municipal',
      'Departamento Jurídico',
      CURRENT_DATE
    ),
    (
      user3_id,
      'admin@muniguate.gob.gt',
      'Administrador del Sistema',
      'Director Jurídico',
      'Departamento Jurídico',
      CURRENT_DATE
    )
  ON CONFLICT (id) DO UPDATE SET
    nombre = EXCLUDED.nombre,
    cargo = EXCLUDED.cargo,
    departamento = EXCLUDED.departamento;

  -- Crear configuración por defecto para cada usuario
  INSERT INTO configuracion_usuario (
    usuario_id,
    notificaciones_email,
    notificaciones_push,
    tema,
    idioma
  ) VALUES 
    (user1_id, true, false, 'claro', 'es'),
    (user2_id, true, false, 'claro', 'es'),
    (user3_id, true, false, 'claro', 'es')
  ON CONFLICT (usuario_id) DO NOTHING;

END $$;