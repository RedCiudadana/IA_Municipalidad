/*
  # Crear usuario demo para pruebas

  1. Usuario Demo
    - Email: demo@redciudadana.org.gt
    - Password: redciudadana2024

  2. Notas
    - Usuario de prueba para el sistema
    - Triggers automáticos crean perfil y configuración
*/

DO $$
DECLARE
  new_user_id uuid;
  existing_user_id uuid;
BEGIN
  SELECT id INTO existing_user_id 
  FROM auth.users 
  WHERE email = 'demo@redciudadana.org.gt';

  IF existing_user_id IS NULL THEN
    new_user_id := gen_random_uuid();

    INSERT INTO auth.users (
      instance_id,
      id,
      aud,
      role,
      email,
      encrypted_password,
      email_confirmed_at,
      raw_app_meta_data,
      raw_user_meta_data,
      created_at,
      updated_at,
      confirmation_token,
      email_change,
      email_change_token_new,
      recovery_token
    ) VALUES (
      '00000000-0000-0000-0000-000000000000',
      new_user_id,
      'authenticated',
      'authenticated',
      'demo@redciudadana.org.gt',
      crypt('redciudadana2024', gen_salt('bf')),
      now(),
      '{"provider":"email","providers":["email"]}',
      jsonb_build_object(
        'nombre', 'Usuario Demo Red Ciudadana',
        'cargo', 'Asesor Jurídico',
        'departamento', 'Departamento Jurídico'
      ),
      now(),
      now(),
      '',
      '',
      '',
      ''
    );

    INSERT INTO auth.identities (
      provider_id,
      user_id,
      identity_data,
      provider,
      last_sign_in_at,
      created_at,
      updated_at
    ) VALUES (
      new_user_id::text,
      new_user_id,
      jsonb_build_object(
        'sub', new_user_id::text,
        'email', 'demo@redciudadana.org.gt',
        'email_verified', true,
        'phone_verified', false
      ),
      'email',
      now(),
      now(),
      now()
    );

    RAISE NOTICE 'Usuario demo creado';
  ELSE
    RAISE NOTICE 'Usuario demo ya existe';
  END IF;

END $$;
