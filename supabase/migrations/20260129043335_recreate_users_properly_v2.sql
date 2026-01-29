/*
  # Recreate Users with Proper Structure
  
  1. Changes
    - Delete existing users and recreate them using proper Supabase methods
    - Ensure all auth schema fields are properly populated
    -confirmed_at is a generated column so it's excluded
    
  2. Security
    - Users remain confirmed and ready to use
    - RLS policies remain intact
*/

-- Delete existing users and their related data
DELETE FROM auth.identities WHERE user_id IN (
  'a1111111-1111-1111-1111-111111111111',
  'b2222222-2222-2222-2222-222222222222',
  'c3333333-3333-3333-3333-333333333333'
);

DELETE FROM configuracion_usuario WHERE usuario_id IN (
  'a1111111-1111-1111-1111-111111111111',
  'b2222222-2222-2222-2222-222222222222',
  'c3333333-3333-3333-3333-333333333333'
);

DELETE FROM usuarios WHERE id IN (
  'a1111111-1111-1111-1111-111111111111',
  'b2222222-2222-2222-2222-222222222222',
  'c3333333-3333-3333-3333-333333333333'
);

DELETE FROM auth.users WHERE id IN (
  'a1111111-1111-1111-1111-111111111111',
  'b2222222-2222-2222-2222-222222222222',
  'c3333333-3333-3333-3333-333333333333'
);

-- Recreate users with updated structure
DO $$
DECLARE
  user1_id uuid := 'a1111111-1111-1111-1111-111111111111'::uuid;
  user2_id uuid := 'b2222222-2222-2222-2222-222222222222'::uuid;
  user3_id uuid := 'c3333333-3333-3333-3333-333333333333'::uuid;
  encrypted_password text;
BEGIN
  -- Generate password hash
  encrypted_password := crypt('redciudadana', gen_salt('bf'));

  -- Insert User 1
  INSERT INTO auth.users (
    id, instance_id, email, encrypted_password,
    email_confirmed_at, created_at, updated_at,
    raw_app_meta_data, raw_user_meta_data,
    aud, role, is_sso_user, is_anonymous
  ) VALUES (
    user1_id,
    '00000000-0000-0000-0000-000000000000',
    'jherrera@redciudadana.org.gt',
    encrypted_password,
    now(), now(), now(),
    '{"provider":"email","providers":["email"]}'::jsonb,
    '{"nombre":"Jorge Herrera","cargo":"Coordinador de Proyecto"}'::jsonb,
    'authenticated', 'authenticated', false, false
  );

  INSERT INTO auth.identities (
    id, user_id, provider_id, provider,
    identity_data, last_sign_in_at, created_at, updated_at
  ) VALUES (
    gen_random_uuid(),
    user1_id,
    user1_id::text,
    'email',
    jsonb_build_object(
      'sub', user1_id::text,
      'email', 'jherrera@redciudadana.org.gt',
      'email_verified', true,
      'provider', 'email'
    ),
    now(), now(), now()
  );

  -- Insert User 2
  INSERT INTO auth.users (
    id, instance_id, email, encrypted_password,
    email_confirmed_at, created_at, updated_at,
    raw_app_meta_data, raw_user_meta_data,
    aud, role, is_sso_user, is_anonymous
  ) VALUES (
    user2_id,
    '00000000-0000-0000-0000-000000000000',
    'municipalidad@muniguate.gob.gt',
    encrypted_password,
    now(), now(), now(),
    '{"provider":"email","providers":["email"]}'::jsonb,
    '{"nombre":"Usuario Municipalidad","cargo":"Abogado Municipal"}'::jsonb,
    'authenticated', 'authenticated', false, false
  );

  INSERT INTO auth.identities (
    id, user_id, provider_id, provider,
    identity_data, last_sign_in_at, created_at, updated_at
  ) VALUES (
    gen_random_uuid(),
    user2_id,
    user2_id::text,
    'email',
    jsonb_build_object(
      'sub', user2_id::text,
      'email', 'municipalidad@muniguate.gob.gt',
      'email_verified', true,
      'provider', 'email'
    ),
    now(), now(), now()
  );

  -- Insert User 3
  INSERT INTO auth.users (
    id, instance_id, email, encrypted_password,
    email_confirmed_at, created_at, updated_at,
    raw_app_meta_data, raw_user_meta_data,
    aud, role, is_sso_user, is_anonymous
  ) VALUES (
    user3_id,
    '00000000-0000-0000-0000-000000000000',
    'admin@muniguate.gob.gt',
    encrypted_password,
    now(), now(), now(),
    '{"provider":"email","providers":["email"]}'::jsonb,
    '{"nombre":"Administrador del Sistema","cargo":"Director Jurídico"}'::jsonb,
    'authenticated', 'authenticated', false, false
  );

  INSERT INTO auth.identities (
    id, user_id, provider_id, provider,
    identity_data, last_sign_in_at, created_at, updated_at
  ) VALUES (
    gen_random_uuid(),
    user3_id,
    user3_id::text,
    'email',
    jsonb_build_object(
      'sub', user3_id::text,
      'email', 'admin@muniguate.gob.gt',
      'email_verified', true,
      'provider', 'email'
    ),
    now(), now(), now()
  );

  -- Create user profiles
  INSERT INTO usuarios (
    id, email, nombre, cargo, departamento, fecha_ingreso
  ) VALUES 
    (user1_id, 'jherrera@redciudadana.org.gt', 'Jorge Herrera', 'Coordinador de Proyecto', 'Red Ciudadana', CURRENT_DATE),
    (user2_id, 'municipalidad@muniguate.gob.gt', 'Usuario Municipalidad', 'Abogado Municipal', 'Departamento Jurídico', CURRENT_DATE),
    (user3_id, 'admin@muniguate.gob.gt', 'Administrador del Sistema', 'Director Jurídico', 'Departamento Jurídico', CURRENT_DATE);

  -- Create user configurations
  INSERT INTO configuracion_usuario (
    usuario_id, notificaciones_email, notificaciones_push, tema, idioma
  ) VALUES 
    (user1_id, true, false, 'claro', 'es'),
    (user2_id, true, false, 'claro', 'es'),
    (user3_id, true, false, 'claro', 'es');

END $$;
