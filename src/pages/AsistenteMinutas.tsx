import React, { useState } from 'react';
import FormularioDocumento from '../components/ui/FormularioDocumento';
import EditorResultado from '../components/ui/EditorResultado';
import PanelRecursos from '../components/ui/PanelRecursos';
import FileUpload from '../components/ui/FileUpload';
import { Agent, run, setDefaultOpenAIClient } from "@openai/agents";
import OpenAI from "openai";

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

      const participantesLista = datos.participantes.split(',').map((p: string) => p.trim());
      let archivos = '';
      let referenciaArchivos = '';
      if (archivosSubidos.length > 0) {
        archivos = `\nDocumentos de referencia: ${archivosSubidos.map(a => a.nombre).join(', ')}`;
        const textos = archivosSubidos
          .filter(a => a.contenido)
          .map(a => `Contenido de ${a.nombre}:\n${a.contenido.substring(0, 1000)}`)
          .join('\n\n');
        if (textos) {
          referenciaArchivos = `\n\nReferencia de documentos subidos:\n${textos}`;
        }
      }
      const prompt = `Redacta una ${datos.tipo_documento.toLowerCase()} institucional de SEGEPLAN con la siguiente información:\n\nTítulo: ${datos.titulo_reunion}\nFecha: ${datos.fecha_reunion}\nHora: ${datos.hora_inicio} - ${datos.hora_fin || 'Por definir'}\nLugar: ${datos.lugar}\nModerador: ${datos.moderador}\nParticipantes: ${participantesLista.join(', ')}${archivos}${referenciaArchivos}\n\nEl documento debe estar firmado por: ${usuario.nombre}, ${usuario.cargo}, SEGEPLAN. Usa un formato profesional y adecuado para una minuta/acta oficial.`;

      const agent = new Agent({
        name: "AsistenteMinutasIA",
        model: "gpt-4o-mini",
        instructions: prompt
      });
      const result = await run(agent, "");
      setDocumento(result.finalOutput ?? 'No se pudo generar la minuta/acta.');
    } catch (err) {
      setDocumento('Error al generar la minuta/acta.');
    }
    setCargando(false);
  };

  const recursosEspecificos = [
    {
      categoria: 'Estructura de Documentos',
      items: [
        'Diferencias entre minuta y acta',
        'Elementos obligatorios',
        'Formato de compromisos',
        'Seguimiento de acuerdos'
      ]
    },
    {
      categoria: 'Mejores Prácticas',
      items: [
        'Registro de participantes',
        'Claridad en los acuerdos',
        'Asignación de responsables',
        'Fechas límite específicas'
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
          Elabora minutas y actas de reuniones institucionales con formato estándar
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