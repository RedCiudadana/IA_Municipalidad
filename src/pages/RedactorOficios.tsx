import React, { useState } from 'react';
import FormularioDocumento from '../components/ui/FormularioDocumento';
import EditorResultado from '../components/ui/EditorResultado';
import PanelRecursos from '../components/ui/PanelRecursos';

interface RedactorOficiosProps {
  usuario: { nombre: string; cargo: string };
}

const RedactorOficios: React.FC<RedactorOficiosProps> = () => {
  const [documento, setDocumento] = useState('');
  const [cargando, setCargando] = useState(false);

  const camposFormulario = [
    {
      nombre: 'tema',
      etiqueta: 'Tema de Consulta Legal',
      tipo: 'textarea' as const,
      requerido: true,
      placeholder: 'Ej: Competencias del Concejo Municipal en materia de presupuesto'
    },
    {
      nombre: 'contexto',
      etiqueta: 'Contexto o Situación Específica',
      tipo: 'textarea' as const,
      requerido: false,
      placeholder: 'Describa el contexto o caso concreto que requiere análisis legal (opcional)'
    },
    {
      nombre: 'tipo_normativa',
      etiqueta: 'Tipo de Normativa Prioritaria',
      tipo: 'select' as const,
      opciones: [
        'Todas las normas aplicables',
        'Código Municipal',
        'Constitución',
        'Ley de Contrataciones',
        'Ley de Servicio Municipal',
        'Ordenanzas Municipales',
        'Otras leyes'
      ],
      requerido: false
    },
    {
      nombre: 'ambito',
      etiqueta: 'Ámbito de Aplicación',
      tipo: 'select' as const,
      opciones: [
        'Administrativo',
        'Financiero',
        'Contrataciones',
        'Laboral',
        'Urbanístico',
        'Servicios Públicos',
        'Otro'
      ],
      requerido: false
    }
  ];

  const manejarGeneracion = async (datos: any) => {
    setCargando(true);
    try {
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

      if (!supabaseUrl || !supabaseAnonKey) {
        setDocumento('Error: Variables de entorno de Supabase no configuradas');
        setCargando(false);
        return;
      }

      const apiUrl = `${supabaseUrl}/functions/v1/busqueda-normativa`;

      const requestBody = {
        tema: datos.tema,
        contexto: datos.contexto || undefined,
        tipo_normativa: datos.tipo_normativa !== 'Todas las normas aplicables' ? datos.tipo_normativa : undefined,
        ambito: datos.ambito || undefined
      };

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${supabaseAnonKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error al realizar la búsqueda');
      }

      const data = await response.json();
      setDocumento(data.resultado || 'No se pudo generar el análisis normativo.');
    } catch (err) {
      console.error('Error:', err);
      setDocumento(`Error al realizar la búsqueda de normativa: ${err instanceof Error ? err.message : 'Error desconocido'}`);
    }
    setCargando(false);
  };

  const recursosEspecificos = [
    {
      categoria: 'Normativa Municipal Fundamental',
      items: [
        'Código Municipal (Decreto 12-2002)',
        'Ley General de Descentralización (Decreto 14-2002)',
        'Ley de Consejos de Desarrollo (Decreto 11-2002)',
        'Ordenanzas municipales vigentes'
      ]
    },
    {
      categoria: 'Leyes Complementarias',
      items: [
        'Constitución Política de Guatemala',
        'Ley de Servicio Municipal (Decreto 1-87)',
        'Ley de Contrataciones del Estado (Decreto 57-92)',
        'Ley Orgánica del Presupuesto (Decreto 101-97)',
        'Ley de Probidad (Decreto 89-2002)'
      ]
    },
    {
      categoria: 'Recursos de Consulta',
      items: [
        'Dictámenes de la Procuraduría General',
        'Jurisprudencia de la Corte de Constitucionalidad',
        'Criterios de la Contraloría General de Cuentas'
      ]
    }
  ];

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl shadow-xl p-8 text-white">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h2 className="text-3xl font-bold mb-3">
              Agente de Búsqueda de Normativa Municipal
            </h2>
            <p className="text-blue-100 text-lg leading-relaxed mb-4">
              Sistema especializado en localización y análisis exhaustivo de normativa legal guatemalteca aplicable a casos municipales.
              Proporciona fundamentación jurídica completa con citas normativas precisas.
            </p>
            <div className="flex flex-wrap gap-3">
              <span className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-medium">
                Código Municipal
              </span>
              <span className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-medium">
                Leyes Complementarias
              </span>
              <span className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-medium">
                Ordenanzas Vigentes
              </span>
              <span className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-medium">
                Jurisprudencia
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Realizar Consulta Normativa</h3>
            <FormularioDocumento
              campos={camposFormulario}
              onGenerar={manejarGeneracion}
              cargando={cargando}
              tipoDocumento="búsqueda normativa"
            />
          </div>

          {documento && (
            <EditorResultado
              contenido={documento}
              onGuardar={(contenido) => console.log('Guardado:', contenido)}
              tipoDocumento="análisis normativo"
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