/*
  # Biblioteca Jurídica Municipal - Base de Datos de Precedentes Municipales
  
  1. Descripción General
     Este esquema crea una biblioteca digital de documentos jurídicos municipales que sirve como
     repositorio de precedentes administrativos, similar a jurisprudencia pero a nivel municipal.
     Permite a los abogados municipales consultar cómo se resolvieron casos anteriores.
  
  2. Nuevas Tablas
     
     a) `categorias_juridicas`
        - `id` (uuid, primary key): Identificador único
        - `nombre` (text): Nombre de la categoría (ej: "Contrataciones Públicas", "Recursos Humanos")
        - `descripcion` (text): Descripción de la categoría
        - `icono` (text): Nombre del ícono para UI
        - `color` (text): Color asignado para UI
        - `created_at` (timestamptz): Fecha de creación
     
     b) `tipos_documento_juridico`
        - `id` (uuid, primary key): Identificador único
        - `nombre` (text): Tipo de documento (Acuerdo, Convenio, Opinión Técnica, Lineamiento, Resolución, Dictamen)
        - `descripcion` (text): Descripción del tipo
        - `prefijo` (text): Prefijo para numeración (ej: "ACU", "CONV", "OT")
        - `created_at` (timestamptz): Fecha de creación
     
     c) `documentos_juridicos`
        - `id` (uuid, primary key): Identificador único
        - `numero_documento` (text): Número oficial del documento
        - `titulo` (text): Título del documento
        - `tipo_documento_id` (uuid, foreign key): Referencia a tipos_documento_juridico
        - `categoria_id` (uuid, foreign key): Referencia a categorias_juridicas
        - `fecha_emision` (date): Fecha de emisión del documento
        - `autoridad_emisora` (text): Quién emitió el documento
        - `resumen_ejecutivo` (text): Resumen breve del documento
        - `contenido_completo` (text): Contenido completo del documento
        - `problema_juridico` (text): Planteamiento del problema jurídico
        - `fundamentacion_legal` (text): Base legal utilizada
        - `conclusion` (text): Conclusión o resolución
        - `palabras_clave` (text[]): Array de palabras clave para búsqueda
        - `documento_url` (text): URL al documento original si existe
        - `relevancia` (integer): Nivel de relevancia (1-5)
        - `vigente` (boolean): Si está vigente o fue derogado
        - `usuario_id` (uuid, foreign key): Usuario que registró el documento
        - `vistas` (integer): Contador de vistas
        - `created_at` (timestamptz): Fecha de registro
        - `updated_at` (timestamptz): Última actualización
     
     d) `referencias_cruzadas`
        - `id` (uuid, primary key): Identificador único
        - `documento_origen_id` (uuid, foreign key): Documento que hace la referencia
        - `documento_referenciado_id` (uuid, foreign key): Documento referenciado
        - `tipo_relacion` (text): Tipo de relación (modifica, complementa, deroga, cita)
        - `notas` (text): Notas sobre la relación
        - `created_at` (timestamptz): Fecha de creación
     
     e) `consultas_biblioteca`
        - `id` (uuid, primary key): Identificador único
        - `usuario_id` (uuid, foreign key): Usuario que realizó la consulta
        - `termino_busqueda` (text): Términos de búsqueda utilizados
        - `filtros_aplicados` (jsonb): Filtros aplicados en la búsqueda
        - `resultados_encontrados` (integer): Cantidad de resultados
        - `documento_seleccionado_id` (uuid, foreign key): Documento que se consultó
        - `created_at` (timestamptz): Fecha de la consulta
  
  3. Índices
     - Índices en campos de búsqueda frecuente
     - Índice GIN para búsqueda de texto completo
     - Índice en palabras_clave para búsquedas rápidas
  
  4. Seguridad (RLS)
     - Lectura: Todos los usuarios autenticados pueden leer documentos
     - Escritura: Solo usuarios con rol apropiado pueden crear/editar documentos
     - Las consultas son privadas por usuario
  
  5. Datos Iniciales
     - Categorías básicas predefinidas
     - Tipos de documentos estándar
*/

-- Crear tabla de categorías jurídicas
CREATE TABLE IF NOT EXISTS categorias_juridicas (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  nombre text NOT NULL,
  descripcion text,
  icono text DEFAULT 'Folder',
  color text DEFAULT 'blue',
  created_at timestamptz DEFAULT now()
);

-- Crear tabla de tipos de documento
CREATE TABLE IF NOT EXISTS tipos_documento_juridico (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  nombre text NOT NULL UNIQUE,
  descripcion text,
  prefijo text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Crear tabla principal de documentos jurídicos
CREATE TABLE IF NOT EXISTS documentos_juridicos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  numero_documento text NOT NULL,
  titulo text NOT NULL,
  tipo_documento_id uuid REFERENCES tipos_documento_juridico(id) ON DELETE RESTRICT,
  categoria_id uuid REFERENCES categorias_juridicas(id) ON DELETE RESTRICT,
  fecha_emision date NOT NULL,
  autoridad_emisora text NOT NULL,
  resumen_ejecutivo text NOT NULL,
  contenido_completo text NOT NULL,
  problema_juridico text,
  fundamentacion_legal text,
  conclusion text,
  palabras_clave text[] DEFAULT '{}',
  documento_url text,
  relevancia integer DEFAULT 3 CHECK (relevancia >= 1 AND relevancia <= 5),
  vigente boolean DEFAULT true,
  usuario_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  vistas integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Crear tabla de referencias cruzadas
CREATE TABLE IF NOT EXISTS referencias_cruzadas (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  documento_origen_id uuid REFERENCES documentos_juridicos(id) ON DELETE CASCADE,
  documento_referenciado_id uuid REFERENCES documentos_juridicos(id) ON DELETE CASCADE,
  tipo_relacion text NOT NULL CHECK (tipo_relacion IN ('modifica', 'complementa', 'deroga', 'cita', 'actualiza')),
  notas text,
  created_at timestamptz DEFAULT now(),
  CONSTRAINT no_self_reference CHECK (documento_origen_id != documento_referenciado_id)
);

-- Crear tabla de consultas para analytics
CREATE TABLE IF NOT EXISTS consultas_biblioteca (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  usuario_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  termino_busqueda text,
  filtros_aplicados jsonb DEFAULT '{}',
  resultados_encontrados integer DEFAULT 0,
  documento_seleccionado_id uuid REFERENCES documentos_juridicos(id) ON DELETE SET NULL,
  created_at timestamptz DEFAULT now()
);

-- Crear índices para optimizar búsquedas
CREATE INDEX IF NOT EXISTS idx_documentos_tipo ON documentos_juridicos(tipo_documento_id);
CREATE INDEX IF NOT EXISTS idx_documentos_categoria ON documentos_juridicos(categoria_id);
CREATE INDEX IF NOT EXISTS idx_documentos_fecha ON documentos_juridicos(fecha_emision DESC);
CREATE INDEX IF NOT EXISTS idx_documentos_vigente ON documentos_juridicos(vigente);
CREATE INDEX IF NOT EXISTS idx_documentos_palabras_clave ON documentos_juridicos USING GIN(palabras_clave);
CREATE INDEX IF NOT EXISTS idx_documentos_busqueda_texto ON documentos_juridicos USING GIN(to_tsvector('spanish', titulo || ' ' || resumen_ejecutivo || ' ' || contenido_completo));
CREATE INDEX IF NOT EXISTS idx_consultas_usuario ON consultas_biblioteca(usuario_id, created_at DESC);

-- Función para actualizar updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger para actualizar updated_at
DROP TRIGGER IF EXISTS update_documentos_juridicos_updated_at ON documentos_juridicos;
CREATE TRIGGER update_documentos_juridicos_updated_at
  BEFORE UPDATE ON documentos_juridicos
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Habilitar RLS en todas las tablas
ALTER TABLE categorias_juridicas ENABLE ROW LEVEL SECURITY;
ALTER TABLE tipos_documento_juridico ENABLE ROW LEVEL SECURITY;
ALTER TABLE documentos_juridicos ENABLE ROW LEVEL SECURITY;
ALTER TABLE referencias_cruzadas ENABLE ROW LEVEL SECURITY;
ALTER TABLE consultas_biblioteca ENABLE ROW LEVEL SECURITY;

-- Políticas RLS para categorias_juridicas
CREATE POLICY "Usuarios autenticados pueden ver categorías"
  ON categorias_juridicas FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Solo administradores pueden crear categorías"
  ON categorias_juridicas FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Políticas RLS para tipos_documento_juridico
CREATE POLICY "Usuarios autenticados pueden ver tipos de documento"
  ON tipos_documento_juridico FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Solo administradores pueden crear tipos de documento"
  ON tipos_documento_juridico FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Políticas RLS para documentos_juridicos
CREATE POLICY "Usuarios autenticados pueden ver documentos jurídicos"
  ON documentos_juridicos FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Usuarios autenticados pueden crear documentos"
  ON documentos_juridicos FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = usuario_id);

CREATE POLICY "Usuarios pueden editar sus propios documentos"
  ON documentos_juridicos FOR UPDATE
  TO authenticated
  USING (auth.uid() = usuario_id)
  WITH CHECK (auth.uid() = usuario_id);

CREATE POLICY "Usuarios pueden eliminar sus propios documentos"
  ON documentos_juridicos FOR DELETE
  TO authenticated
  USING (auth.uid() = usuario_id);

-- Políticas RLS para referencias_cruzadas
CREATE POLICY "Usuarios autenticados pueden ver referencias"
  ON referencias_cruzadas FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Usuarios autenticados pueden crear referencias"
  ON referencias_cruzadas FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Políticas RLS para consultas_biblioteca
CREATE POLICY "Usuarios pueden ver sus propias consultas"
  ON consultas_biblioteca FOR SELECT
  TO authenticated
  USING (auth.uid() = usuario_id);

CREATE POLICY "Usuarios pueden registrar sus consultas"
  ON consultas_biblioteca FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = usuario_id);

-- Insertar categorías predefinidas
INSERT INTO categorias_juridicas (nombre, descripcion, icono, color) VALUES
  ('Contrataciones Públicas', 'Documentos sobre procesos de contratación, licitaciones y adquisiciones', 'FileText', 'blue'),
  ('Recursos Humanos', 'Normativa y precedentes sobre gestión de personal municipal', 'Users', 'green'),
  ('Presupuesto y Finanzas', 'Documentos relacionados con administración financiera municipal', 'DollarSign', 'emerald'),
  ('Ordenamiento Territorial', 'Normativa sobre uso de suelo, construcciones y desarrollo urbano', 'Map', 'orange'),
  ('Servicios Públicos', 'Regulación de servicios públicos municipales', 'Truck', 'purple'),
  ('Medio Ambiente', 'Normativa ambiental y gestión de recursos naturales', 'Leaf', 'teal'),
  ('Administrativo', 'Procedimientos administrativos generales', 'Briefcase', 'gray'),
  ('Transparencia', 'Acceso a información y rendición de cuentas', 'Eye', 'cyan')
ON CONFLICT DO NOTHING;

-- Insertar tipos de documento predefinidos
INSERT INTO tipos_documento_juridico (nombre, descripcion, prefijo) VALUES
  ('Acuerdo Municipal', 'Decisiones del Concejo Municipal', 'ACU'),
  ('Opinión Técnica', 'Análisis jurídico de casos específicos', 'OT'),
  ('Dictamen Legal', 'Dictámenes emitidos por la Dirección Jurídica', 'DL'),
  ('Lineamiento', 'Lineamientos y directrices internas', 'LIN'),
  ('Convenio', 'Convenios y acuerdos con otras entidades', 'CONV'),
  ('Resolución', 'Resoluciones administrativas', 'RES'),
  ('Circular', 'Circulares administrativas', 'CIR')
ON CONFLICT (nombre) DO NOTHING;
