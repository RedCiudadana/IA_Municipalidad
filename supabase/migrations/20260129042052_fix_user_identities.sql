/*
  # Corregir identidades de usuarios
  
  1. Problema
    - Los usuarios creados manualmente no tienen registros en auth.identities
    - Supabase requiere registros de identidad para la autenticación
    
  2. Solución
    - Crear registros de identidad para cada usuario existente
    - Vincular identidades con método de autenticación email
    
  3. Seguridad
    - Mantiene la integridad de la autenticación
    - Permite login correcto de usuarios
*/

-- Insertar identidades para usuarios existentes
DO $$
DECLARE
  user_record RECORD;
BEGIN
  -- Iterar sobre usuarios sin identidad
  FOR user_record IN 
    SELECT u.id, u.email, u.encrypted_password, u.created_at, u.updated_at
    FROM auth.users u
    LEFT JOIN auth.identities i ON u.id = i.user_id
    WHERE i.id IS NULL
    AND u.email IN ('jherrera@redciudadana.org.gt', 'municipalidad@muniguate.gob.gt', 'admin@muniguate.gob.gt')
  LOOP
    -- Insertar identidad para cada usuario
    INSERT INTO auth.identities (
      id,
      user_id,
      identity_data,
      provider,
      provider_id,
      last_sign_in_at,
      created_at,
      updated_at
    ) VALUES (
      gen_random_uuid(),
      user_record.id,
      jsonb_build_object(
        'sub', user_record.id::text,
        'email', user_record.email,
        'email_verified', true,
        'provider', 'email'
      ),
      'email',
      user_record.id::text,
      user_record.created_at,
      user_record.created_at,
      user_record.updated_at
    )
    ON CONFLICT DO NOTHING;
  END LOOP;
END $$;