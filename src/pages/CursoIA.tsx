import React, { useEffect } from 'react';
import { ExternalLink, BookOpen, Zap } from 'lucide-react';

const CursoIA: React.FC = () => {
  useEffect(() => {
    // Redirect after a short delay to show the page briefly
    const timer = setTimeout(() => {
      window.open('https://escuela.redciudadana.org/course/inteligencia-artificial-basico', '_blank');
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  const handleRedirect = () => {
    window.open('https://escuela.redciudadana.org/course/inteligencia-artificial-basico', '_blank');
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="max-w-2xl mx-auto text-center p-8">
        <div className="bg-white rounded-3xl shadow-2xl p-12 border border-gray-100">
          <div className="mb-8">
            <div className="w-24 h-24 bg-gradient-to-br from-blue-600 to-purple-600 rounded-3xl flex items-center justify-center mx-auto mb-6">
              <BookOpen size={48} className="text-white" />
            </div>
            
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
              Curso de Inteligencia Artificial
            </h1>
            
            <p className="text-gray-600 text-lg mb-8 leading-relaxed">
              Te estamos redirigiendo al curso básico de Inteligencia Artificial 
              de la Escuela Red Ciudadana para complementar tu aprendizaje.
            </p>
          </div>

          <div className="space-y-6">
            <div className="flex items-center justify-center space-x-4 text-gray-600">
              <div className="flex items-center space-x-2">
                <Zap size={20} className="text-blue-600" />
                <span>Curso básico de IA</span>
              </div>
              <div className="flex items-center space-x-2">
                <BookOpen size={20} className="text-purple-600" />
                <span>Red Ciudadana</span>
              </div>
            </div>

            <button
              onClick={handleRedirect}
              className="inline-flex items-center space-x-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 rounded-2xl transition-all duration-200 font-semibold shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              <ExternalLink size={20} />
              <span>Ir al Curso de IA</span>
            </button>

            <p className="text-gray-500 text-sm">
              Si no se abre automáticamente, haz clic en el botón de arriba
            </p>
          </div>

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
          </div>
        </div>
      </div>
    </div>
  );
};

export default CursoIA;