import React, { useState } from 'react';
import { Copy, Download, RefreshCw, Save, Check } from 'lucide-react';

interface EditorResultadoProps {
  contenido: string;
  onGuardar: (contenido: string) => void;
  tipoDocumento: string;
}

const EditorResultado: React.FC<EditorResultadoProps> = ({
  contenido,
  onGuardar,
  tipoDocumento
}) => {
  const [contenidoEditado, setContenidoEditado] = useState(contenido);
  const [copiado, setCopiado] = useState(false);

  const manejarCopiar = async () => {
    try {
      await navigator.clipboard.writeText(contenidoEditado);
      setCopiado(true);
      setTimeout(() => setCopiado(false), 2000);
    } catch (err) {
      console.error('Error al copiar:', err);
    }
  };

  const manejarDescargar = () => {
    const blob = new Blob([contenidoEditado], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${tipoDocumento}-${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const manejarRevisar = () => {
    // Simulación de revisión de estilo
    alert('Función de revisión de estilo (integración con herramientas de escritura)');
  };

  const manejarGuardar = () => {
    onGuardar(contenidoEditado);
    alert('Documento guardado en el historial');
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-2xl font-bold text-gray-800">
          Resultado Generado
        </h3>
        
        <div className="flex space-x-3">
          <button
            onClick={manejarCopiar}
            className="flex items-center space-x-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-all duration-200 font-medium"
            title="Copiar"
          >
            {copiado ? <Check size={16} /> : <Copy size={16} />}
            <span className="text-sm">{copiado ? 'Copiado' : 'Copiar'}</span>
          </button>
          
          <button
            onClick={manejarDescargar}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-xl hover:bg-blue-200 transition-all duration-200 font-medium"
            title="Descargar"
          >
            <Download size={16} />
            <span className="text-sm">Descargar</span>
          </button>
          
          <button
            onClick={manejarRevisar}
            className="flex items-center space-x-2 px-4 py-2 bg-purple-100 text-purple-700 rounded-xl hover:bg-purple-200 transition-all duration-200 font-medium"
            title="Revisar Estilo"
          >
            <RefreshCw size={16} />
            <span className="text-sm">Revisar</span>
          </button>
          
          <button
            onClick={manejarGuardar}
            className="flex items-center space-x-2 px-4 py-2 bg-emerald-100 text-emerald-700 rounded-xl hover:bg-emerald-200 transition-all duration-200 font-medium"
            title="Guardar en Historial"
          >
            <Save size={16} />
            <span className="text-sm">Guardar</span>
          </button>
        </div>
      </div>

      <div className="border border-gray-200 rounded-xl overflow-hidden">
        <textarea
          value={contenidoEditado}
          onChange={(e) => setContenidoEditado(e.target.value)}
          className="w-full h-96 p-6 border-none focus:ring-2 focus:ring-blue-500 focus:outline-none resize-none font-mono"
          placeholder="El documento generado aparecerá aquí..."
        />
      </div>

      <div className="mt-6 text-gray-600">
        <p>
          <strong>Tip:</strong> Puedes editar el contenido directamente en el área de texto.
          Los cambios se guardarán cuando uses el botón "Guardar en Historial".
        </p>
      </div>
    </div>
  );
};

export default EditorResultado;