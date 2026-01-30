import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { Home, FileText, File as FileEdit, Mail, ClipboardList, BookOpen, FolderOpen, FileQuestion, ChevronDown, Menu, X, GraduationCap } from 'lucide-react';

const TopNavigation: React.FC = () => {
  const [menuMovilAbierto, setMenuMovilAbierto] = useState(false);
  const [submenuAbierto, setSubmenuAbierto] = useState(false);
  const location = useLocation();

  const secciones = [
    { id: 'inicio', titulo: 'Inicio', icono: Home, ruta: '/' },
    { id: 'tutoriales', titulo: 'Tutoriales', icono: GraduationCap, ruta: '/tutoriales' },
    { id: 'documentacion', titulo: 'Documentación', icono: FileQuestion, ruta: '/documentacion' }
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
    <nav className="bg-white shadow-md border-b border-neutral-200 sticky top-[112px] z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="hidden md:flex items-center space-x-6">
            {secciones.map((seccion) => {
              const IconoComponente = seccion.icono;

              return (
                <NavLink
                  key={seccion.id}
                  to={seccion.ruta}
                  className={({ isActive }) => `
                    flex items-center space-x-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200
                    ${isActive
                      ? 'bg-gradient-to-r from-teal-600 to-teal-700 text-white shadow-lg'
                      : 'text-neutral-700 hover:bg-neutral-100 hover:text-neutral-900'
                    }
                  `}
                >
                  <IconoComponente size={20} />
                  <span>{seccion.titulo}</span>
                </NavLink>
              );
            })}

            <div className="relative">
              <button
                onClick={() => setSubmenuAbierto(!submenuAbierto)}
                className={`flex items-center space-x-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${
                  esRutaAgente
                    ? 'bg-gradient-to-r from-teal-600 to-teal-700 text-white shadow-lg'
                    : 'text-neutral-700 hover:bg-neutral-100 hover:text-neutral-900'
                }`}
              >
                <FileText size={20} />
                <span>Agentes</span>
                <ChevronDown size={18} className={`transform transition-transform ${submenuAbierto ? 'rotate-180' : ''}`} />
              </button>

              {submenuAbierto && (
                <div className="absolute top-full left-0 mt-3 w-64 bg-white rounded-2xl shadow-2xl border border-neutral-200 py-2 z-50">
                  {agentes.map((agente) => {
                    const IconoComponente = agente.icono;
                    const esActivo = location.pathname === agente.ruta;

                    return (
                      <NavLink
                        key={agente.id}
                        to={agente.ruta}
                        onClick={manejarClick}
                        className={`
                          w-full flex items-center space-x-3 px-5 py-3 text-left font-semibold transition-all duration-200
                          ${esActivo
                            ? 'bg-teal-50 text-teal-700 border-r-4 border-teal-600'
                            : 'text-neutral-700 hover:bg-neutral-50'
                          }
                        `}
                      >
                        <IconoComponente size={20} />
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
              className="p-3 rounded-xl text-neutral-700 hover:bg-neutral-100 transition-all"
            >
              {menuMovilAbierto ? <X size={26} /> : <Menu size={26} />}
            </button>
          </div>
        </div>

        {menuMovilAbierto && (
          <div className="md:hidden border-t border-neutral-200 py-4">
            <div className="space-y-2">
              {secciones.map((seccion) => {
                const IconoComponente = seccion.icono;

                return (
                  <NavLink
                    key={seccion.id}
                    to={seccion.ruta}
                    onClick={manejarClick}
                    className={({ isActive }) => `
                      w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-left font-semibold transition-all duration-200
                      ${isActive
                        ? 'bg-gradient-to-r from-teal-600 to-teal-700 text-white'
                        : 'text-neutral-700 hover:bg-neutral-100'
                      }
                    `}
                  >
                    <IconoComponente size={22} />
                    <span>{seccion.titulo}</span>
                  </NavLink>
                );
              })}

              <div className="pt-2 border-t border-neutral-200 mt-4">
                <p className="px-4 py-2 text-sm font-bold text-neutral-500 uppercase tracking-wide">
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
                        w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-left font-semibold transition-all duration-200
                        ${isActive
                          ? 'bg-gradient-to-r from-teal-600 to-teal-700 text-white'
                          : 'text-neutral-700 hover:bg-neutral-100'
                        }
                      `}
                    >
                      <IconoComponente size={22} />
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
