import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FileText,
  FileEdit,
  Mail,
  ClipboardList,
  BookOpen,
  FolderOpen,
  Zap,
  Users,
  Award,
  ArrowRight,
  Sparkles,
  Clock,
  Shield,
  Target,
  Send,
  MessageSquare,
  ScrollText,
  FileCheck,
  FolderSearch,
  TrendingUp
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
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-50',
      iconColor: 'text-blue-600',
      categoria: 'Asesoría Jurídica',
      tiempo: '2-3 min',
      popular: true,
      ruta: '/agentes/oficios'
    },
    {
      id: 'dictamenes-juridicos',
      titulo: 'Dictámenes Jurídicos',
      descripcion: 'Elabora dictámenes con análisis de precedentes y fundamentación legal completa',
      icono: FileEdit,
      color: 'from-emerald-500 to-emerald-600',
      bgColor: 'bg-emerald-50',
      iconColor: 'text-emerald-600',
      categoria: 'Asesoría Jurídica',
      tiempo: '5-7 min',
      popular: true,
      ruta: '/agentes/memos'
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
      ruta: '/agentes/cartas'
    },
    {
      id: 'elaboracion-pliegos',
      titulo: 'Elaboración de Pliegos',
      descripcion: 'Genera pliegos de contratación conforme a Ley de Contrataciones del Estado',
      icono: ScrollText,
      color: 'from-red-500 to-red-600',
      bgColor: 'bg-red-50',
      iconColor: 'text-red-600',
      categoria: 'Contrataciones',
      tiempo: '6-8 min',
      ruta: '/agentes/minutas'
    },
    {
      id: 'calculo-plazos',
      titulo: 'Cálculo de Plazos Legales',
      descripcion: 'Calcula automáticamente plazos procesales y términos legales en procedimientos',
      icono: Clock,
      color: 'from-teal-500 to-teal-600',
      bgColor: 'bg-teal-50',
      iconColor: 'text-teal-600',
      categoria: 'Procedimientos Administrativos',
      tiempo: '1-2 min',
      ruta: '/agentes/resumenes'
    },
    {
      id: 'redaccion-notificaciones',
      titulo: 'Redacción de Notificaciones',
      descripcion: 'Redacta notificaciones jurídicas conforme a requisitos legales de notificación',
      icono: Send,
      color: 'from-indigo-500 to-indigo-600',
      bgColor: 'bg-indigo-50',
      iconColor: 'text-indigo-600',
      categoria: 'Procedimientos Administrativos',
      tiempo: '3-4 min',
      ruta: '/agentes/analisis'
    }
  ];

  const beneficios = [
    {
      icono: Clock,
      titulo: 'Eficiencia Operativa',
      descripcion: 'Reduce tiempo de análisis jurídico entre 40-60%',
      color: 'text-blue-600'
    },
    {
      icono: Shield,
      titulo: 'Seguridad Jurídica',
      descripcion: 'Garantiza cumplimiento de normativa municipal y constitucional',
      color: 'text-emerald-600'
    },
    {
      icono: Target,
      titulo: 'Precisión Legal',
      descripcion: 'Análisis consistente con fundamentación jurídica correcta',
      color: 'text-orange-600'
    },
    {
      icono: Sparkles,
      titulo: 'IA Especializada',
      descripcion: 'Agentes entrenados en derecho municipal guatemalteco',
      color: 'text-indigo-600'
    }
  ];

  return (
    <div className="space-y-12">
      {/* Welcome Section - Redesigned */}
      <section className="relative">
        <div className="bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 rounded-3xl overflow-hidden shadow-2xl">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0" style={{backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)", backgroundSize: "40px 40px"}}></div>
          </div>
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20"></div>
          <div className="relative p-12">
            <div className="max-w-4xl">
              <div className="flex items-center space-x-6 mb-8">
                <div className="w-20 h-20 bg-gradient-to-br from-yellow-400 to-orange-500 backdrop-blur-sm rounded-3xl flex items-center justify-center shadow-2xl animate-pulse">
                  <Sparkles size={40} className="text-white" />
                </div>
                <div>
                  <h1 className="text-5xl font-bold text-white mb-3">
                    Bienvenido al Sistema de IA Jurídico Municipal
                  </h1>
                  <p className="text-blue-200 text-xl font-semibold">
                    Municipalidad de Guatemala • Departamento Jurídico
                  </p>
                </div>
              </div>
              
              <p className="text-white/90 text-xl leading-relaxed mb-8 max-w-3xl">
                Sistema de Asistencia Jurídica Municipal potenciado por IA. Agiliza análisis legales,
                dictámenes, contratos y procedimientos administrativos con herramientas especializadas
                en derecho municipal guatemalteco.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {beneficios.map((beneficio, index) => {
                  const IconoComponente = beneficio.icono;
                  return (
                    <div key={index} className="flex items-start space-x-4 bg-white/10 backdrop-blur-sm rounded-2xl p-6">
                      <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center flex-shrink-0">
                        <IconoComponente size={24} className="text-white" />
                      </div>
                      <div>
                        <h3 className="text-white font-bold text-lg mb-2">{beneficio.titulo}</h3>
                        <p className="text-white/80">{beneficio.descripcion}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </section>


      {/* Features Section - New */}
      <section className="bg-gradient-to-br from-gray-50 to-white rounded-3xl p-12 border border-gray-100">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            ¿Por qué usar IA Jurídico Municipal?
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Herramienta especializada para fortalecer la capacidad jurídica del gobierno municipal
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-600 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-lg">
              <Zap size={32} className="text-white" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Tecnología Especializada</h3>
            <p className="text-gray-600 leading-relaxed">
              Agentes de IA especializados en derecho municipal guatemalteco,
              con conocimiento del Código Municipal y normativa aplicable.
            </p>
          </div>

          <div className="text-center">
            <div className="w-20 h-20 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-lg">
              <Users size={32} className="text-white" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Apoyo Profesional</h3>
            <p className="text-gray-600 leading-relaxed">
              Complementa el criterio profesional del abogado municipal
              con análisis automatizado y búsqueda inteligente de normativa.
            </p>
          </div>

          <div className="text-center">
            <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-purple-600 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-lg">
              <Award size={32} className="text-white" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Seguridad Jurídica</h3>
            <p className="text-gray-600 leading-relaxed">
              Documentos legales fundamentados en normativa vigente,
              con análisis de precedentes y cumplimiento constitucional.
            </p>
          </div>
        </div>
      </section>

      {/* Getting Started Section - New */}
      <section className="bg-white rounded-3xl shadow-lg p-12 border border-gray-100">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-6">
            Comienza en 3 Pasos Simples
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
            <div className="relative">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6 text-white font-bold text-2xl shadow-lg">
                1
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Selecciona un Agente</h3>
              <p className="text-gray-600">
                Elige el agente jurídico especializado según tu necesidad: dictámenes, contratos, normativa.
              </p>
            </div>

            <div className="relative">
              <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-6 text-white font-bold text-2xl shadow-lg">
                2
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Proporciona los Datos</h3>
              <p className="text-gray-600">
                Ingresa la información del caso, normativa relevante o documentos a analizar.
              </p>
            </div>

            <div className="relative">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6 text-white font-bold text-2xl shadow-lg">
                3
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Obtén el Resultado</h3>
              <p className="text-gray-600">
                Recibe análisis jurídico fundamentado, listo para revisión y aplicación profesional.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Agents Section - Enhanced */}
      <section>
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Agentes Jurídicos Especializados
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Cada agente está especializado en áreas específicas del derecho municipal,
            garantizando análisis fundamentado en normativa guatemalteca vigente.
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8 mb-12">
          {agentes.map((agente) => {
            const IconoComponente = agente.icono;
            
            return (
              <div
                key={agente.id}
                className="group bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 border-2 border-gray-100 hover:border-gray-200 transform hover:-translate-y-2 overflow-hidden cursor-pointer relative"
              >
                {agente.popular && (
                  <div className="absolute top-4 right-4 z-10">
                    <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-3 py-1.5 rounded-full text-xs font-bold shadow-lg flex items-center space-x-1">
                      <Sparkles size={12} />
                      <span>Popular</span>
                    </div>
                  </div>
                )}
                {/* Header with gradient */}
                <div className={`h-2 bg-gradient-to-r ${agente.color}`}></div>

                <div className="p-8">
                  {/* Icon and Category */}
                  <div className="flex items-start justify-between mb-6">
                    <div className="relative">
                      <div className={`w-20 h-20 ${agente.bgColor} rounded-3xl flex items-center justify-center shadow-md group-hover:shadow-xl transition-all duration-300 group-hover:scale-110`}>
                        <IconoComponente size={36} className={agente.iconColor} strokeWidth={2} />
                      </div>
                      <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center shadow-lg">
                        <Sparkles size={16} className="text-white" />
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="inline-block bg-gray-100 text-gray-700 text-xs font-semibold px-3 py-1.5 rounded-full mb-2">
                        {agente.categoria}
                      </span>
                      <div className="flex items-center justify-end text-gray-500 text-sm font-medium">
                        <Clock size={14} className="mr-1.5" />
                        {agente.tiempo}
                      </div>
                    </div>
                  </div>
                  
                  {/* Title and Description */}
                  <h3 className="text-2xl font-bold text-gray-900 mb-4 leading-tight">
                    {agente.titulo}
                  </h3>
                  
                  <p className="text-gray-600 mb-8 leading-relaxed text-base">
                    {agente.descripcion}
                  </p>
                  
                  {/* Action Button */}
                  <button
                    onClick={() => navigate(agente.ruta)}
                    className={`w-full bg-gradient-to-r ${agente.color} hover:shadow-2xl text-white px-6 py-4 rounded-2xl transition-all duration-300 font-bold text-lg shadow-xl transform group-hover:scale-105 flex items-center justify-center space-x-3 relative overflow-hidden group/button`}
                  >
                    <div className="absolute inset-0 bg-white/20 translate-y-full group-hover/button:translate-y-0 transition-transform duration-300"></div>
                    <span className="relative">Comenzar Ahora</span>
                    <ArrowRight size={22} className="relative group-hover:translate-x-2 transition-transform duration-300" strokeWidth={3} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
};

export default Dashboard;