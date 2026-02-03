import React, { useState } from 'react';
import {
  Book,
  Database,
  FileCode,
  Users,
  FileText,
  Settings,
  ChevronDown,
  ChevronRight,
  Copy,
  CheckCircle2,
  Code,
  Table,
  Link2
} from 'lucide-react';

interface DocumentacionProps {
  usuario: { nombre: string; cargo: string };
}

const Documentacion: React.FC<DocumentacionProps> = ({ usuario }) => {
  const [seccionExpandida, setSeccionExpandida] = useState<string>('esquema');
  const [copiado, setCopiado] = useState<string>('');

  const copiarCodigo = (texto: string, id: string) => {
    navigator.clipboard.writeText(texto);
    setCopiado(id);
    setTimeout(() => setCopiado(''), 2000);
  };

  const toggleSeccion = (seccion: string) => {
    setSeccionExpandida(seccionExpandida === seccion ? '' : seccion);
  };

  const esquemaDatabase = {
    usuarios: {
      descripcion: 'Información de usuarios del sistema',
      columnas: [
        { nombre: 'id', tipo: 'uuid', pk: true, descripcion: 'Identificador único del usuario' },
        { nombre: 'email', tipo: 'text', unique: true, descripcion: 'Correo electrónico del usuario' },
        { nombre: 'nombre', tipo: 'text', descripcion: 'Nombre completo del usuario' },
        { nombre: 'cargo', tipo: 'text', descripcion: 'Cargo del usuario en Municipalidad de Guatemala' },
        { nombre: 'departamento', tipo: 'text', descripcion: 'Departamento al que pertenece' },
        { nombre: 'telefono', tipo: 'text', descripcion: 'Número telefónico' },
        { nombre: 'ubicacion', tipo: 'text', descripcion: 'Ubicación física' },
        { nombre: 'biografia', tipo: 'text', descripcion: 'Biografía profesional' },
        { nombre: 'fecha_ingreso', tipo: 'date', descripcion: 'Fecha de ingreso a Municipalidad de Guatemala' },
        { nombre: 'created_at', tipo: 'timestamptz', default: 'now()', descripcion: 'Fecha de creación del registro' },
        { nombre: 'updated_at', tipo: 'timestamptz', default: 'now()', descripcion: 'Fecha de última actualización' }
      ]
    },
    documentos: {
      descripcion: 'Registro de documentos generados por los agentes',
      columnas: [
        { nombre: 'id', tipo: 'uuid', pk: true, descripcion: 'Identificador único del documento' },
        { nombre: 'usuario_id', tipo: 'uuid', fk: 'usuarios(id)', descripcion: 'ID del usuario que generó el documento' },
        { nombre: 'tipo_documento', tipo: 'text', descripcion: 'Tipo: oficio, memorando, carta, minuta, resumen, analisis' },
        { nombre: 'titulo', tipo: 'text', descripcion: 'Título del documento' },
        { nombre: 'contenido', tipo: 'text', descripcion: 'Contenido completo del documento' },
        { nombre: 'destinatario', tipo: 'text', descripcion: 'Destinatario del documento' },
        { nombre: 'cargo_destinatario', tipo: 'text', descripcion: 'Cargo del destinatario' },
        { nombre: 'institucion', tipo: 'text', descripcion: 'Institución del destinatario' },
        { nombre: 'asunto', tipo: 'text', descripcion: 'Asunto del documento' },
        { nombre: 'estado', tipo: 'text', default: 'borrador', descripcion: 'Estado: borrador, completado, archivado' },
        { nombre: 'metadata', tipo: 'jsonb', descripcion: 'Metadata adicional del documento' },
        { nombre: 'created_at', tipo: 'timestamptz', default: 'now()', descripcion: 'Fecha de creación' },
        { nombre: 'updated_at', tipo: 'timestamptz', default: 'now()', descripcion: 'Fecha de actualización' }
      ]
    },
    transacciones_api: {
      descripcion: 'Registro de transacciones con la API de OpenAI',
      columnas: [
        { nombre: 'id', tipo: 'uuid', pk: true, descripcion: 'Identificador único de la transacción' },
        { nombre: 'usuario_id', tipo: 'uuid', fk: 'usuarios(id)', descripcion: 'ID del usuario que realizó la transacción' },
        { nombre: 'documento_id', tipo: 'uuid', fk: 'documentos(id)', descripcion: 'ID del documento generado' },
        { nombre: 'agente', tipo: 'text', descripcion: 'Tipo de agente usado' },
        { nombre: 'modelo', tipo: 'text', descripcion: 'Modelo de OpenAI utilizado' },
        { nombre: 'tokens_entrada', tipo: 'integer', descripcion: 'Tokens de entrada (prompt)' },
        { nombre: 'tokens_salida', tipo: 'integer', descripcion: 'Tokens de salida (respuesta)' },
        { nombre: 'tokens_total', tipo: 'integer', descripcion: 'Total de tokens usados' },
        { nombre: 'costo', tipo: 'decimal', descripcion: 'Costo en USD de la transacción' },
        { nombre: 'duracion', tipo: 'decimal', descripcion: 'Duración de la llamada en segundos' },
        { nombre: 'estado', tipo: 'text', descripcion: 'Estado: exitoso, error, timeout' },
        { nombre: 'error_mensaje', tipo: 'text', descripcion: 'Mensaje de error si aplica' },
        { nombre: 'created_at', tipo: 'timestamptz', default: 'now()', descripcion: 'Fecha de la transacción' }
      ]
    },
    configuracion_usuario: {
      descripcion: 'Configuración personalizada de cada usuario',
      columnas: [
        { nombre: 'id', tipo: 'uuid', pk: true, descripcion: 'Identificador único' },
        { nombre: 'usuario_id', tipo: 'uuid', fk: 'usuarios(id)', unique: true, descripcion: 'ID del usuario' },
        { nombre: 'notificaciones_email', tipo: 'boolean', default: 'true', descripcion: 'Notificaciones por email' },
        { nombre: 'notificaciones_push', tipo: 'boolean', default: 'false', descripcion: 'Notificaciones push' },
        { nombre: 'notificaciones_documentos', tipo: 'boolean', default: 'true', descripcion: 'Notificar documentos generados' },
        { nombre: 'notificaciones_actualizaciones', tipo: 'boolean', default: 'true', descripcion: 'Notificar actualizaciones' },
        { nombre: 'perfil_publico', tipo: 'boolean', default: 'false', descripcion: 'Perfil visible a otros' },
        { nombre: 'mostrar_actividad', tipo: 'boolean', default: 'true', descripcion: 'Mostrar actividad reciente' },
        { nombre: 'compartir_estadisticas', tipo: 'boolean', default: 'false', descripcion: 'Compartir estadísticas' },
        { nombre: 'tema', tipo: 'text', default: 'claro', descripcion: 'Tema: claro, oscuro' },
        { nombre: 'idioma', tipo: 'text', default: 'es', descripcion: 'Idioma: es, en' },
        { nombre: 'tamano_fuente', tipo: 'text', default: 'medio', descripcion: 'Tamaño: pequeno, medio, grande' },
        { nombre: 'updated_at', tipo: 'timestamptz', default: 'now()', descripcion: 'Fecha de actualización' }
      ]
    },
    estadisticas_agentes: {
      descripcion: 'Estadísticas de uso agregadas por agente',
      columnas: [
        { nombre: 'id', tipo: 'uuid', pk: true, descripcion: 'Identificador único' },
        { nombre: 'agente_id', tipo: 'text', descripcion: 'ID del agente' },
        { nombre: 'fecha', tipo: 'date', descripcion: 'Fecha de las estadísticas' },
        { nombre: 'total_usos', tipo: 'integer', default: '0', descripcion: 'Total de usos en el día' },
        { nombre: 'total_tokens', tipo: 'integer', default: '0', descripcion: 'Total de tokens usados' },
        { nombre: 'total_costo', tipo: 'decimal', default: '0', descripcion: 'Costo total en USD' },
        { nombre: 'usuarios_unicos', tipo: 'integer', default: '0', descripcion: 'Usuarios únicos que usaron el agente' },
        { nombre: 'duracion_promedio', tipo: 'decimal', descripcion: 'Duración promedio de transacciones' },
        { nombre: 'created_at', tipo: 'timestamptz', default: 'now()', descripcion: 'Fecha de creación' }
      ]
    }
  };

  const ejemplosIntegracion = [
    {
      titulo: 'Configurar Cliente Supabase',
      lenguaje: 'typescript',
      codigo: `import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey)`
    },
    {
      titulo: 'Guardar Documento Generado',
      lenguaje: 'typescript',
      codigo: `const guardarDocumento = async (datos: any) => {
  const { data, error } = await supabase
    .from('documentos')
    .insert({
      usuario_id: usuario.id,
      tipo_documento: 'oficio',
      titulo: datos.titulo,
      contenido: datos.contenido,
      destinatario: datos.destinatario,
      cargo_destinatario: datos.cargo_destinatario,
      institucion: datos.institucion,
      asunto: datos.asunto,
      estado: 'completado',
      metadata: {
        tipo_lenguaje: datos.tipo_lenguaje,
        urgencia: datos.urgencia
      }
    })
    .select()
    .maybeSingle()

  return { data, error }
}`
    },
    {
      titulo: 'Registrar Transacción API',
      lenguaje: 'typescript',
      codigo: `const registrarTransaccion = async (datos: any) => {
  const { data, error } = await supabase
    .from('transacciones_api')
    .insert({
      usuario_id: usuario.id,
      documento_id: documento.id,
      agente: 'redactor-oficios',
      modelo: 'gpt-4o-mini',
      tokens_entrada: datos.tokens_entrada,
      tokens_salida: datos.tokens_salida,
      tokens_total: datos.tokens_entrada + datos.tokens_salida,
      costo: calcularCosto(datos.tokens_total),
      duracion: datos.duracion,
      estado: 'exitoso'
    })

  return { data, error }
}`
    },
    {
      titulo: 'Obtener Historial de Documentos',
      lenguaje: 'typescript',
      codigo: `const obtenerHistorial = async (filtros: any) => {
  let query = supabase
    .from('documentos')
    .select(\`
      *,
      usuarios:usuario_id (nombre, cargo)
    \`)
    .eq('usuario_id', usuario.id)
    .order('created_at', { ascending: false })

  if (filtros.tipo) {
    query = query.eq('tipo_documento', filtros.tipo)
  }

  if (filtros.fecha) {
    query = query.gte('created_at', filtros.fecha)
  }

  const { data, error } = await query

  return { data, error }
}`
    },
    {
      titulo: 'Obtener Estadísticas de Uso',
      lenguaje: 'typescript',
      codigo: `const obtenerEstadisticas = async (periodo: string) => {
  const fechaInicio = calcularFechaInicio(periodo)

  const { data, error } = await supabase
    .from('transacciones_api')
    .select(\`
      agente,
      tokens_total.sum(),
      costo.sum(),
      duracion.avg()
    \`)
    .eq('usuario_id', usuario.id)
    .gte('created_at', fechaInicio)
    .group('agente')

  return { data, error }
}`
    },
    {
      titulo: 'Actualizar Configuración de Usuario',
      lenguaje: 'typescript',
      codigo: `const actualizarConfiguracion = async (config: any) => {
  const { data, error } = await supabase
    .from('configuracion_usuario')
    .upsert({
      usuario_id: usuario.id,
      notificaciones_email: config.notificaciones.email,
      notificaciones_push: config.notificaciones.push,
      tema: config.apariencia.tema,
      idioma: config.apariencia.idioma,
      updated_at: new Date().toISOString()
    })
    .eq('usuario_id', usuario.id)

  return { data, error }
}`
    }
  ];

  const migracionEjemplo = `/*
  # Creación de esquema AIGP-Municipalidad de Guatemala

  1. Nuevas Tablas
    - \`usuarios\` - Información de usuarios del sistema
    - \`documentos\` - Documentos generados por los agentes
    - \`transacciones_api\` - Registro de llamadas a OpenAI
    - \`configuracion_usuario\` - Configuración personalizada
    - \`estadisticas_agentes\` - Estadísticas agregadas

  2. Seguridad
    - Habilitar RLS en todas las tablas
    - Políticas para acceso solo a datos propios
    - Políticas especiales para administradores
*/

-- Tabla de usuarios
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

-- Tabla de documentos
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

-- Tabla de transacciones API
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

ALTER TABLE transacciones_api ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own transactions"
  ON transacciones_api FOR SELECT
  TO authenticated
  USING (auth.uid() = usuario_id);

-- Tabla de configuración de usuario
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

ALTER TABLE configuracion_usuario ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own config"
  ON configuracion_usuario FOR SELECT
  TO authenticated
  USING (auth.uid() = usuario_id);

CREATE POLICY "Users can update own config"
  ON configuracion_usuario FOR UPDATE
  TO authenticated
  USING (auth.uid() = usuario_id)
  WITH CHECK (auth.uid() = usuario_id);

-- Tabla de estadísticas de agentes
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

ALTER TABLE estadisticas_agentes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view aggregated stats"
  ON estadisticas_agentes FOR SELECT
  TO authenticated
  USING (true);

-- Índices para mejorar rendimiento
CREATE INDEX IF NOT EXISTS idx_documentos_usuario ON documentos(usuario_id);
CREATE INDEX IF NOT EXISTS idx_documentos_tipo ON documentos(tipo_documento);
CREATE INDEX IF NOT EXISTS idx_documentos_fecha ON documentos(created_at);
CREATE INDEX IF NOT EXISTS idx_transacciones_usuario ON transacciones_api(usuario_id);
CREATE INDEX IF NOT EXISTS idx_transacciones_fecha ON transacciones_api(created_at);
CREATE INDEX IF NOT EXISTS idx_estadisticas_agente ON estadisticas_agentes(agente_id, fecha);`;

  const mapaRelaciones = {
    titulo: 'Relaciones entre Tablas',
    relaciones: [
      {
        desde: 'documentos',
        hacia: 'usuarios',
        tipo: 'Many-to-One',
        campo: 'usuario_id → usuarios.id',
        descripcion: 'Cada documento pertenece a un usuario'
      },
      {
        desde: 'transacciones_api',
        hacia: 'usuarios',
        tipo: 'Many-to-One',
        campo: 'usuario_id → usuarios.id',
        descripcion: 'Cada transacción está asociada a un usuario'
      },
      {
        desde: 'transacciones_api',
        hacia: 'documentos',
        tipo: 'Many-to-One',
        campo: 'documento_id → documentos.id',
        descripcion: 'Cada transacción puede estar asociada a un documento'
      },
      {
        desde: 'configuracion_usuario',
        hacia: 'usuarios',
        tipo: 'One-to-One',
        campo: 'usuario_id → usuarios.id',
        descripcion: 'Cada usuario tiene una configuración única'
      }
    ]
  };

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 rounded-3xl shadow-2xl overflow-hidden">
        <div className="p-12">
          <div className="flex items-center space-x-4 mb-6">
            <div className="w-16 h-16 bg-white/10 backdrop-blur-sm rounded-2xl flex items-center justify-center">
              <Book size={32} className="text-white" />
            </div>
            <div>
              <h1 className="text-5xl font-bold text-white mb-2">
                Documentación Técnica
              </h1>
              <p className="text-blue-200 text-xl font-medium">
                Esquema de Datos e Integración con Supabase
              </p>
            </div>
          </div>

          <p className="text-white/90 text-lg leading-relaxed max-w-4xl">
            Documentación completa del esquema de base de datos, modelos de datos y ejemplos
            de integración para conectar la aplicación AIGP-Municipalidad de Guatemala con Supabase.
          </p>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
        <div className="flex items-center space-x-3 mb-6">
          <Database size={28} className="text-blue-600" />
          <h2 className="text-3xl font-bold text-gray-800">Esquema de Base de Datos</h2>
        </div>

        <div className="space-y-6">
          {Object.entries(esquemaDatabase).map(([tabla, info]) => (
            <div key={tabla} className="border border-gray-200 rounded-xl overflow-hidden">
              <button
                onClick={() => toggleSeccion(tabla)}
                className="w-full flex items-center justify-between p-6 bg-gradient-to-r from-gray-50 to-white hover:from-gray-100 hover:to-gray-50 transition-colors"
              >
                <div className="flex items-center space-x-4">
                  <Table size={24} className="text-blue-600" />
                  <div className="text-left">
                    <h3 className="text-xl font-bold text-gray-800">{tabla}</h3>
                    <p className="text-sm text-gray-600">{info.descripcion}</p>
                  </div>
                </div>
                {seccionExpandida === tabla ? (
                  <ChevronDown size={24} className="text-gray-400" />
                ) : (
                  <ChevronRight size={24} className="text-gray-400" />
                )}
              </button>

              {seccionExpandida === tabla && (
                <div className="p-6 bg-gray-50 border-t border-gray-200">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-100">
                        <tr>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase">
                            Columna
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase">
                            Tipo
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase">
                            Restricciones
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase">
                            Descripción
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {info.columnas.map((col) => (
                          <tr key={col.nombre} className="hover:bg-gray-50">
                            <td className="px-4 py-3 text-sm font-mono font-medium text-blue-600">
                              {col.nombre}
                            </td>
                            <td className="px-4 py-3 text-sm font-mono text-gray-700">
                              {col.tipo}
                            </td>
                            <td className="px-4 py-3 text-sm">
                              <div className="flex flex-wrap gap-1">
                                {col.pk && (
                                  <span className="px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded-full font-medium">
                                    PK
                                  </span>
                                )}
                                {col.unique && (
                                  <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full font-medium">
                                    UNIQUE
                                  </span>
                                )}
                                {col.fk && (
                                  <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full font-medium">
                                    FK: {col.fk}
                                  </span>
                                )}
                                {col.default && (
                                  <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full font-medium">
                                    DEFAULT: {col.default}
                                  </span>
                                )}
                              </div>
                            </td>
                            <td className="px-4 py-3 text-sm text-gray-600">
                              {col.descripcion}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
        <div className="flex items-center space-x-3 mb-6">
          <Link2 size={28} className="text-emerald-600" />
          <h2 className="text-3xl font-bold text-gray-800">{mapaRelaciones.titulo}</h2>
        </div>

        <div className="space-y-4">
          {mapaRelaciones.relaciones.map((rel, idx) => (
            <div key={idx} className="flex items-center p-6 bg-gradient-to-r from-gray-50 to-white rounded-xl border border-gray-200">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  <span className="px-3 py-1 bg-blue-100 text-blue-800 font-mono text-sm rounded-lg font-medium">
                    {rel.desde}
                  </span>
                  <span className="text-gray-400">→</span>
                  <span className="px-3 py-1 bg-emerald-100 text-emerald-800 font-mono text-sm rounded-lg font-medium">
                    {rel.hacia}
                  </span>
                  <span className="px-3 py-1 bg-purple-100 text-purple-800 text-xs rounded-full font-medium">
                    {rel.tipo}
                  </span>
                </div>
                <p className="text-sm text-gray-600 mb-1">{rel.descripcion}</p>
                <p className="text-xs font-mono text-gray-500">{rel.campo}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
        <div className="flex items-center space-x-3 mb-6">
          <Code size={28} className="text-purple-600" />
          <h2 className="text-3xl font-bold text-gray-800">Ejemplos de Integración</h2>
        </div>

        <div className="space-y-6">
          {ejemplosIntegracion.map((ejemplo, idx) => (
            <div key={idx} className="border border-gray-200 rounded-xl overflow-hidden">
              <div className="bg-gradient-to-r from-gray-800 to-gray-700 px-6 py-4 flex items-center justify-between">
                <h3 className="text-lg font-semibold text-white">{ejemplo.titulo}</h3>
                <button
                  onClick={() => copiarCodigo(ejemplo.codigo, `ejemplo-${idx}`)}
                  className="flex items-center space-x-2 px-3 py-1 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors"
                >
                  {copiado === `ejemplo-${idx}` ? (
                    <>
                      <CheckCircle2 size={16} />
                      <span className="text-sm">Copiado</span>
                    </>
                  ) : (
                    <>
                      <Copy size={16} />
                      <span className="text-sm">Copiar</span>
                    </>
                  )}
                </button>
              </div>
              <div className="bg-gray-900 p-6 overflow-x-auto">
                <pre className="text-sm text-gray-100">
                  <code>{ejemplo.codigo}</code>
                </pre>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
        <div className="flex items-center space-x-3 mb-6">
          <FileCode size={28} className="text-orange-600" />
          <h2 className="text-3xl font-bold text-gray-800">Script de Migración Completo</h2>
        </div>

        <p className="text-gray-600 mb-6">
          Este script SQL crea todas las tablas necesarias con sus relaciones y políticas RLS.
        </p>

        <div className="border border-gray-200 rounded-xl overflow-hidden">
          <div className="bg-gradient-to-r from-gray-800 to-gray-700 px-6 py-4 flex items-center justify-between">
            <h3 className="text-lg font-semibold text-white">migration.sql</h3>
            <button
              onClick={() => copiarCodigo(migracionEjemplo, 'migracion')}
              className="flex items-center space-x-2 px-3 py-1 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors"
            >
              {copiado === 'migracion' ? (
                <>
                  <CheckCircle2 size={16} />
                  <span className="text-sm">Copiado</span>
                </>
              ) : (
                <>
                  <Copy size={16} />
                  <span className="text-sm">Copiar</span>
                </>
              )}
            </button>
          </div>
          <div className="bg-gray-900 p-6 overflow-x-auto max-h-96">
            <pre className="text-sm text-gray-100">
              <code>{migracionEjemplo}</code>
            </pre>
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl shadow-lg p-8 border border-blue-100">
        <div className="flex items-start space-x-4">
          <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center flex-shrink-0">
            <Settings size={24} className="text-white" />
          </div>
          <div>
            <h3 className="text-2xl font-bold text-gray-800 mb-3">Variables de Entorno</h3>
            <p className="text-gray-700 mb-4">
              Las siguientes variables deben estar configuradas en el archivo <code className="px-2 py-1 bg-white rounded font-mono text-sm">.env</code>:
            </p>
            <div className="bg-white rounded-xl p-4 border border-blue-200">
              <pre className="text-sm font-mono text-gray-800">
                <code>
                  VITE_SUPABASE_URL=tu_url_de_supabase{'\n'}
                  VITE_SUPABASE_ANON_KEY=tu_clave_anonima{'\n'}
                  VITE_OPENAI_API_KEY=tu_clave_de_openai
                </code>
              </pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Documentacion;
