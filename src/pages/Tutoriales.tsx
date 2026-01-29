import React, { useState } from 'react';
import {
  Play,
  FileText,
  FileEdit,
  Mail,
  ClipboardList,
  BookOpen,
  FolderOpen,
  ChevronRight,
  Clock,
  Users,
  CheckCircle,
  Lightbulb,
  Video,
  Download,
  Send,
  MessageSquare,
  ScrollText,
  FileCheck,
  FolderSearch,
  TrendingUp,
  Sparkles,
  GraduationCap,
  Target,
  Zap
} from 'lucide-react';

interface TutorialesProps {
  usuario: { nombre: string; cargo: string };
}

const Tutoriales: React.FC<TutorialesProps> = ({ usuario }) => {
  const [tutorialActivo, setTutorialActivo] = useState<string | null>(null);

  const tutoriales = [
    {
      id: 'redactor-oficios',
      titulo: 'Redactor de Oficios',
      descripcion: 'Aprende a generar oficios formales institucionales',
      icono: Send,
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-50',
      iconColor: 'text-blue-600',
      duracion: '5 min',
      nivel: 'Básico',
      pasos: [
        {
          titulo: 'Acceder al Redactor de Oficios',
          descripcion: 'Desde el dashboard, haz clic en "Redactor de Oficios" o selecciónalo desde el menú Agentes.',
          imagen: 'https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=600'
        },
        {
          titulo: 'Completar Información Básica',
          descripcion: 'Llena los campos requeridos: destinatario, cargo, institución y asunto del oficio.',
          imagen: 'https://images.pexels.com/photos/3184292/pexels-photo-3184292.jpeg?auto=compress&cs=tinysrgb&w=600'
        },
        {
          titulo: 'Seleccionar Tipo de Lenguaje',
          descripcion: 'Elige entre Formal, Muy Formal o Protocolar según el contexto del documento.',
          imagen: 'https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg?auto=compress&cs=tinysrgb&w=600'
        },
        {
          titulo: 'Agregar Contenido Adicional',
          descripcion: 'En el campo de contenido libre, proporciona detalles específicos o instrucciones adicionales.',
          imagen: 'https://images.pexels.com/photos/3184339/pexels-photo-3184339.jpeg?auto=compress&cs=tinysrgb&w=600'
        },
        {
          titulo: 'Generar y Editar',
          descripcion: 'Haz clic en "Generar Documento", revisa el resultado y edita si es necesario.',
          imagen: 'https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=600'
        }
      ]
    },
    {
      id: 'generador-memos',
      titulo: 'Generador de Memos',
      descripcion: 'Crea memorandos internos eficientemente',
      icono: MessageSquare,
      color: 'from-emerald-500 to-emerald-600',
      bgColor: 'bg-emerald-50',
      iconColor: 'text-emerald-600',
      duracion: '4 min',
      nivel: 'Básico',
      pasos: [
        {
          titulo: 'Seleccionar Generador de Memos',
          descripcion: 'Accede al generador desde el dashboard o menú de agentes.',
          imagen: 'https://images.pexels.com/photos/3184292/pexels-photo-3184292.jpeg?auto=compress&cs=tinysrgb&w=600'
        },
        {
          titulo: 'Información del Destinatario',
          descripcion: 'Completa los datos del destinatario: nombre, cargo y departamento.',
          imagen: 'https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg?auto=compress&cs=tinysrgb&w=600'
        },
        {
          titulo: 'Definir Prioridad y Tipo',
          descripcion: 'Selecciona la prioridad (Normal, Alta, Urgente) y tipo de memo (Informativo, Solicitud, etc.).',
          imagen: 'https://images.pexels.com/photos/3184339/pexels-photo-3184339.jpeg?auto=compress&cs=tinysrgb&w=600'
        },
        {
          titulo: 'Generar Memorando',
          descripcion: 'Completa el contenido y genera el memorando con formato institucional.',
          imagen: 'https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=600'
        }
      ]
    },
    {
      id: 'redactor-cartas',
      titulo: 'Redactor de Cartas',
      descripcion: 'Redacta cartas oficiales con protocolo apropiado',
      icono: ScrollText,
      color: 'from-purple-500 to-purple-600',
      bgColor: 'bg-purple-50',
      iconColor: 'text-purple-600',
      duracion: '6 min',
      nivel: 'Intermedio',
      pasos: [
        {
          titulo: 'Acceder al Redactor de Cartas',
          descripcion: 'Selecciona el redactor de cartas desde el menú principal.',
          imagen: 'https://images.pexels.com/photos/3184292/pexels-photo-3184292.jpeg?auto=compress&cs=tinysrgb&w=600'
        },
        {
          titulo: 'Información del Destinatario',
          descripcion: 'Completa datos del destinatario, cargo, institución y ciudad.',
          imagen: 'https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg?auto=compress&cs=tinysrgb&w=600'
        },
        {
          titulo: 'Seleccionar Protocolo',
          descripcion: 'Elige el nivel de protocolo: Estándar, Diplomático o Ceremonial.',
          imagen: 'https://images.pexels.com/photos/3184339/pexels-photo-3184339.jpeg?auto=compress&cs=tinysrgb&w=600'
        },
        {
          titulo: 'Tipo de Carta',
          descripcion: 'Selecciona entre Invitación, Agradecimiento, Felicitación, Condolencia o Presentación.',
          imagen: 'https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=600'
        }
      ]
    },
    {
      id: 'asistente-minutas',
      titulo: 'Asistente de Minutas',
      descripcion: 'Elabora minutas y actas de reuniones',
      icono: FileCheck,
      color: 'from-orange-500 to-orange-600',
      bgColor: 'bg-orange-50',
      iconColor: 'text-orange-600',
      duracion: '7 min',
      nivel: 'Intermedio',
      pasos: [
        {
          titulo: 'Configurar Reunión',
          descripcion: 'Ingresa título, fecha, hora y lugar de la reunión.',
          imagen: 'https://images.pexels.com/photos/3184292/pexels-photo-3184292.jpeg?auto=compress&cs=tinysrgb&w=600'
        },
        {
          titulo: 'Lista de Participantes',
          descripcion: 'Agrega todos los participantes separados por comas.',
          imagen: 'https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg?auto=compress&cs=tinysrgb&w=600'
        },
        {
          titulo: 'Tipo de Documento',
          descripcion: 'Selecciona entre Minuta, Acta o Memoria de Reunión.',
          imagen: 'https://images.pexels.com/photos/3184339/pexels-photo-3184339.jpeg?auto=compress&cs=tinysrgb&w=600'
        },
        {
          titulo: 'Contenido y Acuerdos',
          descripcion: 'Describe la agenda y los acuerdos alcanzados en la reunión.',
          imagen: 'https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=600'
        }
      ]
    },
    {
      id: 'resumen-expedientes',
      titulo: 'Resumen de Expedientes',
      descripcion: 'Genera resúmenes ejecutivos de expedientes',
      icono: FolderSearch,
      color: 'from-teal-500 to-teal-600',
      bgColor: 'bg-teal-50',
      iconColor: 'text-teal-600',
      duracion: '8 min',
      nivel: 'Avanzado',
      pasos: [
        {
          titulo: 'Información del Expediente',
          descripcion: 'Ingresa número, título y datos básicos del expediente.',
          imagen: 'https://images.pexels.com/photos/3184292/pexels-photo-3184292.jpeg?auto=compress&cs=tinysrgb&w=600'
        },
        {
          titulo: 'Tipo de Resumen',
          descripcion: 'Selecciona entre Ejecutivo, Técnico, Administrativo o Legal.',
          imagen: 'https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg?auto=compress&cs=tinysrgb&w=600'
        },
        {
          titulo: 'Análisis de Contenido',
          descripcion: 'Proporciona información sobre antecedentes y desarrollo del expediente.',
          imagen: 'https://images.pexels.com/photos/3184339/pexels-photo-3184339.jpeg?auto=compress&cs=tinysrgb&w=600'
        }
      ]
    },
    {
      id: 'analisis-inversion',
      titulo: 'Análisis de Inversión',
      descripcion: 'Evalúa proyectos de inversión pública',
      icono: TrendingUp,
      color: 'from-red-500 to-red-600',
      bgColor: 'bg-red-50',
      iconColor: 'text-red-600',
      duracion: '10 min',
      nivel: 'Avanzado',
      pasos: [
        {
          titulo: 'Datos del Proyecto',
          descripcion: 'Ingresa código, nombre, institución ejecutora y monto del proyecto.',
          imagen: 'https://images.pexels.com/photos/3184292/pexels-photo-3184292.jpeg?auto=compress&cs=tinysrgb&w=600'
        },
        {
          titulo: 'Categoría y Análisis',
          descripcion: 'Selecciona categoría de inversión y tipo de análisis requerido.',
          imagen: 'https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg?auto=compress&cs=tinysrgb&w=600'
        },
        {
          titulo: 'Evaluación Integral',
          descripcion: 'El sistema genera análisis técnico, financiero, social y ambiental.',
          imagen: 'https://images.pexels.com/photos/3184339/pexels-photo-3184339.jpeg?auto=compress&cs=tinysrgb&w=600'
        }
      ]
    }
  ];

  const consejos = [
    {
      titulo: 'Información Completa',
      descripcion: 'Proporciona toda la información requerida para obtener mejores resultados',
      icono: CheckCircle,
      color: 'from-emerald-500 to-teal-500'
    },
    {
      titulo: 'Contenido Específico',
      descripcion: 'Usa el campo de contenido adicional para instrucciones detalladas',
      icono: Target,
      color: 'from-blue-500 to-cyan-500'
    },
    {
      titulo: 'Revisión Final',
      descripcion: 'Siempre revisa y edita el documento generado antes de usarlo',
      icono: FileCheck,
      color: 'from-purple-500 to-pink-500'
    },
    {
      titulo: 'Guarda tu Trabajo',
      descripcion: 'Utiliza el historial para gestionar tus documentos generados',
      icono: BookOpen,
      color: 'from-orange-500 to-red-500'
    }
  ];

  const obtenerColorNivel = (nivel: string) => {
    switch (nivel) {
      case 'Básico':
        return 'bg-green-100 text-green-800';
      case 'Intermedio':
        return 'bg-yellow-100 text-yellow-800';
      case 'Avanzado':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-10">
      {/* Hero Header */}
      <div className="bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 rounded-3xl shadow-2xl overflow-hidden">
        <div className="relative p-12">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0" style={{backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)", backgroundSize: "40px 40px"}}></div>
          </div>
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20"></div>

          <div className="relative text-center">
            <div className="flex items-center justify-center space-x-4 mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-3xl flex items-center justify-center shadow-2xl">
                <GraduationCap size={32} className="text-white" />
              </div>
              <h2 className="text-5xl font-bold text-white">
                Tutoriales del Sistema
              </h2>
            </div>

            <p className="text-white/90 text-xl max-w-3xl mx-auto leading-relaxed mb-8">
              Aprende a usar cada agente de IA para generar documentos oficiales de manera eficiente.
              Sigue nuestras guías paso a paso para dominar todas las funcionalidades.
            </p>

            <div className="flex items-center justify-center space-x-8 text-white/80">
              <div className="flex items-center space-x-2">
                <Sparkles size={20} className="text-yellow-400" />
                <span className="font-semibold">6 Agentes Especializados</span>
              </div>
              <div className="flex items-center space-x-2">
                <Zap size={20} className="text-blue-400" />
                <span className="font-semibold">Guías Paso a Paso</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle size={20} className="text-emerald-400" />
                <span className="font-semibold">Fácil de Seguir</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tutorial Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
        {tutoriales.map((tutorial) => {
          const IconoComponente = tutorial.icono;
          const esActivo = tutorialActivo === tutorial.id;
          
          return (
            <div
              key={tutorial.id}
              className="bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 border-2 border-gray-100 hover:border-gray-200 overflow-hidden transform hover:-translate-y-2 group"
            >
              <div className={`h-2 bg-gradient-to-r ${tutorial.color}`}></div>

              <div className="p-8">
                <div className="flex items-start justify-between mb-6">
                  <div className="relative">
                    <div className={`w-20 h-20 ${tutorial.bgColor} rounded-3xl flex items-center justify-center shadow-md group-hover:shadow-xl transition-all duration-300 group-hover:scale-110`}>
                      <IconoComponente size={36} className={tutorial.iconColor} strokeWidth={2} />
                    </div>
                    <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center shadow-lg">
                      <Play size={16} className="text-white ml-0.5" />
                    </div>
                  </div>
                  <div className="text-right space-y-2">
                    <div className="flex items-center justify-end space-x-2">
                      <Clock size={16} className="text-gray-500" />
                      <span className="text-sm font-semibold text-gray-700">{tutorial.duracion}</span>
                    </div>
                    <span className={`inline-block px-3 py-1.5 text-xs font-bold rounded-full ${obtenerColorNivel(tutorial.nivel)}`}>
                      {tutorial.nivel}
                    </span>
                  </div>
                </div>

                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  {tutorial.titulo}
                </h3>

                <p className="text-gray-600 mb-8 leading-relaxed text-base">
                  {tutorial.descripcion}
                </p>

                <button
                  onClick={() => setTutorialActivo(esActivo ? null : tutorial.id)}
                  className={`w-full flex items-center justify-center space-x-3 px-6 py-4 rounded-2xl transition-all duration-300 font-bold text-lg shadow-xl transform group-hover:scale-105 relative overflow-hidden ${
                    esActivo
                      ? 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                      : `bg-gradient-to-r ${tutorial.color} text-white hover:shadow-2xl`
                  }`}
                >
                  {!esActivo && <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>}
                  <Play size={20} className="relative" strokeWidth={3} />
                  <span className="relative">{esActivo ? 'Ocultar Tutorial' : 'Ver Tutorial'}</span>
                  <ChevronRight size={20} className={`relative transition-transform duration-300 ${esActivo ? 'rotate-90' : ''}`} strokeWidth={3} />
                </button>

                {/* Tutorial Steps */}
                {esActivo && (
                  <div className="mt-6 pt-6 border-t border-gray-200">
                    <h4 className="font-bold text-gray-800 mb-4">Pasos del Tutorial:</h4>
                    <div className="space-y-4">
                      {tutorial.pasos.map((paso, index) => (
                        <div key={index} className="flex items-start space-x-4">
                          <div className={`w-8 h-8 bg-gradient-to-br ${tutorial.color} rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0`}>
                            {index + 1}
                          </div>
                          <div className="flex-1">
                            <h5 className="font-semibold text-gray-800 mb-1">
                              {paso.titulo}
                            </h5>
                            <p className="text-gray-600 text-sm leading-relaxed">
                              {paso.descripcion}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Tips Section */}
      <div className="bg-gradient-to-br from-gray-50 to-white rounded-3xl shadow-xl p-12 border-2 border-gray-100">
        <div className="text-center mb-12">
          <div className="inline-flex items-center space-x-3 mb-4">
            <Lightbulb size={32} className="text-yellow-500" />
            <h3 className="text-3xl font-bold text-gray-900">
              Consejos para Mejores Resultados
            </h3>
          </div>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Sigue estas recomendaciones para aprovechar al máximo los agentes de IA
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {consejos.map((consejo, index) => {
            const IconoComponente = consejo.icono;

            return (
              <div key={index} className="group text-center bg-white rounded-2xl p-6 shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border-2 border-transparent hover:border-gray-200">
                <div className={`w-20 h-20 bg-gradient-to-br ${consejo.color} rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                  <IconoComponente size={32} className="text-white" strokeWidth={2.5} />
                </div>
                <h4 className="font-bold text-gray-900 mb-3 text-lg">
                  {consejo.titulo}
                </h4>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {consejo.descripcion}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Video Resources */}
      <div className="bg-gradient-to-br from-blue-600 via-purple-600 to-blue-700 rounded-3xl shadow-2xl overflow-hidden">
        <div className="relative p-12">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0" style={{backgroundImage: "radial-gradient(circle, white 2px, transparent 2px)", backgroundSize: "30px 30px"}}></div>
          </div>

          <div className="relative text-center">
            <div className="w-24 h-24 bg-white/20 backdrop-blur-sm rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-2xl">
              <Video size={48} className="text-white" strokeWidth={2} />
            </div>

            <h3 className="text-3xl font-bold text-white mb-4">
              Recursos Adicionales
            </h3>

            <p className="text-white/90 text-lg mb-8 max-w-2xl mx-auto leading-relaxed">
              Próximamente estarán disponibles videos tutoriales y guías descargables
              para complementar tu aprendizaje del sistema AIGP-SEGEPLAN.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button className="flex items-center space-x-3 px-8 py-4 bg-white text-blue-600 rounded-2xl hover:bg-blue-50 transition-all duration-300 font-bold text-lg shadow-xl hover:shadow-2xl transform hover:scale-105">
                <Video size={20} strokeWidth={2.5} />
                <span>Videos Tutoriales</span>
              </button>

              <button className="flex items-center space-x-3 px-8 py-4 bg-white/10 backdrop-blur-sm text-white border-2 border-white/50 rounded-2xl hover:bg-white/20 transition-all duration-300 font-bold text-lg shadow-xl hover:shadow-2xl transform hover:scale-105">
                <Download size={20} strokeWidth={2.5} />
                <span>Guías PDF</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Support Contact */}
      <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-3xl shadow-xl p-12 border-2 border-emerald-100">
        <div className="text-center max-w-3xl mx-auto">
          <div className="flex items-center justify-center space-x-3 mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-2xl flex items-center justify-center shadow-lg">
              <Users size={32} className="text-white" strokeWidth={2} />
            </div>
            <h3 className="text-3xl font-bold text-gray-900">
              ¿Necesitas Ayuda Adicional?
            </h3>
          </div>

          <p className="text-gray-700 text-lg mb-8 leading-relaxed">
            Si tienes dudas específicas sobre el uso de algún agente, no dudes en contactar
            al equipo de soporte técnico de SEGEPLAN.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto">
            <div className="bg-white rounded-2xl p-6 shadow-md hover:shadow-xl transition-all duration-300 border-2 border-transparent hover:border-emerald-200">
              <Mail size={24} className="text-emerald-600 mx-auto mb-3" strokeWidth={2} />
              <p className="text-sm font-semibold text-gray-500 mb-2">Correo Electrónico</p>
              <p className="text-gray-900 font-bold">soporte@segeplan.gob.gt</p>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-md hover:shadow-xl transition-all duration-300 border-2 border-transparent hover:border-emerald-200">
              <Users size={24} className="text-emerald-600 mx-auto mb-3" strokeWidth={2} />
              <p className="text-sm font-semibold text-gray-500 mb-2">Mesa de Ayuda</p>
              <p className="text-gray-900 font-bold">Extensión 1234</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Tutoriales;