import React from 'react';
import { X, FileText, Users, Lightbulb } from 'lucide-react';

interface ModalAyudaProps {
  onCerrar: () => void;
}

const ModalAyuda: React.FC<ModalAyudaProps> = ({ onCerrar }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
        <div className="p-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Guía Rápida de Uso
            </h2>
            <button
              onClick={onCerrar}
              className="p-3 hover:bg-gray-100 rounded-xl transition-all duration-200"
            >
              <X size={24} />
            </button>
          </div>

          <div className="space-y-6">
            {/* Introducción */}
            <div>
              <h3 className="text-2xl font-bold text-gray-800 mb-4">
                Bienvenido al AIGP-Municipalidad de Guatemala
              </h3>
              <p className="text-gray-600 text-lg leading-relaxed">
                El Asistente Inteligente de Gestión Pública es una herramienta desarrollada
                para ayudar a los funcionarios de la Municipalidad de Guatemala en la creación de documentos
                oficiales de manera eficiente y estandarizada.
              </p>
            </div>

            {/* Cómo usar */}
            <div>
              <h3 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
                <FileText className="mr-2" size={20} />
                Cómo Usar el Sistema
              </h3>
              <ol className="list-decimal list-inside space-y-3 text-gray-600 text-lg">
                <li>Selecciona el tipo de documento que necesitas en el dashboard</li>
                <li>Completa el formulario con la información requerida</li>
                <li>Agrega contenido adicional si es necesario</li>
                <li>Haz clic en "Generar Documento" y espera el resultado</li>
                <li>Edita el contenido generado si es necesario</li>
                <li>Guarda, copia o descarga tu documento</li>
              </ol>
            </div>

            {/* Tipos de documentos */}
            <div>
              <h3 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
                <Users className="mr-2" size={20} />
                Tipos de Documentos Disponibles
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-4 rounded-xl border border-blue-200">
                  <h4 className="font-bold text-gray-800">Redactor de Oficios</h4>
                  <p className="text-gray-600">Oficios formales institucionales</p>
                </div>
                <div className="bg-gradient-to-r from-emerald-50 to-emerald-100 p-4 rounded-xl border border-emerald-200">
                  <h4 className="font-bold text-gray-800">Generador de Memos</h4>
                  <p className="text-gray-600">Memorandos internos</p>
                </div>
                <div className="bg-gradient-to-r from-purple-50 to-purple-100 p-4 rounded-xl border border-purple-200">
                  <h4 className="font-bold text-gray-800">Redactor de Cartas</h4>
                  <p className="text-gray-600">Cartas oficiales con protocolo</p>
                </div>
                <div className="bg-gradient-to-r from-orange-50 to-orange-100 p-4 rounded-xl border border-orange-200">
                  <h4 className="font-bold text-gray-800">Asistente de Minutas</h4>
                  <p className="text-gray-600">Minutas y actas de reuniones</p>
                </div>
                <div className="bg-gradient-to-r from-teal-50 to-teal-100 p-4 rounded-xl border border-teal-200">
                  <h4 className="font-bold text-gray-800">Resumen de Expedientes</h4>
                  <p className="text-gray-600">Resúmenes ejecutivos</p>
                </div>
                <div className="bg-gradient-to-r from-red-50 to-red-100 p-4 rounded-xl border border-red-200">
                  <h4 className="font-bold text-gray-800">Análisis de Inversión</h4>
                  <p className="text-gray-600">Análisis de proyectos</p>
                </div>
              </div>
            </div>

            {/* Consejos */}
            <div>
              <h3 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
                <Lightbulb className="mr-2" size={20} />
                Consejos Útiles
              </h3>
              <ul className="space-y-3 text-gray-600 text-lg">
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-blue-600 rounded-full mr-3 mt-3"></span>
                  Proporciona información completa y precisa en los formularios
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-blue-600 rounded-full mr-3 mt-3"></span>
                  Utiliza el campo de "Contenido Adicional\" para instrucciones específicas
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-blue-600 rounded-full mr-3 mt-3"></span>
                  Revisa y edita el contenido generado antes de usar
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-blue-600 rounded-full mr-3 mt-3"></span>
                  Consulta el panel de recursos para obtener ayuda específica
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-blue-600 rounded-full mr-3 mt-3"></span>
                  Usa el historial para gestionar tus documentos generados
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-gray-200">
            <button
              onClick={onCerrar}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 rounded-xl transition-all duration-200 font-bold text-lg shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              Entendido
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModalAyuda;