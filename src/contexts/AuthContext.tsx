import React, { createContext, useContext, useEffect, useState } from 'react';

interface UsuarioPerfil {
  id: string;
  nombre: string;
  cargo: string;
  email: string;
  departamento?: string;
  telefono?: string;
  ubicacion?: string;
  biografia?: string;
  fecha_ingreso?: string;
}

interface User {
  id: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  perfil: UsuarioPerfil | null;
  loading: boolean;
  signIn: (username: string, password: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
};

const DEMO_USERNAME = 'redciudadana';
const DEMO_PASSWORD = 'redciudadana';
const DEMO_USER_KEY = 'demo_user_session';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [perfil, setPerfil] = useState<UsuarioPerfil | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const sessionData = localStorage.getItem(DEMO_USER_KEY);
    if (sessionData) {
      try {
        const { user: savedUser, perfil: savedPerfil } = JSON.parse(sessionData);
        setUser(savedUser);
        setPerfil(savedPerfil);
      } catch (error) {
        console.error('Error al cargar sesión:', error);
        localStorage.removeItem(DEMO_USER_KEY);
      }
    }
    setLoading(false);
  }, []);

  const signIn = async (username: string, password: string) => {
    try {
      if (username === DEMO_USERNAME && password === DEMO_PASSWORD) {
        const demoUser: User = {
          id: 'demo-user-001',
          email: 'demo@redciudadana.org.gt'
        };

        const demoPerfil: UsuarioPerfil = {
          id: 'demo-user-001',
          nombre: 'Usuario Demo Red Ciudadana',
          cargo: 'Asesor Jurídico',
          email: 'demo@redciudadana.org.gt',
          departamento: 'Departamento Jurídico',
          telefono: '+502 0000-0000',
          ubicacion: 'Municipalidad de Guatemala',
          biografia: 'Usuario de demostración para el sistema de IA Jurídico Municipal',
          fecha_ingreso: new Date().toISOString()
        };

        setUser(demoUser);
        setPerfil(demoPerfil);

        localStorage.setItem(DEMO_USER_KEY, JSON.stringify({
          user: demoUser,
          perfil: demoPerfil
        }));

        return { error: null };
      } else {
        return {
          error: {
            message: 'Credenciales incorrectas. Usuario o contraseña inválidos.'
          }
        };
      }
    } catch (error: any) {
      return { error };
    }
  };

  const signOut = async () => {
    setUser(null);
    setPerfil(null);
    localStorage.removeItem(DEMO_USER_KEY);
  };

  const value = {
    user,
    perfil,
    loading,
    signIn,
    signOut
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
