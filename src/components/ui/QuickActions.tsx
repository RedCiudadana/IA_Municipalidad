import React from 'react';
import { DivideIcon as LucideIcon } from 'lucide-react';

interface Accion {
  titulo: string;
  descripcion: string;
  icono: LucideIcon;
  accion: () => void;
}

interface QuickActionsProps {
  acciones: Accion[];
}

const QuickActions: React.FC<QuickActionsProps> = ({ acciones }) => {
  return (
    <div className="bg-white rounded-3xl shadow-xl p-6 border border-gray-100">
      <h3 className="text-xl font-bold text-gray-800 mb-6">Acciones Rápidas</h3>
      <div className="space-y-4">
        {acciones.map((accion, index) => {
          const IconoComponente = accion.icono;
          
          return (
            <button
              key={index}
              onClick={accion.accion}
              className="w-full flex items-center space-x-4 p-4 rounded-2xl hover:bg-gray-50 transition-all duration-200 text-left group"
            >
              <div className="w-12 h-12 bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl flex items-center justify-center group-hover:from-blue-100 group-hover:to-purple-100 transition-all duration-200">
                <IconoComponente size={20} className="text-gray-600 group-hover:text-blue-600" />
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-gray-800 group-hover:text-blue-600 transition-colors">
                  {accion.titulo}
                </h4>
                <p className="text-gray-600 text-sm">
                  {accion.descripcion}
                </p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default QuickActions;