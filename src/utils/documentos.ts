import { supabase } from '../lib/supabase';

export interface Documento {
  id: string;
  usuario_id: string;
  tipo_documento: string;
  titulo: string;
  contenido: string;
  destinatario?: string;
  cargo_destinatario?: string;
  institucion?: string;
  asunto?: string;
  estado: string;
  metadata?: any;
  created_at: string;
  updated_at: string;
}

export const crearDocumento = async (
  tipoDocumento: string,
  titulo: string,
  contenido: string,
  destinatario?: string,
  cargoDestinatario?: string,
  institucion?: string,
  asunto?: string,
  metadata?: any
) => {
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    throw new Error('Usuario no autenticado');
  }

  const { data, error } = await supabase
    .from('documentos')
    .insert({
      usuario_id: user.id,
      tipo_documento: tipoDocumento,
      titulo: titulo,
      contenido: contenido,
      destinatario: destinatario,
      cargo_destinatario: cargoDestinatario,
      institucion: institucion,
      asunto: asunto,
      estado: 'borrador',
      metadata: metadata || {}
    })
    .select()
    .single();

  if (error) throw error;

  return data as Documento;
};

export const obtenerDocumentos = async (limite?: number) => {
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    throw new Error('Usuario no autenticado');
  }

  let query = supabase
    .from('documentos')
    .select('*')
    .eq('usuario_id', user.id)
    .order('created_at', { ascending: false });

  if (limite) {
    query = query.limit(limite);
  }

  const { data, error } = await query;

  if (error) throw error;

  return data as Documento[];
};

export const obtenerDocumento = async (id: string) => {
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    throw new Error('Usuario no autenticado');
  }

  const { data, error } = await supabase
    .from('documentos')
    .select('*')
    .eq('id', id)
    .eq('usuario_id', user.id)
    .maybeSingle();

  if (error) throw error;

  return data as Documento | null;
};

export const actualizarDocumento = async (
  id: string,
  actualizaciones: Partial<Omit<Documento, 'id' | 'usuario_id' | 'created_at'>>
) => {
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    throw new Error('Usuario no autenticado');
  }

  const { data, error } = await supabase
    .from('documentos')
    .update({
      ...actualizaciones,
      updated_at: new Date().toISOString()
    })
    .eq('id', id)
    .eq('usuario_id', user.id)
    .select()
    .single();

  if (error) throw error;

  return data as Documento;
};

export const eliminarDocumento = async (id: string) => {
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    throw new Error('Usuario no autenticado');
  }

  const { error } = await supabase
    .from('documentos')
    .delete()
    .eq('id', id)
    .eq('usuario_id', user.id);

  if (error) throw error;

  return true;
};

export const obtenerDocumentosPorTipo = async (tipoDocumento: string) => {
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    throw new Error('Usuario no autenticado');
  }

  const { data, error } = await supabase
    .from('documentos')
    .select('*')
    .eq('usuario_id', user.id)
    .eq('tipo_documento', tipoDocumento)
    .order('created_at', { ascending: false });

  if (error) throw error;

  return data as Documento[];
};

export const obtenerDocumentosPorEstado = async (estado: string) => {
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    throw new Error('Usuario no autenticado');
  }

  const { data, error } = await supabase
    .from('documentos')
    .select('*')
    .eq('usuario_id', user.id)
    .eq('estado', estado)
    .order('created_at', { ascending: false });

  if (error) throw error;

  return data as Documento[];
};

export const buscarDocumentos = async (busqueda: string) => {
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    throw new Error('Usuario no autenticado');
  }

  const { data, error } = await supabase
    .from('documentos')
    .select('*')
    .eq('usuario_id', user.id)
    .or(`titulo.ilike.%${busqueda}%,destinatario.ilike.%${busqueda}%,asunto.ilike.%${busqueda}%`)
    .order('created_at', { ascending: false});

  if (error) throw error;

  return data as Documento[];
};

export const contarDocumentosPorTipo = async () => {
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    throw new Error('Usuario no autenticado');
  }

  const { data, error } = await supabase
    .from('documentos')
    .select('tipo_documento')
    .eq('usuario_id', user.id);

  if (error) throw error;

  const conteo: Record<string, number> = {};
  data.forEach(doc => {
    conteo[doc.tipo_documento] = (conteo[doc.tipo_documento] || 0) + 1;
  });

  return conteo;
};
