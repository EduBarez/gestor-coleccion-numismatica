export interface User {
  id: string;
  DNI: string;
  nombre: string;
  apellidos: string;
  email: string;
  isApproved: boolean;
  rol: 'user' | 'admin';
  profilePicture: string;
}

export interface RegisterData {
  DNI: string;
  nombre: string;
  apellidos: string;
  email: string;
  password: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: User;
}