import React, { useState, useRef } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import {
  FileCheck,
  Upload,
  FileText,
  AlertTriangle,
  CheckCircle2,
  Search,
  Download,
  Copy,
  Loader2,
  Shield,
  Scale,
  BookOpen,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

interface RevisionContratosProps {
  usuario: { nombre: string; cargo: string };
}

interface SeccionAnalisis {
  titulo: string;
  contenido: string;
  tipo: 'resumen' | 'verificacion' | 'clausulas' | 'riesgos' | 'recomendaciones';
  icono: React.ElementType;
}

const RevisionContratos: React.FC<RevisionContratosProps> = ({ usuario }) => {
  const { perfil } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [cargando, setCargando] = useState(false);
  const [resultado, setResultado] = useState('');
  const [archivoSeleccionado, setArchivoSeleccionado] = useState<File | null>(null);
  const [textoContrato, setTextoContrato] = useState('');
  const [seccionesExpandidas, setSeccionesExpandidas] = useState<Set<string>>(new Set());

  const [formulario, setFormulario] = useState({
    tipo_contrato: '',
    objeto_contrato: '',
    monto_estimado: '',
    plazo_ejecucion: '',
    contratista: '',
    modalidad_contratacion: '',
    clausulas_especificas: '',
    garantias_solicitadas: '',
    aspectos_revisar: ''
  });

  const tiposContrato = [
    'Contrato de Obra Pública',
    'Contrato de Suministro',
    'Contrato de Servicios Generales',
    'Contrato de Servicios Técnicos y Profesionales',
    'Contrato de Consultoría',
    'Contrato de Arrendamiento',
    'Contrato de Mantenimiento',
    'Contrato de Compraventa',
    'Otro'
  ];

  const modalidadesContratacion = [
    'Licitación Pública',
    'Cotización',
    'Compra Directa',
    'Contratación por Excepción',
    'Negociación Directa',
    'Convenio Marco'
  ];

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setArchivoSeleccionado(file);

    const allowedTypes = ['text/plain', 'application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];

    if (!allowedTypes.includes(file.type) && !file.name.match(/\.(txt|pdf|doc|docx)$/i)) {
      alert('Por favor selecciona un archivo válido (PDF, DOC, DOCX, TXT)');
      return;
    }

    if (file.type === 'text/plain') {
      const text = await file.text();
      setTextoContrato(text);
    } else {
      setTextoContrato(`[Archivo adjunto: ${file.name}]\n\nNota: Para una revisión más detallada, por favor copia y pega el texto del contrato en el campo "Texto del Contrato" abajo, o proporciona información detallada en los campos del formulario.`);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) {
      const fakeEvent = {
        target: { files: [file] }
      } as unknown as React.ChangeEvent<HTMLInputElement>;
      handleFileSelect(fakeEvent);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formulario.tipo_contrato || !formulario.objeto_contrato) {
      alert('Por favor completa los campos obligatorios: Tipo de Contrato y Objeto del Contrato');
      return;
    }

    setCargando(true);
    setResultado('');

    try {
      const { data: { session } } = await supabase.auth.getSession();
      const apiUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/revision-contratos`;

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session?.access_token || import.meta.env.VITE_SUPABASE_ANON_KEY}`,
        },
        body: JSON.stringify({
          ...formulario,
          texto_contrato: textoContrato || formulario.aspectos_revisar
        }),
      });

      if (!response.ok) {
        throw new Error('Error al procesar la solicitud');
      }

      const data = await response.json();
      setResultado(data.resultado);

      const todasLasSecciones = new Set(['resumen', 'verificacion', 'clausulas', 'riesgos', 'recomendaciones']);
      setSeccionesExpandidas(todasLasSecciones);
    } catch (error) {
      console.error('Error:', error);
      alert('Ocurrió un error al generar la revisión del contrato. Por favor intenta nuevamente.');
    } finally {
      setCargando(false);
    }
  };

  const copiarResultado = () => {
    navigator.clipboard.writeText(resultado);
    alert('Contenido copiado al portapapeles');
  };

  const descargarResultado = () => {
    const blob = new Blob([resultado], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `revision-contrato-${formulario.tipo_contrato}-${Date.now()}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const extraerSecciones = (texto: string): SeccionAnalisis[] => {
    const secciones: SeccionAnalisis[] = [];

    const seccionesMap = [
      { keyword: 'RESUMEN', tipo: 'resumen' as const, icono: FileText },
      { keyword: 'VERIFICACIÓN', tipo: 'verificacion' as const, icono: Shield },
      { keyword: 'ANÁLISIS DE CLÁUSULAS', tipo: 'clausulas' as const, icono: BookOpen },
      { keyword: 'RIESGOS', tipo: 'riesgos' as const, icono: AlertTriangle },
      { keyword: 'RECOMENDACIONES', tipo: 'recomendaciones' as const, icono: CheckCircle2 }
    ];

    seccionesMap.forEach(({ keyword, tipo, icono }) => {
      const regex = new RegExp(`##\\s*.*${keyword}.*?(?=##|$)`, 'is');
      const match = texto.match(regex);

      if (match) {
        secciones.push({
          titulo: keyword,
          contenido: match[0],
          tipo,
          icono
        });
      }
    });

    return secciones;
  };

  const toggleSeccion = (tipo: string) => {
    const nuevas = new Set(seccionesExpandidas);
    if (nuevas.has(tipo)) {
      nuevas.delete(tipo);
    } else {
      nuevas.add(tipo);
    }
    setSeccionesExpandidas(nuevas);
  };

  const renderizarSeccion = (seccion: SeccionAnalisis) => {
    const IconoSeccion = seccion.icono;
    const expandida = seccionesExpandidas.has(seccion.tipo);

    const coloresMap = {
      resumen: { bg: 'bg-blue-50', border: 'border-blue-200', text: 'text-blue-700', icon: 'text-blue-600' },
      verificacion: { bg: 'bg-green-50', border: 'border-green-200', text: 'text-green-700', icon: 'text-green-600' },
      clausulas: { bg: 'bg-purple-50', border: 'border-purple-200', text: 'text-purple-700', icon: 'text-purple-600' },
      riesgos: { bg: 'bg-red-50', border: 'border-red-200', text: 'text-red-700', icon: 'text-red-600' },
      recomendaciones: { bg: 'bg-amber-50', border: 'border-amber-200', text: 'text-amber-700', icon: 'text-amber-600' }
    };

    const colores = coloresMap[seccion.tipo];

    return (
      <div key={seccion.tipo} className={`border ${colores.border} rounded-xl overflow-hidden mb-4`}>
        <button
          onClick={() => toggleSeccion(seccion.tipo)}
          className={`w-full ${colores.bg} p-6 flex items-center justify-between hover:opacity-80 transition-opacity`}
        >
          <div className="flex items-center space-x-3">
            <IconoSeccion size={24} className={colores.icon} />
            <h3 className={`text-xl font-bold ${colores.text}`}>{seccion.titulo}</h3>
          </div>
          {expandida ? (
            <ChevronUp size={24} className={colores.text} />
          ) : (
            <ChevronDown size={24} className={colores.text} />
          )}
        </button>

        {expandida && (
          <div className={`${colores.bg} bg-opacity-30 p-6 border-t ${colores.border}`}>
            <div
              className="prose max-w-none"
              dangerouslySetInnerHTML={{
                __html: seccion.contenido
                  .replace(/^##\s+/gm, '<h2 class="text-2xl font-bold mb-4">')
                  .replace(/^###\s+/gm, '<h3 class="text-xl font-semibold mb-3 mt-4">')
                  .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                  .replace(/^>\s+(.+)$/gm, '<blockquote class="border-l-4 border-gray-400 pl-4 italic my-4">$1</blockquote>')
                  .replace(/^- (.+)$/gm, '<li>$1</li>')
                  .replace(/(<li>.*<\/li>)/s, '<ul class="list-disc ml-6 space-y-2">$1</ul>')
                  .replace(/^(\d+)\.\s+(.+)$/gm, '<li>$2</li>')
                  .replace(/✅/g, '<span class="text-green-600">✅</span>')
                  .replace(/❌/g, '<span class="text-red-600">❌</span>')
                  .replace(/⚠️/g, '<span class="text-amber-600">⚠️</span>')
                  .replace(/🔍/g, '<span class="text-blue-600">🔍</span>')
                  .split('\n').map(line => line.trim() ? line : '<br>').join('\n')
              }}
            />
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-8">
      <div className="bg-gradient-to-br from-orange-900 via-orange-800 to-amber-900 rounded-3xl shadow-2xl overflow-hidden">
        <div className="p-12">
          <div className="flex items-center space-x-4 mb-6">
            <div className="w-16 h-16 bg-white/10 backdrop-blur-sm rounded-2xl flex items-center justify-center">
              <FileCheck size={32} className="text-white" />
            </div>
            <div>
              <h1 className="text-5xl font-bold text-white mb-2">
                Revisión de Contratos
              </h1>
              <p className="text-orange-200 text-xl font-medium">
                Análisis jurídico exhaustivo de contratos municipales
              </p>
            </div>
          </div>

          <p className="text-white/90 text-lg leading-relaxed max-w-4xl">
            Revisa contratos municipales verificando cumplimiento legal, análisis de cláusulas,
            identificación de riesgos y recomendaciones correctivas conforme a la Ley de Contrataciones
            del Estado y normativa municipal aplicable.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
              <Upload size={24} className="mr-3 text-orange-600" />
              Adjuntar Contrato (Opcional)
            </h2>

            <div
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-orange-500 transition-colors cursor-pointer bg-gray-50"
              onClick={() => fileInputRef.current?.click()}
            >
              <Upload size={48} className="mx-auto text-gray-400 mb-4" />
              <p className="text-gray-600 mb-2">
                Arrastra un archivo aquí o haz clic para seleccionar
              </p>
              <p className="text-sm text-gray-500">
                Formatos aceptados: PDF, DOC, DOCX, TXT
              </p>
              {archivoSeleccionado && (
                <div className="mt-4 p-3 bg-orange-50 border border-orange-200 rounded-lg flex items-center justify-center space-x-2">
                  <FileText size={20} className="text-orange-600" />
                  <span className="text-orange-700 font-medium">{archivoSeleccionado.name}</span>
                </div>
              )}
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.doc,.docx,.txt"
                onChange={handleFileSelect}
                className="hidden"
              />
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">
              Información del Contrato
            </h2>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tipo de Contrato *
                </label>
                <select
                  value={formulario.tipo_contrato}
                  onChange={(e) => setFormulario({ ...formulario, tipo_contrato: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  required
                >
                  <option value="">Selecciona el tipo de contrato</option>
                  {tiposContrato.map((tipo) => (
                    <option key={tipo} value={tipo}>{tipo}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Objeto del Contrato *
                </label>
                <textarea
                  value={formulario.objeto_contrato}
                  onChange={(e) => setFormulario({ ...formulario, objeto_contrato: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 resize-none"
                  rows={3}
                  placeholder="Describe el objeto del contrato..."
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Monto Estimado
                  </label>
                  <input
                    type="text"
                    value={formulario.monto_estimado}
                    onChange={(e) => setFormulario({ ...formulario, monto_estimado: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    placeholder="Ej: Q 500,000.00"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Plazo de Ejecución
                  </label>
                  <input
                    type="text"
                    value={formulario.plazo_ejecucion}
                    onChange={(e) => setFormulario({ ...formulario, plazo_ejecucion: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    placeholder="Ej: 6 meses"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Contratista
                </label>
                <input
                  type="text"
                  value={formulario.contratista}
                  onChange={(e) => setFormulario({ ...formulario, contratista: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  placeholder="Nombre o razón social del contratista"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Modalidad de Contratación
                </label>
                <select
                  value={formulario.modalidad_contratacion}
                  onChange={(e) => setFormulario({ ...formulario, modalidad_contratacion: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                >
                  <option value="">Selecciona la modalidad</option>
                  {modalidadesContratacion.map((modalidad) => (
                    <option key={modalidad} value={modalidad}>{modalidad}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Texto del Contrato
                </label>
                <textarea
                  value={textoContrato}
                  onChange={(e) => setTextoContrato(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 resize-none font-mono text-sm"
                  rows={6}
                  placeholder="Pega aquí el texto del contrato a revisar..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Cláusulas Específicas a Revisar
                </label>
                <textarea
                  value={formulario.clausulas_especificas}
                  onChange={(e) => setFormulario({ ...formulario, clausulas_especificas: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 resize-none"
                  rows={3}
                  placeholder="Indica cláusulas específicas que requieren atención especial..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Garantías Solicitadas
                </label>
                <input
                  type="text"
                  value={formulario.garantias_solicitadas}
                  onChange={(e) => setFormulario({ ...formulario, garantias_solicitadas: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  placeholder="Ej: Fianza de cumplimiento 10%, garantía de calidad"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Aspectos Específicos a Revisar
                </label>
                <textarea
                  value={formulario.aspectos_revisar}
                  onChange={(e) => setFormulario({ ...formulario, aspectos_revisar: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 resize-none"
                  rows={3}
                  placeholder="Menciona aspectos legales específicos que te preocupan o requieren revisión..."
                />
              </div>

              <button
                type="submit"
                disabled={cargando}
                className="w-full bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 text-white px-8 py-4 rounded-xl transition-all duration-200 font-bold text-lg shadow-lg hover:shadow-xl transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center space-x-2"
              >
                {cargando ? (
                  <>
                    <Loader2 size={24} className="animate-spin" />
                    <span>Analizando Contrato...</span>
                  </>
                ) : (
                  <>
                    <Search size={24} />
                    <span>Revisar Contrato</span>
                  </>
                )}
              </button>
            </form>
          </div>
        </div>

        <div className="space-y-6">
          {resultado && (
            <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-800 flex items-center">
                  <Scale size={24} className="mr-3 text-orange-600" />
                  Resultado de la Revisión
                </h2>
                <div className="flex space-x-2">
                  <button
                    onClick={copiarResultado}
                    className="p-3 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors"
                    title="Copiar"
                  >
                    <Copy size={20} className="text-gray-600" />
                  </button>
                  <button
                    onClick={descargarResultado}
                    className="p-3 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors"
                    title="Descargar"
                  >
                    <Download size={20} className="text-gray-600" />
                  </button>
                </div>
              </div>

              <div className="space-y-4">
                {extraerSecciones(resultado).map(renderizarSeccion)}

                {extraerSecciones(resultado).length === 0 && (
                  <div className="prose max-w-none bg-gray-50 p-6 rounded-xl">
                    <div dangerouslySetInnerHTML={{ __html: resultado.replace(/\n/g, '<br>') }} />
                  </div>
                )}
              </div>
            </div>
          )}

          {!resultado && !cargando && (
            <div className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-2xl shadow-lg p-8 border border-orange-100">
              <div className="text-center">
                <FileCheck size={64} className="mx-auto text-orange-400 mb-4" />
                <h3 className="text-2xl font-bold text-gray-800 mb-4">
                  Revisión Integral de Contratos
                </h3>
                <div className="text-left space-y-4 text-gray-700">
                  <div className="flex items-start space-x-3">
                    <Shield size={20} className="text-orange-600 mt-1 flex-shrink-0" />
                    <div>
                      <p className="font-semibold">Verificación Legal Completa</p>
                      <p className="text-sm text-gray-600">
                        Análisis de cumplimiento con Ley de Contrataciones, Código Municipal y normativa aplicable
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <BookOpen size={20} className="text-orange-600 mt-1 flex-shrink-0" />
                    <div>
                      <p className="font-semibold">Análisis de Cláusulas</p>
                      <p className="text-sm text-gray-600">
                        Revisión detallada de cláusulas esenciales, obligatorias y específicas
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <AlertTriangle size={20} className="text-orange-600 mt-1 flex-shrink-0" />
                    <div>
                      <p className="font-semibold">Identificación de Riesgos</p>
                      <p className="text-sm text-gray-600">
                        Detección de riesgos legales, financieros y de ejecución contractual
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <CheckCircle2 size={20} className="text-orange-600 mt-1 flex-shrink-0" />
                    <div>
                      <p className="font-semibold">Recomendaciones Correctivas</p>
                      <p className="text-sm text-gray-600">
                        Propuestas específicas de mejora y texto sugerido para cláusulas problemáticas
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RevisionContratos;
