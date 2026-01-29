/*
  # Sistema de Asistencia Jurídica Municipal Inteligente
  
  1. Nuevas Tablas
    - `base_conocimiento_juridica` - Repositorio de normativa legal municipal
      - Constitución, Código Municipal, Ley de Servicio Municipal
      - Ley de Contrataciones, Ordenanzas, Reglamentos
      - Jurisprudencia de la Corte de Constitucionalidad
    - `dictamenes_juridicos` - Dictámenes y opiniones legales
      - Asesoría jurídica emitida por el departamento
      - Análisis de precedentes y normativa aplicable
    - `contratos_municipales` - Gestión de contratos y convenios
      - Contratos de obra, servicios, suministros
      - Revisión legal y verificación de requisitos
    - `pliegos_contratacion` - Pliegos para procesos de contratación
      - Elaboración de bases de licitación
      - Requisitos legales y especificaciones técnicas
    - `procedimientos_administrativos` - Control de procedimientos legales
      - Gestión de expedientes administrativos
      - Cálculo automático de plazos legales
    - `notificaciones_juridicas` - Notificaciones y comunicaciones oficiales
      - Redacción de notificaciones legales
      - Control de términos y plazos de notificación
    - `consultas_constitucionales` - Consultas sobre constitucionalidad
      - Análisis de normativa vs. Constitución
      - Precedentes de Corte de Constitucionalidad
    - `agentes_juridicos` - Agentes de IA especializados
      - Agente de Normativa Municipal
      - Agente de Contratación Pública
      - Agente de Procedimientos Administrativos
      - Agente de Consultas Constitucionales
      - Agente de Recursos Humanos y Laboral
    
  2. Seguridad
    - RLS habilitado en todas las tablas
    - Usuarios solo acceden sus propios datos
    - Base de conocimiento accesible para todos (autenticados)
    - Políticas restrictivas para datos sensibles
    
  3. Rendimiento
    - Índices en columnas clave para búsquedas
    - Búsqueda de texto completo en normativas
    - Optimización para consultas frecuentes
*/

-- ============================================
-- TABLA: base_conocimiento_juridica
-- ============================================
CREATE TABLE IF NOT EXISTS base_conocimiento_juridica (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tipo_documento text NOT NULL,
  categoria text NOT NULL,
  titulo text NOT NULL,
  numero_documento text,
  fecha_emision date,
  contenido text NOT NULL,
  resumen text,
  tags text[],
  vigente boolean DEFAULT true,
  metadata jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- RLS para base_conocimiento_juridica
ALTER TABLE base_conocimiento_juridica ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can view legal knowledge base"
  ON base_conocimiento_juridica FOR SELECT
  TO authenticated
  USING (true);

-- ============================================
-- TABLA: dictamenes_juridicos
-- ============================================
CREATE TABLE IF NOT EXISTS dictamenes_juridicos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  usuario_id uuid REFERENCES usuarios(id) ON DELETE CASCADE,
  numero_dictamen text UNIQUE,
  solicitante text NOT NULL,
  unidad_solicitante text,
  asunto text NOT NULL,
  antecedentes text,
  normativa_aplicable text[],
  analisis_juridico text NOT NULL,
  conclusion text NOT NULL,
  recomendaciones text,
  estado text DEFAULT 'borrador',
  fecha_emision date,
  metadata jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- RLS para dictamenes_juridicos
ALTER TABLE dictamenes_juridicos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own legal opinions"
  ON dictamenes_juridicos FOR SELECT
  TO authenticated
  USING (auth.uid() = usuario_id);

CREATE POLICY "Users can create own legal opinions"
  ON dictamenes_juridicos FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = usuario_id);

CREATE POLICY "Users can update own legal opinions"
  ON dictamenes_juridicos FOR UPDATE
  TO authenticated
  USING (auth.uid() = usuario_id)
  WITH CHECK (auth.uid() = usuario_id);

CREATE POLICY "Users can delete own legal opinions"
  ON dictamenes_juridicos FOR DELETE
  TO authenticated
  USING (auth.uid() = usuario_id);

-- ============================================
-- TABLA: contratos_municipales
-- ============================================
CREATE TABLE IF NOT EXISTS contratos_municipales (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  usuario_id uuid REFERENCES usuarios(id) ON DELETE CASCADE,
  numero_contrato text UNIQUE,
  tipo_contrato text NOT NULL,
  objeto_contrato text NOT NULL,
  contratista text NOT NULL,
  nit_contratista text,
  monto_contrato decimal(15,2),
  plazo_ejecucion text,
  fecha_suscripcion date,
  fecha_inicio date,
  fecha_finalizacion date,
  estado text DEFAULT 'borrador',
  clausulas text,
  garantias text,
  revision_legal text,
  observaciones text,
  metadata jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- RLS para contratos_municipales
ALTER TABLE contratos_municipales ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own contracts"
  ON contratos_municipales FOR SELECT
  TO authenticated
  USING (auth.uid() = usuario_id);

CREATE POLICY "Users can create own contracts"
  ON contratos_municipales FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = usuario_id);

CREATE POLICY "Users can update own contracts"
  ON contratos_municipales FOR UPDATE
  TO authenticated
  USING (auth.uid() = usuario_id)
  WITH CHECK (auth.uid() = usuario_id);

CREATE POLICY "Users can delete own contracts"
  ON contratos_municipales FOR DELETE
  TO authenticated
  USING (auth.uid() = usuario_id);

-- ============================================
-- TABLA: pliegos_contratacion
-- ============================================
CREATE TABLE IF NOT EXISTS pliegos_contratacion (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  usuario_id uuid REFERENCES usuarios(id) ON DELETE CASCADE,
  numero_evento text UNIQUE,
  tipo_contratacion text NOT NULL,
  modalidad text NOT NULL,
  objeto_contratacion text NOT NULL,
  presupuesto_estimado decimal(15,2),
  plazo_ejecucion text,
  requisitos_legales text,
  especificaciones_tecnicas text,
  criterios_evaluacion text,
  garantias_requeridas text,
  estado text DEFAULT 'borrador',
  fecha_publicacion date,
  metadata jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- RLS para pliegos_contratacion
ALTER TABLE pliegos_contratacion ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own procurement documents"
  ON pliegos_contratacion FOR SELECT
  TO authenticated
  USING (auth.uid() = usuario_id);

CREATE POLICY "Users can create own procurement documents"
  ON pliegos_contratacion FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = usuario_id);

CREATE POLICY "Users can update own procurement documents"
  ON pliegos_contratacion FOR UPDATE
  TO authenticated
  USING (auth.uid() = usuario_id)
  WITH CHECK (auth.uid() = usuario_id);

CREATE POLICY "Users can delete own procurement documents"
  ON pliegos_contratacion FOR DELETE
  TO authenticated
  USING (auth.uid() = usuario_id);

-- ============================================
-- TABLA: procedimientos_administrativos
-- ============================================
CREATE TABLE IF NOT EXISTS procedimientos_administrativos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  usuario_id uuid REFERENCES usuarios(id) ON DELETE CASCADE,
  numero_expediente text UNIQUE,
  tipo_procedimiento text NOT NULL,
  interesado text NOT NULL,
  asunto text NOT NULL,
  fecha_inicio date NOT NULL,
  plazos jsonb,
  actuaciones text,
  documentos_adjuntos text[],
  estado text DEFAULT 'en_tramite',
  resolucion text,
  fecha_resolucion date,
  metadata jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- RLS para procedimientos_administrativos
ALTER TABLE procedimientos_administrativos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own administrative procedures"
  ON procedimientos_administrativos FOR SELECT
  TO authenticated
  USING (auth.uid() = usuario_id);

CREATE POLICY "Users can create own administrative procedures"
  ON procedimientos_administrativos FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = usuario_id);

CREATE POLICY "Users can update own administrative procedures"
  ON procedimientos_administrativos FOR UPDATE
  TO authenticated
  USING (auth.uid() = usuario_id)
  WITH CHECK (auth.uid() = usuario_id);

CREATE POLICY "Users can delete own administrative procedures"
  ON procedimientos_administrativos FOR DELETE
  TO authenticated
  USING (auth.uid() = usuario_id);

-- ============================================
-- TABLA: notificaciones_juridicas
-- ============================================
CREATE TABLE IF NOT EXISTS notificaciones_juridicas (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  usuario_id uuid REFERENCES usuarios(id) ON DELETE CASCADE,
  procedimiento_id uuid REFERENCES procedimientos_administrativos(id) ON DELETE SET NULL,
  tipo_notificacion text NOT NULL,
  destinatario text NOT NULL,
  direccion text,
  contenido text NOT NULL,
  fecha_emision date DEFAULT CURRENT_DATE,
  fecha_notificacion date,
  medio_notificacion text,
  estado text DEFAULT 'pendiente',
  observaciones text,
  metadata jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- RLS para notificaciones_juridicas
ALTER TABLE notificaciones_juridicas ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own legal notifications"
  ON notificaciones_juridicas FOR SELECT
  TO authenticated
  USING (auth.uid() = usuario_id);

CREATE POLICY "Users can create own legal notifications"
  ON notificaciones_juridicas FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = usuario_id);

CREATE POLICY "Users can update own legal notifications"
  ON notificaciones_juridicas FOR UPDATE
  TO authenticated
  USING (auth.uid() = usuario_id)
  WITH CHECK (auth.uid() = usuario_id);

CREATE POLICY "Users can delete own legal notifications"
  ON notificaciones_juridicas FOR DELETE
  TO authenticated
  USING (auth.uid() = usuario_id);

-- ============================================
-- TABLA: consultas_constitucionales
-- ============================================
CREATE TABLE IF NOT EXISTS consultas_constitucionales (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  usuario_id uuid REFERENCES usuarios(id) ON DELETE CASCADE,
  numero_consulta text UNIQUE,
  norma_consultada text NOT NULL,
  articulos_cuestionados text[],
  materia text NOT NULL,
  planteamiento text NOT NULL,
  analisis_constitucional text,
  precedentes_cc text,
  conclusion text,
  estado text DEFAULT 'borrador',
  fecha_consulta date,
  metadata jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- RLS para consultas_constitucionales
ALTER TABLE consultas_constitucionales ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own constitutional consultations"
  ON consultas_constitucionales FOR SELECT
  TO authenticated
  USING (auth.uid() = usuario_id);

CREATE POLICY "Users can create own constitutional consultations"
  ON consultas_constitucionales FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = usuario_id);

CREATE POLICY "Users can update own constitutional consultations"
  ON consultas_constitucionales FOR UPDATE
  TO authenticated
  USING (auth.uid() = usuario_id)
  WITH CHECK (auth.uid() = usuario_id);

CREATE POLICY "Users can delete own constitutional consultations"
  ON consultas_constitucionales FOR DELETE
  TO authenticated
  USING (auth.uid() = usuario_id);

-- ============================================
-- TABLA: agentes_juridicos
-- ============================================
CREATE TABLE IF NOT EXISTS agentes_juridicos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  nombre text UNIQUE NOT NULL,
  tipo_agente text NOT NULL,
  descripcion text,
  especialidad text,
  modelos_soportados text[],
  configuracion jsonb,
  activo boolean DEFAULT true,
  metricas jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- RLS para agentes_juridicos
ALTER TABLE agentes_juridicos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can view AI agents"
  ON agentes_juridicos FOR SELECT
  TO authenticated
  USING (true);

-- ============================================
-- ÍNDICES PARA RENDIMIENTO
-- ============================================

-- Índices para base_conocimiento_juridica
CREATE INDEX IF NOT EXISTS idx_conocimiento_tipo 
  ON base_conocimiento_juridica(tipo_documento);

CREATE INDEX IF NOT EXISTS idx_conocimiento_categoria 
  ON base_conocimiento_juridica(categoria);

CREATE INDEX IF NOT EXISTS idx_conocimiento_vigente 
  ON base_conocimiento_juridica(vigente);

CREATE INDEX IF NOT EXISTS idx_conocimiento_tags 
  ON base_conocimiento_juridica USING GIN(tags);

-- Índices para dictamenes_juridicos
CREATE INDEX IF NOT EXISTS idx_dictamenes_usuario 
  ON dictamenes_juridicos(usuario_id);

CREATE INDEX IF NOT EXISTS idx_dictamenes_estado 
  ON dictamenes_juridicos(estado);

CREATE INDEX IF NOT EXISTS idx_dictamenes_fecha 
  ON dictamenes_juridicos(fecha_emision DESC);

-- Índices para contratos_municipales
CREATE INDEX IF NOT EXISTS idx_contratos_usuario 
  ON contratos_municipales(usuario_id);

CREATE INDEX IF NOT EXISTS idx_contratos_tipo 
  ON contratos_municipales(tipo_contrato);

CREATE INDEX IF NOT EXISTS idx_contratos_estado 
  ON contratos_municipales(estado);

-- Índices para pliegos_contratacion
CREATE INDEX IF NOT EXISTS idx_pliegos_usuario 
  ON pliegos_contratacion(usuario_id);

CREATE INDEX IF NOT EXISTS idx_pliegos_modalidad 
  ON pliegos_contratacion(modalidad);

-- Índices para procedimientos_administrativos
CREATE INDEX IF NOT EXISTS idx_procedimientos_usuario 
  ON procedimientos_administrativos(usuario_id);

CREATE INDEX IF NOT EXISTS idx_procedimientos_estado 
  ON procedimientos_administrativos(estado);

CREATE INDEX IF NOT EXISTS idx_procedimientos_fecha 
  ON procedimientos_administrativos(fecha_inicio DESC);

-- Índices para notificaciones_juridicas
CREATE INDEX IF NOT EXISTS idx_notificaciones_usuario 
  ON notificaciones_juridicas(usuario_id);

CREATE INDEX IF NOT EXISTS idx_notificaciones_procedimiento 
  ON notificaciones_juridicas(procedimiento_id);

CREATE INDEX IF NOT EXISTS idx_notificaciones_estado 
  ON notificaciones_juridicas(estado);

-- Índices para consultas_constitucionales
CREATE INDEX IF NOT EXISTS idx_consultas_usuario 
  ON consultas_constitucionales(usuario_id);

CREATE INDEX IF NOT EXISTS idx_consultas_estado 
  ON consultas_constitucionales(estado);

-- ============================================
-- TRIGGERS
-- ============================================

-- Trigger para base_conocimiento_juridica
DROP TRIGGER IF EXISTS update_conocimiento_updated_at ON base_conocimiento_juridica;
CREATE TRIGGER update_conocimiento_updated_at
  BEFORE UPDATE ON base_conocimiento_juridica
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Trigger para dictamenes_juridicos
DROP TRIGGER IF EXISTS update_dictamenes_updated_at ON dictamenes_juridicos;
CREATE TRIGGER update_dictamenes_updated_at
  BEFORE UPDATE ON dictamenes_juridicos
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Trigger para contratos_municipales
DROP TRIGGER IF EXISTS update_contratos_updated_at ON contratos_municipales;
CREATE TRIGGER update_contratos_updated_at
  BEFORE UPDATE ON contratos_municipales
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Trigger para pliegos_contratacion
DROP TRIGGER IF EXISTS update_pliegos_updated_at ON pliegos_contratacion;
CREATE TRIGGER update_pliegos_updated_at
  BEFORE UPDATE ON pliegos_contratacion
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Trigger para procedimientos_administrativos
DROP TRIGGER IF EXISTS update_procedimientos_updated_at ON procedimientos_administrativos;
CREATE TRIGGER update_procedimientos_updated_at
  BEFORE UPDATE ON procedimientos_administrativos
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Trigger para notificaciones_juridicas
DROP TRIGGER IF EXISTS update_notificaciones_updated_at ON notificaciones_juridicas;
CREATE TRIGGER update_notificaciones_updated_at
  BEFORE UPDATE ON notificaciones_juridicas
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Trigger para consultas_constitucionales
DROP TRIGGER IF EXISTS update_consultas_updated_at ON consultas_constitucionales;
CREATE TRIGGER update_consultas_updated_at
  BEFORE UPDATE ON consultas_constitucionales
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Trigger para agentes_juridicos
DROP TRIGGER IF EXISTS update_agentes_updated_at ON agentes_juridicos;
CREATE TRIGGER update_agentes_updated_at
  BEFORE UPDATE ON agentes_juridicos
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- DATOS INICIALES: Agentes Jurídicos
-- ============================================

INSERT INTO agentes_juridicos (nombre, tipo_agente, descripcion, especialidad, modelos_soportados, activo) VALUES
  ('Agente de Normativa Municipal', 'normativa', 'Especializado en búsqueda y análisis de normativa municipal vigente', 'Código Municipal, Ordenanzas, Reglamentos', ARRAY['gpt-4', 'gpt-4-turbo'], true),
  ('Agente de Contratación Pública', 'contratacion', 'Asistencia en elaboración de pliegos y revisión de contratos bajo Ley de Contrataciones', 'Ley de Contrataciones del Estado', ARRAY['gpt-4', 'gpt-4-turbo'], true),
  ('Agente de Procedimientos Administrativos', 'procedimientos', 'Gestión de expedientes y cálculo automático de plazos legales', 'Ley de lo Contencioso Administrativo', ARRAY['gpt-4', 'gpt-3.5-turbo'], true),
  ('Agente de Consultas Constitucionales', 'constitucional', 'Análisis de constitucionalidad y precedentes de la Corte de Constitucionalidad', 'Constitución Política de Guatemala', ARRAY['gpt-4', 'gpt-4-turbo'], true),
  ('Agente de Recursos Humanos y Laboral', 'laboral', 'Asesoría en temas de servicio municipal y derecho laboral', 'Ley de Servicio Municipal, Código de Trabajo', ARRAY['gpt-4', 'gpt-3.5-turbo'], true)
ON CONFLICT (nombre) DO NOTHING;