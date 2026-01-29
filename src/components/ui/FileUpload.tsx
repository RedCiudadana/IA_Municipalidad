import React, { useState, useRef } from 'react';
import { Upload, File, X, AlertCircle, CheckCircle } from 'lucide-react';

interface ArchivoSubido {
  id: string;
  nombre: string;
  tamaño: number;
  tipo: string;
  contenido?: string;
}

interface FileUploadProps {
  onArchivosSubidos: (archivos: ArchivoSubido[]) => void;
  tiposPermitidos?: string[];
  tamaño_maximo?: number; // en MB
  multiple?: boolean;
}

const FileUpload: React.FC<FileUploadProps> = ({
  onArchivosSubidos,
  tiposPermitidos = ['.pdf', '.doc', '.docx', '.txt'],
  tamaño_maximo = 10,
  multiple = true
}) => {
  const [archivos, setArchivos] = useState<ArchivoSubido[]>([]);
  const [arrastrando, setArrastrando] = useState(false);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const validarArchivo = (archivo: File): string | null => {
    // Validar tamaño
    if (archivo.size > tamaño_maximo * 1024 * 1024) {
      return `El archivo ${archivo.name} excede el tamaño máximo de ${tamaño_maximo}MB`;
    }

    // Validar tipo
    const extension = '.' + archivo.name.split('.').pop()?.toLowerCase();
    if (!tiposPermitidos.includes(extension)) {
      return `Tipo de archivo no permitido: ${extension}. Tipos permitidos: ${tiposPermitidos.join(', ')}`;
    }

    return null;
  };

  const leerArchivo = (archivo: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const contenido = e.target?.result as string;
        resolve(contenido);
      };
      reader.onerror = () => reject(new Error('Error al leer el archivo'));
      reader.readAsText(archivo);
    });
  };

  const procesarArchivos = async (archivosSeleccionados: FileList) => {
    setCargando(true);
    setError('');
    
    const nuevosArchivos: ArchivoSubido[] = [];
    
    for (let i = 0; i < archivosSeleccionados.length; i++) {
      const archivo = archivosSeleccionados[i];
      
      const errorValidacion = validarArchivo(archivo);
      if (errorValidacion) {
        setError(errorValidacion);
        setCargando(false);
        return;
      }

      try {
        let contenido = '';
        
        // Solo leer contenido de archivos de texto
        if (archivo.type === 'text/plain' || archivo.name.endsWith('.txt')) {
          contenido = await leerArchivo(archivo);
        }

        const archivoSubido: ArchivoSubido = {
          id: Date.now().toString() + i,
          nombre: archivo.name,
          tamaño: archivo.size,
          tipo: archivo.type || 'application/octet-stream',
          contenido: contenido
        };

        nuevosArchivos.push(archivoSubido);
      } catch (error) {
        setError(`Error al procesar ${archivo.name}`);
        setCargando(false);
        return;
      }
    }

    const archivosActualizados = multiple ? [...archivos, ...nuevosArchivos] : nuevosArchivos;
    setArchivos(archivosActualizados);
    onArchivosSubidos(archivosActualizados);
    setCargando(false);
  };

  const manejarDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setArrastrando(false);
    
    const archivosDropeados = e.dataTransfer.files;
    if (archivosDropeados.length > 0) {
      procesarArchivos(archivosDropeados);
    }
  };

  const manejarDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setArrastrando(true);
  };

  const manejarDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setArrastrando(false);
  };

  const manejarSeleccionArchivo = (e: React.ChangeEvent<HTMLInputElement>) => {
    const archivosSeleccionados = e.target.files;
    if (archivosSeleccionados && archivosSeleccionados.length > 0) {
      procesarArchivos(archivosSeleccionados);
    }
  };

  const eliminarArchivo = (id: string) => {
    const archivosActualizados = archivos.filter(archivo => archivo.id !== id);
    setArchivos(archivosActualizados);
    onArchivosSubidos(archivosActualizados);
  };

  const formatearTamaño = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const tamaños = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + tamaños[i];
  };

  return (
    <div className="space-y-4">
      {/* Área de subida */}
      <div
        onDrop={manejarDrop}
        onDragOver={manejarDragOver}
        onDragLeave={manejarDragLeave}
        onClick={() => inputRef.current?.click()}
        className={`
          border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all duration-200
          ${arrastrando 
            ? 'border-blue-500 bg-blue-50' 
            : 'border-gray-300 hover:border-gray-400 hover:bg-gray-50'
          }
          ${cargando ? 'opacity-50 cursor-not-allowed' : ''}
        `}
      >
        <input
          ref={inputRef}
          type="file"
          multiple={multiple}
          accept={tiposPermitidos.join(',')}
          onChange={manejarSeleccionArchivo}
          className="hidden"
          disabled={cargando}
        />
        
        <div className="space-y-4">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto">
            <Upload size={32} className="text-gray-500" />
          </div>
          
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              {cargando ? 'Procesando archivos...' : 'Subir documentos'}
            </h3>
            <p className="text-gray-600 mb-2">
              Arrastra y suelta archivos aquí o haz clic para seleccionar
            </p>
            <p className="text-sm text-gray-500">
              Tipos permitidos: {tiposPermitidos.join(', ')} • Máximo {tamaño_maximo}MB por archivo
            </p>
          </div>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="flex items-center space-x-2 p-3 bg-red-50 border border-red-200 rounded-lg">
          <AlertCircle size={16} className="text-red-600" />
          <span className="text-red-700 text-sm">{error}</span>
        </div>
      )}

      {/* Lista de archivos subidos */}
      {archivos.length > 0 && (
        <div className="space-y-2">
          <h4 className="font-semibold text-gray-800">Archivos subidos:</h4>
          {archivos.map((archivo) => (
            <div key={archivo.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                  <File size={16} className="text-blue-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-800">{archivo.nombre}</p>
                  <p className="text-sm text-gray-500">{formatearTamaño(archivo.tamaño)}</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <CheckCircle size={16} className="text-green-600" />
                <button
                  onClick={() => eliminarArchivo(archivo.id)}
                  className="p-1 text-gray-500 hover:text-red-600 transition-colors"
                  title="Eliminar archivo"
                >
                  <X size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FileUpload;