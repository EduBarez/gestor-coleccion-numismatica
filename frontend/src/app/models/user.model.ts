export enum UserRole {
  USER = 'user',
  ADMIN = 'admin',
}

export interface User {
  id: string;
  DNI: string;
  nombre: string;
  apellidos: string;
  email: string;
  isApproved: boolean;
  rol: UserRole;
  profilePicture: string;
}

export interface RegisterData {
  DNI: string;
  nombre: string;
  apellidos: string;
  email: string;
  password: string;
  rol?: UserRole;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
}

export interface JwtPayload {
  id: string;
  nombre: string;
  rol: string;
  exp: number;
  iat: number;
}
