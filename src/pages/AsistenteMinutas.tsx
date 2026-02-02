import React, { useState } from 'react';
import FormularioDocumento from '../components/ui/FormularioDocumento';
import EditorResultado from '../components/ui/EditorResultado';
import PanelRecursos from '../components/ui/PanelRecursos';
import FileUpload from '../components/ui/FileUpload';
import { supabase } from '../lib/supabase';

interface AsistenteMinutasProps {
  usuario: { nombre: string; cargo: string };
}

const AsistenteMinutas: React.FC<AsistenteMinutasProps> = ({ usuario }) => {
  const [documento, setDocumento] = useState('');
  const [cargando, setCargando] = useState(false);
  const [archivosSubidos, setArchivosSubidos] = useState<any[]>([]);

  const camposFormulario = [
    { nombre: 'titulo_reunion', etiqueta: 'Título de la Reunión', tipo: 'text' as const, requerido: true },
    { nombre: 'fecha_reunion', etiqueta: 'Fecha de la Reunión', tipo: 'date' as const, requerido: true },
    { nombre: 'hora_inicio', etiqueta: 'Hora de Inicio', tipo: 'time' as const, requerido: true },
    { nombre: 'hora_fin', etiqueta: 'Hora de Finalización', tipo: 'time' as const },
    { nombre: 'lugar', etiqueta: 'Lugar', tipo: 'text' as const, requerido: true },
    { nombre: 'moderador', etiqueta: 'Moderador', tipo: 'text' as const, requerido: true },
    { 
      nombre: 'tipo_documento', 
      etiqueta: 'Tipo de Documento', 
      tipo: 'select' as const, 
      opciones: ['Minuta', 'Acta', 'Memoria de Reunión'],
      requerido: true
    },
    { nombre: 'participantes', etiqueta: 'Participantes (separados por coma)', tipo: 'textarea' as const, requerido: true }
  ];

  const manejarGeneracion = async (datos: any) => {
    setCargando(true);
    try {
      const apiUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/generar-minuta`;

      const requestBody = {
        titulo_reunion: datos.titulo_reunion,
        fecha_reunion: datos.fecha_reunion,
        hora_inicio: datos.hora_inicio,
        hora_fin: datos.hora_fin,
        lugar: datos.lugar,
        moderador: datos.moderador,
        tipo_documento: datos.tipo_documento,
        participantes: datos.participantes,
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
        throw new Error(errorData.error || 'Error al generar el documento');
      }

      const result = await response.json();
      setDocumento(result.documento || 'No se pudo generar la minuta/acta.');
    } catch (err) {
      console.error('Error:', err);
      setDocumento(`Error al generar la minuta/acta: ${err instanceof Error ? err.message : 'Error desconocido'}`);
    }
    setCargando(false);
  };

  const recursosEspecificos = [
    {
      categoria: 'Elementos de una Minuta',
      items: [
        'Encabezado con fecha y lugar',
        'Lista de asistentes',
        'Orden del día',
        'Desarrollo y acuerdos',
        'Compromisos y responsables',
        'Cierre y firmas'
      ]
    },
    {
      categoria: 'Tipos de Documento',
      items: [
        'Minuta: Resumen ejecutivo',
        'Acta: Documento formal completo',
        'Memoria: Detalle extenso'
      ]
    }
  ];

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          Asistente para Minutas y Actas
        </h2>
        <p className="text-gray-600">
          Genera minutas, actas y memorias de reuniones de forma profesional y estructurada
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Subida de documentos de la reunión */}
          <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
            <h3 className="text-2xl font-bold text-gray-800 mb-6">
              Documentos de la Reunión
            </h3>
            <p className="text-gray-600 mb-4">
              Sube documentos relacionados con la reunión (agenda, presentaciones, etc.)
            </p>
            <FileUpload
              onArchivosSubidos={setArchivosSubidos}
              tiposPermitidos={['.pdf', '.doc', '.docx', '.txt', '.ppt', '.pptx']}
              tamaño_maximo={25}
              multiple={true}
            />
          </div>

          <FormularioDocumento
            campos={camposFormulario}
            onGenerar={manejarGeneracion}
            cargando={cargando}
            tipoDocumento="minuta"
          />

          {documento && (
            <EditorResultado
              contenido={documento}
              onGuardar={(contenido) => console.log('Guardado:', contenido)}
              tipoDocumento="minuta"
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

export default AsistenteMinutas;