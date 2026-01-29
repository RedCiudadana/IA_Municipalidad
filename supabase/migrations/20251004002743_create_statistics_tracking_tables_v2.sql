/*
  # Create statistics and usage tracking tables

  1. New Tables
    - `transacciones_api`
      - Tracks every AI agent interaction
      - Records tokens, costs, duration, and status
      - Links to user and agent type
    
    - `uso_agentes`
      - Aggregated statistics per agent per user
      - Tracks total uses, tokens, costs
      - Updated via trigger on transacciones_api
    
    - `estadisticas_generales`
      - System-wide statistics
      - Daily aggregates of all usage
      - Used for dashboard metrics
  
  2. Security
    - Enable RLS on all tables
    - Users can only view their own transaction data
    - Admins can view all statistics
    - Automatic timestamp tracking

  3. Indexes
    - Optimized for common queries
    - Fast filtering by date, user, agent
*/

-- Create transacciones_api table
CREATE TABLE transacciones_api (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  usuario_id uuid REFERENCES usuarios(id) ON DELETE CASCADE NOT NULL,
  agente_tipo text NOT NULL,
  agente_nombre text NOT NULL,
  tokens_entrada integer DEFAULT 0,
  tokens_salida integer DEFAULT 0,
  tokens_total integer DEFAULT 0,
  costo_usd decimal(10, 4) DEFAULT 0,
  duracion_segundos decimal(6, 2) DEFAULT 0,
  estado text DEFAULT 'exitoso' CHECK (estado IN ('exitoso', 'error', 'timeout')),
  metadata jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now()
);

-- Create uso_agentes table for aggregated stats
CREATE TABLE uso_agentes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  usuario_id uuid REFERENCES usuarios(id) ON DELETE CASCADE NOT NULL,
  agente_tipo text NOT NULL,
  agente_nombre text NOT NULL,
  total_usos integer DEFAULT 0,
  total_tokens integer DEFAULT 0,
  costo_total_usd decimal(10, 2) DEFAULT 0,
  ultimo_uso timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(usuario_id, agente_tipo)
);

-- Create estadisticas_generales table for system-wide stats
CREATE TABLE estadisticas_generales (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  fecha date DEFAULT CURRENT_DATE NOT NULL,
  total_transacciones integer DEFAULT 0,
  total_tokens integer DEFAULT 0,
  costo_total_usd decimal(10, 2) DEFAULT 0,
  usuarios_activos integer DEFAULT 0,
  promedio_tokens_transaccion integer DEFAULT 0,
  agente_mas_usado text,
  metadata jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(fecha)
);

-- Create indexes for performance
CREATE INDEX idx_transacciones_usuario_fecha 
  ON transacciones_api(usuario_id, created_at DESC);

CREATE INDEX idx_transacciones_agente 
  ON transacciones_api(agente_tipo);

CREATE INDEX idx_transacciones_fecha 
  ON transacciones_api(created_at DESC);

CREATE INDEX idx_uso_agentes_usuario 
  ON uso_agentes(usuario_id);

CREATE INDEX idx_estadisticas_fecha 
  ON estadisticas_generales(fecha DESC);

-- Enable RLS
ALTER TABLE transacciones_api ENABLE ROW LEVEL SECURITY;
ALTER TABLE uso_agentes ENABLE ROW LEVEL SECURITY;
ALTER TABLE estadisticas_generales ENABLE ROW LEVEL SECURITY;

-- RLS Policies for transacciones_api
CREATE POLICY "Users can view own transactions"
  ON transacciones_api FOR SELECT
  TO authenticated
  USING (auth.uid() = usuario_id);

CREATE POLICY "Users can insert own transactions"
  ON transacciones_api FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = usuario_id);

-- RLS Policies for uso_agentes
CREATE POLICY "Users can view own agent usage"
  ON uso_agentes FOR SELECT
  TO authenticated
  USING (auth.uid() = usuario_id);

CREATE POLICY "Users can insert own agent usage"
  ON uso_agentes FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = usuario_id);

CREATE POLICY "Users can update own agent usage"
  ON uso_agentes FOR UPDATE
  TO authenticated
  USING (auth.uid() = usuario_id)
  WITH CHECK (auth.uid() = usuario_id);

-- RLS Policies for estadisticas_generales (public read for authenticated users)
CREATE POLICY "Authenticated users can view general statistics"
  ON estadisticas_generales FOR SELECT
  TO authenticated
  USING (true);

-- Function to automatically calculate tokens_total
CREATE OR REPLACE FUNCTION calculate_tokens_total()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.tokens_total := COALESCE(NEW.tokens_entrada, 0) + COALESCE(NEW.tokens_salida, 0);
  RETURN NEW;
END;
$$;

-- Trigger to calculate tokens_total
CREATE TRIGGER trigger_calculate_tokens_total
  BEFORE INSERT OR UPDATE ON transacciones_api
  FOR EACH ROW
  EXECUTE FUNCTION calculate_tokens_total();

-- Function to update uso_agentes when a transaction is created
CREATE OR REPLACE FUNCTION update_uso_agentes()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  INSERT INTO uso_agentes (
    usuario_id,
    agente_tipo,
    agente_nombre,
    total_usos,
    total_tokens,
    costo_total_usd,
    ultimo_uso
  ) VALUES (
    NEW.usuario_id,
    NEW.agente_tipo,
    NEW.agente_nombre,
    1,
    NEW.tokens_total,
    NEW.costo_usd,
    NEW.created_at
  )
  ON CONFLICT (usuario_id, agente_tipo)
  DO UPDATE SET
    total_usos = uso_agentes.total_usos + 1,
    total_tokens = uso_agentes.total_tokens + NEW.tokens_total,
    costo_total_usd = uso_agentes.costo_total_usd + NEW.costo_usd,
    ultimo_uso = NEW.created_at,
    updated_at = now();
  
  RETURN NEW;
END;
$$;

-- Trigger to update uso_agentes
CREATE TRIGGER trigger_update_uso_agentes
  AFTER INSERT ON transacciones_api
  FOR EACH ROW
  EXECUTE FUNCTION update_uso_agentes();

-- Function to update estadisticas_generales daily
CREATE OR REPLACE FUNCTION update_estadisticas_generales()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_fecha date := CURRENT_DATE;
  v_total_trans integer;
  v_total_tokens integer;
  v_costo_total decimal(10,2);
  v_usuarios_activos integer;
  v_promedio_tokens integer;
  v_agente_mas_usado text;
BEGIN
  -- Calculate daily statistics
  SELECT 
    COUNT(*)::integer,
    COALESCE(SUM(tokens_total), 0)::integer,
    COALESCE(SUM(costo_usd), 0)::decimal(10,2),
    COUNT(DISTINCT usuario_id)::integer
  INTO 
    v_total_trans,
    v_total_tokens,
    v_costo_total,
    v_usuarios_activos
  FROM transacciones_api
  WHERE DATE(created_at) = v_fecha;
  
  -- Calculate average tokens
  IF v_total_trans > 0 THEN
    v_promedio_tokens := (v_total_tokens / v_total_trans)::integer;
  ELSE
    v_promedio_tokens := 0;
  END IF;
  
  -- Find most used agent
  SELECT agente_nombre
  INTO v_agente_mas_usado
  FROM transacciones_api
  WHERE DATE(created_at) = v_fecha
  GROUP BY agente_nombre
  ORDER BY COUNT(*) DESC
  LIMIT 1;
  
  -- Insert or update estadisticas_generales
  INSERT INTO estadisticas_generales (
    fecha,
    total_transacciones,
    total_tokens,
    costo_total_usd,
    usuarios_activos,
    promedio_tokens_transaccion,
    agente_mas_usado
  ) VALUES (
    v_fecha,
    v_total_trans,
    v_total_tokens,
    v_costo_total,
    v_usuarios_activos,
    v_promedio_tokens,
    v_agente_mas_usado
  )
  ON CONFLICT (fecha)
  DO UPDATE SET
    total_transacciones = EXCLUDED.total_transacciones,
    total_tokens = EXCLUDED.total_tokens,
    costo_total_usd = EXCLUDED.costo_total_usd,
    usuarios_activos = EXCLUDED.usuarios_activos,
    promedio_tokens_transaccion = EXCLUDED.promedio_tokens_transaccion,
    agente_mas_usado = EXCLUDED.agente_mas_usado,
    updated_at = now();
END;
$$;
