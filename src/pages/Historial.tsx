import React, { useState, useEffect } from 'react';
import { Search, Calendar, FileText, CreditCard as Edit, Trash2, BarChart2, Download } from 'lucide-react';
import {
  obtenerDocumentos,
  eliminarDocumento,
  buscarDocumentos,
  contarDocumentosPorTipo,
  type Documento
} from '../utils/documentos';

interface HistorialProps {
  usuario: { nombre: string; cargo: string };
}

const Historial: React.FC<HistorialProps> = ({ usuario }) => {
  const [busqueda, setBusqueda] = useState('');
  const [filtroTipo, setFiltroTipo] = useState('todos');
  const [filtroFecha, setFiltroFecha] = useState('');
  const [documentos, setDocumentos] = useState<Documento[]>([]);
  const [cargando, setCargando] = useState(true);
  const [estadisticasDocumentos, setEstadisticasDocumentos] = useState<Record<string, number>>({});

  useEffect(() => {
    cargarDocumentos();
  }, []);

  useEffect(() => {
    if (busqueda.length >= 3) {
      realizarBusqueda();
    } else if (busqueda.length === 0) {
      cargarDocumentos();
    }
  }, [busqueda]);

  const cargarDocumentos = async () => {
    try {
      setCargando(true);
      const [docs, stats] = await Promise.all([
        obtenerDocumentos(),
        contarDocumentosPorTipo()
      ]);
      setDocumentos(docs);
      setEstadisticasDocumentos(stats);
    } catch (error) {
      console.error('Error al cargar documentos:', error);
    } finally {
      setCargando(false);
    }
  };

  const realizarBusqueda = async () => {
    try {
      setCargando(true);
      const docs = await buscarDocumentos(busqueda);
      setDocumentos(docs);
    } catch (error) {
      console.error('Error al buscar documentos:', error);
    } finally {
      setCargando(false);
    }
  };

  const manejarEliminar = async (id: string) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar este documento?')) {
      try {
        await eliminarDocumento(id);
        await cargarDocumentos();
      } catch (error) {
        console.error('Error al eliminar documento:', error);
        alert('No se pudo eliminar el documento');
      }
    }
  };

  const tiposDocumento = [
    { valor: 'todos', etiqueta: 'Todos los tipos' },
    { valor: 'oficio', etiqueta: 'Oficios' },
    { valor: 'memorando', etiqueta: 'Memorandos' },
    { valor: 'carta', etiqueta: 'Cartas' },
    { valor: 'minuta', etiqueta: 'Minutas' },
    { valor: 'resumen', etiqueta: 'Resúmenes' },
    { valor: 'analisis', etiqueta: 'Análisis' }
  ];

  const documentosFiltrados = documentos.filter(doc => {
    const coincideBusqueda = busqueda === '' ||
      doc.titulo.toLowerCase().includes(busqueda.toLowerCase()) ||
      (doc.destinatario && doc.destinatario.toLowerCase().includes(busqueda.toLowerCase()));
    const coincideTipo = filtroTipo === 'todos' || doc.tipo_documento === filtroTipo;
    const coincideFecha = !filtroFecha || doc.created_at.includes(filtroFecha);

    return coincideBusqueda && coincideTipo && coincideFecha;
  });

  const obtenerColorTipo = (tipo: string) => {
    const colores: Record<string, string> = {
      'redactor-oficios': 'bg-blue-100 text-blue-800',
      'generador-memos': 'bg-green-100 text-green-800',
      'redactor-cartas': 'bg-purple-100 text-purple-800',
      'asistente-minutas': 'bg-orange-100 text-orange-800',
      'resumen-expedientes': 'bg-teal-100 text-teal-800',
      'analisis-inversion': 'bg-red-100 text-red-800'
    };
    return colores[tipo] || 'bg-gray-100 text-gray-800';
  };

  const obtenerColorEstado = (estado: string) => {
    return estado === 'completado' 
      ? 'bg-green-100 text-green-800' 
      : 'bg-yellow-100 text-yellow-800';
  };

  const totalDocumentos = documentos.length;
  const documentosCompletados = documentos.filter(d => d.estado === 'completado').length;
  const documentosBorradores = documentos.filter(d => d.estado === 'borrador').length;

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          Historial de Documentos
        </h2>
        <p className="text-gray-600">
          Gestiona y consulta todos los documentos generados con el sistema
        </p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl shadow-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm font-medium mb-1">Total Documentos</p>
              <p className="text-white text-3xl font-bold">{totalDocumentos}</p>
            </div>
            <div className="p-3 bg-white/20 rounded-xl">
              <FileText size={24} className="text-white" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl shadow-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm font-medium mb-1">Completados</p>
              <p className="text-white text-3xl font-bold">{documentosCompletados}</p>
            </div>
            <div className="p-3 bg-white/20 rounded-xl">
              <FileText size={24} className="text-white" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-2xl shadow-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-yellow-100 text-sm font-medium mb-1">Borradores</p>
              <p className="text-white text-3xl font-bold">{documentosBorradores}</p>
            </div>
            <div className="p-3 bg-white/20 rounded-xl">
              <Edit size={24} className="text-white" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl shadow-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100 text-sm font-medium mb-1">Por Tipo</p>
              <p className="text-white text-3xl font-bold">{Object.keys(estadisticasDocumentos).length}</p>
            </div>
            <div className="p-3 bg-white/20 rounded-xl">
              <BarChart2 size={24} className="text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Filtros */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Buscar documento
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
              <input
                type="text"
                placeholder="Buscar por título o destinatario..."
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tipo de documento
            </label>
            <select
              value={filtroTipo}
              onChange={(e) => setFiltroTipo(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {tiposDocumento.map(tipo => (
                <option key={tipo.valor} value={tipo.valor}>
                  {tipo.etiqueta}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Fecha
            </label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
              <input
                type="date"
                value={filtroFecha}
                onChange={(e) => setFiltroFecha(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Lista de documentos */}
      <div className="bg-white rounded-lg shadow-md">
        <div className="p-6 border-b">
          <h3 className="text-lg font-semibold text-gray-800">
            Documentos encontrados: {documentosFiltrados.length}
          </h3>
        </div>

        <div className="divide-y divide-gray-200">
          {cargando ? (
            <div className="p-12 text-center">
              <p className="text-gray-600">Cargando documentos...</p>
            </div>
          ) : (
            documentosFiltrados.map(documento => (
              <div key={documento.id} className="p-6 hover:bg-gray-50 transition-colors">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h4 className="text-lg font-medium text-gray-800">
                        {documento.titulo}
                      </h4>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${obtenerColorTipo(documento.tipo_documento)}`}>
                        {documento.tipo_documento}
                      </span>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${obtenerColorEstado(documento.estado)}`}>
                        {documento.estado}
                      </span>
                    </div>

                    <div className="text-sm text-gray-600 space-y-1">
                      {documento.destinatario && (
                        <p><strong>Destinatario:</strong> {documento.destinatario}</p>
                      )}
                      <p><strong>Fecha:</strong> {new Date(documento.created_at).toLocaleDateString('es-GT')}</p>
                    </div>
                  </div>

                  <div className="flex space-x-2 ml-4">
                    <button
                      className="p-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
                      title="Ver documento"
                    >
                      <FileText size={16} />
                    </button>
                    <button
                      onClick={() => manejarEliminar(documento.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Eliminar"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {!cargando && documentosFiltrados.length === 0 && (
          <div className="p-12 text-center">
            <FileText className="mx-auto mb-4 text-gray-400" size={48} />
            <h3 className="text-lg font-medium text-gray-800 mb-2">
              No se encontraron documentos
            </h3>
            <p className="text-gray-600">
              {documentos.length === 0
                ? 'Aún no has generado ningún documento. Comienza usando los agentes de IA.'
                : 'Intenta ajustar los filtros de búsqueda'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Historial;