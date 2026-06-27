import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import { useNavigate } from "@tanstack/react-router";
import { paveApi } from "../services/PaveApiService";
import { AuthError } from "../errors/ApiError";
import type { UserSession, TipoUsuario, LoginPayload } from "../types/auth";

function decodeJwtPayload(token: string): UserSession | null {
  try {
    const base64Payload = token.split(".")[1];
    if (!base64Payload) return null;
    const json = atob(base64Payload.replace(/-/g, "+").replace(/_/g, "/"));
    const parsed = JSON.parse(json) as { id?: string; email?: string; tipo?: string; exp?: number };
    if (!parsed.id || !parsed.email || !parsed.tipo) return null;
    if (parsed.exp && Date.now() / 1000 > parsed.exp) return null;
    return { id: parsed.id, email: parsed.email, tipo: parsed.tipo as TipoUsuario };
  } catch {
    return null;
  }
}

interface AuthContextValue {
  session: UserSession | null;
  isLoading: boolean;
  login: (payload: LoginPayload) => Promise<void>;
  logout: () => void;
  isDocente: boolean;
  isDiscente: boolean;
}

const AuthContext = createContext<AuthContextValue | null>(null);

function loadSessionFromStorage(): UserSession | null {
  const token = paveApi.getToken();
  if (!token) return null;
  const decoded = decodeJwtPayload(token);
  if (!decoded) { paveApi.clearToken(); return null; }
  return decoded;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<UserSession | null>(loadSessionFromStorage);
  const [isLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    function handleAuthError(event: ErrorEvent) {
      if (event.error instanceof AuthError) logout();
    }
    window.addEventListener("error", handleAuthError);
    return () => window.removeEventListener("error", handleAuthError);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const login = useCallback(async (payload: LoginPayload): Promise<void> => {
    const { token } = await paveApi.login(payload);
    const decoded = decodeJwtPayload(token);
    if (!decoded) throw new Error("Token recebido é inválido.");
    paveApi.setToken(token);
    setSession(decoded);
  }, []);

  const logout = useCallback((): void => {
    paveApi.clearToken();
    setSession(null);
    navigate({ to: "/login" });
  }, [navigate]);

  const value = useMemo<AuthContextValue>(
    () => ({ session, isLoading, login, logout, isDocente: session?.tipo === "docente", isDiscente: session?.tipo === "discente" }),
    [session, isLoading, login, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth deve ser utilizado dentro de AuthProvider.");
  return ctx;
}
