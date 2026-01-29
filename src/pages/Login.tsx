import React, { useState } from 'react';
import { User, Lock, Eye, EyeOff, LogIn, Sparkles, Shield, Info, Mail, UserPlus } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const Login: React.FC = () => {
  const { signIn, signUp } = useAuth();
  const [modo, setModo] = useState<'login' | 'registro'>('login');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    nombre: '',
    cargo: ''
  });
  const [mostrarPassword, setMostrarPassword] = useState(false);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState('');
  const [mensaje, setMensaje] = useState('');

  const manejarCambio = (campo: string, valor: string) => {
    setFormData(prev => ({
      ...prev,
      [campo]: valor
    }));
    if (error) setError('');
    if (mensaje) setMensaje('');
  };

  const manejarLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setCargando(true);
    setError('');

    const { error } = await signIn(formData.email, formData.password);

    if (error) {
      if (error.message.includes('Invalid login credentials')) {
        setError('Correo o contraseña incorrectos');
      } else if (error.message.includes('Email not confirmed')) {
        setError('Por favor confirma tu correo electrónico');
      } else {
        setError(error.message || 'Error al iniciar sesión');
      }
    }

    setCargando(false);
  };

  const manejarRegistro = async (e: React.FormEvent) => {
    e.preventDefault();
    setCargando(true);
    setError('');
    setMensaje('');

    if (!formData.nombre || !formData.cargo) {
      setError('Por favor completa todos los campos');
      setCargando(false);
      return;
    }

    const { error } = await signUp(formData.email, formData.password, formData.nombre, formData.cargo);

    if (error) {
      if (error.message.includes('already registered')) {
        setError('Este correo ya está registrado');
      } else if (error.message.includes('Password')) {
        setError('La contraseña debe tener al menos 6 caracteres');
      } else {
        setError(error.message || 'Error al crear cuenta');
      }
    } else {
      setMensaje('Cuenta creada exitosamente. Por favor inicia sesión.');
      setModo('login');
      setFormData({
        email: formData.email,
        password: '',
        nombre: '',
        cargo: ''
      });
    }

    setCargando(false);
  };

  const llenarCredencialesPrueba = () => {
    setFormData({
      email: 'demo@segeplan.gob.gt',
      password: 'demo123456',
      nombre: '',
      cargo: ''
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-6 mb-6">
            <img
              src="https://datos.segeplan.gob.gt/uploads/admin/2024-06-04-213946.470432PAGINA-DATOS-ABIERTOS-13.png"
              alt="SEGEPLAN"
              className="h-16 w-auto object-contain"
            />
            <div className="h-12 w-px bg-white/30"></div>
            <img
              src="https://datos.segeplan.gob.gt/img/redciudadana-logo.png"
              alt="Red Ciudadana"
              className="h-12 w-auto object-contain"
            />
          </div>

          <div className="flex items-center justify-center space-x-2 mb-4">
            <Sparkles className="text-blue-400" size={24} />
            <h1 className="text-3xl font-bold text-white">
              AIGP-SEGEPLAN
            </h1>
          </div>

          <p className="text-blue-200 text-lg">
            Asistente Inteligente de Gestión Pública
          </p>
        </div>

        <div className="bg-white/10 backdrop-blur-lg rounded-3xl shadow-2xl p-8 border border-white/20">
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Shield size={32} className="text-white" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">
              {modo === 'login' ? 'Iniciar Sesión' : 'Crear Cuenta'}
            </h2>
            <p className="text-blue-200">
              {modo === 'login'
                ? 'Accede al sistema con tus credenciales institucionales'
                : 'Regístrate para acceder al sistema'}
            </p>
          </div>


          <form onSubmit={modo === 'login' ? manejarLogin : manejarRegistro} className="space-y-6">
            {modo === 'registro' && (
              <>
                <div>
                  <label className="block text-white font-medium mb-2">
                    Nombre Completo
                  </label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                    <input
                      type="text"
                      value={formData.nombre}
                      onChange={(e) => manejarCambio('nombre', e.target.value)}
                      placeholder="Ingresa tu nombre completo"
                      required
                      className="w-full pl-12 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent backdrop-blur-sm"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-white font-medium mb-2">
                    Cargo
                  </label>
                  <div className="relative">
                    <Shield className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                    <input
                      type="text"
                      value={formData.cargo}
                      onChange={(e) => manejarCambio('cargo', e.target.value)}
                      placeholder="Ej: Analista SEGEPLAN"
                      required
                      className="w-full pl-12 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent backdrop-blur-sm"
                    />
                  </div>
                </div>
              </>
            )}

            <div>
              <label className="block text-white font-medium mb-2">
                Correo Electrónico
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => manejarCambio('email', e.target.value)}
                  placeholder="correo@segeplan.gob.gt"
                  required
                  className="w-full pl-12 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent backdrop-blur-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-white font-medium mb-2">
                Contraseña
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type={mostrarPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={(e) => manejarCambio('password', e.target.value)}
                  placeholder={modo === 'registro' ? 'Mínimo 6 caracteres' : 'Ingresa tu contraseña'}
                  required
                  className="w-full pl-12 pr-12 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent backdrop-blur-sm"
                />
                <button
                  type="button"
                  onClick={() => setMostrarPassword(!mostrarPassword)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                >
                  {mostrarPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            {error && (
              <div className="bg-red-500/20 border border-red-400/30 rounded-xl p-3">
                <p className="text-red-200 text-sm text-center">{error}</p>
              </div>
            )}

            {mensaje && (
              <div className="bg-green-500/20 border border-green-400/30 rounded-xl p-3">
                <p className="text-green-200 text-sm text-center">{mensaje}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={cargando}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-4 rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-3 font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 disabled:transform-none"
            >
              {cargando ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  <span>{modo === 'login' ? 'Iniciando sesión...' : 'Creando cuenta...'}</span>
                </>
              ) : (
                <>
                  {modo === 'login' ? <LogIn size={20} /> : <UserPlus size={20} />}
                  <span>{modo === 'login' ? 'Iniciar Sesión' : 'Crear Cuenta'}</span>
                </>
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <button
              onClick={() => {
                setModo(modo === 'login' ? 'registro' : 'login');
                setError('');
                setMensaje('');
              }}
              className="text-blue-200 hover:text-white transition-colors text-sm"
            >
              {modo === 'login'
                ? '¿No tienes cuenta? Regístrate aquí'
                : '¿Ya tienes cuenta? Inicia sesión'}
            </button>
          </div>

          <div className="mt-8 pt-6 border-t border-white/20 text-center">
            <p className="text-blue-200 text-sm">
              Sistema seguro protegido por SEGEPLAN
            </p>
            <p className="text-blue-300 text-xs mt-2">
              Proyecto piloto 2025 • Gobierno de Guatemala
            </p>
          </div>
        </div>

        <div className="mt-6 text-center">
          <p className="text-blue-200 text-sm">
            ¿Problemas para acceder? Contacta al soporte técnico
          </p>
          <p className="text-blue-300 text-xs mt-1">
            Email: soporte@segeplan.gob.gt • Tel: (502) 2230-0000
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
