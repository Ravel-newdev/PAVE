import { buildApiError } from "../errors/ApiError";
import type { LoginPayload, LoginResponse, RegisterDiscentePayload, RegisterDocentePayload } from "../types/auth";
import type { Projeto, CriarProjetoPayload, AtualizarProjetoPayload, AlterarStatusProjetoPayload, Tag } from "../types/projeto";
import type { Processo, CriarProcessoPayload, AtualizarProcessoPayload, Candidato, Inscricao, CriarInscricaoPayload, AvaliarInscricaoPayload } from "../types/processo";
import type { Notificacao } from "../types/notificacao";

const TOKEN_KEY = "@pave:token";

const API_BASE_URL =
  (import.meta.env.VITE_API_URL as string | undefined)?.replace(/\/$/, "") ??
  "https://pave-backend-hwck.onrender.com/api";

class PaveApiService {
  getToken(): string | null {
    return localStorage.getItem(TOKEN_KEY);
  }

  setToken(token: string): void {
    localStorage.setItem(TOKEN_KEY, token);
  }

  clearToken(): void {
    localStorage.removeItem(TOKEN_KEY);
  }

  private buildHeaders(authenticated: boolean): Headers {
    const headers = new Headers({ "Content-Type": "application/json" });
    if (authenticated) {
      const token = this.getToken();
      if (token) headers.set("Authorization", `Bearer ${token}`);
    }
    return headers;
  }

  private async request<T>(path: string, options: RequestInit = {}, authenticated = true): Promise<T> {
    const headers = this.buildHeaders(authenticated);
    const response = await fetch(`${API_BASE_URL}${path}`, { ...options, headers });

    const contentType = response.headers.get("content-type");
    const isJson = contentType?.includes("application/json") ?? false;
    const body = isJson
      ? await response.json().catch(() => null)
      : await response.text().catch(() => "");

    if (!response.ok) {
      const message =
        body && typeof body === "object" && "message" in body
          ? String((body as { message: unknown }).message)
          : `Erro ${response.status}`;
      throw buildApiError(response.status, message, body);
    }

    return body as T;
  }

  private get<T>(path: string, authenticated = true): Promise<T> {
    return this.request<T>(path, { method: "GET" }, authenticated);
  }

  private post<T>(path: string, payload?: unknown, authenticated = true): Promise<T> {
    return this.request<T>(path, { method: "POST", body: payload !== undefined ? JSON.stringify(payload) : undefined }, authenticated);
  }

  private put<T>(path: string, payload: unknown, authenticated = true): Promise<T> {
    return this.request<T>(path, { method: "PUT", body: JSON.stringify(payload) }, authenticated);
  }

  private patch<T>(path: string, payload?: unknown, authenticated = true): Promise<T> {
    return this.request<T>(path, { method: "PATCH", body: payload !== undefined ? JSON.stringify(payload) : undefined }, authenticated);
  }

  private delete<T>(path: string, authenticated = true): Promise<T> {
    return this.request<T>(path, { method: "DELETE" }, authenticated);
  }

  login(payload: LoginPayload): Promise<LoginResponse> {
    return this.post<LoginResponse>("/auth/login", payload, false);
  }

  registrarDiscente(payload: RegisterDiscentePayload): Promise<void> {
    return this.post<void>("/auth/register/discente", payload, false);
  }

  registrarDocente(payload: RegisterDocentePayload): Promise<void> {
    return this.post<void>("/auth/register/docente", payload, false);
  }

  recuperarSenha(email: string): Promise<void> {
    return this.post<void>("/auth/recuperar-senha", { email }, false);
  }

  redefinirSenha(token: string, nova_senha: string): Promise<void> {
    return this.post<void>("/auth/reset-senha", { token, nova_senha }, false);
  }

  listarProjetos(status?: string): Promise<Projeto[]> {
    const query = status ? `?status=${status}` : "";
    return this.get<Projeto[]>(`/projetos${query}`);
  }

  buscarProjeto(id: string): Promise<Projeto> {
    return this.get<Projeto>(`/projetos/${id}`);
  }

  criarProjeto(payload: CriarProjetoPayload): Promise<Projeto> {
    return this.post<Projeto>("/projetos", payload);
  }

  atualizarProjeto(id: string, payload: AtualizarProjetoPayload): Promise<Projeto> {
    return this.put<Projeto>(`/projetos/${id}`, payload);
  }

  alterarStatusProjeto(id: string, payload: AlterarStatusProjetoPayload): Promise<Projeto> {
    return this.patch<Projeto>(`/projetos/${id}/status`, payload);
  }

  toggleFavorito(id: string): Promise<void> {
    return this.post<void>(`/projetos/${id}/favorito`);
  }

  criarProcesso(payload: CriarProcessoPayload): Promise<Processo> {
    return this.post<Processo>("/processos", payload);
  }

  atualizarProcesso(id: string, payload: AtualizarProcessoPayload): Promise<Processo> {
    return this.put<Processo>(`/processos/${id}`, payload);
  }

  listarCandidatos(processoId: string): Promise<Candidato[]> {
    return this.get<Candidato[]>(`/processos/${processoId}/candidatos`);
  }

  criarInscricao(payload: CriarInscricaoPayload): Promise<Inscricao> {
    return this.post<Inscricao>("/inscricoes", payload);
  }

  listarMinhasInscricoes(): Promise<Inscricao[]> {
    return this.get<Inscricao[]>("/inscricoes");
  }

  buscarInscricao(id: string): Promise<Inscricao> {
    return this.get<Inscricao>(`/inscricoes/${id}`);
  }

  avaliarInscricao(id: string, payload: AvaliarInscricaoPayload): Promise<Inscricao> {
    return this.post<Inscricao>(`/inscricoes/${id}/avaliar`, payload);
  }

  listarNotificacoes(): Promise<Notificacao[]> {
    return this.get<Notificacao[]>("/notificacoes");
  }

  marcarNotificacaoLida(id: string): Promise<void> {
    return this.patch<void>(`/notificacoes/${id}/lida`);
  }

  deletarNotificacao(id: string): Promise<void> {
    return this.delete<void>(`/notificacoes/${id}`);
  }

  listarTags(): Promise<Tag[]> {
    return this.get<Tag[]>("/tags");
  }

  listarTiposCampo(): Promise<{ id: string; nome: string }[]> {
    return this.get<{ id: string; nome: string }[]>("/formularios/tipos-campo");
  }

  listarFavoritos(): Promise<Projeto[]> {
    return this.get<Projeto[]>("/discentes/favoritos");
  }
}

export const paveApi = new PaveApiService();
