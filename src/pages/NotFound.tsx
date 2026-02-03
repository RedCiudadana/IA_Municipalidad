import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Home, Search, ArrowLeft, AlertTriangle } from 'lucide-react';

const NotFound: React.FC = () => {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-2xl mx-auto text-center p-8">
        <div className="bg-white rounded-3xl shadow-2xl p-12 border border-gray-100">
          {/* Error Icon */}
          <div className="mb-8">
            <div className="w-32 h-32 bg-gradient-to-br from-red-500 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-2xl">
              <AlertTriangle size={64} className="text-white" />
            </div>
            
            <h1 className="text-8xl font-bold bg-gradient-to-r from-red-600 to-orange-600 bg-clip-text text-transparent mb-4">
              404
            </h1>
            
            <h2 className="text-3xl font-bold text-gray-800 mb-4">
              Página No Encontrada
            </h2>
            
            <p className="text-gray-600 text-lg mb-8 leading-relaxed">
              Lo sentimos, la página que estás buscando no existe o ha sido movida. 
              Puede que el enlace esté roto o que hayas ingresado una URL incorrecta.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="space-y-4">
            <button
              onClick={() => navigate('/')}
              className="inline-flex items-center space-x-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 rounded-2xl transition-all duration-200 font-semibold shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              <Home size={20} />
              <span>Volver al Inicio</span>
            </button>

            <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4 mt-6">
              <button
                onClick={() => window.history.back()}
                className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 transition-colors font-medium"
              >
                <ArrowLeft size={16} />
                <span>Página Anterior</span>
              </button>
              
              <span className="text-gray-400 hidden sm:block">•</span>
              
              <button
                onClick={() => navigate('/')}
                className="flex items-center space-x-2 text-blue-600 hover:text-blue-800 transition-colors font-medium"
              >
                <Search size={16} />
                <span>Explorar Agentes</span>
              </button>
            </div>
          </div>

          {/* Help Section */}
          <div className="mt-12 pt-8 border-t border-gray-200">
            <h3 className="text-xl font-bold text-gray-800 mb-4">
              ¿Necesitas Ayuda?
            </h3>
            
            <div className="flex justify-center">
              <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-6 rounded-2xl border border-blue-200 max-w-md w-full">
                <h4 className="font-bold text-blue-900 mb-2">Páginas Principales</h4>
                <ul className="text-blue-800 space-y-1 text-sm">
                  <li>• Dashboard de Agentes</li>
                  <li>• Tutoriales del Sistema</li>
                  <li>• Historial de Documentos</li>
                  <li>• Curso de Inteligencia Artificial</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Institutional Branding */}
          <div className="mt-8 pt-8 border-t border-gray-200">
            <div className="flex items-center justify-center space-x-6">
              <img
                src="https://datos.segeplan.gob.gt/uploads/admin/2024-06-04-213946.470432PAGINA-DATOS-ABIERTOS-13.png"
                alt="Municipalidad de Guatemala"
                className="h-8 w-auto object-contain"
              />
              <span className="text-gray-400">+</span>
              <img
                src="https://datos.segeplan.gob.gt/img/redciudadana-logo.png"
                alt="Red Ciudadana"
                className="h-6 w-auto object-contain"
              />
            </div>
            <p className="text-gray-500 text-sm mt-4">
              Asistente Inteligente de Gestión Pública - Municipalidad de Guatemala
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;