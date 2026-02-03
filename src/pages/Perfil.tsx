import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { 
  User, 
  Settings, 
  Bell, 
  Shield, 
  Palette, 
  Save, 
  LogOut,
  Camera,
  Mail,
  Phone,
  MapPin,
  Briefcase,
  Calendar,
  Edit3,
  Check,
  X,
  Key,
  Globe
} from 'lucide-react';

interface PerfilProps {
  usuario: { nombre: string; cargo: string };
}

const Perfil: React.FC<PerfilProps> = ({ usuario }) => {
  const { signOut } = useAuth();
  const [seccionActiva, setSeccionActiva] = useState('perfil');
  const [editandoPerfil, setEditandoPerfil] = useState(false);
  const [configuracion, setConfiguracion] = useState({
    notificaciones: {
      email: true,
      push: false,
      documentos: true,
      actualizaciones: true
    },
    privacidad: {
      perfilPublico: false,
      mostrarActividad: true,
      compartirEstadisticas: false
    },
    apariencia: {
      tema: 'claro',
      idioma: 'es',
      tamanoFuente: 'medio'
    }
  });

  const { perfil, updatePerfil } = useAuth();
  const [perfilData, setPerfilData] = useState({
    nombre: usuario.nombre,
    cargo: usuario.cargo,
    email: perfil?.email || '',
    telefono: perfil?.telefono || '',
    departamento: perfil?.departamento || '',
    ubicacion: perfil?.ubicacion || '',
    fechaIngreso: perfil?.fecha_ingreso || '',
    biografia: perfil?.biografia || ''
  });
  const [configuracionData, setConfiguracionData] = useState<any>(null);
  const [cargandoConfig, setCargandoConfig] = useState(true);

  useEffect(() => {
    if (perfil) {
      setPerfilData({
        nombre: perfil.nombre,
        cargo: perfil.cargo,
        email: perfil.email,
        telefono: perfil.telefono || '',
        departamento: perfil.departamento || '',
        ubicacion: perfil.ubicacion || '',
        fechaIngreso: perfil.fecha_ingreso || '',
        biografia: perfil.biografia || ''
      });
    }
    cargarConfiguracion();
  }, [perfil]);

  const cargarConfiguracion = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('configuracion_usuario')
        .select('*')
        .eq('usuario_id', user.id)
        .maybeSingle();

      if (error) throw error;

      if (data) {
        setConfiguracion({
          notificaciones: {
            email: data.notificaciones_email,
            push: data.notificaciones_push,
            documentos: data.notificaciones_documentos,
            actualizaciones: data.notificaciones_actualizaciones
          },
          privacidad: {
            perfilPublico: data.perfil_publico,
            mostrarActividad: data.mostrar_actividad,
            compartirEstadisticas: data.compartir_estadisticas
          },
          apariencia: {
            tema: data.tema,
            idioma: data.idioma,
            tamanoFuente: data.tamano_fuente
          }
        });
        setConfiguracionData(data);
      }
    } catch (error) {
      console.error('Error al cargar configuración:', error);
    } finally {
      setCargandoConfig(false);
    }
  };

  const secciones = [
    { id: 'perfil', titulo: 'Mi Perfil', icono: User },
    { id: 'configuracion', titulo: 'Configuración', icono: Settings },
    { id: 'notificaciones', titulo: 'Notificaciones', icono: Bell },
    { id: 'privacidad', titulo: 'Privacidad', icono: Shield },
    { id: 'apariencia', titulo: 'Apariencia', icono: Palette },
    { id: 'seguridad', titulo: 'Seguridad', icono: Key }
  ];

  const manejarCambioConfiguracion = async (seccion: string, campo: string, valor: any) => {
    setConfiguracion(prev => ({
      ...prev,
      [seccion]: {
        ...prev[seccion as keyof typeof prev],
        [campo]: valor
      }
    }));

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const campoDb = {
        notificaciones: {
          email: 'notificaciones_email',
          push: 'notificaciones_push',
          documentos: 'notificaciones_documentos',
          actualizaciones: 'notificaciones_actualizaciones'
        },
        privacidad: {
          perfilPublico: 'perfil_publico',
          mostrarActividad: 'mostrar_actividad',
          compartirEstadisticas: 'compartir_estadisticas'
        },
        apariencia: {
          tema: 'tema',
          idioma: 'idioma',
          tamanoFuente: 'tamano_fuente'
        }
      };

      const nombreCampoDb = (campoDb as any)[seccion][campo];

      const { error } = await supabase
        .from('configuracion_usuario')
        .update({ [nombreCampoDb]: valor })
        .eq('usuario_id', user.id);

      if (error) throw error;
    } catch (error) {
      console.error('Error al actualizar configuración:', error);
    }
  };

  const manejarCambioPerfil = (campo: string, valor: string) => {
    setPerfilData(prev => ({
      ...prev,
      [campo]: valor
    }));
  };

  const guardarCambios = async () => {
    try {
      const { error } = await updatePerfil({
        nombre: perfilData.nombre,
        cargo: perfilData.cargo,
        telefono: perfilData.telefono || null,
        departamento: perfilData.departamento || null,
        ubicacion: perfilData.ubicacion || null,
        biografia: perfilData.biografia || null
      });

      if (error) throw error;

      setEditandoPerfil(false);
    } catch (error) {
      console.error('Error al guardar cambios:', error);
    }
  };

  const confirmarCerrarSesion = async () => {
    if (window.confirm('¿Estás seguro de que deseas cerrar sesión?')) {
      await signOut();
    }
  };

  const renderSeccionPerfil = () => (
    <div className="space-y-8">
      {/* Información Personal */}
      <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-2xl font-bold text-gray-800">Información Personal</h3>
          <button
            onClick={() => setEditandoPerfil(!editandoPerfil)}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-xl hover:bg-blue-200 transition-colors font-medium"
          >
            <Edit3 size={16} />
            <span>{editandoPerfil ? 'Cancelar' : 'Editar'}</span>
          </button>
        </div>

        <div className="flex items-start space-x-8">
          {/* Avatar */}
          <div className="relative">
            <div className="w-32 h-32 bg-gradient-to-br from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center">
              <User size={48} className="text-white" />
            </div>
            {editandoPerfil && (
              <button className="absolute -bottom-2 -right-2 w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center hover:bg-blue-700 transition-colors">
                <Camera size={16} />
              </button>
            )}
          </div>

          {/* Información */}
          <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Nombre Completo</label>
              {editandoPerfil ? (
                <input
                  type="text"
                  value={perfilData.nombre}
                  onChange={(e) => manejarCambioPerfil('nombre', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              ) : (
                <p className="text-gray-800 font-medium">{perfilData.nombre}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Cargo</label>
              {editandoPerfil ? (
                <input
                  type="text"
                  value={perfilData.cargo}
                  onChange={(e) => manejarCambioPerfil('cargo', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              ) : (
                <p className="text-gray-800 font-medium">{perfilData.cargo}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
              <p className="text-gray-800 font-medium flex items-center">
                <Mail size={16} className="mr-2 text-gray-500" />
                {perfilData.email}
              </p>
              {editandoPerfil && (
                <p className="text-xs text-gray-500 mt-1">El email no se puede modificar</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Teléfono</label>
              {editandoPerfil ? (
                <input
                  type="tel"
                  value={perfilData.telefono}
                  onChange={(e) => manejarCambioPerfil('telefono', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              ) : (
                <p className="text-gray-800 font-medium flex items-center">
                  <Phone size={16} className="mr-2 text-gray-500" />
                  {perfilData.telefono}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Departamento</label>
              {editandoPerfil ? (
                <input
                  type="text"
                  value={perfilData.departamento}
                  onChange={(e) => manejarCambioPerfil('departamento', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              ) : (
                <p className="text-gray-800 font-medium flex items-center">
                  <Briefcase size={16} className="mr-2 text-gray-500" />
                  {perfilData.departamento}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Ubicación</label>
              {editandoPerfil ? (
                <input
                  type="text"
                  value={perfilData.ubicacion}
                  onChange={(e) => manejarCambioPerfil('ubicacion', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              ) : (
                <p className="text-gray-800 font-medium flex items-center">
                  <MapPin size={16} className="mr-2 text-gray-500" />
                  {perfilData.ubicacion}
                </p>
              )}
            </div>
          </div>
        </div>

        <div className="mt-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">Biografía</label>
          {editandoPerfil ? (
            <textarea
              value={perfilData.biografia}
              onChange={(e) => manejarCambioPerfil('biografia', e.target.value)}
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            />
          ) : (
            <p className="text-gray-600">{perfilData.biografia}</p>
          )}
        </div>

        {editandoPerfil && (
          <div className="flex space-x-4 mt-6">
            <button
              onClick={guardarCambios}
              className="flex items-center space-x-2 px-6 py-2 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors font-medium"
            >
              <Check size={16} />
              <span>Guardar Cambios</span>
            </button>
            <button
              onClick={() => setEditandoPerfil(false)}
              className="flex items-center space-x-2 px-6 py-2 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors font-medium"
            >
              <X size={16} />
              <span>Cancelar</span>
            </button>
          </div>
        )}
      </div>

      {/* Información Institucional */}
      <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
        <h3 className="text-2xl font-bold text-gray-800 mb-6">Información Institucional</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Fecha de Ingreso</label>
            <p className="text-gray-800 font-medium flex items-center">
              <Calendar size={16} className="mr-2 text-gray-500" />
              {new Date(perfilData.fechaIngreso).toLocaleDateString('es-GT')}
            </p>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Institución</label>
            <p className="text-gray-800 font-medium">Municipalidad de Guatemala</p>
          </div>
        </div>
      </div>
    </div>
  );

  const renderSeccionNotificaciones = () => (
    <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
      <h3 className="text-2xl font-bold text-gray-800 mb-6">Configuración de Notificaciones</h3>
      
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="font-semibold text-gray-800">Notificaciones por Email</h4>
            <p className="text-gray-600 text-sm">Recibir notificaciones en tu correo electrónico</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={configuracion.notificaciones.email}
              onChange={(e) => manejarCambioConfiguracion('notificaciones', 'email', e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
          </label>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <h4 className="font-semibold text-gray-800">Notificaciones Push</h4>
            <p className="text-gray-600 text-sm">Recibir notificaciones en el navegador</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={configuracion.notificaciones.push}
              onChange={(e) => manejarCambioConfiguracion('notificaciones', 'push', e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
          </label>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <h4 className="font-semibold text-gray-800">Documentos Generados</h4>
            <p className="text-gray-600 text-sm">Notificar cuando se complete la generación de documentos</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={configuracion.notificaciones.documentos}
              onChange={(e) => manejarCambioConfiguracion('notificaciones', 'documentos', e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
          </label>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <h4 className="font-semibold text-gray-800">Actualizaciones del Sistema</h4>
            <p className="text-gray-600 text-sm">Recibir información sobre nuevas funcionalidades</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={configuracion.notificaciones.actualizaciones}
              onChange={(e) => manejarCambioConfiguracion('notificaciones', 'actualizaciones', e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
          </label>
        </div>
      </div>
    </div>
  );

  const renderSeccionPrivacidad = () => (
    <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
      <h3 className="text-2xl font-bold text-gray-800 mb-6">Configuración de Privacidad</h3>
      
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="font-semibold text-gray-800">Perfil Público</h4>
            <p className="text-gray-600 text-sm">Permitir que otros usuarios vean tu perfil</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={configuracion.privacidad.perfilPublico}
              onChange={(e) => manejarCambioConfiguracion('privacidad', 'perfilPublico', e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
          </label>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <h4 className="font-semibold text-gray-800">Mostrar Actividad</h4>
            <p className="text-gray-600 text-sm">Mostrar tu actividad reciente en el sistema</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={configuracion.privacidad.mostrarActividad}
              onChange={(e) => manejarCambioConfiguracion('privacidad', 'mostrarActividad', e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
          </label>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <h4 className="font-semibold text-gray-800">Compartir Estadísticas</h4>
            <p className="text-gray-600 text-sm">Permitir el uso de tus datos para estadísticas generales</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={configuracion.privacidad.compartirEstadisticas}
              onChange={(e) => manejarCambioConfiguracion('privacidad', 'compartirEstadisticas', e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
          </label>
        </div>
      </div>
    </div>
  );

  const renderSeccionApariencia = () => (
    <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
      <h3 className="text-2xl font-bold text-gray-800 mb-6">Configuración de Apariencia</h3>
      
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">Tema</label>
          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={() => manejarCambioConfiguracion('apariencia', 'tema', 'claro')}
              className={`p-4 rounded-xl border-2 transition-all ${
                configuracion.apariencia.tema === 'claro'
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="w-full h-8 bg-white rounded mb-2 border"></div>
              <p className="text-sm font-medium">Tema Claro</p>
            </button>
            <button
              onClick={() => manejarCambioConfiguracion('apariencia', 'tema', 'oscuro')}
              className={`p-4 rounded-xl border-2 transition-all ${
                configuracion.apariencia.tema === 'oscuro'
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="w-full h-8 bg-gray-800 rounded mb-2"></div>
              <p className="text-sm font-medium">Tema Oscuro</p>
            </button>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">Idioma</label>
          <select
            value={configuracion.apariencia.idioma}
            onChange={(e) => manejarCambioConfiguracion('apariencia', 'idioma', e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="es">Español</option>
            <option value="en">English</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">Tamaño de Fuente</label>
          <select
            value={configuracion.apariencia.tamanoFuente}
            onChange={(e) => manejarCambioConfiguracion('apariencia', 'tamanoFuente', e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="pequeno">Pequeño</option>
            <option value="medio">Medio</option>
            <option value="grande">Grande</option>
          </select>
        </div>
      </div>
    </div>
  );

  const renderSeccionSeguridad = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
        <h3 className="text-2xl font-bold text-gray-800 mb-6">Configuración de Seguridad</h3>
        
        <div className="space-y-6">
          <div>
            <h4 className="font-semibold text-gray-800 mb-3">Cambiar Contraseña</h4>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Contraseña Actual</label>
                <input
                  type="password"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Ingresa tu contraseña actual"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Nueva Contraseña</label>
                <input
                  type="password"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Ingresa tu nueva contraseña"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Confirmar Nueva Contraseña</label>
                <input
                  type="password"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Confirma tu nueva contraseña"
                />
              </div>
              <button className="px-6 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-medium">
                Cambiar Contraseña
              </button>
            </div>
          </div>

          <div className="border-t pt-6">
            <h4 className="font-semibold text-gray-800 mb-3">Sesiones Activas</h4>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-800">Navegador Actual</p>
                  <p className="text-sm text-gray-600">Chrome en Windows • Guatemala, Guatemala</p>
                  <p className="text-xs text-gray-500">Última actividad: Ahora</p>
                </div>
                <span className="px-3 py-1 bg-green-100 text-green-800 text-sm rounded-full font-medium">
                  Activa
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Cerrar Sesión */}
      <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
        <h3 className="text-2xl font-bold text-gray-800 mb-6">Cerrar Sesión</h3>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-600 mb-2">
              ¿Deseas cerrar tu sesión actual en el sistema?
            </p>
            <p className="text-sm text-gray-500">
              Tendrás que volver a iniciar sesión para acceder al sistema.
            </p>
          </div>
          <button
            onClick={confirmarCerrarSesion}
            className="flex items-center space-x-2 px-6 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors font-medium"
          >
            <LogOut size={16} />
            <span>Cerrar Sesión</span>
          </button>
        </div>
      </div>
    </div>
  );

  const renderSeccionActiva = () => {
    switch (seccionActiva) {
      case 'perfil':
        return renderSeccionPerfil();
      case 'notificaciones':
        return renderSeccionNotificaciones();
      case 'privacidad':
        return renderSeccionPrivacidad();
      case 'apariencia':
        return renderSeccionApariencia();
      case 'seguridad':
        return renderSeccionSeguridad();
      default:
        return renderSeccionPerfil();
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
        <div className="text-center">
          <h2 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
            Mi Perfil
          </h2>
          <p className="text-gray-600 text-lg">
            Gestiona tu información personal y configuración del sistema
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 sticky top-8">
            <nav className="space-y-2">
              {secciones.map((seccion) => {
                const IconoComponente = seccion.icono;
                const esActivo = seccionActiva === seccion.id;
                
                return (
                  <button
                    key={seccion.id}
                    onClick={() => setSeccionActiva(seccion.id)}
                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-left transition-all duration-200 ${
                      esActivo
                        ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <IconoComponente size={20} />
                    <span className="font-medium">{seccion.titulo}</span>
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Content */}
        <div className="lg:col-span-3">
          {renderSeccionActiva()}
        </div>
      </div>
    </div>
  );
};

export default Perfil;