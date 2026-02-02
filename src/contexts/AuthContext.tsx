import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

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
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
  updatePerfil: (data: Partial<UsuarioPerfil>) => Promise<{ error: any }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [perfil, setPerfil] = useState<UsuarioPerfil | null>(null);
  const [loading, setLoading] = useState(true);

  const cargarPerfil = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('usuarios')
        .select('*')
        .eq('id', userId)
        .maybeSingle();

      if (error) {
        console.error('Error al cargar perfil:', error);
        return;
      }

      if (data) {
        setPerfil(data);
      }
    } catch (error) {
      console.error('Error al cargar perfil:', error);
    }
  };

  useEffect(() => {
    const initAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();

        if (session?.user) {
          setUser({
            id: session.user.id,
            email: session.user.email || ''
          });
          await cargarPerfil(session.user.id);
        }
      } catch (error) {
        console.error('Error al inicializar auth:', error);
      } finally {
        setLoading(false);
      }
    };

    initAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        if (session?.user) {
          setUser({
            id: session.user.id,
            email: session.user.email || ''
          });
          await cargarPerfil(session.user.id);
        } else {
          setUser(null);
          setPerfil(null);
        }
        setLoading(false);
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        return { error };
      }

      if (data.user) {
        setUser({
          id: data.user.id,
          email: data.user.email || ''
        });
        await cargarPerfil(data.user.id);
      }

      return { error: null };
    } catch (error: any) {
      return { error };
    }
  };

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
      setPerfil(null);
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  };

  const updatePerfil = async (data: Partial<UsuarioPerfil>) => {
    try {
      if (!user) {
        return { error: { message: 'No hay usuario autenticado' } };
      }

      const { error } = await supabase
        .from('usuarios')
        .update(data)
        .eq('id', user.id);

      if (error) {
        return { error };
      }

      await cargarPerfil(user.id);

      return { error: null };
    } catch (error: any) {
      return { error };
    }
  };

  const value = {
    user,
    perfil,
    loading,
    signIn,
    signOut,
    updatePerfil
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
