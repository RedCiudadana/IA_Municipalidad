import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ProtectedRoute } from './routes/ProtectedRoute';
import { MainLayout } from './layouts/MainLayout';
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
import RevisionContratos from './pages/RevisionContratos';
import BibliotecaJuridica from './pages/BibliotecaJuridica';
import Login from './pages/Login';
import NotFound from './pages/NotFound';

function AppRoutes() {
  const usuario = {
    nombre: 'Usuario',
    cargo: 'Funcionario'
  };

  return (
    <Routes>
      <Route path="/login" element={<Login />} />

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
        <Route path="/agentes/revision-contratos" element={<RevisionContratos usuario={usuario} />} />

        <Route path="/biblioteca-juridica" element={<BibliotecaJuridica />} />
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
