export interface Usuario {
  nombre: string;
  cargo: string;
}

export interface UsuarioPerfil {
  id: string;
  nombre: string;
  cargo: string;
  email: string;
  departamento?: string;
  created_at?: string;
}
