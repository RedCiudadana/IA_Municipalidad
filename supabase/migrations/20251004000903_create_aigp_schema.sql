/*
  # Creación de esquema completo AIGP-SEGEPLAN

  1. Nuevas Tablas
    - `usuarios` - Información de usuarios del sistema
      - Almacena datos personales y profesionales
      - Incluye nombre, cargo, departamento, contacto
    - `documentos` - Documentos generados por los agentes
      - Registro de todos los documentos creados
      - Incluye contenido, destinatario, asunto, estado
      - Metadata en formato JSON para flexibilidad
    - `transacciones_api` - Registro de transacciones con OpenAI
      - Bitácora completa de llamadas API
      - Tracking de tokens, costos y duración
      - Permite análisis de uso y optimización
    - `configuracion_usuario` - Configuración personalizada
      - Preferencias de notificaciones
      - Configuración de privacidad
      - Preferencias de apariencia (tema, idioma, fuente)
    - `estadisticas_agentes` - Estadísticas agregadas por agente
      - Métricas diarias de uso por agente
      - Totales de usos, tokens, costos
      - Promedios y usuarios únicos

  2. Seguridad
    - Habilitar RLS en todas las tablas
    - Políticas restrictivas: usuarios solo acceden sus propios datos
    - Políticas de SELECT, INSERT, UPDATE, DELETE separadas
    - Estadísticas agregadas visibles para todos (autenticados)

  3. Rendimiento
    - Índices en columnas frecuentemente consultadas
    - Índices compuestos para búsquedas complejas
    - Optimización de consultas con foreign keys

  4. Notas Importantes
    - Todos los IDs son UUID v4 generados automáticamente
    - Timestamps automáticos para auditoría
    - Cascada en eliminación para integridad referencial
    - Constraints UNIQUE donde corresponde
*/

-- ============================================
-- TABLA: usuarios
-- ============================================
CREATE TABLE IF NOT EXISTS usuarios (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  nombre text NOT NULL,
  cargo text,
  departamento text,
  telefono text,
  ubicacion text,
  biografia text,
  fecha_ingreso date,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- RLS para usuarios
ALTER TABLE usuarios ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile"
  ON usuarios FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON usuarios FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- ============================================
-- TABLA: documentos
-- ============================================
CREATE TABLE IF NOT EXISTS documentos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  usuario_id uuid REFERENCES usuarios(id) ON DELETE CASCADE,
  tipo_documento text NOT NULL,
  titulo text NOT NULL,
  contenido text NOT NULL,
  destinatario text,
  cargo_destinatario text,
  institucion text,
  asunto text,
  estado text DEFAULT 'borrador',
  metadata jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- RLS para documentos
ALTER TABLE documentos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own documents"
  ON documentos FOR SELECT
  TO authenticated
  USING (auth.uid() = usuario_id);

CREATE POLICY "Users can create own documents"
  ON documentos FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = usuario_id);

CREATE POLICY "Users can update own documents"
  ON documentos FOR UPDATE
  TO authenticated
  USING (auth.uid() = usuario_id)
  WITH CHECK (auth.uid() = usuario_id);

CREATE POLICY "Users can delete own documents"
  ON documentos FOR DELETE
  TO authenticated
  USING (auth.uid() = usuario_id);

-- ============================================
-- TABLA: transacciones_api
-- ============================================
CREATE TABLE IF NOT EXISTS transacciones_api (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  usuario_id uuid REFERENCES usuarios(id) ON DELETE CASCADE,
  documento_id uuid REFERENCES documentos(id) ON DELETE SET NULL,
  agente text NOT NULL,
  modelo text NOT NULL,
  tokens_entrada integer DEFAULT 0,
  tokens_salida integer DEFAULT 0,
  tokens_total integer DEFAULT 0,
  costo decimal(10,4) DEFAULT 0,
  duracion decimal(10,2),
  estado text DEFAULT 'exitoso',
  error_mensaje text,
  created_at timestamptz DEFAULT now()
);

-- RLS para transacciones_api
ALTER TABLE transacciones_api ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own transactions"
  ON transacciones_api FOR SELECT
  TO authenticated
  USING (auth.uid() = usuario_id);

CREATE POLICY "Users can create own transactions"
  ON transacciones_api FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = usuario_id);

-- ============================================
-- TABLA: configuracion_usuario
-- ============================================
CREATE TABLE IF NOT EXISTS configuracion_usuario (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  usuario_id uuid REFERENCES usuarios(id) ON DELETE CASCADE UNIQUE,
  notificaciones_email boolean DEFAULT true,
  notificaciones_push boolean DEFAULT false,
  notificaciones_documentos boolean DEFAULT true,
  notificaciones_actualizaciones boolean DEFAULT true,
  perfil_publico boolean DEFAULT false,
  mostrar_actividad boolean DEFAULT true,
  compartir_estadisticas boolean DEFAULT false,
  tema text DEFAULT 'claro',
  idioma text DEFAULT 'es',
  tamano_fuente text DEFAULT 'medio',
  updated_at timestamptz DEFAULT now()
);

-- RLS para configuracion_usuario
ALTER TABLE configuracion_usuario ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own config"
  ON configuracion_usuario FOR SELECT
  TO authenticated
  USING (auth.uid() = usuario_id);

CREATE POLICY "Users can insert own config"
  ON configuracion_usuario FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = usuario_id);

CREATE POLICY "Users can update own config"
  ON configuracion_usuario FOR UPDATE
  TO authenticated
  USING (auth.uid() = usuario_id)
  WITH CHECK (auth.uid() = usuario_id);

-- ============================================
-- TABLA: estadisticas_agentes
-- ============================================
CREATE TABLE IF NOT EXISTS estadisticas_agentes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  agente_id text NOT NULL,
  fecha date NOT NULL,
  total_usos integer DEFAULT 0,
  total_tokens integer DEFAULT 0,
  total_costo decimal(10,4) DEFAULT 0,
  usuarios_unicos integer DEFAULT 0,
  duracion_promedio decimal(10,2),
  created_at timestamptz DEFAULT now(),
  UNIQUE(agente_id, fecha)
);

-- RLS para estadisticas_agentes
ALTER TABLE estadisticas_agentes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can view aggregated stats"
  ON estadisticas_agentes FOR SELECT
  TO authenticated
  USING (true);

-- ============================================
-- ÍNDICES PARA RENDIMIENTO
-- ============================================

-- Índices para documentos
CREATE INDEX IF NOT EXISTS idx_documentos_usuario 
  ON documentos(usuario_id);

CREATE INDEX IF NOT EXISTS idx_documentos_tipo 
  ON documentos(tipo_documento);

CREATE INDEX IF NOT EXISTS idx_documentos_fecha 
  ON documentos(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_documentos_estado 
  ON documentos(estado);

-- Índices para transacciones_api
CREATE INDEX IF NOT EXISTS idx_transacciones_usuario 
  ON transacciones_api(usuario_id);

CREATE INDEX IF NOT EXISTS idx_transacciones_fecha 
  ON transacciones_api(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_transacciones_agente 
  ON transacciones_api(agente);

CREATE INDEX IF NOT EXISTS idx_transacciones_estado 
  ON transacciones_api(estado);

-- Índices para estadisticas_agentes
CREATE INDEX IF NOT EXISTS idx_estadisticas_agente_fecha 
  ON estadisticas_agentes(agente_id, fecha DESC);

-- Índice para configuracion_usuario
CREATE INDEX IF NOT EXISTS idx_config_usuario 
  ON configuracion_usuario(usuario_id);

-- ============================================
-- FUNCIONES Y TRIGGERS
-- ============================================

-- Función para actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger para usuarios
DROP TRIGGER IF EXISTS update_usuarios_updated_at ON usuarios;
CREATE TRIGGER update_usuarios_updated_at
  BEFORE UPDATE ON usuarios
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Trigger para documentos
DROP TRIGGER IF EXISTS update_documentos_updated_at ON documentos;
CREATE TRIGGER update_documentos_updated_at
  BEFORE UPDATE ON documentos
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Trigger para configuracion_usuario
DROP TRIGGER IF EXISTS update_configuracion_updated_at ON configuracion_usuario;
CREATE TRIGGER update_configuracion_updated_at
  BEFORE UPDATE ON configuracion_usuario
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
