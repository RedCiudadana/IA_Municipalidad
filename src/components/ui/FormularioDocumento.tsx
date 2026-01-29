import React, { useState } from 'react';
import { Loader2 } from 'lucide-react';

interface Campo {
  nombre: string;
  etiqueta: string;
  tipo: 'text' | 'textarea' | 'select' | 'number' | 'date' | 'time';
  requerido?: boolean;
  opciones?: string[];
  placeholder?: string;
}

interface FormularioDocumentoProps {
  campos: Campo[];
  onGenerar: (datos: any) => void;
  cargando: boolean;
  tipoDocumento: string;
}

const FormularioDocumento: React.FC<FormularioDocumentoProps> = ({
  campos,
  onGenerar,
  cargando,
  tipoDocumento
}) => {
  const [formData, setFormData] = useState<Record<string, any>>({});

  const manejarCambio = (nombre: string, valor: any) => {
    setFormData(prev => ({
      ...prev,
      [nombre]: valor
    }));
  };

  const manejarEnvio = (e: React.FormEvent) => {
    e.preventDefault();
    onGenerar(formData);
  };

  const renderCampo = (campo: Campo) => {
    const valor = formData[campo.nombre] || '';
    
    switch (campo.tipo) {
      case 'textarea':
        return (
          <textarea
            value={valor}
            onChange={(e) => manejarCambio(campo.nombre, e.target.value)}
            placeholder={campo.placeholder}
            required={campo.requerido}
            rows={3}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
          />
        );
      
      case 'select':
        return (
          <select
            value={valor}
            onChange={(e) => manejarCambio(campo.nombre, e.target.value)}
            required={campo.requerido}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Seleccionar...</option>
            {campo.opciones?.map(opcion => (
              <option key={opcion} value={opcion}>
                {opcion}
              </option>
            ))}
          </select>
        );
      
      default:
        return (
          <input
            type={campo.tipo}
            value={valor}
            onChange={(e) => manejarCambio(campo.nombre, e.target.value)}
            placeholder={campo.placeholder}
            required={campo.requerido}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        );
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
      <h3 className="text-2xl font-bold text-gray-800 mb-6">
        Información del Documento
      </h3>
      
      <form onSubmit={manejarEnvio} className="space-y-6">
        {campos.map(campo => (
          <div key={campo.nombre}>
            <label className="block font-semibold text-gray-800 mb-3">
              {campo.etiqueta}
              {campo.requerido && <span className="text-red-500 ml-1">*</span>}
            </label>
            {renderCampo(campo)}
          </div>
        ))}

        <div>
          <label className="block font-semibold text-gray-800 mb-3">
            Contenido Adicional
            {/* <span className="text-sm font-normal text-gray-600 ml-2">
              (Si subiste documentos, se analizarán automáticamente)
            </span> */}
          </label>
          <textarea
            value={formData.contenido_libre || ''}
            onChange={(e) => manejarCambio('contenido_libre', e.target.value)}
            placeholder="Proporciona información adicional o instrucciones específicas..."
            rows={4}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
          />
        </div>

        <button
          type="submit"
          disabled={cargando}
          className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-3 font-semibold shadow-lg hover:shadow-xl transform hover:scale-105"
        >
          {cargando ? (
            <>
              <Loader2 className="animate-spin" size={20} />
              <span>Generando documento...</span>
            </>
          ) : (
            <span>Generar Documento</span>
          )}
        </button>
      </form>
    </div>
  );
};

export default FormularioDocumento;