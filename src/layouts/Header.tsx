import React, { useState } from 'react';
import { HelpCircle, Facebook, Twitter, Instagram, Youtube, Phone, LogOut } from 'lucide-react';
import ModalAyuda from '../components/ui/ModalAyuda';
import LogoRedCiudadana from '../assets/redciudadana-logo.png';

interface HeaderProps {
  usuario: { nombre: string; cargo: string };
  onCerrarSesion: () => void;
}

const Header: React.FC<HeaderProps> = ({ onCerrarSesion }) => {
  const [mostrarAyuda, setMostrarAyuda] = useState(false);

  return (
    <React.Fragment>
      {/* Top Bar with Social Media and Contact */}
      <div className="bg-neutral-800 text-white py-3">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-2">
                <Phone size={16} />
              </div>
            {/* Espacio flexible */}
            <div className="flex-1"></div>
            </div>

            <div className="flex items-center space-x-4">
              <span className="text-neutral-300 font-medium">Síguenos:</span>
              <div className="flex items-center space-x-3">
                <a
                  href="https://www.facebook.com/MuniGuate"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-lg hover:bg-neutral-700 transition-all"
                  title="Facebook Municipalidad de Guatemala"
                >
                  <Facebook size={16} />
                </a>
                <a
                  href="https://twitter.com/MuniGuate"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-lg hover:bg-neutral-700 transition-all"
                  title="Twitter Municipalidad de Guatemala"
                >
                  <Twitter size={16} />
                </a>
                <a
                  href="https://www.instagram.com/muniguate"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-lg hover:bg-neutral-700 transition-all"
                  title="Instagram Municipalidad de Guatemala"
                >
                  <Instagram size={16} />
                </a>
                <a
                  href="https://www.youtube.com/@MuniGuate"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-lg hover:bg-neutral-700 transition-all"
                  title="YouTube Municipalidad de Guatemala"
                >
                  <Youtube size={16} />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
      <header className="gradient-neutral text-white shadow-2xl sticky top-0 z-50 backdrop-blur-sm">
        <>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-28">
              {/* Logos Municipalidad de Guatemala y Red Ciudadana */}
              <div className="flex items-center space-x-8">
                <div className="flex items-center space-x-3">
                  <div className="text-white">
                    <h1 className="text-2xl font-bold tracking-tight">Municipalidad de Guatemala</h1>
                    <p className="text-base text-teal-200 font-medium">Departamento Jurídico</p>
                  </div>
                </div>

                <div className="h-14 w-px bg-neutral-600"></div>

                <div className="flex items-center space-x-3">
                  <img
                    src={LogoRedCiudadana}
                    alt="Red Ciudadana"
                    className="h-14 w-auto object-contain"
                  />
                </div>
              </div>

              {/* Espacio flexible */}
              <div className="flex-1"></div>

              {/* Área derecha */}
              <div className="flex items-center space-x-4">
                {/* Ayuda */}
                <button
                  onClick={() => setMostrarAyuda(true)}
                  className="flex items-center space-x-2 px-6 py-3 rounded-xl bg-white/15 hover:bg-white/25 transition-all duration-200 text-white font-semibold shadow-lg"
                  title="Ayuda"
                >
                  <HelpCircle size={22} />
                  <span className="hidden md:inline">Ayuda</span>
                </button>

                {/* Cerrar Sesión */}
                <button
                  onClick={onCerrarSesion}
                  className="flex items-center space-x-2 px-6 py-3 rounded-xl bg-orange-500/20 hover:bg-orange-500/30 border border-orange-400/30 transition-all duration-200 text-white font-semibold shadow-lg"
                  title="Cerrar Sesión"
                >
                  <LogOut size={22} />
                  <span className="hidden md:inline">Salir</span>
                </button>
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