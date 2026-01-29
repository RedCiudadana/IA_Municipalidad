import { Outlet } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Header from './Header';
import TopNavigation from './TopNavigation';
import Footer from './Footer';
import ScrollToTop from './scrolltotop';

export const MainLayout = () => {
  const { perfil, signOut } = useAuth();

  const usuario = {
    nombre: perfil?.nombre || '',
    cargo: perfil?.cargo || ''
  };

  const manejarCerrarSesion = async () => {
    await signOut();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex flex-col">
      <ScrollToTop />
      <Header usuario={usuario} onCerrarSesion={manejarCerrarSesion} />
      <TopNavigation />

      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Outlet />
        </div>
      </main>

      <Footer />
    </div>
  );
};
