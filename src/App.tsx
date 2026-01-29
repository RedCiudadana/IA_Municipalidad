import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ProtectedRoute } from './routes/ProtectedRoute';
import { MainLayout } from './layouts/MainLayout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Perfil from './pages/Perfil';
import Tutoriales from './pages/Tutoriales';
import CursoIA from './pages/CursoIA';
import Historial from './pages/Historial';
import Estadisticas from './pages/Estadisticas';
import Documentacion from './pages/Documentacion';
import RedactorOficios from './pages/RedactorOficios';
import GeneradorMemos from './pages/GeneradorMemos';
import RedactorCartas from './pages/RedactorCartas';
import AsistenteMinutas from './pages/AsistenteMinutas';
import ResumenExpedientes from './pages/ResumenExpedientes';
import AnalisisInversion from './pages/AnalisisInversion';
import NotFound from './pages/NotFound';

function AppRoutes() {
  const { user, perfil } = useAuth();

  const usuario = {
    nombre: perfil?.nombre || '',
    cargo: perfil?.cargo || ''
  };

  return (
    <Routes>
      <Route path="/login" element={
        user ? <Navigate to="/" replace /> : <Login />
      } />

      <Route element={
        <ProtectedRoute>
          <MainLayout />
        </ProtectedRoute>
      }>
        <Route path="/" element={<Dashboard usuario={usuario} />} />
        <Route path="/perfil" element={<Perfil usuario={usuario} />} />
        <Route path="/tutoriales" element={<Tutoriales usuario={usuario} />} />
        <Route path="/curso-ia" element={<CursoIA />} />
        <Route path="/historial" element={<Historial usuario={usuario} />} />
        <Route path="/estadisticas" element={<Estadisticas usuario={usuario} />} />
        <Route path="/documentacion" element={<Documentacion usuario={usuario} />} />

        <Route path="/agentes/oficios" element={<RedactorOficios usuario={usuario} />} />
        <Route path="/agentes/memos" element={<GeneradorMemos usuario={usuario} />} />
        <Route path="/agentes/cartas" element={<RedactorCartas usuario={usuario} />} />
        <Route path="/agentes/minutas" element={<AsistenteMinutas usuario={usuario} />} />
        <Route path="/agentes/resumenes" element={<ResumenExpedientes usuario={usuario} />} />
        <Route path="/agentes/analisis" element={<AnalisisInversion usuario={usuario} />} />
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
