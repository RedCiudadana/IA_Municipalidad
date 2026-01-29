import React, { useState } from 'react';
import { HelpCircle, Facebook, Twitter, Instagram, Youtube, Phone } from 'lucide-react';
import ModalAyuda from '../components/ui/ModalAyuda';
import LogoRedCiudadana from '../assets/redciudadana-logo.png';

interface HeaderProps {
  usuario: { nombre: string; cargo: string };
  onCerrarSesion: () => void;
}

const Header: React.FC<HeaderProps> = () => {
  const [mostrarAyuda, setMostrarAyuda] = useState(false);

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
                  href="https://www.facebook.com/MuniGuate"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-1 rounded hover:bg-slate-600 transition-colors"
                  title="Facebook Municipalidad de Guatemala"
                >
                  <Facebook size={16} />
                </a>
                <a
                  href="https://twitter.com/MuniGuate"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-1 rounded hover:bg-slate-600 transition-colors"
                  title="Twitter Municipalidad de Guatemala"
                >
                  <Twitter size={16} />
                </a>
                <a
                  href="https://www.instagram.com/muniguate"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-1 rounded hover:bg-slate-600 transition-colors"
                  title="Instagram Municipalidad de Guatemala"
                >
                  <Instagram size={16} />
                </a>
                <a
                  href="https://www.youtube.com/@MuniGuate"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-1 rounded hover:bg-slate-600 transition-colors"
                  title="YouTube Municipalidad de Guatemala"
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
              {/* Logos Municipalidad de Guatemala y Red Ciudadana */}
              <div className="flex items-center space-x-8">
                <div className="flex items-center space-x-3">
                  <div className="text-white">
                    <h1 className="text-xl font-bold">Municipalidad de Guatemala</h1>
                    <p className="text-sm text-slate-300">Departamento Jurídico</p>
                  </div>
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

              {/* Área derecha */}
              <div className="flex items-center space-x-4">
                {/* Ayuda */}
                <button
                  onClick={() => setMostrarAyuda(true)}
                  className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 transition-all duration-200 text-white"
                  title="Ayuda"
                >
                  <HelpCircle size={20} />
                  <span className="hidden md:inline text-sm font-medium">Ayuda</span>
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