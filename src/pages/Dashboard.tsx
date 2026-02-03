import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FileText,
  FileEdit,
  BookOpen,
  Zap,
  Users,
  Award,
  ArrowRight,
  Sparkles,
  Clock,
  Shield,
  Send,
  ScrollText,
  FileCheck,
  FolderSearch,
  TrendingUp,
  Scale,
  Briefcase
} from 'lucide-react';

interface DashboardProps {
  usuario: { nombre: string; cargo: string };
}

const Dashboard: React.FC<DashboardProps> = ({ usuario }) => {
  const navigate = useNavigate();
  const agentes = [
    {
      id: 'busqueda-normativa',
      titulo: 'Búsqueda de Normativa',
      descripcion: 'Localiza y analiza normativa aplicable del Código Municipal, leyes y ordenanzas vigentes',
      icono: BookOpen,
      color: 'from-teal-500 to-teal-600',
      bgColor: 'bg-teal-50',
      iconColor: 'text-teal-600',
      categoria: 'Asesoría Jurídica',
      tiempo: '2-3 min',
      popular: true,
      ruta: '/agentes/oficios',
      proximamente: false
    },
    {
      id: 'dictamenes-juridicos',
      titulo: 'Dictámenes Jurídicos',
      descripcion: 'Elabora dictámenes con análisis de precedentes y fundamentación legal completa',
      icono: FileEdit,
      color: 'from-teal-600 to-teal-700',
      bgColor: 'bg-teal-50',
      iconColor: 'text-teal-700',
      categoria: 'Asesoría Jurídica',
      tiempo: '5-7 min',
      popular: true,
      ruta: '/agentes/memos',
      proximamente: false
    },
    {
      id: 'revision-contratos',
      titulo: 'Revisión de Contratos',
      descripcion: 'Revisa contratos municipales verificando cumplimiento legal y cláusulas esenciales',
      icono: FileCheck,
      color: 'from-orange-500 to-orange-600',
      bgColor: 'bg-orange-50',
      iconColor: 'text-orange-600',
      categoria: 'Contrataciones',
      tiempo: '4-6 min',
      ruta: '/agentes/revision-contratos',
      proximamente: false
    },
    {
      id: 'elaboracion-pliegos',
      titulo: 'Elaboración de Pliegos',
      descripcion: 'Genera pliegos de contratación conforme a Ley de Contrataciones del Estado',
      icono: ScrollText,
      color: 'from-amber-600 to-orange-600',
      bgColor: 'bg-amber-50',
      iconColor: 'text-amber-700',
      categoria: 'Contrataciones',
      tiempo: '6-8 min',
      ruta: '/agentes/minutas',
      proximamente: true
    },
    {
      id: 'calculo-plazos',
      titulo: 'Cálculo de Plazos Legales',
      descripcion: 'Calcula automáticamente plazos procesales y términos legales en procedimientos',
      icono: Clock,
      color: 'from-teal-500 to-cyan-600',
      bgColor: 'bg-cyan-50',
      iconColor: 'text-cyan-700',
      categoria: 'Procedimientos',
      tiempo: '1-2 min',
      ruta: '/agentes/resumenes',
      proximamente: true
    },
    {
      id: 'redaccion-notificaciones',
      titulo: 'Redacción de Notificaciones',
      descripcion: 'Redacta notificaciones jurídicas conforme a requisitos legales de notificación',
      icono: Send,
      color: 'from-slate-600 to-slate-700',
      bgColor: 'bg-slate-50',
      iconColor: 'text-slate-700',
      categoria: 'Procedimientos',
      tiempo: '3-4 min',
      ruta: '/agentes/analisis',
      proximamente: true
    }
  ];

  return (
    <div className="space-y-16">
      <section className="relative">
        <div className="gradient-neutral rounded-3xl overflow-hidden shadow-2xl">
          <div className="absolute inset-0 opacity-5">
            <div className="absolute inset-0" style={{backgroundImage: "radial-gradient(circle, white 1.5px, transparent 1.5px)", backgroundSize: "32px 32px"}}></div>
          </div>
          <div className="absolute inset-0 bg-gradient-to-r from-teal-900/30 to-orange-900/20"></div>
          <div className="relative px-8 py-16 lg:px-16">
            <div className="max-w-5xl">
              <div className="flex flex-col lg:flex-row lg:items-center lg:space-x-8 mb-10">
                <div className="w-24 h-24 gradient-accent backdrop-blur-sm rounded-3xl flex items-center justify-center shadow-2xl mb-6 lg:mb-0">
                  <Scale size={48} className="text-white" />
                </div>
                <div>
                  <h1 className="text-5xl lg:text-6xl font-bold text-white mb-4 tracking-tight">
                    Asistencia Jurídica Municipal con IA
                  </h1>
                  <p className="text-teal-100 text-xl lg:text-2xl font-medium">
                    Municipalidad de Guatemala • Departamento Jurídico
                  </p>
                </div>
              </div>

              <p className="text-white/90 text-xl lg:text-2xl leading-relaxed max-w-4xl">
                Herramientas inteligentes para análisis legales, dictámenes, contratos y procedimientos
                administrativos especializadas en derecho municipal guatemalteco.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="card p-12">
        <div className="text-center mb-14">
          <h2 className="text-4xl lg:text-5xl font-bold text-neutral-900 mb-5">
            ¿Por qué usar IA Jurídico Municipal?
          </h2>
          <p className="text-xl text-neutral-600 max-w-3xl mx-auto leading-relaxed">
            Herramienta especializada para fortalecer la capacidad jurídica del gobierno municipal
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          <div className="text-center group">
            <div className="w-24 h-24 gradient-primary rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-lg group-hover:shadow-2xl transition-all duration-300 group-hover:scale-110">
              <Zap size={40} className="text-white" />
            </div>
            <h3 className="text-2xl font-bold text-neutral-900 mb-4">Tecnología Especializada</h3>
            <p className="text-neutral-600 leading-relaxed text-lg">
              Agentes de IA especializados en derecho municipal guatemalteco,
              con conocimiento del Código Municipal y normativa aplicable.
            </p>
          </div>

          <div className="text-center group">
            <div className="w-24 h-24 gradient-primary rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-lg group-hover:shadow-2xl transition-all duration-300 group-hover:scale-110">
              <Users size={40} className="text-white" />
            </div>
            <h3 className="text-2xl font-bold text-neutral-900 mb-4">Apoyo Profesional</h3>
            <p className="text-neutral-600 leading-relaxed text-lg">
              Complementa el criterio profesional del abogado municipal
              con análisis automatizado y búsqueda inteligente de normativa.
            </p>
          </div>

          <div className="text-center group">
            <div className="w-24 h-24 gradient-accent rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-lg group-hover:shadow-2xl transition-all duration-300 group-hover:scale-110">
              <Award size={40} className="text-white" />
            </div>
            <h3 className="text-2xl font-bold text-neutral-900 mb-4">Seguridad Jurídica</h3>
            <p className="text-neutral-600 leading-relaxed text-lg">
              Documentos legales fundamentados en normativa vigente,
              con análisis de precedentes y cumplimiento constitucional.
            </p>
          </div>
        </div>
      </section>

      <section className="card p-12">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-4xl lg:text-5xl font-bold text-neutral-900 mb-8">
            Comienza en 3 Pasos
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mt-12">
            <div className="relative">
              <div className="w-20 h-20 gradient-primary rounded-2xl flex items-center justify-center mx-auto mb-6 text-white font-bold text-3xl shadow-lg">
                1
              </div>
              <h3 className="text-2xl font-bold text-neutral-900 mb-4">Selecciona un Agente</h3>
              <p className="text-neutral-600 text-lg leading-relaxed">
                Elige el agente jurídico especializado según tu necesidad: dictámenes, contratos, normativa.
              </p>
            </div>

            <div className="relative">
              <div className="w-20 h-20 gradient-primary rounded-2xl flex items-center justify-center mx-auto mb-6 text-white font-bold text-3xl shadow-lg">
                2
              </div>
              <h3 className="text-2xl font-bold text-neutral-900 mb-4">Proporciona los Datos</h3>
              <p className="text-neutral-600 text-lg leading-relaxed">
                Ingresa la información del caso, normativa relevante o documentos a analizar.
              </p>
            </div>

            <div className="relative">
              <div className="w-20 h-20 gradient-accent rounded-2xl flex items-center justify-center mx-auto mb-6 text-white font-bold text-3xl shadow-lg">
                3
              </div>
              <h3 className="text-2xl font-bold text-neutral-900 mb-4">Obtén el Resultado</h3>
              <p className="text-neutral-600 text-lg leading-relaxed">
                Recibe análisis jurídico fundamentado, listo para revisión y aplicación profesional.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section id="agentes">
        <div className="text-center mb-14">
          <h2 className="text-4xl lg:text-5xl font-bold text-neutral-900 mb-5">
            Agentes Jurídicos Especializados
          </h2>
          <p className="text-xl text-neutral-600 max-w-4xl mx-auto leading-relaxed">
            Cada agente está especializado en áreas específicas del derecho municipal,
            garantizando análisis fundamentado en normativa guatemalteca vigente.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
          {agentes.map((agente) => {
            const IconoComponente = agente.icono;

            return (
              <div
                key={agente.id}
                className={`group bg-white rounded-3xl shadow-md transition-all duration-500 border-2 overflow-hidden relative ${
                  agente.proximamente
                    ? 'border-neutral-200 opacity-70'
                    : 'card-hover'
                }`}
              >
                {agente.popular && !agente.proximamente && (
                  <div className="absolute top-5 right-5 z-10">
                    <div className="gradient-accent text-white px-4 py-2 rounded-full text-xs font-bold shadow-lg flex items-center space-x-2">
                      <Sparkles size={14} />
                      <span>Popular</span>
                    </div>
                  </div>
                )}
                {agente.proximamente && (
                  <div className="absolute top-5 right-5 z-10">
                    <div className="bg-neutral-400 text-white px-4 py-2 rounded-full text-xs font-bold shadow-lg flex items-center space-x-2">
                      <Clock size={14} />
                      <span>Próximamente</span>
                    </div>
                  </div>
                )}
                <div className={`h-2 bg-gradient-to-r ${agente.proximamente ? 'from-neutral-300 to-neutral-400' : agente.color}`}></div>

                <div className="p-8">
                  <div className="flex items-start justify-between mb-7">
                    <div className="relative">
                      <div className={`w-20 h-20 ${agente.bgColor} rounded-2xl flex items-center justify-center shadow-sm ${!agente.proximamente && 'group-hover:shadow-lg transition-all duration-300 group-hover:scale-110'}`}>
                        <IconoComponente size={36} className={agente.iconColor} strokeWidth={2} />
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="inline-block bg-neutral-100 text-neutral-700 text-xs font-bold px-3 py-2 rounded-lg mb-2">
                        {agente.categoria}
                      </span>
                      <div className="flex items-center justify-end text-neutral-500 text-sm font-semibold">
                        <Clock size={16} className="mr-2" />
                        {agente.tiempo}
                      </div>
                    </div>
                  </div>

                  <h3 className="text-2xl font-bold text-neutral-900 mb-4 leading-tight">
                    {agente.titulo}
                  </h3>

                  <p className="text-neutral-600 mb-8 leading-relaxed text-base">
                    {agente.descripcion}
                  </p>

                  {agente.proximamente ? (
                    <button
                      disabled
                      className="w-full bg-neutral-300 text-neutral-600 px-6 py-4 rounded-xl font-bold text-lg cursor-not-allowed flex items-center justify-center space-x-3"
                    >
                      <Clock size={22} strokeWidth={2.5} />
                      <span>Próximamente</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => navigate(agente.ruta)}
                      className={`w-full bg-gradient-to-r ${agente.color} hover:shadow-xl text-white px-6 py-4 rounded-xl transition-all duration-300 font-bold text-lg shadow-md transform hover:scale-105 flex items-center justify-center space-x-3 group/btn`}
                    >
                      <span>Comenzar Ahora</span>
                      <ArrowRight size={22} className="group-hover/btn:translate-x-2 transition-transform duration-300" strokeWidth={2.5} />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <section className="relative overflow-hidden">
        <div className="gradient-primary rounded-3xl shadow-2xl overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0" style={{backgroundImage: "radial-gradient(circle, white 2px, transparent 2px)", backgroundSize: "40px 40px"}}></div>
          </div>
          <div className="relative px-8 py-14 lg:p-16">
            <div className="flex flex-col lg:flex-row items-center justify-between gap-10">
              <div className="flex-1">
                <div className="flex items-center space-x-5 mb-8">
                  <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center shadow-xl">
                    <FolderSearch size={40} className="text-white" />
                  </div>
                  <h2 className="text-4xl lg:text-5xl font-bold text-white">
                    Biblioteca Jurídica Municipal
                  </h2>
                </div>
                <p className="text-white/95 text-xl lg:text-2xl leading-relaxed mb-8 max-w-3xl">
                  Accede al repositorio de precedentes administrativos municipales. Consulta acuerdos,
                  opiniones técnicas, dictámenes y lineamientos para fortalecer tus argumentos jurídicos
                  basándote en resoluciones previas.
                </p>
                <div className="flex flex-wrap gap-4 mb-8">
                  <div className="flex items-center space-x-2 bg-white/15 backdrop-blur-md rounded-xl px-5 py-3 hover:bg-white/20 transition-all">
                    <FileText size={22} className="text-white" />
                    <span className="text-white font-semibold">Acuerdos</span>
                  </div>
                  <div className="flex items-center space-x-2 bg-white/15 backdrop-blur-md rounded-xl px-5 py-3 hover:bg-white/20 transition-all">
                    <ScrollText size={22} className="text-white" />
                    <span className="text-white font-semibold">Opiniones</span>
                  </div>
                  <div className="flex items-center space-x-2 bg-white/15 backdrop-blur-md rounded-xl px-5 py-3 hover:bg-white/20 transition-all">
                    <FileCheck size={22} className="text-white" />
                    <span className="text-white font-semibold">Dictámenes</span>
                  </div>
                  <div className="flex items-center space-x-2 bg-white/15 backdrop-blur-md rounded-xl px-5 py-3 hover:bg-white/20 transition-all">
                    <Briefcase size={22} className="text-white" />
                    <span className="text-white font-semibold">Lineamientos</span>
                  </div>
                </div>
              </div>
              <div className="flex-shrink-0">
                <button
                  onClick={() => navigate('/biblioteca-juridica')}
                  className="btn-primary bg-white hover:bg-neutral-50 text-teal-700 px-10 py-5 text-xl flex items-center space-x-4 shadow-2xl"
                >
                  <span>Explorar Biblioteca</span>
                  <ArrowRight size={26} strokeWidth={2.5} />
                </button>
                <p className="text-white/80 text-base mt-4 text-center font-medium">Búsqueda inteligente de precedentes</p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
              <div className="bg-white/15 backdrop-blur-md rounded-2xl p-8 hover:bg-white/20 transition-all duration-300">
                <div className="flex items-center space-x-4 mb-4">
                  <div className="w-12 h-12 bg-white/25 rounded-xl flex items-center justify-center">
                    <FolderSearch size={24} className="text-white" />
                  </div>
                  <h3 className="text-white font-bold text-xl">Búsqueda Avanzada</h3>
                </div>
                <p className="text-white/85 text-base leading-relaxed">Filtra por categoría, tipo de documento, fecha y palabras clave</p>
              </div>
              <div className="bg-white/15 backdrop-blur-md rounded-2xl p-8 hover:bg-white/20 transition-all duration-300">
                <div className="flex items-center space-x-4 mb-4">
                  <div className="w-12 h-12 bg-white/25 rounded-xl flex items-center justify-center">
                    <TrendingUp size={24} className="text-white" />
                  </div>
                  <h3 className="text-white font-bold text-xl">Más Relevantes</h3>
                </div>
                <p className="text-white/85 text-base leading-relaxed">Accede a los documentos más consultados y de mayor relevancia</p>
              </div>
              <div className="bg-white/15 backdrop-blur-md rounded-2xl p-8 hover:bg-white/20 transition-all duration-300">
                <div className="flex items-center space-x-4 mb-4">
                  <div className="w-12 h-12 bg-white/25 rounded-xl flex items-center justify-center">
                    <Shield size={24} className="text-white" />
                  </div>
                  <h3 className="text-white font-bold text-xl">Historial</h3>
                </div>
                <p className="text-white/85 text-base leading-relaxed">Consulta cómo se resolvieron casos similares anteriormente</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Dashboard;
