import React from 'react';
import { Facebook, Twitter, Instagram, Linkedin, Youtube, Mail, MapPin, Clock } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white mt-auto">
      <div className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {/* Columna 1: Red Ciudadana */}
          <div className="space-y-6">
            <div className="flex items-center space-x-3">
              <img
                src="https://datos.segeplan.gob.gt/img/redciudadana-logo.png"
                alt="Red Ciudadana"
                className="h-10 w-auto object-contain filter brightness-0 invert"
              />
              <span className="font-bold text-xl">Red Ciudadana</span>
            </div>

            <p className="text-gray-300 text-sm leading-relaxed">
              En Red Ciudadana trabajamos para fortalecer la transparencia, promover la participación
              ciudadana y construir un futuro más justo e inclusivo para todos los guatemaltecos.
            </p>

            <div className="flex items-center space-x-4">
              <a
                href="https://www.facebook.com/RedCiudadanaGT"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
                aria-label="Facebook"
              >
                <Facebook size={18} />
              </a>
              <a
                href="https://twitter.com/RedCiudadanaGT"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
                aria-label="Twitter"
              >
                <Twitter size={18} />
              </a>
              <a
                href="https://www.instagram.com/redciudadanagt"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
                aria-label="Instagram"
              >
                <Instagram size={18} />
              </a>
              <a
                href="https://www.linkedin.com/company/red-ciudadana"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
                aria-label="LinkedIn"
              >
                <Linkedin size={18} />
              </a>
              <a
                href="https://www.youtube.com/@RedCiudadanaGT"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
                aria-label="YouTube"
              >
                <Youtube size={18} />
              </a>
            </div>
          </div>

          {/* Columna 2: Enlaces Rápidos */}
          <div className="space-y-6">
            <h3 className="text-xl font-bold text-white mb-4">Enlaces Rápidos</h3>

            <nav className="space-y-3">
              <a
                href="https://redciudadana.org"
                target="_blank"
                rel="noopener noreferrer"
                className="block text-gray-300 hover:text-white transition-colors text-sm"
              >
                Inicio
              </a>
              <a
                href="https://redciudadana.org/metodologia"
                target="_blank"
                rel="noopener noreferrer"
                className="block text-gray-300 hover:text-white transition-colors text-sm"
              >
                Metodología
              </a>
              <a
                href="https://redciudadana.org/desafios"
                target="_blank"
                rel="noopener noreferrer"
                className="block text-gray-300 hover:text-white transition-colors text-sm"
              >
                Desafíos
              </a>
              <a
                href="https://redciudadana.org/curso-ia"
                target="_blank"
                rel="noopener noreferrer"
                className="block text-gray-300 hover:text-white transition-colors text-sm"
              >
                Curso de IA
              </a>
              <a
                href="https://docs.aigp-segeplan.gt"
                target="_blank"
                rel="noopener noreferrer"
                className="block text-gray-300 hover:text-white transition-colors text-sm"
              >
                Documentación
              </a>
            </nav>

            <div className="pt-4 border-t border-white/10">
              <p className="text-xs text-gray-400">
                Un proyecto de <span className="font-semibold text-white">Municipalidad de Guatemala</span> y{' '}
                <span className="font-semibold text-white">Red Ciudadana</span>
              </p>
            </div>
          </div>

          {/* Columna 3: Contacto */}
          <div className="space-y-6">
            <h3 className="text-xl font-bold text-white mb-4">Contacto</h3>

            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <MapPin size={18} className="text-blue-400 mt-1 flex-shrink-0" />
                <div>
                  <p className="text-sm font-semibold text-white mb-1">Dirección</p>
                  <p className="text-sm text-gray-300">
                    21 calle 6-77, Zona 1, Ciudad de Guatemala
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <Mail size={18} className="text-blue-400 mt-1 flex-shrink-0" />
                <div>
                  <p className="text-sm font-semibold text-white mb-1">Correo Electrónico</p>
                  <a
                    href="mailto:juridico@muniguate.gob.gt"
                    className="text-sm text-gray-300 hover:text-white transition-colors"
                  >
                    juridico@muniguate.gob.gt
                  </a>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <Clock size={18} className="text-blue-400 mt-1 flex-shrink-0" />
                <div>
                  <p className="text-sm font-semibold text-white mb-1">Horario de Atención</p>
                  <p className="text-sm text-gray-300">
                    Lunes a Viernes, 8:00am - 5:00pm
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-white/10">
          <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
            <div className="flex items-center space-x-6">
              <div className="text-white font-bold text-lg">
                Municipalidad de Guatemala
              </div>
              <span className="text-gray-400 text-xl">×</span>
              <img
                src="https://datos.segeplan.gob.gt/img/redciudadana-logo.png"
                alt="Red Ciudadana"
                className="h-6 w-auto object-contain filter brightness-0 invert"
              />
            </div>

            <p className="text-sm text-gray-400">
              © 2025 IA Jurídico Municipal. Departamento Jurídico • Municipalidad de Guatemala
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
