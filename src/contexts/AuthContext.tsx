import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
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

interface AuthContextType {
  user: User | null;
  session: Session | null;
  perfil: UsuarioPerfil | null;
  loading: boolean;
  signUp: (email: string, password: string, nombre: string, cargo: string) => Promise<{ error: any }>;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
  updatePerfil: (datos: Partial<UsuarioPerfil>) => Promise<{ error: any }>;
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
  const [session, setSession] = useState<Session | null>(null);
  const [perfil, setPerfil] = useState<UsuarioPerfil | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        cargarPerfil(session.user.id);
      } else {
        setLoading(false);
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      (async () => {
        setSession(session);
        setUser(session?.user ?? null);
        if (session?.user) {
          await cargarPerfil(session.user.id);
        } else {
          setPerfil(null);
          setLoading(false);
        }
      })();
    });

    return () => subscription.unsubscribe();
  }, []);

  const cargarPerfil = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('usuarios')
        .select('*')
        .eq('id', userId)
        .maybeSingle();

      if (error) throw error;

      if (data) {
        setPerfil(data);
      }
    } catch (error) {
      console.error('Error al cargar perfil:', error);
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (email: string, password: string, nombre: string, cargo: string) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            nombre: nombre,
            cargo: cargo
          }
        }
      });

      if (error) throw error;

      return { error: null };
    } catch (error: any) {
      return { error };
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      return { error: null };
    } catch (error: any) {
      return { error };
    }
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setPerfil(null);
  };

  const updatePerfil = async (datos: Partial<UsuarioPerfil>) => {
    if (!user) return { error: new Error('No hay usuario autenticado') };

    try {
      const { error } = await supabase
        .from('usuarios')
        .update({
          ...datos,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id);

      if (error) throw error;

      await cargarPerfil(user.id);

      return { error: null };
    } catch (error: any) {
      return { error };
    }
  };

  const value = {
    user,
    session,
    perfil,
    loading,
    signUp,
    signIn,
    signOut,
    updatePerfil
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
