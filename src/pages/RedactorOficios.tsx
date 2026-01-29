import React, { useState } from 'react';
import FormularioDocumento from '../components/ui/FormularioDocumento';
import EditorResultado from '../components/ui/EditorResultado';
import PanelRecursos from '../components/ui/PanelRecursos';
import { Agent, run, setDefaultOpenAIClient } from "@openai/agents";
import OpenAI from "openai";

interface RedactorOficiosProps {
  usuario: { nombre: string; cargo: string };
}

const RedactorOficios: React.FC<RedactorOficiosProps> = ({ usuario }) => {
  const [documento, setDocumento] = useState('');
  const [cargando, setCargando] = useState(false);

  const camposFormulario = [
    { nombre: 'destinatario', etiqueta: 'Destinatario', tipo: 'text' as const, requerido: true },
    { nombre: 'cargo_destinatario', etiqueta: 'Cargo del Destinatario', tipo: 'text' as const, requerido: true },
    { nombre: 'institucion', etiqueta: 'Institución', tipo: 'text' as const, requerido: true },
    { nombre: 'asunto', etiqueta: 'Asunto', tipo: 'text' as const, requerido: true },
    { 
      nombre: 'tipo_lenguaje', 
      etiqueta: 'Tipo de Lenguaje', 
      tipo: 'select' as const, 
      opciones: ['Formal', 'Muy Formal', 'Protocolar'],
      requerido: true
    },
    { 
      nombre: 'urgencia', 
      etiqueta: 'Nivel de Urgencia', 
      tipo: 'select' as const, 
      opciones: ['Normal', 'Urgente', 'Muy Urgente'],
      requerido: true
    }
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

      const prompt = `Redacta un oficio institucional siguiendo los protocolos de SEGEPLAN con la siguiente información:
      \n\nDestinatario: ${datos.destinatario}\nCargo del destinatario: ${datos.cargo_destinatario}
      \nInstitución: ${datos.institucion}\nAsunto: ${datos.asunto}\nTipo de lenguaje: ${datos.tipo_lenguaje}
      \nNivel de urgencia: ${datos.urgencia}\n\nEl documento debe estar firmado por: ${usuario.nombre}, ${usuario.cargo}, 
      SEGEPLAN. Usa un formato ${datos.tipo_lenguaje} y adecuado para un oficio oficial.`;

      const agent = new Agent({
        name: "RedactorOficiosIA",
        model: "gpt-4o-mini",
        instructions: prompt
      });
      const result = await run(agent, "");
      setDocumento(result.finalOutput ?? 'No se pudo generar el oficio.');
    } catch (err) {
      setDocumento('Error al generar el oficio.');
    }
    setCargando(false);
  };

  const recursosEspecificos = [
    {
      categoria: 'Plantillas de Oficios',
      items: [
        'Oficio de solicitud de información',
        'Oficio de convocatoria',
        'Oficio de respuesta institucional'
      ]
    },
    {
      categoria: 'Normativa',
      items: [
        'Manual de correspondencia oficial',
        'Protocolo de comunicaciones SEGEPLAN',
        'Guía de redacción institucional'
      ]
    }
  ];

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          Redactor de Oficios
        </h2>
        <p className="text-gray-600">
          Genera oficios formales siguiendo los protocolos institucionales de SEGEPLAN
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <FormularioDocumento
            campos={camposFormulario}
            onGenerar={manejarGeneracion}
            cargando={cargando}
            tipoDocumento="oficio"
          />

          {documento && (
            <EditorResultado
              contenido={documento}
              onGuardar={(contenido) => console.log('Guardado:', contenido)}
              tipoDocumento="oficio"
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

export default RedactorOficios;