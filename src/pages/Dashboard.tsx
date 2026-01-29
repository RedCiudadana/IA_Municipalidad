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
      id: 'redactor-oficios',
      titulo: 'Redactor de Oficios',
      descripcion: 'Genera oficios formales siguiendo protocolos institucionales de SEGEPLAN',
      icono: Send,
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-50',
      iconColor: 'text-blue-600',
      categoria: 'Comunicación Externa',
      tiempo: '2-3 min',
      popular: true,
      ruta: '/agentes/oficios'
    },
    {
      id: 'generador-memos',
      titulo: 'Generador de Memos',
      descripcion: 'Crea memorandos internos con formato estandarizado para comunicación interna',
      icono: MessageSquare,
      color: 'from-emerald-500 to-emerald-600',
      bgColor: 'bg-emerald-50',
      iconColor: 'text-emerald-600',
      categoria: 'Comunicación Interna',
      tiempo: '1-2 min',
      ruta: '/agentes/memos'
    },
    {
      id: 'redactor-cartas',
      titulo: 'Redactor de Cartas',
      descripcion: 'Redacta cartas oficiales con protocolo diplomático y ceremonial apropiado',
      icono: ScrollText,
      color: 'from-purple-500 to-purple-600',
      bgColor: 'bg-purple-50',
      iconColor: 'text-purple-600',
      categoria: 'Protocolo Oficial',
      tiempo: '3-4 min',
      ruta: '/agentes/cartas'
    },
    {
      id: 'asistente-minutas',
      titulo: 'Asistente de Minutas',
      descripcion: 'Elabora minutas y actas de reuniones institucionales con formato estándar',
      icono: FileCheck,
      color: 'from-orange-500 to-orange-600',
      bgColor: 'bg-orange-50',
      iconColor: 'text-orange-600',
      categoria: 'Gestión de Reuniones',
      tiempo: '4-5 min',
      ruta: '/agentes/minutas'
    },
    {
      id: 'resumen-expedientes',
      titulo: 'Resumen de Expedientes',
      descripcion: 'Genera resúmenes ejecutivos de expedientes complejos con análisis estructurado',
      icono: FolderSearch,
      color: 'from-teal-500 to-teal-600',
      bgColor: 'bg-teal-50',
      iconColor: 'text-teal-600',
      categoria: 'Análisis Documental',
      tiempo: '5-7 min',
      popular: true,
      ruta: '/agentes/resumenes'
    },
    {
      id: 'analisis-inversion',
      titulo: 'Análisis de Inversión',
      descripcion: 'Analiza y evalúa expedientes de proyectos de inversión pública bajo normativa SNIP',
      icono: TrendingUp,
      color: 'from-red-500 to-red-600',
      bgColor: 'bg-red-50',
      iconColor: 'text-red-600',
      categoria: 'Inversión Pública',
      tiempo: '7-10 min',
      ruta: '/agentes/analisis'
    }
  ];

  const beneficios = [
    {
      icono: Clock,
      titulo: 'Ahorro de Tiempo',
      descripcion: 'Reduce el tiempo de redacción hasta en un 80%',
      color: 'text-blue-600'
    },
    {
      icono: Shield,
      titulo: 'Cumplimiento Normativo',
      descripcion: 'Garantiza el cumplimiento de protocolos institucionales',
      color: 'text-emerald-600'
    },
    {
      icono: Target,
      titulo: 'Precisión Profesional',
      descripcion: 'Documentos con formato y lenguaje institucional correcto',
      color: 'text-purple-600'
    },
    {
      icono: Sparkles,
      titulo: 'Inteligencia Artificial',
      descripcion: 'Tecnología avanzada adaptada a la administración pública',
      color: 'text-orange-600'
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
                    Bienvenido, {usuario.nombre}
                  </h1>
                  <p className="text-blue-200 text-xl font-semibold">
                    {usuario.cargo} • SEGEPLAN
                  </p>
                </div>
              </div>
              
              <p className="text-white/90 text-xl leading-relaxed mb-8 max-w-3xl">
                Optimiza tu trabajo con nuestros agentes de inteligencia artificial especializados 
                en documentos oficiales. Genera contenido profesional que cumple con todos los 
                estándares institucionales de SEGEPLAN.
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
            ¿Por qué usar AIGP-SEGEPLAN?
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Una solución integral para la modernización de la gestión documental en el sector público
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-600 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-lg">
              <Zap size={32} className="text-white" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Tecnología Avanzada</h3>
            <p className="text-gray-600 leading-relaxed">
              Inteligencia artificial especializada en documentos gubernamentales, 
              entrenada con protocolos institucionales de SEGEPLAN.
            </p>
          </div>

          <div className="text-center">
            <div className="w-20 h-20 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-lg">
              <Users size={32} className="text-white" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Colaboración Institucional</h3>
            <p className="text-gray-600 leading-relaxed">
              Proyecto conjunto entre SEGEPLAN y Red Ciudadana para fortalecer 
              la administración pública con herramientas digitales modernas.
            </p>
          </div>

          <div className="text-center">
            <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-purple-600 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-lg">
              <Award size={32} className="text-white" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Calidad Garantizada</h3>
            <p className="text-gray-600 leading-relaxed">
              Documentos que cumplen con estándares institucionales, 
              normativas vigentes y mejores prácticas de redacción oficial.
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
                Elige el tipo de documento que necesitas generar de nuestra lista de agentes especializados.
              </p>
            </div>

            <div className="relative">
              <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-6 text-white font-bold text-2xl shadow-lg">
                2
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Completa la Información</h3>
              <p className="text-gray-600">
                Llena el formulario con los datos necesarios. El sistema te guiará paso a paso.
              </p>
            </div>

            <div className="relative">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6 text-white font-bold text-2xl shadow-lg">
                3
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Genera y Descarga</h3>
              <p className="text-gray-600">
                Obtén tu documento profesional listo para usar, editar o compartir según necesites.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Agents Section - Enhanced */}
      <section>
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Selecciona tu Agente Especializado
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Cada agente está diseñado para un tipo específico de documento institucional, 
            garantizando resultados profesionales y conformes a la normativa.
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