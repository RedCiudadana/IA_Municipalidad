import React, { useState } from 'react';
import FormularioDocumento from '../components/ui/FormularioDocumento';
import EditorResultado from '../components/ui/EditorResultado';
import PanelRecursos from '../components/ui/PanelRecursos';

interface GeneradorMemosProps {
  usuario: { nombre: string; cargo: string };
}

const GeneradorMemos: React.FC<GeneradorMemosProps> = () => {
  const [documento, setDocumento] = useState('');
  const [cargando, setCargando] = useState(false);

  const camposFormulario = [
    {
      nombre: 'asunto',
      etiqueta: 'Asunto del Dictamen',
      tipo: 'text' as const,
      requerido: true,
      placeholder: 'Ej: Legalidad del procedimiento de contratación directa'
    },
    {
      nombre: 'antecedentes',
      etiqueta: 'Antecedentes del Caso',
      tipo: 'textarea' as const,
      requerido: true,
      placeholder: 'Describa los hechos relevantes del caso de manera cronológica y objetiva...'
    },
    {
      nombre: 'solicitante',
      etiqueta: 'Nombre del Solicitante',
      tipo: 'text' as const,
      requerido: false,
      placeholder: 'Nombre de quien solicita el dictamen (opcional)'
    },
    {
      nombre: 'cargo_solicitante',
      etiqueta: 'Cargo del Solicitante',
      tipo: 'text' as const,
      requerido: false,
      placeholder: 'Cargo o función del solicitante (opcional)'
    },
    {
      nombre: 'departamento',
      etiqueta: 'Departamento o Unidad',
      tipo: 'text' as const,
      requerido: false,
      placeholder: 'Departamento que solicita el dictamen (opcional)'
    },
    {
      nombre: 'pregunta_juridica',
      etiqueta: 'Pregunta(s) Jurídica(s) Específica(s)',
      tipo: 'textarea' as const,
      requerido: false,
      placeholder: '¿Qué cuestiones jurídicas específicas deben resolverse? (opcional)'
    },
    {
      nombre: 'normativa_sugerida',
      etiqueta: 'Normativa Relevante Sugerida',
      tipo: 'textarea' as const,
      requerido: false,
      placeholder: 'Indique leyes, decretos o artículos que considera relevantes (opcional)'
    }
  ];

  const manejarGeneracion = async (datos: any) => {
    setCargando(true);
    try {
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

      if (!supabaseUrl || !supabaseAnonKey) {
        setDocumento('Error: Variables de entorno de Supabase no configuradas');
        setCargando(false);
        return;
      }

      const apiUrl = `${supabaseUrl}/functions/v1/dictamenes-juridicos`;

      const requestBody = {
        asunto: datos.asunto,
        antecedentes: datos.antecedentes,
        solicitante: datos.solicitante || undefined,
        cargo_solicitante: datos.cargo_solicitante || undefined,
        departamento: datos.departamento || undefined,
        pregunta_juridica: datos.pregunta_juridica || undefined,
        normativa_sugerida: datos.normativa_sugerida || undefined,
        documentos_adjuntos: datos.contenido_libre || undefined
      };

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${supabaseAnonKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error al elaborar el dictamen');
      }

      const data = await response.json();
      setDocumento(data.resultado || 'No se pudo generar el dictamen jurídico.');
    } catch (err) {
      console.error('Error:', err);
      setDocumento(`Error al elaborar el dictamen: ${err instanceof Error ? err.message : 'Error desconocido'}`);
    }
    setCargando(false);
  };

  const recursosEspecificos = [
    {
      categoria: 'Estructura de Dictamen Jurídico',
      items: [
        'I. Encabezado (No., Fecha, Para, De, Asunto)',
        'II. Antecedentes del caso',
        'III. Planteamiento de cuestión jurídica',
        'IV. Normativa aplicable (con citas textuales)',
        'V. Análisis jurídico fundamentado',
        'VI. Conclusiones (numeradas)',
        'VII. Recomendaciones',
        'VIII. Advertencias legales (si aplica)'
      ]
    },
    {
      categoria: 'Normativa Frecuente',
      items: [
        'Constitución Política de Guatemala',
        'Código Municipal (Decreto 12-2002)',
        'Ley de Contrataciones (Decreto 57-92)',
        'Ley de Servicio Municipal (Decreto 1-87)',
        'Ley de Probidad (Decreto 89-2002)',
        'Ley Orgánica del Presupuesto'
      ]
    },
    {
      categoria: 'Fuentes de Fundamentación',
      items: [
        'Jurisprudencia Corte de Constitucionalidad',
        'Dictámenes Procuraduría General',
        'Criterios Contraloría General de Cuentas',
        'Doctrina legal guatemalteca',
        'Principios del derecho administrativo'
      ]
    }
  ];

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-br from-emerald-600 to-emerald-700 rounded-2xl shadow-xl p-8 text-white">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h2 className="text-3xl font-bold mb-3">
              Agente de Dictámenes Jurídicos Municipales
            </h2>
            <p className="text-emerald-100 text-lg leading-relaxed mb-4">
              Sistema especializado en elaboración de dictámenes jurídicos completos con análisis exhaustivo de precedentes,
              fundamentación legal rigurosa y estructura profesional. Proporciona opinión jurídica fundamentada en derecho
              municipal guatemalteco.
            </p>
            <div className="flex flex-wrap gap-3">
              <span className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-medium">
                Análisis Jurídico Completo
              </span>
              <span className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-medium">
                Precedentes y Jurisprudencia
              </span>
              <span className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-medium">
                Citas Normativas Exactas
              </span>
              <span className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-medium">
                Recomendaciones Legales
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Datos del Dictamen</h3>
            <FormularioDocumento
              campos={camposFormulario}
              onGenerar={manejarGeneracion}
              cargando={cargando}
              tipoDocumento="dictamen jurídico"
            />
          </div>

          {documento && (
            <EditorResultado
              contenido={documento}
              onGuardar={(contenido) => console.log('Guardado:', contenido)}
              tipoDocumento="dictamen jurídico"
            />
          )}
        </div>

        <div>
          <PanelRecursos recursos={recursosEspecificos} />
        </div>
      </div>
    </div>
  );
};

export default GeneradorMemos;