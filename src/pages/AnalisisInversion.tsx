import React, { useState } from 'react';
import FormularioDocumento from '../components/ui/FormularioDocumento';
import EditorResultado from '../components/ui/EditorResultado';
import PanelRecursos from '../components/ui/PanelRecursos';
import FileUpload from '../components/ui/FileUpload';
import { Agent, run, setDefaultOpenAIClient } from "@openai/agents";
import OpenAI from "openai";

interface AnalisisInversionProps {
  usuario: { nombre: string; cargo: string };
}

const AnalisisInversion: React.FC<AnalisisInversionProps> = ({ usuario }) => {
  const [documento, setDocumento] = useState('');
  const [cargando, setCargando] = useState(false);
  const [archivosSubidos, setArchivosSubidos] = useState<any[]>([]);

  const camposFormulario = [
    { nombre: 'codigo_proyecto', etiqueta: 'Código del Proyecto', tipo: 'text' as const, requerido: true },
    { nombre: 'nombre_proyecto', etiqueta: 'Nombre del Proyecto', tipo: 'text' as const, requerido: true },
    { nombre: 'institucion_ejecutora', etiqueta: 'Institución Ejecutora', tipo: 'text' as const, requerido: true },
    { nombre: 'monto_total', etiqueta: 'Monto Total (GTQ)', tipo: 'number' as const, requerido: true },
    { nombre: 'fecha_inicio', etiqueta: 'Fecha de Inicio', tipo: 'date' as const, requerido: true },
    { nombre: 'fecha_fin', etiqueta: 'Fecha de Finalización', tipo: 'date' as const, requerido: true },
    { 
      nombre: 'categoria_inversion', 
      etiqueta: 'Categoría de Inversión', 
      tipo: 'select' as const, 
      opciones: ['Infraestructura', 'Educación', 'Salud', 'Desarrollo Social', 'Medio Ambiente'],
      requerido: true
    },
    { 
      nombre: 'tipo_analisis', 
      etiqueta: 'Tipo de Análisis', 
      tipo: 'select' as const, 
      opciones: ['Viabilidad', 'Factibilidad', 'Seguimiento', 'Evaluación'],
      requerido: true
    },
    { nombre: 'region', etiqueta: 'Región', tipo: 'text' as const, requerido: true }
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
        archivos = `\nDocumentos del expediente: ${archivosSubidos.map(a => a.nombre).join(', ')}`;
        const textos = archivosSubidos
          .filter(a => a.contenido)
          .map(a => `Contenido de ${a.nombre}:\n${a.contenido.substring(0, 1000)}`)
          .join('\n\n');
        if (textos) {
          referenciaArchivos = `\n\nReferencia de documentos subidos:\n${textos}`;
        }
      }
      const prompt = `Redacta un análisis ${datos.tipo_analisis.toLowerCase()} de expediente de inversión pública para SEGEPLAN con la siguiente información:\n\nCódigo del proyecto: ${datos.codigo_proyecto}\nNombre del proyecto: ${datos.nombre_proyecto}\nInstitución ejecutora: ${datos.institucion_ejecutora}\nMonto total: Q. ${Number(datos.monto_total).toLocaleString('es-GT')}\nPeríodo de ejecución: ${datos.fecha_inicio} - ${datos.fecha_fin}\nCategoría: ${datos.categoria_inversion}\nRegión: ${datos.region}${archivos}${referenciaArchivos}\n\nEl documento debe estar firmado por: ${usuario.nombre}, ${usuario.cargo}, SEGEPLAN. Usa un formato profesional y adecuado para un análisis de expediente oficial.`;

      const agent = new Agent({
        name: "AnalisisInversionIA",
        model: "gpt-4o-mini",
        instructions: prompt
      });
      const result = await run(agent, "");
      setDocumento(result.finalOutput ?? 'No se pudo generar el análisis.');
    } catch (err) {
      setDocumento('Error al generar el análisis.');
    }
    setCargando(false);
  };

  const recursosEspecificos = [
    {
      categoria: 'Marco Normativo',
      items: [
        'Ley de Inversión Pública',
        'Reglamento SNIP',
        'Guías metodológicas',
        'Criterios de evaluación'
      ]
    },
    {
      categoria: 'Herramientas de Análisis',
      items: [
        'Análisis costo-beneficio',
        'Evaluación de riesgos',
        'Indicadores de impacto',
        'Matrices de evaluación'
      ]
    }
  ];

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          Análisis de Expediente de Inversión
        </h2>
        <p className="text-gray-600">
          Analiza y evalúa expedientes de proyectos de inversión pública bajo normativa SNIP
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