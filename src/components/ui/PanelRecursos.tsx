import React from 'react';
import { BookOpen, Lightbulb } from 'lucide-react';

interface Recurso {
  categoria: string;
  items: string[];
}

interface PanelRecursosProps {
  recursos: Recurso[];
}

const PanelRecursos: React.FC<PanelRecursosProps> = ({ recursos }) => {
  const tipsGenerales = [
    'Usa un lenguaje claro y directo',
    'Estructura la información de forma lógica',
    'Revisa la ortografía y gramática',
    'Mantén un tono profesional',
    'Incluye toda la información necesaria'
  ];

  return (
    <div className="space-y-6">
      {/* Recursos específicos */}
      <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
        <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
          <BookOpen className="mr-2" size={20} />
          Recursos Institucionales
        </h3>
        
        {recursos.map((recurso, index) => (
          <div key={index} className="mb-6">
            <h4 className="font-bold text-gray-800 mb-3">
              {recurso.categoria}
            </h4>
            <ul className="space-y-2">
              {recurso.items.map((item, itemIndex) => (
                <li key={itemIndex} className="text-gray-600 flex items-center">
                  <span className="w-2 h-2 bg-blue-600 rounded-full mr-3"></span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Tips de redacción */}
      <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
        <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
          <Lightbulb className="mr-2" size={20} />
          Tips de Redacción
        </h3>

        <ul className="space-y-3">
          {tipsGenerales.map((tip, index) => (
            <li key={index} className="text-gray-600 flex items-start">
              <span className="w-2 h-2 bg-yellow-500 rounded-full mr-3 mt-2"></span>
              {tip}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default PanelRecursos;