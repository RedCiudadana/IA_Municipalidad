import { useState, useEffect } from 'react';
import { Search, Filter, BookOpen, Calendar, Tag, Eye, ExternalLink, FileText, ChevronDown, ChevronUp, X, Download } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

interface Categoria {
  id: string;
  nombre: string;
  descripcion: string;
  icono: string;
  color: string;
}

interface TipoDocumento {
  id: string;
  nombre: string;
  descripcion: string;
  prefijo: string;
}

interface DocumentoJuridico {
  id: string;
  numero_documento: string;
  titulo: string;
  tipo_documento_id: string;
  categoria_id: string;
  fecha_emision: string;
  autoridad_emisora: string;
  resumen_ejecutivo: string;
  contenido_completo: string;
  problema_juridico: string;
  fundamentacion_legal: string;
  conclusion: string;
  palabras_clave: string[];
  documento_url: string | null;
  relevancia: number;
  vigente: boolean;
  vistas: number;
  created_at: string;
  tipo_documento?: TipoDocumento;
  categoria?: Categoria;
}

export default function BibliotecaJuridica() {
  const { user } = useAuth();
  const [documentos, setDocumentos] = useState<DocumentoJuridico[]>([]);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [tiposDocumento, setTiposDocumento] = useState<TipoDocumento[]>([]);
  const [loading, setLoading] = useState(true);
  const [documentoSeleccionado, setDocumentoSeleccionado] = useState<DocumentoJuridico | null>(null);

  const [terminoBusqueda, setTerminoBusqueda] = useState('');
  const [categoriaFiltro, setCategoriaFiltro] = useState<string>('');
  const [tipoFiltro, setTipoFiltro] = useState<string>('');
  const [vigenteFiltro, setVigenteFiltro] = useState<string>('todos');
  const [mostrarFiltros, setMostrarFiltros] = useState(false);

  useEffect(() => {
    cargarDatosIniciales();
  }, []);

  useEffect(() => {
    buscarDocumentos();
  }, [terminoBusqueda, categoriaFiltro, tipoFiltro, vigenteFiltro]);

  const cargarDatosIniciales = async () => {
    try {
      const [categoriasRes, tiposRes] = await Promise.all([
        supabase.from('categorias_juridicas').select('*').order('nombre'),
        supabase.from('tipos_documento_juridico').select('*').order('nombre')
      ]);

      if (categoriasRes.data) setCategorias(categoriasRes.data);
      if (tiposRes.data) setTiposDocumento(tiposRes.data);
    } catch (error) {
      console.error('Error cargando datos:', error);
    }
  };

  const buscarDocumentos = async () => {
    setLoading(true);
    try {
      let query = supabase
        .from('documentos_juridicos')
        .select(`
          *,
          tipo_documento:tipos_documento_juridico(*),
          categoria:categorias_juridicas(*)
        `)
        .order('fecha_emision', { ascending: false })
        .limit(50);

      if (terminoBusqueda) {
        query = query.or(`titulo.ilike.%${terminoBusqueda}%,resumen_ejecutivo.ilike.%${terminoBusqueda}%,numero_documento.ilike.%${terminoBusqueda}%`);
      }

      if (categoriaFiltro) {
        query = query.eq('categoria_id', categoriaFiltro);
      }

      if (tipoFiltro) {
        query = query.eq('tipo_documento_id', tipoFiltro);
      }

      if (vigenteFiltro !== 'todos') {
        query = query.eq('vigente', vigenteFiltro === 'vigente');
      }

      const { data, error } = await query;

      if (error) throw error;
      setDocumentos(data || []);

      if (user && terminoBusqueda) {
        await supabase.from('consultas_biblioteca').insert({
          usuario_id: user.id,
          termino_busqueda: terminoBusqueda,
          filtros_aplicados: { categoriaFiltro, tipoFiltro, vigenteFiltro },
          resultados_encontrados: data?.length || 0
        });
      }
    } catch (error) {
      console.error('Error buscando documentos:', error);
    } finally {
      setLoading(false);
    }
  };

  const abrirDocumento = async (documento: DocumentoJuridico) => {
    setDocumentoSeleccionado(documento);

    await supabase
      .from('documentos_juridicos')
      .update({ vistas: documento.vistas + 1 })
      .eq('id', documento.id);

    if (user) {
      await supabase.from('consultas_biblioteca').insert({
        usuario_id: user.id,
        termino_busqueda: terminoBusqueda,
        filtros_aplicados: { categoriaFiltro, tipoFiltro, vigenteFiltro },
        resultados_encontrados: documentos.length,
        documento_seleccionado_id: documento.id
      });
    }
  };

  const limpiarFiltros = () => {
    setTerminoBusqueda('');
    setCategoriaFiltro('');
    setTipoFiltro('');
    setVigenteFiltro('todos');
  };

  const getCategoriaColor = (color: string) => {
    const colors: Record<string, string> = {
      blue: 'bg-blue-100 text-blue-700',
      green: 'bg-green-100 text-green-700',
      emerald: 'bg-emerald-100 text-emerald-700',
      orange: 'bg-orange-100 text-orange-700',
      purple: 'bg-purple-100 text-purple-700',
      teal: 'bg-teal-100 text-teal-700',
      gray: 'bg-gray-100 text-gray-700',
      cyan: 'bg-cyan-100 text-cyan-700'
    };
    return colors[color] || colors.blue;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="flex items-center space-x-4 mb-4">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg">
              <BookOpen size={32} className="text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-gray-900">Biblioteca Jurídica Municipal</h1>
              <p className="text-gray-600 text-lg mt-1">Repositorio de precedentes administrativos y documentos jurídicos</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <div className="flex items-center space-x-4 mb-4">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Buscar por título, número de documento o contenido..."
                value={terminoBusqueda}
                onChange={(e) => setTerminoBusqueda(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
            </div>
            <button
              onClick={() => setMostrarFiltros(!mostrarFiltros)}
              className="flex items-center space-x-2 px-6 py-3 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors font-medium"
            >
              <Filter size={20} />
              <span>Filtros</span>
              {mostrarFiltros ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </button>
          </div>

          {mostrarFiltros && (
            <div className="border-t pt-4 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Categoría</label>
                  <select
                    value={categoriaFiltro}
                    onChange={(e) => setCategoriaFiltro(e.target.value)}
                    className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Todas las categorías</option>
                    {categorias.map(cat => (
                      <option key={cat.id} value={cat.id}>{cat.nombre}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Tipo de Documento</label>
                  <select
                    value={tipoFiltro}
                    onChange={(e) => setTipoFiltro(e.target.value)}
                    className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Todos los tipos</option>
                    {tiposDocumento.map(tipo => (
                      <option key={tipo.id} value={tipo.id}>{tipo.nombre}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Estado</label>
                  <select
                    value={vigenteFiltro}
                    onChange={(e) => setVigenteFiltro(e.target.value)}
                    className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="todos">Todos</option>
                    <option value="vigente">Vigentes</option>
                    <option value="no_vigente">No Vigentes</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  onClick={limpiarFiltros}
                  className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                >
                  <X size={16} />
                  <span>Limpiar filtros</span>
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">
              {loading ? 'Buscando...' : `${documentos.length} documentos encontrados`}
            </h2>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
              <p className="text-gray-500 mt-4">Cargando documentos...</p>
            </div>
          ) : documentos.length === 0 ? (
            <div className="text-center py-12">
              <BookOpen size={48} className="text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">No se encontraron documentos</p>
              <p className="text-gray-400 mt-2">Intenta ajustar los filtros de búsqueda</p>
            </div>
          ) : (
            <div className="space-y-4">
              {documentos.map((doc) => (
                <div
                  key={doc.id}
                  onClick={() => abrirDocumento(doc)}
                  className="border-2 border-gray-200 rounded-xl p-6 hover:border-blue-300 hover:shadow-lg transition-all cursor-pointer group"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-semibold">
                          {doc.numero_documento}
                        </span>
                        <span className={`px-3 py-1 rounded-full text-sm font-semibold ${doc.categoria ? getCategoriaColor(doc.categoria.color) : 'bg-gray-100 text-gray-700'}`}>
                          {doc.categoria?.nombre}
                        </span>
                        <span className={`px-3 py-1 rounded-full text-sm font-semibold ${doc.vigente ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>
                          {doc.vigente ? 'Vigente' : 'No Vigente'}
                        </span>
                      </div>
                      <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                        {doc.titulo}
                      </h3>
                    </div>
                    <div className="flex items-center space-x-4 text-gray-500 text-sm">
                      <div className="flex items-center space-x-1">
                        <Eye size={16} />
                        <span>{doc.vistas}</span>
                      </div>
                    </div>
                  </div>

                  <p className="text-gray-600 mb-3 line-clamp-2">{doc.resumen_ejecutivo}</p>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <div className="flex items-center space-x-1">
                        <FileText size={16} />
                        <span>{doc.tipo_documento?.nombre}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Calendar size={16} />
                        <span>{new Date(doc.fecha_emision).toLocaleDateString('es-GT')}</span>
                      </div>
                    </div>
                    {doc.palabras_clave && doc.palabras_clave.length > 0 && (
                      <div className="flex items-center space-x-2">
                        <Tag size={16} className="text-gray-400" />
                        <div className="flex space-x-1">
                          {doc.palabras_clave.slice(0, 3).map((palabra, idx) => (
                            <span key={idx} className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs">
                              {palabra}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {documentoSeleccionado && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50" onClick={() => setDocumentoSeleccionado(null)}>
          <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="sticky top-0 bg-white border-b p-6 flex items-center justify-between z-10">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-semibold">
                    {documentoSeleccionado.numero_documento}
                  </span>
                  <span className={`px-3 py-1 rounded-full text-sm font-semibold ${documentoSeleccionado.vigente ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>
                    {documentoSeleccionado.vigente ? 'Vigente' : 'No Vigente'}
                  </span>
                </div>
                <h2 className="text-2xl font-bold text-gray-900">{documentoSeleccionado.titulo}</h2>
              </div>
              <button
                onClick={() => setDocumentoSeleccionado(null)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            <div className="p-6 space-y-6">
              <div className="grid grid-cols-2 gap-4 pb-6 border-b">
                <div>
                  <p className="text-sm text-gray-500 mb-1">Tipo de Documento</p>
                  <p className="font-semibold text-gray-900">{documentoSeleccionado.tipo_documento?.nombre}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Categoría</p>
                  <p className="font-semibold text-gray-900">{documentoSeleccionado.categoria?.nombre}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Fecha de Emisión</p>
                  <p className="font-semibold text-gray-900">
                    {new Date(documentoSeleccionado.fecha_emision).toLocaleDateString('es-GT', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Autoridad Emisora</p>
                  <p className="font-semibold text-gray-900">{documentoSeleccionado.autoridad_emisora}</p>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-center space-x-2">
                  <FileText size={20} className="text-blue-600" />
                  <span>Resumen Ejecutivo</span>
                </h3>
                <p className="text-gray-700 leading-relaxed">{documentoSeleccionado.resumen_ejecutivo}</p>
              </div>

              {documentoSeleccionado.problema_juridico && (
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-3">Problema Jurídico Planteado</h3>
                  <p className="text-gray-700 leading-relaxed">{documentoSeleccionado.problema_juridico}</p>
                </div>
              )}

              {documentoSeleccionado.fundamentacion_legal && (
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-3">Fundamentación Legal</h3>
                  <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{documentoSeleccionado.fundamentacion_legal}</p>
                </div>
              )}

              {documentoSeleccionado.conclusion && (
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-3">Conclusión</h3>
                  <p className="text-gray-700 leading-relaxed">{documentoSeleccionado.conclusion}</p>
                </div>
              )}

              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-3">Contenido Completo</h3>
                <div className="bg-gray-50 rounded-xl p-6">
                  <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{documentoSeleccionado.contenido_completo}</p>
                </div>
              </div>

              {documentoSeleccionado.palabras_clave && documentoSeleccionado.palabras_clave.length > 0 && (
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-center space-x-2">
                    <Tag size={20} className="text-blue-600" />
                    <span>Palabras Clave</span>
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {documentoSeleccionado.palabras_clave.map((palabra, idx) => (
                      <span key={idx} className="px-3 py-1.5 bg-blue-100 text-blue-700 rounded-lg text-sm font-medium">
                        {palabra}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {documentoSeleccionado.documento_url && (
                <div className="flex justify-center pt-4">
                  <a
                    href={documentoSeleccionado.documento_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center space-x-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-colors font-semibold"
                  >
                    <Download size={20} />
                    <span>Descargar Documento Original</span>
                    <ExternalLink size={16} />
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
