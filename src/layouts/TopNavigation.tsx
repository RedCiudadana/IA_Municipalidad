import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { Home, FileText, File as FileEdit, Mail, ClipboardList, BookOpen, FolderOpen, History, BarChart3, ChevronDown, Menu, X, User } from 'lucide-react';

const TopNavigation: React.FC = () => {
  const [menuMovilAbierto, setMenuMovilAbierto] = useState(false);
  const [submenuAbierto, setSubmenuAbierto] = useState(false);
  const location = useLocation();

  const secciones = [
    { id: 'inicio', titulo: 'Inicio', icono: Home, ruta: '/' },
    { id: 'perfil', titulo: 'Mi Perfil', icono: User, ruta: '/perfil' },
    { id: 'tutoriales', titulo: 'Tutoriales', icono: BookOpen, ruta: '/tutoriales' },
    { id: 'historial', titulo: 'Historial', icono: History, ruta: '/historial' },
    { id: 'estadisticas', titulo: 'Estadísticas', icono: BarChart3, ruta: '/estadisticas' }
  ];

  const agentes = [
    { id: 'redactor-oficios', titulo: 'Oficios', icono: FileText, ruta: '/agentes/oficios' },
    { id: 'generador-memos', titulo: 'Memos', icono: FileEdit, ruta: '/agentes/memos' },
    { id: 'redactor-cartas', titulo: 'Cartas', icono: Mail, ruta: '/agentes/cartas' },
    { id: 'asistente-minutas', titulo: 'Minutas', icono: ClipboardList, ruta: '/agentes/minutas' },
    { id: 'resumen-expedientes', titulo: 'Resúmenes', icono: BookOpen, ruta: '/agentes/resumenes' },
    { id: 'analisis-inversion', titulo: 'Análisis', icono: FolderOpen, ruta: '/agentes/analisis' }
  ];

  const manejarClick = () => {
    setMenuMovilAbierto(false);
    setSubmenuAbierto(false);
  };

  const esRutaAgente = location.pathname.startsWith('/agentes');

  return (
    <nav className="bg-white shadow-lg border-b border-gray-200 sticky top-[96px] z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="hidden md:flex items-center space-x-8">
            {secciones.map((seccion) => {
              const IconoComponente = seccion.icono;

              return (
                <NavLink
                  key={seccion.id}
                  to={seccion.ruta}
                  className={({ isActive }) => `
                    flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200
                    ${isActive
                      ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                      : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                    }
                  `}
                >
                  <IconoComponente size={18} />
                  <span>{seccion.titulo}</span>
                </NavLink>
              );
            })}

            <div className="relative">
              <button
                onClick={() => setSubmenuAbierto(!submenuAbierto)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  esRutaAgente
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                    : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                }`}
              >
                <FileText size={18} />
                <span>Agentes</span>
                <ChevronDown size={16} className={`transform transition-transform ${submenuAbierto ? 'rotate-180' : ''}`} />
              </button>

              {submenuAbierto && (
                <div className="absolute top-full left-0 mt-2 w-64 bg-white rounded-xl shadow-2xl border border-gray-200 py-2 z-50">
                  {agentes.map((agente) => {
                    const IconoComponente = agente.icono;
                    const esActivo = location.pathname === agente.ruta;

                    return (
                      <NavLink
                        key={agente.id}
                        to={agente.ruta}
                        onClick={manejarClick}
                        className={`
                          w-full flex items-center space-x-3 px-4 py-3 text-left text-sm transition-all duration-200
                          ${esActivo
                            ? 'bg-gradient-to-r from-blue-50 to-purple-50 text-blue-700 border-r-4 border-blue-600'
                            : 'text-gray-700 hover:bg-gray-50'
                          }
                        `}
                      >
                        <IconoComponente size={18} />
                        <span>{agente.titulo}</span>
                      </NavLink>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          <div className="md:hidden flex items-center">
            <button
              onClick={() => setMenuMovilAbierto(!menuMovilAbierto)}
              className="p-2 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
            >
              {menuMovilAbierto ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {menuMovilAbierto && (
          <div className="md:hidden border-t border-gray-200 py-4">
            <div className="space-y-2">
              {secciones.map((seccion) => {
                const IconoComponente = seccion.icono;

                return (
                  <NavLink
                    key={seccion.id}
                    to={seccion.ruta}
                    onClick={manejarClick}
                    className={({ isActive }) => `
                      w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-all duration-200
                      ${isActive
                        ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white'
                        : 'text-gray-700 hover:bg-gray-100'
                      }
                    `}
                  >
                    <IconoComponente size={20} />
                    <span>{seccion.titulo}</span>
                  </NavLink>
                );
              })}

              <div className="pt-2 border-t border-gray-200 mt-4">
                <p className="px-4 py-2 text-sm font-medium text-gray-500 uppercase tracking-wide">
                  Agentes
                </p>
                {agentes.map((agente) => {
                  const IconoComponente = agente.icono;

                  return (
                    <NavLink
                      key={agente.id}
                      to={agente.ruta}
                      onClick={manejarClick}
                      className={({ isActive }) => `
                        w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-all duration-200
                        ${isActive
                          ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white'
                          : 'text-gray-700 hover:bg-gray-100'
                        }
                      `}
                    >
                      <IconoComponente size={20} />
                      <span>{agente.titulo}</span>
                    </NavLink>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default TopNavigation;
