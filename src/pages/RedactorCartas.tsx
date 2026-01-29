import React, { useState } from 'react';
import FormularioDocumento from '../components/ui/FormularioDocumento';
import EditorResultado from '../components/ui/EditorResultado';
import PanelRecursos from '../components/ui/PanelRecursos';

interface RedactorCartasProps {
  usuario: { nombre: string; cargo: string };
}

const RedactorCartas: React.FC<RedactorCartasProps> = () => {
  const [documento, setDocumento] = useState('');
  const [cargando, setCargando] = useState(false);

  const camposFormulario = [
    {
      nombre: 'tipo_contrato',
      etiqueta: 'Tipo de Contrato',
      tipo: 'select' as const,
      opciones: [
        'Obra Pública',
        'Suministro de Bienes',
        'Prestación de Servicios',
        'Servicios Profesionales',
        'Consultoría',
        'Arrendamiento',
        'Mantenimiento',
        'Otro'
      ],
      requerido: true
    },
    {
      nombre: 'objeto_contrato',
      etiqueta: 'Objeto del Contrato',
      tipo: 'textarea' as const,
      requerido: true,
      placeholder: 'Describa detalladamente el objeto y alcance del contrato...'
    },
    {
      nombre: 'monto_estimado',
      etiqueta: 'Monto Estimado del Contrato',
      tipo: 'text' as const,
      requerido: false,
      placeholder: 'Ej: Q. 500,000.00 (opcional)'
    },
    {
      nombre: 'plazo_ejecucion',
      etiqueta: 'Plazo de Ejecución',
      tipo: 'text' as const,
      requerido: false,
      placeholder: 'Ej: 6 meses (opcional)'
    },
    {
      nombre: 'contratista',
      etiqueta: 'Nombre del Contratista',
      tipo: 'text' as const,
      requerido: false,
      placeholder: 'Nombre o razón social del contratista (opcional)'
    },
    {
      nombre: 'modalidad_contratacion',
      etiqueta: 'Modalidad de Contratación',
      tipo: 'select' as const,
      opciones: [
        'Licitación Pública',
        'Cotización',
        'Compra Directa',
        'Contratación Abierta',
        'Urgencia Nacional',
        'No especificada'
      ],
      requerido: false
    },
    {
      nombre: 'texto_contrato',
      etiqueta: 'Texto del Contrato (si disponible)',
      tipo: 'textarea' as const,
      requerido: false,
      placeholder: 'Pegue aquí el texto completo del contrato a revisar (opcional pero recomendado)...'
    },
    {
      nombre: 'clausulas_especificas',
      etiqueta: 'Cláusulas Específicas a Revisar',
      tipo: 'textarea' as const,
      requerido: false,
      placeholder: 'Indique cláusulas específicas que requieren atención especial (opcional)...'
    },
    {
      nombre: 'aspectos_revisar',
      etiqueta: 'Aspectos Específicos a Revisar',
      tipo: 'textarea' as const,
      requerido: false,
      placeholder: 'Mencione aspectos particulares que desea sean revisados (garantías, penalizaciones, plazos, etc.)...'
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

      const apiUrl = `${supabaseUrl}/functions/v1/revision-contratos`;

      const requestBody = {
        tipo_contrato: datos.tipo_contrato,
        objeto_contrato: datos.objeto_contrato,
        monto_estimado: datos.monto_estimado || undefined,
        plazo_ejecucion: datos.plazo_ejecucion || undefined,
        contratista: datos.contratista || undefined,
        modalidad_contratacion: datos.modalidad_contratacion || undefined,
        texto_contrato: datos.texto_contrato || undefined,
        clausulas_especificas: datos.clausulas_especificas || undefined,
        garantias_solicitadas: datos.garantias_solicitadas || undefined,
        aspectos_revisar: datos.aspectos_revisar || undefined
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
        throw new Error(errorData.error || 'Error al revisar el contrato');
      }

      const data = await response.json();
      setDocumento(data.resultado || 'No se pudo generar la revisión del contrato.');
    } catch (err) {
      console.error('Error:', err);
      setDocumento(`Error al revisar el contrato: ${err instanceof Error ? err.message : 'Error desconocido'}`);
    }
    setCargando(false);
  };

  const recursosEspecificos = [
    {
      categoria: 'Normativa Aplicable',
      items: [
        'Ley de Contrataciones del Estado (Decreto 57-92)',
        'Reglamento de Contrataciones (Acuerdo Gub. 122-2016)',
        'Código Municipal (Decreto 12-2002)',
        'Ley de Probidad y Responsabilidades',
        'Código Civil (obligaciones y contratos)',
        'Criterios de Contraloría General de Cuentas'
      ]
    },
    {
      categoria: 'Cláusulas Esenciales a Verificar',
      items: [
        '1. Objeto del contrato (claro y preciso)',
        '2. Plazo de ejecución y prórrogas',
        '3. Precio y forma de pago',
        '4. Garantías (cumplimiento, calidad, anticipo)',
        '5. Multas y sanciones por incumplimiento',
        '6. Recepción (provisional y definitiva)',
        '7. Resolución de controversias',
        '8. Rescisión y terminación',
        '9. Cesión y subcontratación',
        '10. Seguros y responsabilidades'
      ]
    },
    {
      categoria: 'Aspectos Críticos a Revisar',
      items: [
        'Competencia municipal para contratar',
        'Modalidad de contratación correcta',
        'Capacidad legal del contratista',
        'Disponibilidad presupuestaria',
        'Garantías según ley (5-10% del monto)',
        'Especificaciones técnicas claras',
        'Mecanismos de supervisión',
        'Cláusulas anticorrupción',
        'Protección de datos municipales',
        'Auditoría y fiscalización'
      ]
    },
    {
      categoria: 'Riesgos Legales a Identificar',
      items: [
        'Incumplimiento de procedimientos',
        'Cláusulas contrarias a la ley',
        'Ambigüedades contractuales',
        'Garantías insuficientes',
        'Plazos poco realistas',
        'Limitación inadecuada de responsabilidad',
        'Falta de mecanismos de control',
        'Conflictos de interés'
      ]
    }
  ];

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-br from-orange-600 to-orange-700 rounded-2xl shadow-xl p-8 text-white">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h2 className="text-3xl font-bold mb-3">
              Agente de Revisión de Contratos Municipales
            </h2>
            <p className="text-orange-100 text-lg leading-relaxed mb-4">
              Sistema experto en análisis jurídico de contratos municipales. Verifica cumplimiento de la Ley de
              Contrataciones del Estado, identifica cláusulas problemáticas, evalúa riesgos legales y proporciona
              recomendaciones fundamentadas para proteger los intereses municipales.
            </p>
            <div className="flex flex-wrap gap-3">
              <span className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-medium">
                Verificación Legal Completa
              </span>
              <span className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-medium">
                Análisis de Cláusulas
              </span>
              <span className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-medium">
                Identificación de Riesgos
              </span>
              <span className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-medium">
                Recomendaciones Correctivas
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Datos del Contrato a Revisar</h3>
            <FormularioDocumento
              campos={camposFormulario}
              onGenerar={manejarGeneracion}
              cargando={cargando}
              tipoDocumento="revisión de contrato"
            />
          </div>

          {documento && (
            <EditorResultado
              contenido={documento}
              onGuardar={(contenido) => console.log('Guardado:', contenido)}
              tipoDocumento="revisión de contrato"
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

export default RedactorCartas;