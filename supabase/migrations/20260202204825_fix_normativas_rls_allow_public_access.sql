/*
  # Permitir acceso público a normativas legales
  
  1. Descripción
     Las normativas legales son documentos públicos que deben estar
     disponibles para todos los usuarios sin requerir autenticación.
     
  2. Cambios
     - Eliminar políticas restrictivas existentes
     - Crear nueva política que permite acceso público (anon) para lectura
     - Mantener restricción de escritura para usuarios autenticados
  
  3. Seguridad
     - Lectura: Acceso público (anon y authenticated)
     - Escritura: Solo usuarios autenticados
*/

-- Eliminar políticas existentes
DROP POLICY IF EXISTS "Usuarios autenticados pueden ver normativas legales" ON normativas_legales;
DROP POLICY IF EXISTS "Usuarios autenticados pueden crear normativas" ON normativas_legales;
DROP POLICY IF EXISTS "Usuarios autenticados pueden actualizar normativas" ON normativas_legales;

-- Crear política de lectura pública (acceso para anon y authenticated)
CREATE POLICY "Acceso público para leer normativas legales"
  ON normativas_legales FOR SELECT
  TO anon, authenticated
  USING (true);

-- Mantener políticas de escritura solo para autenticados
CREATE POLICY "Solo autenticados pueden crear normativas"
  ON normativas_legales FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Solo autenticados pueden actualizar normativas"
  ON normativas_legales FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);
