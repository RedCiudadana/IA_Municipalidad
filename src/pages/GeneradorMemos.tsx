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

      const prompt = `Redacta un memorando interno siguiendo los protocolos institucionales de SEGEPLAN con la siguiente información:\n\nPara: ${datos.destinatario}\nCargo: ${datos.cargo_destinatario}\nDepartamento: ${datos.departamento}\nAsunto: ${datos.asunto}\nPrioridad: ${datos.prioridad}\nTipo de memo: ${datos.tipo_memo}\n\nEl documento debe estar firmado por: ${usuario.nombre}, ${usuario.cargo}, SEGEPLAN. Usa un formato profesional y adecuado para un memorando oficial.`;

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
      categoria: 'Tipos de Memorandos',
      items: [
        'Memorando informativo',
        'Memorando de solicitud',
        'Memorando de instrucciones',
        'Memorando de recordatorio'
      ]
    },
    {
      categoria: 'Mejores Prácticas',
      items: [
        'Claridad en el asunto',
        'Brevedad y precisión',
        'Estructura lógica',
        'Seguimiento adecuado'
      ]
    }
  ];

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          Generador de Memos Internos
        </h2>
        <p className="text-gray-600">
          Crea memorandos internos con formato estandarizado para comunicación interna
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