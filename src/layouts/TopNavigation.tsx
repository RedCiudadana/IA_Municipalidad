import React, { useState } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { Home, FileText, FileQuestion, Menu, X, GraduationCap } from 'lucide-react';

const TopNavigation: React.FC = () => {
  const [menuMovilAbierto, setMenuMovilAbierto] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const secciones = [
    { id: 'inicio', titulo: 'Inicio', icono: Home, ruta: '/' },
    { id: 'tutoriales', titulo: 'Tutoriales', icono: GraduationCap, ruta: '/tutoriales' },
    { id: 'documentacion', titulo: 'Documentación', icono: FileQuestion, ruta: '/documentacion' }
  ];

  const manejarClick = () => {
    setMenuMovilAbierto(false);
  };

  const manejarClickAgentes = () => {
    setMenuMovilAbierto(false);

    if (location.pathname === '/') {
      const elemento = document.getElementById('agentes');
      if (elemento) {
        elemento.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    } else {
      navigate('/');
      setTimeout(() => {
        const elemento = document.getElementById('agentes');
        if (elemento) {
          elemento.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 100);
    }
  };

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

            <button
              onClick={manejarClickAgentes}
              className="flex items-center space-x-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 text-neutral-700 hover:bg-neutral-100 hover:text-neutral-900"
            >
              <FileText size={20} />
              <span>Agentes</span>
            </button>
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

              <button
                onClick={manejarClickAgentes}
                className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-left font-semibold transition-all duration-200 text-neutral-700 hover:bg-neutral-100"
              >
                <FileText size={22} />
                <span>Agentes</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default TopNavigation;
