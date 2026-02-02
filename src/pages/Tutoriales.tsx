import { useState } from 'react';
import {
  Scale,
  FileText,
  FileCheck,
  Clock,
  TrendingUp,
  Search,
  BookOpen,
  Sparkles,
  ArrowRight,
  Shield,
  Calculator,
  Bell,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface TutorialesProps {
  usuario: { nombre: string; cargo: string };
}

interface AgenteJuridico {
  id: string;
  nombre: string;
  descripcion: string;
  categoria: string;
  duracion: string;
  icono: any;
  color: string;
  bgColor: string;
  ruta?: string;
  disponible: boolean;
  popular?: boolean;
}

const Tutoriales: React.FC<TutorialesProps> = () => {
  const navigate = useNavigate();

  const agentesJuridicos: AgenteJuridico[] = [
    {
      id: 'busqueda-normativa',
      nombre: 'Búsqueda de Normativa',
      descripcion: 'Localiza y analiza normativa aplicable del Código Municipal, leyes y ordenanzas vigentes',
      categoria: 'Asesoría Jurídica',
      duracion: '2-3 min',
      icono: Search,
      color: 'from-teal-500 to-teal-600',
      bgColor: 'bg-teal-50',
      disponible: true,
      popular: true
    },
    {
      id: 'dictamenes-juridicos',
      nombre: 'Dictámenes Jurídicos',
      descripcion: 'Elabora dictámenes con análisis de precedentes y fundamentación legal completa',
      categoria: 'Asesoría Jurídica',
      duracion: '5-7 min',
      icono: Scale,
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-50',
      disponible: true,
      popular: true
    },
    {
      id: 'revision-contratos',
      nombre: 'Revisión de Contratos',
      descripcion: 'Revisa contratos municipales verificando cumplimiento legal y cláusulas esenciales',
      categoria: 'Contrataciones',
      duracion: '4-6 min',
      icono: FileCheck,
      color: 'from-emerald-500 to-emerald-600',
      bgColor: 'bg-emerald-50',
      disponible: true,
      popular: false
    },
    {
      id: 'elaboracion-pliegos',
      nombre: 'Elaboración de Pliegos',
      descripcion: 'Genera pliegos de contratación conforme a Ley de Contrataciones del Estado',
      categoria: 'Contrataciones',
      duracion: '6-8 min',
      icono: FileText,
      color: 'from-orange-500 to-orange-600',
      bgColor: 'bg-orange-50',
      disponible: false,
      popular: false
    },
    {
      id: 'calculo-plazos',
      nombre: 'Cálculo de Plazos Legales',
      descripcion: 'Calcula automáticamente plazos procesales y términos legales en procedimientos',
      categoria: 'Procedimientos',
      duracion: '1-2 min',
      icono: Calculator,
      color: 'from-cyan-500 to-cyan-600',
      bgColor: 'bg-cyan-50',
      disponible: false,
      popular: false
    },
    {
      id: 'redaccion-notificaciones',
      nombre: 'Redacción de Notificaciones',
      descripcion: 'Redacta notificaciones jurídicas conforme a requisitos legales de notificación',
      categoria: 'Procedimientos',
      duracion: '3-4 min',
      icono: Bell,
      color: 'from-purple-500 to-purple-600',
      bgColor: 'bg-purple-50',
      disponible: false,
      popular: false
    }
  ];

  const getCategoriaColor = (categoria: string) => {
    switch (categoria) {
      case 'Asesoría Jurídica':
        return 'bg-blue-100 text-blue-700';
      case 'Contrataciones':
        return 'bg-emerald-100 text-emerald-700';
      case 'Procedimientos':
        return 'bg-orange-100 text-orange-700';
      default:
        return 'bg-neutral-100 text-neutral-700';
    }
  };

  const handleIniciarAgente = (agente: AgenteJuridico) => {
    if (!agente.disponible) return;

    if (agente.ruta) {
      navigate(agente.ruta);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 via-teal-50/30 to-neutral-50">
      <div className="max-w-7xl mx-auto px-4 py-10">
        <div className="mb-10">
          <div className="flex items-center space-x-6 mb-6">
            <div className="w-20 h-20 gradient-primary rounded-3xl flex items-center justify-center shadow-xl">
              <Scale size={40} className="text-white" />
            </div>
            <div>
              <h1 className="text-5xl font-bold text-neutral-900 tracking-tight">
                Agentes Jurídicos Especializados
              </h1>
              <p className="text-neutral-600 text-xl mt-2">
                Cada agente está especializado en áreas específicas del derecho municipal, garantizando análisis fundamentado en normativa guatemalteca vigente.
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8 mb-12">
          {agentesJuridicos.map((agente) => {
            const IconoComponente = agente.icono;

            return (
              <div
                key={agente.id}
                className={`card-hover p-8 relative overflow-hidden ${!agente.disponible ? 'opacity-75' : ''}`}
              >
                {agente.popular && (
                  <div className="absolute top-0 right-0">
                    <div className="bg-gradient-to-br from-yellow-400 to-orange-500 text-white px-4 py-1 rounded-bl-2xl font-bold text-sm flex items-center space-x-1 shadow-lg">
                      <TrendingUp size={14} />
                      <span>Popular</span>
                    </div>
                  </div>
                )}

                {!agente.disponible && (
                  <div className="absolute top-0 right-0">
                    <div className="bg-neutral-200 text-neutral-600 px-4 py-1 rounded-bl-2xl font-bold text-sm shadow-md">
                      Próximamente
                    </div>
                  </div>
                )}

                <div className="flex items-start justify-between mb-6 mt-2">
                  <div className={`w-16 h-16 ${agente.bgColor} rounded-2xl flex items-center justify-center shadow-md`}>
                    <IconoComponente size={32} className={`bg-gradient-to-br ${agente.color} bg-clip-text text-transparent`} strokeWidth={2.5} />
                  </div>
                  <div className="text-right">
                    <div className="flex items-center justify-end space-x-2 mb-2">
                      <Clock size={16} className="text-neutral-500" />
                      <span className="text-sm font-semibold text-neutral-700">{agente.duracion}</span>
                    </div>
                  </div>
                </div>

                <div className="mb-4">
                  <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${getCategoriaColor(agente.categoria)} mb-3`}>
                    {agente.categoria}
                  </span>
                  <h3 className="text-2xl font-bold text-neutral-900 mb-3">
                    {agente.nombre}
                  </h3>
                  <p className="text-neutral-600 leading-relaxed text-base">
                    {agente.descripcion}
                  </p>
                </div>

                <button
                  onClick={() => handleIniciarAgente(agente)}
                  disabled={!agente.disponible}
                  className={`w-full flex items-center justify-center space-x-3 px-6 py-4 rounded-xl transition-all font-bold text-base shadow-md ${
                    agente.disponible
                      ? `bg-gradient-to-r ${agente.color} text-white hover:shadow-xl transform hover:-translate-y-1`
                      : 'bg-neutral-200 text-neutral-500 cursor-not-allowed'
                  }`}
                >
                  {agente.disponible ? (
                    <>
                      <Sparkles size={20} strokeWidth={2.5} />
                      <span>Comenzar Ahora</span>
                      <ArrowRight size={20} strokeWidth={2.5} />
                    </>
                  ) : (
                    <>
                      <AlertCircle size={20} strokeWidth={2.5} />
                      <span>Próximamente</span>
                    </>
                  )}
                </button>
              </div>
            );
          })}
        </div>

        <div className="card p-8 mb-10 bg-gradient-to-br from-teal-50/50 to-white border-2 border-teal-100">
          <div className="flex items-start space-x-4">
            <div className="w-14 h-14 gradient-primary rounded-xl flex items-center justify-center flex-shrink-0">
              <Shield size={28} className="text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-neutral-900 mb-3">
                Fundamentación Legal Garantizada
              </h2>
              <p className="text-neutral-700 leading-relaxed text-lg mb-4">
                Todos nuestros agentes jurídicos están diseñados para trabajar con la normativa guatemalteca vigente,
                incluyendo el Código Municipal, Ley de Contrataciones del Estado, Ley de Servicio Municipal y demás
                leyes aplicables al ámbito municipal.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-start space-x-3">
                  <CheckCircle size={20} className="text-teal-600 flex-shrink-0 mt-1" />
                  <div>
                    <p className="font-semibold text-neutral-900">Análisis Contextual</p>
                    <p className="text-neutral-600 text-sm">Comprende el contexto específico de cada consulta</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle size={20} className="text-teal-600 flex-shrink-0 mt-1" />
                  <div>
                    <p className="font-semibold text-neutral-900">Precedentes Municipales</p>
                    <p className="text-neutral-600 text-sm">Acceso a biblioteca de precedentes administrativos</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle size={20} className="text-teal-600 flex-shrink-0 mt-1" />
                  <div>
                    <p className="font-semibold text-neutral-900">Citas Normativas</p>
                    <p className="text-neutral-600 text-sm">Referencias precisas a artículos y decretos</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle size={20} className="text-teal-600 flex-shrink-0 mt-1" />
                  <div>
                    <p className="font-semibold text-neutral-900">Actualización Constante</p>
                    <p className="text-neutral-600 text-sm">Base de conocimiento en continua actualización</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="card p-8 bg-gradient-to-br from-blue-50/50 to-white border-2 border-blue-100">
          <div className="flex items-start space-x-4 mb-6">
            <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center flex-shrink-0">
              <BookOpen size={28} className="text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-neutral-900 mb-2">
                ¿Cómo funcionan los agentes jurídicos?
              </h2>
              <p className="text-neutral-600 leading-relaxed">
                Cada agente especializado utiliza inteligencia artificial para procesar tu consulta,
                analizar la normativa aplicable y generar respuestas fundamentadas legalmente.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-xl p-6 shadow-sm border border-neutral-200">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-4">
                <span className="text-2xl font-bold text-blue-600">1</span>
              </div>
              <h3 className="font-bold text-neutral-900 mb-2 text-lg">Ingresa tu Consulta</h3>
              <p className="text-neutral-600 text-sm leading-relaxed">
                Describe tu situación jurídica o el documento que necesitas elaborar de forma clara y detallada.
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm border border-neutral-200">
              <div className="w-12 h-12 bg-teal-100 rounded-xl flex items-center justify-center mb-4">
                <span className="text-2xl font-bold text-teal-600">2</span>
              </div>
              <h3 className="font-bold text-neutral-900 mb-2 text-lg">Análisis Inteligente</h3>
              <p className="text-neutral-600 text-sm leading-relaxed">
                El agente analiza tu consulta, identifica la normativa aplicable y busca precedentes relevantes.
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm border border-neutral-200">
              <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center mb-4">
                <span className="text-2xl font-bold text-emerald-600">3</span>
              </div>
              <h3 className="font-bold text-neutral-900 mb-2 text-lg">Resultado Fundamentado</h3>
              <p className="text-neutral-600 text-sm leading-relaxed">
                Recibe un análisis completo con citas legales, conclusiones y recomendaciones jurídicas.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Tutoriales;
