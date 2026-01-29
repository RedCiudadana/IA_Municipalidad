import React, { useState } from 'react';
import FormularioDocumento from '../components/ui/FormularioDocumento';
import EditorResultado from '../components/ui/EditorResultado';
import PanelRecursos from '../components/ui/PanelRecursos';
import FileUpload from '../components/ui/FileUpload';
import { Agent, run, setDefaultOpenAIClient } from "@openai/agents";
import OpenAI from "openai";

interface ResumenExpedientesProps {
  usuario: { nombre: string; cargo: string };
}

const ResumenExpedientes: React.FC<ResumenExpedientesProps> = ({ usuario }) => {
  const [documento, setDocumento] = useState('');
  const [cargando, setCargando] = useState(false);
  const [archivosSubidos, setArchivosSubidos] = useState<any[]>([]);

  const camposFormulario = [
    { nombre: 'numero_expediente', etiqueta: 'Número de Expediente', tipo: 'text' as const, requerido: true },
    { nombre: 'titulo_expediente', etiqueta: 'Título del Expediente', tipo: 'text' as const, requerido: true },
    { nombre: 'fecha_inicio', etiqueta: 'Fecha de Inicio', tipo: 'date' as const, requerido: true },
    { nombre: 'responsable', etiqueta: 'Responsable', tipo: 'text' as const, requerido: true },
    { nombre: 'departamento', etiqueta: 'Departamento', tipo: 'text' as const, requerido: true },
    { 
      nombre: 'estado_expediente', 
      etiqueta: 'Estado del Expediente', 
      tipo: 'select' as const, 
      opciones: ['En Proceso', 'Completado', 'Suspendido', 'Archivado'],
      requerido: true
    },
    { 
      nombre: 'tipo_resumen', 
      etiqueta: 'Tipo de Resumen', 
      tipo: 'select' as const, 
      opciones: ['Ejecutivo', 'Técnico', 'Administrativo', 'Legal'],
      requerido: true
    },
    { nombre: 'paginas_totales', etiqueta: 'Número Total de Páginas', tipo: 'number' as const }
  ];

  const manejarGeneracion = async (datos: any) => {
    setCargando(true);
    try {
      const apiKey = import.meta.env.VITE_OPENAI_API_KEY;
      if (!apiKey) {
        setDocumento('Error: No está definida la variable VITE_OPENAI_API_KEY');
        setCargando(false);
        return;
      }
      const client = new OpenAI({
        apiKey,
        dangerouslyAllowBrowser: true
      });
      setDefaultOpenAIClient(client);

      let archivos = '';
      let referenciaArchivos = '';
      if (archivosSubidos.length > 0) {
        archivos = `\nDocumentos analizados: ${archivosSubidos.map(a => a.nombre).join(', ')}`;
        const textos = archivosSubidos
          .filter(a => a.contenido)
          .map(a => `Contenido de ${a.nombre}:\n${a.contenido.substring(0, 1000)}`)
          .join('\n\n');
        if (textos) {
          referenciaArchivos = `\n\nReferencia de documentos subidos:\n${textos}`;
        }
      }
      const prompt = `Redacta un resumen ${datos.tipo_resumen.toLowerCase()} de expediente para SEGEPLAN con la siguiente información:\n\nExpediente No.: ${datos.numero_expediente}\nTítulo: ${datos.titulo_expediente}\nFecha de inicio: ${datos.fecha_inicio}\nResponsable: ${datos.responsable}\nDepartamento: ${datos.departamento}\nEstado: ${datos.estado_expediente}\nPáginas totales: ${datos.paginas_totales || 'N/A'}${archivos}${referenciaArchivos}\n\nEl documento debe estar firmado por: ${usuario.nombre}, ${usuario.cargo}, SEGEPLAN. Usa un formato profesional y adecuado para un resumen de expediente oficial.`;

      const agent = new Agent({
        name: "ResumenExpedientesIA",
        model: "gpt-4o-mini",
        instructions: prompt
      });
      const result = await run(agent, "");
      setDocumento(result.finalOutput ?? 'No se pudo generar el resumen.');
    } catch (err) {
      setDocumento('Error al generar el resumen.');
    }
    setCargando(false);
  };

  const recursosEspecificos = [
    {
      categoria: 'Tipos de Resumen',
      items: [
        'Resumen ejecutivo',
        'Resumen técnico',
        'Resumen administrativo',
        'Resumen legal'
      ]
    },
    {
      categoria: 'Metodología',
      items: [
        'Análisis de contenido',
        'Identificación de elementos clave',
        'Síntesis de información',
        'Estructura lógica'
      ]
    }
  ];

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          Resumen de Expedientes
        </h2>
        <p className="text-gray-600">
          Genera resúmenes ejecutivos de expedientes complejos con análisis estructurado
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