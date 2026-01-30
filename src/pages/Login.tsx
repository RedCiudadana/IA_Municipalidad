import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Lock, Eye, EyeOff, LogIn, Sparkles, Shield, Scale, AlertCircle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import LogoRedCiudadana from '../assets/redciudadana-logo.png';

const Login: React.FC = () => {
  const { signIn, user, loading } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [mostrarPassword, setMostrarPassword] = useState(false);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!loading && user) {
      navigate('/');
    }
  }, [user, loading, navigate]);

  const manejarCambio = (campo: string, valor: string) => {
    setFormData(prev => ({
      ...prev,
      [campo]: valor
    }));
    if (error) setError('');
  };

  const manejarLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setCargando(true);
    setError('');

    const { error } = await signIn(formData.username, formData.password);

    if (error) {
      setError(error.message || 'Error al iniciar sesión');
      setCargando(false);
    } else {
      navigate('/');
    }
  };

  const llenarCredencialesDemo = () => {
    setFormData({
      username: 'redciudadana',
      password: 'redciudadana'
    });
    setError('');
  };

  if (loading) {
    return (
      <div className="min-h-screen gradient-neutral flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-teal-400 mx-auto mb-6"></div>
          <p className="text-white text-lg font-medium">Cargando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen gradient-neutral flex items-center justify-center p-4">
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{backgroundImage: "radial-gradient(circle, white 1.5px, transparent 1.5px)", backgroundSize: "32px 32px"}}></div>
      </div>

      <div className="max-w-md w-full relative z-10">
        <div className="text-center mb-10">
          <div className="flex items-center justify-center space-x-6 mb-8">
            <div className="text-white font-bold text-2xl">
              Municipalidad de Guatemala
            </div>
            <div className="h-12 w-px bg-white/30"></div>
            <img
              src={LogoRedCiudadana}
              alt="Red Ciudadana"
              className="h-12 w-auto object-contain"
            />
          </div>

          <div className="flex items-center justify-center space-x-3 mb-4">
            <div className="w-14 h-14 gradient-accent rounded-2xl flex items-center justify-center shadow-xl">
              <Scale size={28} className="text-white" />
            </div>
            <h1 className="text-4xl font-bold text-white tracking-tight">
              IA Jurídico Municipal
            </h1>
          </div>

          <p className="text-teal-100 text-xl font-medium">
            Asistencia Inteligente para el Departamento Jurídico
          </p>
        </div>

        <div className="bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-white/20">
          <div className="text-center mb-8">
            <div className="w-20 h-20 gradient-primary rounded-3xl flex items-center justify-center mx-auto mb-5 shadow-xl">
              <Shield size={36} className="text-white" />
            </div>
            <h2 className="text-3xl font-bold text-white mb-3">
              Acceso al Sistema
            </h2>
            <p className="text-teal-100 text-base">
              Ingresa tus credenciales para continuar
            </p>
          </div>

          <form onSubmit={manejarLogin} className="space-y-6">
            <div>
              <label className="block text-white font-semibold mb-3">
                Usuario
              </label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 transform -translate-y-1/2 text-neutral-300" size={22} />
                <input
                  type="text"
                  value={formData.username}
                  onChange={(e) => manejarCambio('username', e.target.value)}
                  placeholder="Ingresa tu usuario"
                  required
                  className="w-full pl-12 pr-4 py-4 bg-white/10 border-2 border-white/20 rounded-xl text-white placeholder-neutral-300 focus:ring-2 focus:ring-teal-400 focus:border-teal-400 backdrop-blur-sm transition-all text-base font-medium"
                />
              </div>
            </div>

            <div>
              <label className="block text-white font-semibold mb-3">
                Contraseña
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-neutral-300" size={22} />
                <input
                  type={mostrarPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={(e) => manejarCambio('password', e.target.value)}
                  placeholder="Ingresa tu contraseña"
                  required
                  className="w-full pl-12 pr-14 py-4 bg-white/10 border-2 border-white/20 rounded-xl text-white placeholder-neutral-300 focus:ring-2 focus:ring-teal-400 focus:border-teal-400 backdrop-blur-sm transition-all text-base font-medium"
                />
                <button
                  type="button"
                  onClick={() => setMostrarPassword(!mostrarPassword)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-neutral-300 hover:text-white transition-colors"
                >
                  {mostrarPassword ? <EyeOff size={22} /> : <Eye size={22} />}
                </button>
              </div>
            </div>

            {error && (
              <div className="bg-red-500/20 border-2 border-red-400/30 rounded-xl p-4 backdrop-blur-sm">
                <div className="flex items-center space-x-3">
                  <AlertCircle className="text-red-300 flex-shrink-0" size={22} />
                  <p className="text-red-100 text-sm font-medium">{error}</p>
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={cargando}
              className="w-full gradient-primary hover:shadow-2xl text-white px-6 py-4 rounded-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-3 font-bold text-lg shadow-xl transform hover:scale-105 disabled:transform-none"
            >
              {cargando ? (
                <>
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                  <span>Iniciando sesión...</span>
                </>
              ) : (
                <>
                  <LogIn size={24} />
                  <span>Iniciar Sesión</span>
                </>
              )}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-white/20 text-center">
            <p className="text-teal-100 text-sm font-medium">
              Sistema seguro - Municipalidad de Guatemala
            </p>
            <p className="text-teal-200 text-xs mt-2">
              Departamento Jurídico • Proyecto Red Ciudadana 2025
            </p>
          </div>
        </div>

        <div className="mt-8 bg-teal-900/40 backdrop-blur-md rounded-2xl border-2 border-teal-400/30 p-6 shadow-xl">
          <div className="flex items-start space-x-3 mb-4">
            <Sparkles className="text-teal-300 flex-shrink-0 mt-1" size={24} />
            <div>
              <p className="text-white text-base font-bold mb-2">
                Versión Demo - Acceso Restringido
              </p>
              <p className="text-teal-100 text-sm leading-relaxed">
                Esta es una versión de demostración del sistema. Para acceder, utiliza las siguientes credenciales:
              </p>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 mb-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-teal-200 text-sm font-semibold">Usuario:</span>
                <span className="text-white font-mono bg-neutral-900/50 px-3 py-1 rounded-lg text-sm font-bold">redciudadana</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-teal-200 text-sm font-semibold">Contraseña:</span>
                <span className="text-white font-mono bg-neutral-900/50 px-3 py-1 rounded-lg text-sm font-bold">redciudadana</span>
              </div>
            </div>
          </div>

          <button
            onClick={llenarCredencialesDemo}
            className="w-full bg-white/15 hover:bg-white/25 border border-white/30 text-white px-4 py-3 rounded-xl transition-all duration-200 font-semibold text-sm flex items-center justify-center space-x-2"
          >
            <Sparkles size={18} />
            <span>Autocompletar Credenciales Demo</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
