import React, { useState } from 'react';
import FormularioDocumento from '../components/ui/FormularioDocumento';
import EditorResultado from '../components/ui/EditorResultado';
import PanelRecursos from '../components/ui/PanelRecursos';
import { Agent, run, setDefaultOpenAIClient } from "@openai/agents";
import OpenAI from "openai";

interface RedactorCartasProps {
  usuario: { nombre: string; cargo: string };
}

const RedactorCartas: React.FC<RedactorCartasProps> = ({ usuario }) => {
  const [documento, setDocumento] = useState('');
  const [cargando, setCargando] = useState(false);

  const camposFormulario = [
    { nombre: 'destinatario', etiqueta: 'Destinatario', tipo: 'text' as const, requerido: true },
    { nombre: 'cargo_destinatario', etiqueta: 'Cargo', tipo: 'text' as const, requerido: true },
    { nombre: 'institucion', etiqueta: 'Institución', tipo: 'text' as const, requerido: true },
    { nombre: 'ciudad', etiqueta: 'Ciudad', tipo: 'text' as const, requerido: true },
    { nombre: 'asunto', etiqueta: 'Asunto', tipo: 'text' as const, requerido: true },
    { 
      nombre: 'protocolo', 
      etiqueta: 'Nivel de Protocolo', 
      tipo: 'select' as const, 
      opciones: ['Estándar', 'Diplomático', 'Ceremonial'],
      requerido: true
    },
    { 
      nombre: 'tipo_carta', 
      etiqueta: 'Tipo de Carta', 
      tipo: 'select' as const, 
      opciones: ['Invitación', 'Agradecimiento', 'Felicitación', 'Condolencia', 'Presentación'],
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

      const prompt = `Eres un agente especializado en revisión de contratos municipales conforme a la Ley de Contrataciones del Estado.
      Revisa el contrato con: \n\nContratista: ${datos.destinatario}\nTipo: ${datos.cargo_destinatario}\nObjeto: ${datos.institucion}
      \nMonto: ${datos.ciudad}\nAsunto: ${datos.asunto}\nModalidad: ${datos.protocolo}\nRevisión: ${datos.tipo_carta}
      \n\nVerifica: cumplimiento legal, cláusulas esenciales, garantías, plazos. Firma: ${usuario.nombre}, ${usuario.cargo},
      Departamento Jurídico - Municipalidad de Guatemala.`;

      const agent = new Agent({
        name: "RedactorCartasIA",
        model: "gpt-4o-mini",
        instructions: prompt
      });
      const result = await run(agent, "");
      setDocumento(result.finalOutput ?? 'No se pudo generar la carta.');
    } catch (err) {
      setDocumento('Error al generar la carta.');
    }
    setCargando(false);
  };

  const recursosEspecificos = [
    {
      categoria: 'Normativa de Contratación',
      items: [
        'Ley de Contrataciones del Estado',
        'Reglamento de Contrataciones',
        'Código Municipal (contratación)',
        'Manual de contrataciones'
      ]
    },
    {
      categoria: 'Aspectos a Revisar',
      items: [
        'Cláusulas esenciales',
        'Garantías requeridas',
        'Plazos y términos',
        'Penalizaciones y multas'
      ]
    }
  ];

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          Revisión de Contratos Municipales
        </h2>
        <p className="text-gray-600">
          Revisa contratos municipales verificando cumplimiento legal y cláusulas esenciales
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <FormularioDocumento
            campos={camposFormulario}
            onGenerar={manejarGeneracion}
            cargando={cargando}
            tipoDocumento="carta"
          />

          {documento && (
            <EditorResultado
              contenido={documento}
              onGuardar={(contenido) => console.log('Guardado:', contenido)}
              tipoDocumento="carta"
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