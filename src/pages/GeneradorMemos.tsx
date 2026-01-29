import React, { useState } from 'react';
import FormularioDocumento from '../components/ui/FormularioDocumento';
import EditorResultado from '../components/ui/EditorResultado';
import PanelRecursos from '../components/ui/PanelRecursos';
import { Agent, run, setDefaultOpenAIClient } from "@openai/agents";
import OpenAI from "openai";

interface GeneradorMemosProps {
  usuario: { nombre: string; cargo: string };
}

const GeneradorMemos: React.FC<GeneradorMemosProps> = ({ usuario }) => {
  const [documento, setDocumento] = useState('');
  const [cargando, setCargando] = useState(false);

  const camposFormulario = [
    { nombre: 'destinatario', etiqueta: 'Para', tipo: 'text' as const, requerido: true },
    { nombre: 'cargo_destinatario', etiqueta: 'Cargo', tipo: 'text' as const, requerido: true },
    { nombre: 'departamento', etiqueta: 'Departamento', tipo: 'text' as const, requerido: true },
    { nombre: 'asunto', etiqueta: 'Asunto', tipo: 'text' as const, requerido: true },
    { 
      nombre: 'prioridad', 
      etiqueta: 'Prioridad', 
      tipo: 'select' as const, 
      opciones: ['Normal', 'Alta', 'Urgente'],
      requerido: true
    },
    { 
      nombre: 'tipo_memo', 
      etiqueta: 'Tipo de Memo', 
      tipo: 'select' as const, 
      opciones: ['Informativo', 'Solicitud', 'Instrucciones', 'Recordatorio'],
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

      const prompt = `Eres un agente especializado en elaboración de dictámenes jurídicos municipales. Elabora un dictamen legal con:
      \n\nSolicitante: ${datos.destinatario}\nCargo: ${datos.cargo_destinatario}\nUnidad: ${datos.departamento}\nAsunto: ${datos.asunto}
      \nPrioridad: ${datos.prioridad}\nTipo: ${datos.tipo_memo}\n\nIncluye: antecedentes, normativa aplicable, análisis jurídico fundamentado,
      conclusión y recomendaciones. Firma: ${usuario.nombre}, ${usuario.cargo}, Departamento Jurídico - Municipalidad de Guatemala.`;

      const agent = new Agent({
        name: "GeneradorMemosIA",
        model: "gpt-4o-mini",
        instructions: prompt
      });
      const result = await run(agent, "");
      setDocumento(result.finalOutput ?? 'No se pudo generar el memorando.');
    } catch (err) {
      setDocumento('Error al generar el memorando.');
    }
    setCargando(false);
  };

  const recursosEspecificos = [
    {
      categoria: 'Estructura de Dictamen',
      items: [
        'Antecedentes del caso',
        'Normativa aplicable',
        'Análisis jurídico',
        'Conclusión y recomendaciones'
      ]
    },
    {
      categoria: 'Normativa Base',
      items: [
        'Código Municipal',
        'Ley de Servicio Municipal',
        'Constitución Política',
        'Jurisprudencia CC'
      ]
    }
  ];

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          Dictámenes Jurídicos
        </h2>
        <p className="text-gray-600">
          Elabora dictámenes con análisis de precedentes y fundamentación legal completa
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <FormularioDocumento
            campos={camposFormulario}
            onGenerar={manejarGeneracion}
            cargando={cargando}
            tipoDocumento="memorando"
          />

          {documento && (
            <EditorResultado
              contenido={documento}
              onGuardar={(contenido) => console.log('Guardado:', contenido)}
              tipoDocumento="memorando"
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