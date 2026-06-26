/**
 * @file auth.ts
 * @description Contratos de tipos para autenticação e sessão do usuário.
 * Espelha exatamente o payload JWT assinado pelo backend em auth.service.js:
 * jwt.sign({ id, email, tipo }, jwtSecret, { expiresIn: "8h" })
 */

/** Perfis de usuário conforme ENUM do banco de dados. */
export type TipoUsuario = "docente" | "discente";

/** Shape do payload decodificado do JWT. */
export interface JwtPayload {
  id: string;
  email: string;
  tipo: TipoUsuario;
  /** Timestamp de expiração Unix (preenchido automaticamente pelo JWT). */
  exp: number;
  iat: number;
}

/** Estado de sessão disponível via AuthContext em toda a aplicação. */
export interface UserSession {
  id: string;
  email: string;
  tipo: TipoUsuario;
}

/** Corpo da requisição de login. */
export interface LoginPayload {
  email: string;
  senha: string;
}

/** Corpo da requisição de cadastro de discente. */
export interface RegisterDiscentePayload {
  matricula: string;
  nome: string;
  email: string;
  senha: string;
  telefone?: string;
  curso?: string;
}

/** Corpo da requisição de cadastro de docente. */
export interface RegisterDocentePayload {
  matricula: string;
  nome: string;
  email: string;
  senha: string;
  telefone?: string;
  departamento?: string;
}

/** Resposta do endpoint POST /api/auth/login. */
export interface LoginResponse {
  token: string;
}
