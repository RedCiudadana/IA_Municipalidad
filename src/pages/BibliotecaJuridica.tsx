import { useState, useEffect } from 'react';
import { Search, Filter, BookOpen, Calendar, Tag, Eye, ExternalLink, FileText, ChevronDown, ChevronUp, X, Download, Sparkles, Lightbulb, TrendingUp, Scale } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

interface NormativaLegal {
  id: string;
  nombre: string;
  numero_decreto: string | null;
  tipo_normativa: string;
  descripcion: string | null;
  documento_url: string;
  vigente: boolean;
  orden: number;
}

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

interface AnalisisBusqueda {
  analisis: string;
  categorias_sugeridas: string[];
  tipos_documento_sugeridos: string[];
  palabras_clave: string[];
  temas_relacionados: string[];
  sugerencia_busqueda: string;
  documentos_sugeridos: DocumentoJuridico[];
}

export default function BibliotecaJuridica() {
  const { user } = useAuth();
  const [normativas, setNormativas] = useState<NormativaLegal[]>([]);
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
  const [analisisIA, setAnalisisIA] = useState<AnalisisBusqueda | null>(null);
  const [loadingAnalisis, setLoadingAnalisis] = useState(false);
  const [mostrarAnalisis, setMostrarAnalisis] = useState(false);

  useEffect(() => {
    cargarDatosIniciales();
  }, []);

  useEffect(() => {
    buscarDocumentos();
  }, [terminoBusqueda, categoriaFiltro, tipoFiltro, vigenteFiltro]);

  const cargarDatosIniciales = async () => {
    try {
      const [categoriasRes, tiposRes, normativasRes] = await Promise.all([
        supabase.from('categorias_juridicas').select('*').order('nombre'),
        supabase.from('tipos_documento_juridico').select('*').order('nombre'),
        supabase.from('normativas_legales').select('*').order('orden')
      ]);

      if (categoriasRes.error) {
        console.error('Error cargando categorías:', categoriasRes.error);
      } else if (categoriasRes.data) {
        setCategorias(categoriasRes.data);
      }

      if (tiposRes.error) {
        console.error('Error cargando tipos:', tiposRes.error);
      } else if (tiposRes.data) {
        setTiposDocumento(tiposRes.data);
      }

      if (normativasRes.error) {
        console.error('Error cargando normativas:', normativasRes.error);
      } else if (normativasRes.data) {
        console.log('Normativas cargadas:', normativasRes.data);
        setNormativas(normativasRes.data);
      }
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
    setAnalisisIA(null);
    setMostrarAnalisis(false);
  };

  const analizarBusqueda = async () => {
    if (!terminoBusqueda.trim()) return;

    setLoadingAnalisis(true);
    try {
      const apiUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/analizar-busqueda-biblioteca`;
      const headers = {
        'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
        'Content-Type': 'application/json',
      };

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          consulta: terminoBusqueda,
          tipo_documento: tipoFiltro,
          categoria: categoriaFiltro
        })
      });

      if (!response.ok) {
        throw new Error('Error al analizar búsqueda');
      }

      const data = await response.json();
      setAnalisisIA(data);
      setMostrarAnalisis(true);
    } catch (error) {
      console.error('Error en análisis:', error);
    } finally {
      setLoadingAnalisis(false);
    }
  };

  const getCategoriaColor = (color: string) => {
    const colors: Record<string, string> = {
      blue: 'bg-teal-100 text-teal-700',
      green: 'bg-emerald-100 text-emerald-700',
      emerald: 'bg-teal-100 text-teal-700',
      orange: 'bg-orange-100 text-orange-700',
      purple: 'bg-slate-100 text-slate-700',
      teal: 'bg-cyan-100 text-cyan-700',
      gray: 'bg-neutral-100 text-neutral-700',
      cyan: 'bg-cyan-100 text-cyan-700'
    };
    return colors[color] || colors.blue;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 via-teal-50/30 to-neutral-50">
      <div className="max-w-7xl mx-auto px-4 py-10">
        <div className="mb-10">
          <div className="flex items-center space-x-6 mb-6">
            <div className="w-20 h-20 gradient-primary rounded-3xl flex items-center justify-center shadow-xl">
              <BookOpen size={40} className="text-white" />
            </div>
            <div>
              <h1 className="text-5xl font-bold text-neutral-900 tracking-tight">Biblioteca Jurídica Municipal</h1>
              <p className="text-neutral-600 text-xl mt-2">Repositorio de precedentes administrativos y documentos jurídicos</p>
            </div>
          </div>
        </div>

        {normativas.length > 0 ? (
          <div className="card p-8 mb-8 border-2 border-teal-100 bg-gradient-to-br from-teal-50/30 to-white">
            <div className="flex items-center space-x-4 mb-6">
              <div className="w-14 h-14 bg-gradient-to-br from-teal-600 to-cyan-600 rounded-2xl flex items-center justify-center shadow-lg">
                <Scale size={28} className="text-white" />
              </div>
              <div>
                <h2 className="text-3xl font-bold text-neutral-900">Marco Legal de Referencia</h2>
                <p className="text-neutral-600 text-base mt-1">Normativa legal guatemalteca aplicable al ámbito municipal</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {normativas.map((normativa) => (
                <a
                  key={normativa.id}
                  href={normativa.documento_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group p-5 bg-white border-2 border-neutral-200 rounded-xl hover:border-teal-400 hover:shadow-lg transition-all"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <FileText size={20} className="text-teal-600" />
                        <span className="text-xs font-bold text-teal-700 bg-teal-100 px-2 py-1 rounded-lg">
                          {normativa.tipo_normativa}
                        </span>
                        {normativa.numero_decreto && (
                          <span className="text-xs font-semibold text-neutral-500">
                            {normativa.numero_decreto}
                          </span>
                        )}
                      </div>
                      <h3 className="font-bold text-neutral-900 text-lg mb-1 group-hover:text-teal-700 transition-colors">
                        {normativa.nombre}
                      </h3>
                      {normativa.descripcion && (
                        <p className="text-sm text-neutral-600 line-clamp-2">
                          {normativa.descripcion}
                        </p>
                      )}
                    </div>
                    <ExternalLink size={20} className="text-neutral-400 group-hover:text-teal-600 transition-colors ml-3 flex-shrink-0" />
                  </div>
                </a>
              ))}
            </div>
          </div>
        ) : (
          <div className="card p-4 mb-8 bg-yellow-50 border border-yellow-200">
            <p className="text-yellow-800">No se encontraron normativas legales. Total normativas: {normativas.length}</p>
          </div>
        )}

        <div className="card p-8 mb-8">
          <div className="flex flex-col md:flex-row items-stretch md:items-center space-y-4 md:space-y-0 md:space-x-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-neutral-400" size={22} />
              <input
                type="text"
                placeholder="Buscar por título, número de documento o contenido..."
                value={terminoBusqueda}
                onChange={(e) => setTerminoBusqueda(e.target.value)}
                className="input-field pl-12"
              />
            </div>
            <button
              onClick={() => setMostrarFiltros(!mostrarFiltros)}
              className="flex items-center justify-center space-x-2 px-8 py-3 bg-neutral-100 hover:bg-neutral-200 rounded-xl transition-all font-semibold text-neutral-700"
            >
              <Filter size={20} />
              <span>Filtros</span>
              {mostrarFiltros ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
            </button>
            <button
              onClick={analizarBusqueda}
              disabled={!terminoBusqueda.trim() || loadingAnalisis}
              className="flex items-center justify-center space-x-2 px-8 py-3 gradient-primary text-white rounded-xl transition-all font-semibold shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Sparkles size={20} />
              <span>{loadingAnalisis ? 'Analizando...' : 'Analizar con IA'}</span>
            </button>
          </div>

          {mostrarFiltros && (
            <div className="border-t border-neutral-200 pt-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-bold text-neutral-700 mb-3">Categoría</label>
                  <select
                    value={categoriaFiltro}
                    onChange={(e) => setCategoriaFiltro(e.target.value)}
                    className="input-field"
                  >
                    <option value="">Todas las categorías</option>
                    {categorias.map(cat => (
                      <option key={cat.id} value={cat.id}>{cat.nombre}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-bold text-neutral-700 mb-3">Tipo de Documento</label>
                  <select
                    value={tipoFiltro}
                    onChange={(e) => setTipoFiltro(e.target.value)}
                    className="input-field"
                  >
                    <option value="">Todos los tipos</option>
                    {tiposDocumento.map(tipo => (
                      <option key={tipo.id} value={tipo.id}>{tipo.nombre}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-bold text-neutral-700 mb-3">Estado</label>
                  <select
                    value={vigenteFiltro}
                    onChange={(e) => setVigenteFiltro(e.target.value)}
                    className="input-field"
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
                  className="flex items-center space-x-2 px-5 py-2 text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 rounded-lg transition-all font-medium"
                >
                  <X size={18} />
                  <span>Limpiar filtros</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {mostrarAnalisis && analisisIA && (
          <div className="card p-8 mb-8 border-2 border-teal-200 bg-gradient-to-br from-teal-50/50 to-white">
            <div className="flex items-start justify-between mb-6">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 gradient-primary rounded-xl flex items-center justify-center">
                  <Lightbulb size={24} className="text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-neutral-900">Análisis Inteligente de Búsqueda</h3>
                  <p className="text-neutral-600 text-sm mt-1">Sugerencias basadas en IA para mejorar tu búsqueda</p>
                </div>
              </div>
              <button
                onClick={() => setMostrarAnalisis(false)}
                className="p-2 hover:bg-neutral-100 rounded-lg transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <div className="bg-white rounded-xl p-6 mb-6 border border-teal-100">
              <p className="text-neutral-700 leading-relaxed text-lg">{analisisIA.analisis}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              {analisisIA.categorias_sugeridas.length > 0 && (
                <div>
                  <h4 className="font-bold text-neutral-900 mb-3 flex items-center space-x-2">
                    <Tag size={18} className="text-teal-600" />
                    <span>Categorías Sugeridas</span>
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {analisisIA.categorias_sugeridas.map((cat, idx) => (
                      <span key={idx} className="px-3 py-1.5 bg-teal-100 text-teal-700 rounded-lg text-sm font-semibold">
                        {cat}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {analisisIA.tipos_documento_sugeridos.length > 0 && (
                <div>
                  <h4 className="font-bold text-neutral-900 mb-3 flex items-center space-x-2">
                    <FileText size={18} className="text-orange-600" />
                    <span>Tipos de Documento</span>
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {analisisIA.tipos_documento_sugeridos.map((tipo, idx) => (
                      <span key={idx} className="px-3 py-1.5 bg-orange-100 text-orange-700 rounded-lg text-sm font-semibold">
                        {tipo}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {analisisIA.palabras_clave.length > 0 && (
                <div>
                  <h4 className="font-bold text-neutral-900 mb-3 flex items-center space-x-2">
                    <Search size={18} className="text-cyan-600" />
                    <span>Palabras Clave</span>
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {analisisIA.palabras_clave.map((palabra, idx) => (
                      <span key={idx} className="px-3 py-1.5 bg-cyan-100 text-cyan-700 rounded-lg text-sm font-medium">
                        {palabra}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {analisisIA.temas_relacionados.length > 0 && (
                <div>
                  <h4 className="font-bold text-neutral-900 mb-3 flex items-center space-x-2">
                    <TrendingUp size={18} className="text-emerald-600" />
                    <span>Temas Relacionados</span>
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {analisisIA.temas_relacionados.map((tema, idx) => (
                      <span key={idx} className="px-3 py-1.5 bg-emerald-100 text-emerald-700 rounded-lg text-sm font-medium">
                        {tema}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {analisisIA.documentos_sugeridos && analisisIA.documentos_sugeridos.length > 0 && (
              <div className="mt-6 pt-6 border-t border-teal-100">
                <h4 className="font-bold text-neutral-900 mb-4 flex items-center space-x-2">
                  <Sparkles size={20} className="text-teal-600" />
                  <span>Documentos Recomendados</span>
                </h4>
                <div className="space-y-3">
                  {analisisIA.documentos_sugeridos.map((doc) => (
                    <div
                      key={doc.id}
                      onClick={() => abrirDocumento(doc)}
                      className="p-4 bg-white border border-neutral-200 rounded-xl hover:border-teal-300 hover:shadow-md transition-all cursor-pointer"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <span className="badge-primary text-xs px-2 py-1">
                              {doc.numero_documento}
                            </span>
                            <span className="text-xs text-neutral-500 font-medium">
                              {doc.tipo_documento?.nombre}
                            </span>
                          </div>
                          <h5 className="font-bold text-neutral-900 mb-1">{doc.titulo}</h5>
                          <p className="text-sm text-neutral-600 line-clamp-2">{doc.resumen_ejecutivo}</p>
                        </div>
                        <div className="ml-4">
                          <Eye size={16} className="text-neutral-400" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        <div className="card p-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-neutral-900">
              {loading ? 'Buscando documentos...' : `${documentos.length} documentos encontrados`}
            </h2>
            {!loading && documentos.length > 0 && (
              <div className="flex items-center space-x-2 text-neutral-600">
                <Sparkles size={20} className="text-teal-600" />
                <span className="font-medium">Ordenados por fecha</span>
              </div>
            )}
          </div>

          {loading ? (
            <div className="text-center py-16">
              <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-teal-600 mx-auto mb-6"></div>
              <p className="text-neutral-500 text-lg font-medium">Cargando documentos...</p>
            </div>
          ) : documentos.length === 0 ? (
            <div className="text-center py-16">
              <BookOpen size={64} className="text-neutral-300 mx-auto mb-6" />
              <p className="text-neutral-500 text-xl font-semibold mb-2">No se encontraron documentos</p>
              <p className="text-neutral-400 text-base">Intenta ajustar los filtros de búsqueda</p>
            </div>
          ) : (
            <div className="space-y-5">
              {documentos.map((doc) => (
                <div
                  key={doc.id}
                  onClick={() => abrirDocumento(doc)}
                  className="card-hover p-8"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex flex-wrap items-center gap-3 mb-3">
                        <span className="badge-primary text-base px-4 py-1.5">
                          {doc.numero_documento}
                        </span>
                        <span className={`${doc.categoria ? getCategoriaColor(doc.categoria.color) : 'bg-neutral-100 text-neutral-700'} px-4 py-1.5 rounded-full text-sm font-semibold`}>
                          {doc.categoria?.nombre}
                        </span>
                        <span className={`${doc.vigente ? 'bg-emerald-100 text-emerald-700' : 'bg-neutral-200 text-neutral-600'} px-4 py-1.5 rounded-full text-sm font-semibold`}>
                          {doc.vigente ? 'Vigente' : 'No Vigente'}
                        </span>
                      </div>
                      <h3 className="text-2xl font-bold text-neutral-900 group-hover:text-teal-700 transition-colors mb-3">
                        {doc.titulo}
                      </h3>
                    </div>
                    <div className="flex items-center space-x-2 text-neutral-500 text-sm font-medium ml-4">
                      <Eye size={18} />
                      <span>{doc.vistas}</span>
                    </div>
                  </div>

                  <p className="text-neutral-600 mb-4 line-clamp-2 text-base leading-relaxed">{doc.resumen_ejecutivo}</p>

                  <div className="flex flex-wrap items-center justify-between gap-4">
                    <div className="flex flex-wrap items-center gap-4 text-sm text-neutral-600">
                      <div className="flex items-center space-x-2">
                        <FileText size={18} />
                        <span className="font-medium">{doc.tipo_documento?.nombre}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Calendar size={18} />
                        <span className="font-medium">{new Date(doc.fecha_emision).toLocaleDateString('es-GT', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                      </div>
                    </div>
                    {doc.palabras_clave && doc.palabras_clave.length > 0 && (
                      <div className="flex items-center space-x-2">
                        <Tag size={18} className="text-neutral-400" />
                        <div className="flex flex-wrap gap-2">
                          {doc.palabras_clave.slice(0, 3).map((palabra, idx) => (
                            <span key={idx} className="px-3 py-1 bg-neutral-100 text-neutral-600 rounded-lg text-xs font-semibold">
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
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center p-4 z-50 backdrop-blur-sm" onClick={() => setDocumentoSeleccionado(null)}>
          <div className="bg-white rounded-3xl max-w-5xl w-full max-h-[90vh] overflow-y-auto shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="sticky top-0 bg-white border-b border-neutral-200 p-8 flex items-start justify-between z-10">
              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-3 mb-4">
                  <span className="badge-primary text-base px-4 py-1.5">
                    {documentoSeleccionado.numero_documento}
                  </span>
                  <span className={`${documentoSeleccionado.vigente ? 'bg-emerald-100 text-emerald-700' : 'bg-neutral-200 text-neutral-600'} px-4 py-1.5 rounded-full text-sm font-semibold`}>
                    {documentoSeleccionado.vigente ? 'Vigente' : 'No Vigente'}
                  </span>
                </div>
                <h2 className="text-3xl font-bold text-neutral-900">{documentoSeleccionado.titulo}</h2>
              </div>
              <button
                onClick={() => setDocumentoSeleccionado(null)}
                className="p-3 hover:bg-neutral-100 rounded-xl transition-colors ml-4"
              >
                <X size={28} />
              </button>
            </div>

            <div className="p-8 space-y-8">
              <div className="grid grid-cols-2 gap-6 pb-8 border-b border-neutral-200">
                <div>
                  <p className="text-sm text-neutral-500 mb-2 font-semibold">Tipo de Documento</p>
                  <p className="font-bold text-neutral-900 text-lg">{documentoSeleccionado.tipo_documento?.nombre}</p>
                </div>
                <div>
                  <p className="text-sm text-neutral-500 mb-2 font-semibold">Categoría</p>
                  <p className="font-bold text-neutral-900 text-lg">{documentoSeleccionado.categoria?.nombre}</p>
                </div>
                <div>
                  <p className="text-sm text-neutral-500 mb-2 font-semibold">Fecha de Emisión</p>
                  <p className="font-bold text-neutral-900 text-lg">
                    {new Date(documentoSeleccionado.fecha_emision).toLocaleDateString('es-GT', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-neutral-500 mb-2 font-semibold">Autoridad Emisora</p>
                  <p className="font-bold text-neutral-900 text-lg">{documentoSeleccionado.autoridad_emisora}</p>
                </div>
              </div>

              <div>
                <h3 className="text-2xl font-bold text-neutral-900 mb-4 flex items-center space-x-3">
                  <FileText size={24} className="text-teal-600" />
                  <span>Resumen Ejecutivo</span>
                </h3>
                <p className="text-neutral-700 leading-relaxed text-lg">{documentoSeleccionado.resumen_ejecutivo}</p>
              </div>

              {documentoSeleccionado.problema_juridico && (
                <div>
                  <h3 className="text-2xl font-bold text-neutral-900 mb-4">Problema Jurídico Planteado</h3>
                  <p className="text-neutral-700 leading-relaxed text-lg">{documentoSeleccionado.problema_juridico}</p>
                </div>
              )}

              {documentoSeleccionado.fundamentacion_legal && (
                <div>
                  <h3 className="text-2xl font-bold text-neutral-900 mb-4">Fundamentación Legal</h3>
                  <p className="text-neutral-700 leading-relaxed whitespace-pre-wrap text-lg">{documentoSeleccionado.fundamentacion_legal}</p>
                </div>
              )}

              {documentoSeleccionado.conclusion && (
                <div>
                  <h3 className="text-2xl font-bold text-neutral-900 mb-4">Conclusión</h3>
                  <p className="text-neutral-700 leading-relaxed text-lg">{documentoSeleccionado.conclusion}</p>
                </div>
              )}

              <div>
                <h3 className="text-2xl font-bold text-neutral-900 mb-4">Contenido Completo</h3>
                <div className="bg-neutral-50 rounded-2xl p-8 border border-neutral-200">
                  <p className="text-neutral-700 leading-relaxed whitespace-pre-wrap text-lg">{documentoSeleccionado.contenido_completo}</p>
                </div>
              </div>

              {documentoSeleccionado.palabras_clave && documentoSeleccionado.palabras_clave.length > 0 && (
                <div>
                  <h3 className="text-2xl font-bold text-neutral-900 mb-4 flex items-center space-x-3">
                    <Tag size={24} className="text-teal-600" />
                    <span>Palabras Clave</span>
                  </h3>
                  <div className="flex flex-wrap gap-3">
                    {documentoSeleccionado.palabras_clave.map((palabra, idx) => (
                      <span key={idx} className="px-4 py-2 bg-teal-100 text-teal-700 rounded-xl text-base font-semibold">
                        {palabra}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {documentoSeleccionado.documento_url && (
                <div className="flex justify-center pt-6">
                  <a
                    href={documentoSeleccionado.documento_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-primary flex items-center space-x-3"
                  >
                    <Download size={22} />
                    <span>Descargar Documento Original</span>
                    <ExternalLink size={18} />
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
