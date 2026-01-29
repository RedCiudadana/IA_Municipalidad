import React, { useState, useEffect } from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  Zap, 
  Clock, 
  DollarSign,
  FileText,
  Calendar,
  Filter,
  Download,
  RefreshCw,
  Activity,
  Database,
  Eye,
  AlertCircle
} from 'lucide-react';

interface EstadisticasProps {
  usuario: { nombre: string; cargo: string };
}

interface UsoAgente {
  id: string;
  nombre: string;
  usos: number;
  tokens: number;
  costo: number;
  ultimoUso: string;
  promedioDiario: number;
}

interface TransaccionAPI {
  id: string;
  fecha: string;
  hora: string;
  usuario: string;
  agente: string;
  tokens_entrada: number;
  tokens_salida: number;
  tokens_total: number;
  costo: number;
  duracion: number;
  estado: 'exitoso' | 'error' | 'timeout';
}

interface EstadisticasGenerales {
  totalTransacciones: number;
  totalTokens: number;
  costoTotal: number;
  usuariosActivos: number;
  promedioTokensPorTransaccion: number;
  agentesMasUsados: string;
}

const Estadisticas: React.FC<EstadisticasProps> = ({ usuario }) => {
  const [filtroFecha, setFiltroFecha] = useState('7d');
  const [filtroAgente, setFiltroAgente] = useState('todos');
  const [vistaActiva, setVistaActiva] = useState('resumen');
  const [cargando, setCargando] = useState(false);

  // Datos simulados - en producción vendrían de una API
  const estadisticasGenerales: EstadisticasGenerales = {
    totalTransacciones: 1247,
    totalTokens: 892456,
    costoTotal: 178.49,
    usuariosActivos: 23,
    promedioTokensPorTransaccion: 716,
    agentesMasUsados: 'Redactor de Oficios'
  };

  const usoAgentes: UsoAgente[] = [
    {
      id: 'redactor-oficios',
      nombre: 'Redactor de Oficios',
      usos: 342,
      tokens: 245680,
      costo: 49.14,
      ultimoUso: '2025-01-22T14:30:00',
      promedioDiario: 48.9
    },
    {
      id: 'generador-memos',
      nombre: 'Generador de Memos',
      usos: 298,
      tokens: 189432,
      costo: 37.89,
      ultimoUso: '2025-01-22T13:45:00',
      promedioDiario: 42.6
    },
    {
      id: 'redactor-cartas',
      nombre: 'Redactor de Cartas',
      usos: 187,
      tokens: 156789,
      costo: 31.36,
      ultimoUso: '2025-01-22T12:15:00',
      promedioDiario: 26.7
    },
    {
      id: 'asistente-minutas',
      nombre: 'Asistente de Minutas',
      usos: 156,
      tokens: 134567,
      costo: 26.91,
      ultimoUso: '2025-01-22T11:20:00',
      promedioDiario: 22.3
    },
    {
      id: 'resumen-expedientes',
      nombre: 'Resumen de Expedientes',
      usos: 143,
      tokens: 98234,
      costo: 19.65,
      ultimoUso: '2025-01-22T10:30:00',
      promedioDiario: 20.4
    },
    {
      id: 'analisis-inversion',
      nombre: 'Análisis de Inversión',
      usos: 121,
      tokens: 67754,
      costo: 13.55,
      ultimoUso: '2025-01-22T09:45:00',
      promedioDiario: 17.3
    }
  ];

  const transaccionesRecientes: TransaccionAPI[] = [
    {
      id: 'tx_001',
      fecha: '2025-01-22',
      hora: '14:30:25',
      usuario: 'Julio García',
      agente: 'Redactor de Oficios',
      tokens_entrada: 156,
      tokens_salida: 423,
      tokens_total: 579,
      costo: 0.12,
      duracion: 2.3,
      estado: 'exitoso'
    },
    {
      id: 'tx_002',
      fecha: '2025-01-22',
      hora: '14:25:18',
      usuario: 'María González',
      agente: 'Generador de Memos',
      tokens_entrada: 89,
      tokens_salida: 234,
      tokens_total: 323,
      costo: 0.06,
      duracion: 1.8,
      estado: 'exitoso'
    },
    {
      id: 'tx_003',
      fecha: '2025-01-22',
      hora: '14:20:42',
      usuario: 'Carlos Pérez',
      agente: 'Redactor de Cartas',
      tokens_entrada: 203,
      tokens_salida: 567,
      tokens_total: 770,
      costo: 0.15,
      duracion: 3.1,
      estado: 'exitoso'
    },
    {
      id: 'tx_004',
      fecha: '2025-01-22',
      hora: '14:15:33',
      usuario: 'Ana López',
      agente: 'Asistente de Minutas',
      tokens_entrada: 134,
      tokens_salida: 0,
      tokens_total: 134,
      costo: 0.00,
      duracion: 0.5,
      estado: 'error'
    },
    {
      id: 'tx_005',
      fecha: '2025-01-22',
      hora: '14:10:15',
      usuario: 'Roberto Díaz',
      agente: 'Resumen de Expedientes',
      tokens_entrada: 298,
      tokens_salida: 645,
      tokens_total: 943,
      costo: 0.19,
      duracion: 4.2,
      estado: 'exitoso'
    }
  ];

  const actualizarDatos = async () => {
    setCargando(true);
    // Simular carga de datos
    await new Promise(resolve => setTimeout(resolve, 1500));
    setCargando(false);
  };

  const exportarDatos = () => {
    const datos = {
      estadisticas_generales: estadisticasGenerales,
      uso_agentes: usoAgentes,
      transacciones_recientes: transaccionesRecientes,
      fecha_exportacion: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(datos, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `estadisticas-aigp-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const obtenerColorEstado = (estado: string) => {
    switch (estado) {
      case 'exitoso':
        return 'bg-green-100 text-green-800';
      case 'error':
        return 'bg-red-100 text-red-800';
      case 'timeout':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const renderResumen = () => (
    <div className="space-y-6">
      {/* Métricas principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Total Transacciones</p>
              <p className="text-3xl font-bold text-gray-900">{estadisticasGenerales.totalTransacciones.toLocaleString()}</p>
              <p className="text-sm text-emerald-600 mt-2">↗ +12% vs mes anterior</p>
            </div>
            <div className="p-3 rounded-xl bg-blue-100">
              <Activity size={24} className="text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Total Tokens</p>
              <p className="text-3xl font-bold text-gray-900">{estadisticasGenerales.totalTokens.toLocaleString()}</p>
              <p className="text-sm text-emerald-600 mt-2">↗ +8% vs mes anterior</p>
            </div>
            <div className="p-3 rounded-xl bg-emerald-100">
              <Database size={24} className="text-emerald-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Costo Total</p>
              <p className="text-3xl font-bold text-gray-900">${estadisticasGenerales.costoTotal}</p>
              <p className="text-sm text-red-600 mt-2">↗ +15% vs mes anterior</p>
            </div>
            <div className="p-3 rounded-xl bg-purple-100">
              <DollarSign size={24} className="text-purple-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Usuarios Activos</p>
              <p className="text-3xl font-bold text-gray-900">{estadisticasGenerales.usuariosActivos}</p>
              <p className="text-sm text-emerald-600 mt-2">↗ +5% vs mes anterior</p>
            </div>
            <div className="p-3 rounded-xl bg-orange-100">
              <Users size={24} className="text-orange-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Uso por agente */}
      <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
        <h3 className="text-2xl font-bold text-gray-800 mb-6">Uso por Agente</h3>
        
        <div className="space-y-4">
          {usoAgentes.map((agente) => (
            <div key={agente.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
              <div className="flex-1">
                <h4 className="font-semibold text-gray-800">{agente.nombre}</h4>
                <div className="flex items-center space-x-6 mt-2 text-sm text-gray-600">
                  <span>{agente.usos} usos</span>
                  <span>{agente.tokens.toLocaleString()} tokens</span>
                  <span>${agente.costo}</span>
                  <span>Promedio: {agente.promedioDiario}/día</span>
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm text-gray-500">
                  Último uso: {new Date(agente.ultimoUso).toLocaleString('es-GT')}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderTransacciones = () => (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100">
      <div className="p-6 border-b border-gray-200">
        <h3 className="text-2xl font-bold text-gray-800">Bitácora de Transacciones API</h3>
        <p className="text-gray-600 mt-2">Registro detallado de todas las interacciones con OpenAI</p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Fecha/Hora
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Usuario
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Agente
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Tokens
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Costo
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Duración
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Estado
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {transaccionesRecientes.map((transaccion) => (
              <tr key={transaccion.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    {new Date(`${transaccion.fecha}T${transaccion.hora}`).toLocaleString('es-GT')}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{transaccion.usuario}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{transaccion.agente}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    <div>Entrada: {transaccion.tokens_entrada}</div>
                    <div>Salida: {transaccion.tokens_salida}</div>
                    <div className="font-semibold">Total: {transaccion.tokens_total}</div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">${transaccion.costo}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{transaccion.duracion}s</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${obtenerColorEstado(transaccion.estado)}`}>
                    {transaccion.estado}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <button
                    className="text-blue-600 hover:text-blue-800 transition-colors"
                    title="Ver detalles"
                  >
                    <Eye size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderAnalisis = () => (
    <div className="space-y-6">
      {/* Gráfico de tendencias */}
      <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
        <h3 className="text-2xl font-bold text-gray-800 mb-6">Tendencias de Uso</h3>
        
        <div className="h-64 flex items-center justify-center bg-gray-50 rounded-xl">
          <div className="text-center">
            <BarChart3 size={48} className="text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">Gráfico de tendencias de uso por agente</p>
            <p className="text-sm text-gray-500 mt-2">
              Integración con biblioteca de gráficos pendiente
            </p>
          </div>
        </div>
      </div>

      {/* Análisis de eficiencia */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
          <h4 className="text-xl font-bold text-gray-800 mb-4">Eficiencia por Agente</h4>
          
          <div className="space-y-4">
            {usoAgentes.slice(0, 3).map((agente) => {
              const eficiencia = (agente.tokens / agente.usos).toFixed(0);
              return (
                <div key={agente.id} className="flex items-center justify-between">
                  <span className="text-gray-700">{agente.nombre}</span>
                  <div className="text-right">
                    <div className="text-sm font-medium text-gray-900">{eficiencia} tokens/uso</div>
                    <div className="text-xs text-gray-500">${(agente.costo / agente.usos).toFixed(3)}/uso</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
          <h4 className="text-xl font-bold text-gray-800 mb-4">Alertas y Recomendaciones</h4>
          
          <div className="space-y-4">
            <div className="flex items-start space-x-3 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
              <AlertCircle size={20} className="text-yellow-600 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-yellow-800">Uso elevado detectado</p>
                <p className="text-xs text-yellow-700">El agente "Redactor de Oficios" ha superado el promedio mensual</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
              <TrendingUp size={20} className="text-blue-600 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-blue-800">Tendencia positiva</p>
                <p className="text-xs text-blue-700">Incremento del 12% en adopción de agentes este mes</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3 p-3 bg-green-50 rounded-lg border border-green-200">
              <Zap size={20} className="text-green-600 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-green-800">Optimización sugerida</p>
                <p className="text-xs text-green-700">Considerar ajustar parámetros para reducir tokens promedio</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
              Estadísticas y Análisis
            </h2>
            <p className="text-gray-600 text-lg">
              Monitoreo de uso de agentes, consumo de API y análisis de rendimiento
            </p>
          </div>
          
          <div className="flex items-center space-x-4">
            <button
              onClick={actualizarDatos}
              disabled={cargando}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-xl hover:bg-blue-200 transition-colors font-medium disabled:opacity-50"
            >
              <RefreshCw size={16} className={cargando ? 'animate-spin' : ''} />
              <span>Actualizar</span>
            </button>
            
            <button
              onClick={exportarDatos}
              className="flex items-center space-x-2 px-4 py-2 bg-emerald-100 text-emerald-700 rounded-xl hover:bg-emerald-200 transition-colors font-medium"
            >
              <Download size={16} />
              <span>Exportar</span>
            </button>
          </div>
        </div>
      </div>

      {/* Filtros */}
      <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Calendar size={16} className="text-gray-500" />
              <select
                value={filtroFecha}
                onChange={(e) => setFiltroFecha(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="1d">Último día</option>
                <option value="7d">Últimos 7 días</option>
                <option value="30d">Últimos 30 días</option>
                <option value="90d">Últimos 90 días</option>
              </select>
            </div>
            
            <div className="flex items-center space-x-2">
              <Filter size={16} className="text-gray-500" />
              <select
                value={filtroAgente}
                onChange={(e) => setFiltroAgente(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="todos">Todos los agentes</option>
                <option value="redactor-oficios">Redactor de Oficios</option>
                <option value="generador-memos">Generador de Memos</option>
                <option value="redactor-cartas">Redactor de Cartas</option>
                <option value="asistente-minutas">Asistente de Minutas</option>
                <option value="resumen-expedientes">Resumen de Expedientes</option>
                <option value="analisis-inversion">Análisis de Inversión</option>
              </select>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => setVistaActiva('resumen')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                vistaActiva === 'resumen'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Resumen
            </button>
            <button
              onClick={() => setVistaActiva('transacciones')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                vistaActiva === 'transacciones'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Transacciones
            </button>
            <button
              onClick={() => setVistaActiva('analisis')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                vistaActiva === 'analisis'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Análisis
            </button>
          </div>
        </div>
      </div>

      {/* Contenido según vista activa */}
      {vistaActiva === 'resumen' && renderResumen()}
      {vistaActiva === 'transacciones' && renderTransacciones()}
      {vistaActiva === 'analisis' && renderAnalisis()}
    </div>
  );
};

export default Estadisticas;