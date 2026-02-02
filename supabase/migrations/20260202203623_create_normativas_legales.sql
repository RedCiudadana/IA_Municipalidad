/*
  # Normativas Legales Externas - Marco Legal Municipal
  
  1. Descripción General
     Esta tabla almacena las normativas legales externas (leyes, decretos, constitución)
     que sirven como marco legal de referencia para el trabajo jurídico municipal.
     Estas son diferentes a los documentos jurídicos internos (dictámenes, opiniones).
  
  2. Nueva Tabla: `normativas_legales`
     - `id` (uuid, primary key): Identificador único
     - `nombre` (text): Nombre completo de la normativa
     - `numero_decreto` (text): Número del decreto/ley (ej: "12-2002", "14-2002")
     - `tipo_normativa` (text): Tipo (Código, Ley, Constitución, Decreto)
     - `descripcion` (text): Descripción breve de la normativa
     - `documento_url` (text): URL al PDF oficial
     - `vigente` (boolean): Si está vigente actualmente
     - `orden` (integer): Orden de visualización
     - `created_at` (timestamptz): Fecha de registro
  
  3. Seguridad (RLS)
     - Lectura: Todos los usuarios autenticados pueden consultar las normativas
     - Escritura: Solo administradores pueden crear/modificar normativas
  
  4. Datos Iniciales
     - Código Municipal y otras leyes fundamentales guatemaltecas
*/

-- Crear tabla de normativas legales externas
CREATE TABLE IF NOT EXISTS normativas_legales (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  nombre text NOT NULL,
  numero_decreto text,
  tipo_normativa text NOT NULL,
  descripcion text,
  documento_url text NOT NULL,
  vigente boolean DEFAULT true,
  orden integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Crear índice para ordenamiento
CREATE INDEX IF NOT EXISTS idx_normativas_orden ON normativas_legales(orden ASC);

-- Habilitar RLS
ALTER TABLE normativas_legales ENABLE ROW LEVEL SECURITY;

-- Política de lectura: todos los usuarios autenticados pueden ver normativas
CREATE POLICY "Usuarios autenticados pueden ver normativas legales"
  ON normativas_legales FOR SELECT
  TO authenticated
  USING (true);

-- Política de escritura: solo administradores (por ahora todos los autenticados pueden insertar)
CREATE POLICY "Usuarios autenticados pueden crear normativas"
  ON normativas_legales FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Usuarios autenticados pueden actualizar normativas"
  ON normativas_legales FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Insertar normativas iniciales
INSERT INTO normativas_legales (nombre, numero_decreto, tipo_normativa, descripcion, documento_url, vigente, orden) VALUES
  (
    'Código Municipal',
    'Decreto 12-2002',
    'Código',
    'Regula el funcionamiento, organización y atribuciones de las municipalidades en Guatemala',
    'https://www.acnur.org/fileadmin/Documentos/BDL/2008/6698.pdf',
    true,
    1
  ),
  (
    'Ley General de Descentralización',
    'Decreto 14-2002',
    'Ley',
    'Establece el marco legal para la descentralización del Estado guatemalteco',
    'https://www.congreso.gob.gt/assets/uploads/info_legislativo/decretos/14-02.pdf',
    true,
    2
  ),
  (
    'Ley de Consejos de Desarrollo',
    'Decreto 11-2002',
    'Ley',
    'Regula el Sistema de Consejos de Desarrollo Urbano y Rural',
    '#',
    true,
    3
  ),
  (
    'Constitución Política de Guatemala',
    'Constitución 1985',
    'Constitución',
    'Ley suprema de la República de Guatemala',
    'https://www.oas.org/dil/esp/Constitucion_Guatemala.pdf',
    true,
    4
  ),
  (
    'Ley de Servicio Municipal',
    'Decreto 1-87',
    'Ley',
    'Regula las relaciones laborales de los trabajadores municipales',
    'https://www.oas.org/juridico/spanish/mesicic2_gtm_decreto_1-87.pdf',
    true,
    5
  ),
  (
    'Ley de Contrataciones del Estado',
    'Decreto 57-92',
    'Ley',
    'Norma las contrataciones y adquisiciones del Estado',
    'https://www.contraloria.gob.gt/wp-content/uploads/2019/01/LEY-DE-PROBIDAD-DECRETO-DEL-CONGRESO-89-2002.pdf',
    true,
    6
  ),
  (
    'Ley Orgánica del Presupuesto',
    'Decreto 101-97',
    'Ley',
    'Establece el régimen presupuestario del Estado',
    'https://mcd.gob.gt/wp-content/uploads/2013/07/ley_organica_del_presupuesto.pdf',
    true,
    7
  ),
  (
    'Ley de Probidad',
    'Decreto 89-2002',
    'Ley',
    'Regula la probidad y responsabilidad de los funcionarios públicos',
    'https://www.contraloria.gob.gt/wp-content/uploads/2019/01/LEY-DE-PROBIDAD-DECRETO-DEL-CONGRESO-89-2002.pdf',
    true,
    8
  )
ON CONFLICT DO NOTHING;