import React, { useState } from 'react';
import FormularioDocumento from '../components/ui/FormularioDocumento';
import EditorResultado from '../components/ui/EditorResultado';
import PanelRecursos from '../components/ui/PanelRecursos';
import FileUpload from '../components/ui/FileUpload';
import { supabase } from '../lib/supabase';

interface AnalisisInversionProps {
  usuario: { nombre: string; cargo: string };
}

const AnalisisInversion: React.FC<AnalisisInversionProps> = ({ usuario }) => {
  const [documento, setDocumento] = useState('');
  const [cargando, setCargando] = useState(false);
  const [archivosSubidos, setArchivosSubidos] = useState<any[]>([]);

  const camposFormulario = [
    { nombre: 'nombre_proyecto', etiqueta: 'Nombre del Proyecto', tipo: 'text' as const, requerido: true },
    { nombre: 'monto_inversion', etiqueta: 'Monto de Inversión (GTQ)', tipo: 'number' as const, requerido: true },
    { nombre: 'plazo_ejecucion', etiqueta: 'Plazo de Ejecución', tipo: 'text' as const, requerido: true },
    { nombre: 'fuente_financiamiento', etiqueta: 'Fuente de Financiamiento', tipo: 'text' as const, requerido: true },
    { nombre: 'ubicacion', etiqueta: 'Ubicación del Proyecto', tipo: 'text' as const, requerido: true },
    {
      nombre: 'tipo_analisis',
      etiqueta: 'Tipo de Análisis',
      tipo: 'select' as const,
      opciones: ['Técnico-Financiero', 'Costo-Beneficio', 'Viabilidad', 'Factibilidad', 'Impacto Social'],
      requerido: true
    },
    { nombre: 'beneficiarios', etiqueta: 'Población Beneficiaria', tipo: 'text' as const },
    { nombre: 'justificacion', etiqueta: 'Justificación del Proyecto', tipo: 'textarea' as const }
  ];

  const manejarGeneracion = async (datos: any) => {
    setCargando(true);
    try {
      const apiUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/analizar-inversion`;

      const requestBody = {
        nombre_proyecto: datos.nombre_proyecto,
        monto_inversion: datos.monto_inversion,
        plazo_ejecucion: datos.plazo_ejecucion,
        fuente_financiamiento: datos.fuente_financiamiento,
        ubicacion: datos.ubicacion,
        tipo_analisis: datos.tipo_analisis,
        beneficiarios: datos.beneficiarios,
        justificacion: datos.justificacion,
        archivos: archivosSubidos.length > 0 ? archivosSubidos : undefined,
        usuario_nombre: usuario.nombre,
        usuario_cargo: usuario.cargo
      };

      const { data: { session } } = await supabase.auth.getSession();

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${session?.access_token || import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error al generar el análisis');
      }

      const result = await response.json();
      setDocumento(result.analisis || 'No se pudo generar el análisis.');
    } catch (err) {
      console.error('Error:', err);
      setDocumento(`Error al generar el análisis: ${err instanceof Error ? err.message : 'Error desconocido'}`);
    }
    setCargando(false);
  };

  const recursosEspecificos = [
    {
      categoria: 'Componentes del Análisis',
      items: [
        'Análisis técnico',
        'Análisis financiero (VAN, TIR)',
        'Análisis económico-social',
        'Análisis de riesgos',
        'Marco legal y normativo',
        'Conclusiones y recomendaciones'
      ]
    },
    {
      categoria: 'Normativa Aplicable',
      items: [
        'Ley de Contrataciones del Estado',
        'Ley Orgánica del Presupuesto',
        'Código Municipal',
        'Normativa ambiental'
      ]
    }
  ];

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          Análisis de Proyectos de Inversión
        </h2>
        <p className="text-gray-600">
          Genera análisis técnicos, financieros y legales completos de proyectos de inversión municipal
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Subida de documentos del proyecto */}
          <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
            <h3 className="text-2xl font-bold text-gray-800 mb-6">
              Documentos del Proyecto
            </h3>
            <p className="text-gray-600 mb-4">
              Sube los documentos del expediente de inversión para un análisis más preciso
            </p>
            <FileUpload
              onArchivosSubidos={setArchivosSubidos}
              tiposPermitidos={['.pdf', '.doc', '.docx', '.txt', '.xls', '.xlsx']}
              tamaño_maximo={20}
              multiple={true}
            />
          </div>

          <FormularioDocumento
            campos={camposFormulario}
            onGenerar={manejarGeneracion}
            cargando={cargando}
            tipoDocumento="analisis"
          />

          {documento && (
            <EditorResultado
              contenido={documento}
              onGuardar={(contenido) => console.log('Guardado:', contenido)}
              tipoDocumento="analisis"
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

export default AnalisisInversion;