/*
  # Crear tabla configuracion_usuario

  1. Nueva Tabla
    - `configuracion_usuario`
      - `id` (uuid, primary key)
      - `usuario_id` (uuid, foreign key a auth.users, unique)
      - Notificaciones:
        - `notificaciones_email` (boolean, default true)
        - `notificaciones_push` (boolean, default false)
        - `notificaciones_documentos` (boolean, default true)
        - `notificaciones_actualizaciones` (boolean, default true)
      - Privacidad:
        - `perfil_publico` (boolean, default false)
        - `mostrar_actividad` (boolean, default true)
        - `compartir_estadisticas` (boolean, default false)
      - Apariencia:
        - `tema` (text, default 'claro')
        - `idioma` (text, default 'es')
        - `tamano_fuente` (text, default 'medio')
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Seguridad
    - Habilitar RLS en tabla configuracion_usuario
    - Política para usuarios autenticados puedan ver su configuración
    - Política para usuarios autenticados puedan insertar su configuración
    - Política para usuarios autenticados puedan actualizar su configuración

  3. Automatización
    - Función para crear configuración automáticamente al crear usuario
    - Trigger para ejecutar función al insertar en auth.users
*/

CREATE TABLE IF NOT EXISTS configuracion_usuario (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  usuario_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,

  -- Notificaciones
  notificaciones_email boolean DEFAULT true,
  notificaciones_push boolean DEFAULT false,
  notificaciones_documentos boolean DEFAULT true,
  notificaciones_actualizaciones boolean DEFAULT true,

  -- Privacidad
  perfil_publico boolean DEFAULT false,
  mostrar_actividad boolean DEFAULT true,
  compartir_estadisticas boolean DEFAULT false,

  -- Apariencia
  tema text DEFAULT 'claro' CHECK (tema IN ('claro', 'oscuro')),
  idioma text DEFAULT 'es' CHECK (idioma IN ('es', 'en')),
  tamano_fuente text DEFAULT 'medio' CHECK (tamano_fuente IN ('pequeno', 'medio', 'grande')),

  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Índices para mejorar rendimiento
CREATE INDEX IF NOT EXISTS idx_configuracion_usuario_id ON configuracion_usuario(usuario_id);

-- Habilitar Row Level Security
ALTER TABLE configuracion_usuario ENABLE ROW LEVEL SECURITY;

-- Política: Usuarios pueden ver su propia configuración
CREATE POLICY "Usuarios pueden ver su configuracion"
  ON configuracion_usuario FOR SELECT
  TO authenticated
  USING (auth.uid() = usuario_id);

-- Política: Usuarios pueden insertar su propia configuración
CREATE POLICY "Usuarios pueden insertar su configuracion"
  ON configuracion_usuario FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = usuario_id);

-- Política: Usuarios pueden actualizar su propia configuración
CREATE POLICY "Usuarios pueden actualizar su configuracion"
  ON configuracion_usuario FOR UPDATE
  TO authenticated
  USING (auth.uid() = usuario_id)
  WITH CHECK (auth.uid() = usuario_id);

-- Función para crear configuración automáticamente cuando se crea un usuario
CREATE OR REPLACE FUNCTION create_user_config()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO configuracion_usuario (usuario_id)
  VALUES (NEW.id)
  ON CONFLICT (usuario_id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger para crear configuración automáticamente al crear usuario en auth.users
DROP TRIGGER IF EXISTS on_auth_user_created_config ON auth.users;
CREATE TRIGGER on_auth_user_created_config
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION create_user_config();
