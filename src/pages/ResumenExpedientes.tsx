import React, { useState } from 'react';
import FormularioDocumento from '../components/ui/FormularioDocumento';
import EditorResultado from '../components/ui/EditorResultado';
import PanelRecursos from '../components/ui/PanelRecursos';
import FileUpload from '../components/ui/FileUpload';
import { supabase } from '../lib/supabase';

interface ResumenExpedientesProps {
  usuario: { nombre: string; cargo: string };
}

const ResumenExpedientes: React.FC<ResumenExpedientesProps> = ({ usuario }) => {
  const [documento, setDocumento] = useState('');
  const [cargando, setCargando] = useState(false);
  const [archivosSubidos, setArchivosSubidos] = useState<any[]>([]);

  const camposFormulario = [
    { nombre: 'numero_expediente', etiqueta: 'Número de Expediente', tipo: 'text' as const, requerido: true },
    {
      nombre: 'tipo_caso',
      etiqueta: 'Tipo de Caso',
      tipo: 'select' as const,
      opciones: ['Civil', 'Penal', 'Laboral', 'Administrativo', 'Contencioso Administrativo', 'Constitucional', 'Mercantil'],
      requerido: true
    },
    { nombre: 'demandante', etiqueta: 'Demandante/Solicitante', tipo: 'text' as const },
    { nombre: 'demandado', etiqueta: 'Demandado/Requerido', tipo: 'text' as const },
    { nombre: 'fecha_inicio', etiqueta: 'Fecha de Inicio', tipo: 'date' as const },
    {
      nombre: 'estado',
      etiqueta: 'Estado del Expediente',
      tipo: 'select' as const,
      opciones: ['En trámite', 'Pendiente de resolución', 'Resuelto', 'Archivado', 'Suspendido'],
      requerido: false
    }
  ];

  const manejarGeneracion = async (datos: any) => {
    setCargando(true);
    try {
      const apiUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/generar-resumen-expediente`;

      const requestBody = {
        numero_expediente: datos.numero_expediente,
        tipo_caso: datos.tipo_caso,
        demandante: datos.demandante,
        demandado: datos.demandado,
        fecha_inicio: datos.fecha_inicio,
        estado: datos.estado,
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
        throw new Error(errorData.error || 'Error al generar el resumen');
      }

      const result = await response.json();
      setDocumento(result.resumen || 'No se pudo generar el resumen.');

      if (result.guardado && result.documento_id) {
        console.log('Documento guardado exitosamente con ID:', result.documento_id);
      }
    } catch (err) {
      console.error('Error:', err);
      setDocumento(`Error al generar el resumen: ${err instanceof Error ? err.message : 'Error desconocido'}`);
    }
    setCargando(false);
  };

  const recursosEspecificos = [
    {
      categoria: 'Elementos del Resumen',
      items: [
        'Datos generales del expediente',
        'Antecedentes y hechos relevantes',
        'Marco jurídico aplicable',
        'Análisis legal',
        'Actuaciones procesales',
        'Conclusiones y recomendaciones'
      ]
    },
    {
      categoria: 'Tipos de Casos',
      items: [
        'Civil',
        'Penal',
        'Laboral',
        'Administrativo',
        'Contencioso Administrativo',
        'Constitucional'
      ]
    }
  ];

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          Generador de Resúmenes Ejecutivos de Expedientes
        </h2>
        <p className="text-gray-600">
          Genera análisis jurídicos completos y resúmenes ejecutivos de expedientes legales
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Subida de archivos */}
          <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
            <h3 className="text-2xl font-bold text-gray-800 mb-6">
              Documentos del Expediente
            </h3>
            <FileUpload
              onArchivosSubidos={setArchivosSubidos}
              tiposPermitidos={['.pdf', '.doc', '.docx', '.txt']}
              tamaño_maximo={15}
              multiple={true}
            />
          </div>

          <FormularioDocumento
            campos={camposFormulario}
            onGenerar={manejarGeneracion}
            cargando={cargando}
            tipoDocumento="resumen"
          />

          {documento && (
            <EditorResultado
              contenido={documento}
              onGuardar={(contenido) => console.log('Guardado:', contenido)}
              tipoDocumento="resumen"
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

export default ResumenExpedientes;