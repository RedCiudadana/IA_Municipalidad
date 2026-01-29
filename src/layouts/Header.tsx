import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { HelpCircle, User, Sparkles, Bell, Settings, Facebook, Twitter, Instagram, Youtube, Mail, Phone, LogOut } from 'lucide-react';
import ModalAyuda from '../components/ui/ModalAyuda';
import LogoSegeplan from '../assets/logo-segeplan.png';
import LogoRedCiudadana from '../assets/redciudadana-logo.png';

interface HeaderProps {
  usuario: { nombre: string; cargo: string };
  onCerrarSesion: () => void;
}

const Header: React.FC<HeaderProps> = ({ usuario, onCerrarSesion }) => {
  const [mostrarAyuda, setMostrarAyuda] = useState(false);
  const [menuUsuarioAbierto, setMenuUsuarioAbierto] = useState(false);
  const navigate = useNavigate();

  return (
    <React.Fragment>
      {/* Top Bar with Social Media and Contact */}
      <div className="bg-slate-700 text-white py-2">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-2">
                <Phone size={14} />
              </div>
            {/* Espacio flexible */}
            <div className="flex-1"></div>
            </div>
            
            <div className="flex items-center space-x-4">
              <span className="text-slate-300">Síguenos:</span>
              <div className="flex items-center space-x-3">
                <a
                  href="https://www.facebook.com/segeplan"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-1 rounded hover:bg-slate-600 transition-colors"
                  title="Facebook SEGEPLAN"
                >
                  <Facebook size={16} />
                </a>
                <a
                  href="https://twitter.com/segeplan"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-1 rounded hover:bg-slate-600 transition-colors"
                  title="Twitter SEGEPLAN"
                >
                  <Twitter size={16} />
                </a>
                <a
                  href="https://www.instagram.com/segeplan"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-1 rounded hover:bg-slate-600 transition-colors"
                  title="Instagram SEGEPLAN"
                >
                  <Instagram size={16} />
                </a>
                <a
                  href="https://www.youtube.com/segeplan"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-1 rounded hover:bg-slate-600 transition-colors"
                  title="YouTube SEGEPLAN"
                >
                  <Youtube size={16} />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
      <header className="bg-gradient-to-r from-slate-800 to-slate-900 text-white shadow-2xl sticky top-0 z-50 backdrop-blur-sm">
        <>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-24">
              {/* Logos SEGEPLAN y Red Ciudadana */}
              <div className="flex items-center space-x-8">
                <div className="flex items-center space-x-3">
                  <img
                    src={LogoSegeplan}
                    alt="SEGEPLAN"
                    className="h-16 w-auto object-contain"
                  />
                </div>
                
                <div className="h-12 w-px bg-slate-600"></div>
                
                <div className="flex items-center space-x-3">
                  <img
                    src={LogoRedCiudadana}
                    alt="Red Ciudadana"
                    className="h-12 w-auto object-contain"
                  />
                </div>
              </div>

              {/* Espacio flexible */}
              <div className="flex-1"></div>

              {/* Área derecha con usuario y Red Ciudadana */}
              <div className="flex items-center space-x-4">
                {/* Ayuda */}
                <button
                  onClick={() => setMostrarAyuda(true)}
                  className="p-3 rounded-xl hover:bg-white/10 transition-all duration-200 text-white"
                  title="Ayuda"
                >
                  <HelpCircle size={22} />
                </button>

                {/* Usuario */}
                <div className="relative">
                  <button
                    onClick={() => setMenuUsuarioAbierto(!menuUsuarioAbierto)}
                    className="flex items-center space-x-3 p-2 rounded-xl hover:bg-white/10 transition-all duration-200"
                  >
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl flex items-center justify-center">
                      <User size={20} className="text-white" />
                    </div>
                    <div className="hidden md:block text-left">
                      <p className="text-white font-semibold">{usuario.nombre}</p>
                      <p className="text-slate-300 text-sm">{usuario.cargo}</p>
                    </div>
                  </button>

                  {menuUsuarioAbierto && (
                    <div className="absolute right-0 top-full mt-2 w-64 bg-white rounded-xl shadow-2xl border border-gray-200 py-2 z-50">
                      <div className="px-4 py-3 border-b border-gray-200">
                        <p className="font-semibold text-gray-800">{usuario.nombre}</p>
                        <p className="text-gray-600 text-sm">{usuario.cargo}</p>
                      </div>
                      <button
                        onClick={() => {
                          setMenuUsuarioAbierto(false);
                          navigate('/perfil');
                        }}
                        className="w-full flex items-center space-x-3 px-4 py-3 text-left text-gray-700 hover:bg-gray-50 transition-colors"
                      >
                        <User size={18} />
                        <span>Mi Perfil</span>
                      </button>
                      <button
                        onClick={() => {
                          setMenuUsuarioAbierto(false);
                          navigate('/perfil');
                        }}
                        className="w-full flex items-center space-x-3 px-4 py-3 text-left text-gray-700 hover:bg-gray-50 transition-colors"
                      >
                        <Settings size={18} />
                        <span>Configuración</span>
                      </button>
                      <div className="border-t border-gray-200 mt-2 pt-2">
                        <button
                          onClick={() => {
                            setMenuUsuarioAbierto(false);
                            if (window.confirm('¿Estás seguro de que deseas cerrar sesión?')) {
                              onCerrarSesion();
                            }
                          }}
                          className="w-full flex items-center space-x-3 px-4 py-3 text-left text-red-600 hover:bg-red-50 transition-colors"
                        >
                          <LogOut size={18} />
                          <span>Cerrar Sesión</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </>
      </header>

      {mostrarAyuda && (
        <ModalAyuda onCerrar={() => setMostrarAyuda(false)} />
      )}
    </React.Fragment>
  );
};

export default Header;