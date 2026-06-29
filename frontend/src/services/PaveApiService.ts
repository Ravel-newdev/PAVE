import { buildApiError } from "../errors/ApiError";
import type { CampoFormulario, CriarCampoFormularioPayload } from "../types/candidatura";
import type { LoginPayload, LoginResponse, RegisterDiscentePayload, RegisterDocentePayload } from "../types/auth";
import type { Projeto, CriarProjetoPayload, AtualizarProjetoPayload, AlterarStatusProjetoPayload, Tag } from "../types/projeto";
import type { Processo, CriarProcessoPayload, AtualizarProcessoPayload, Candidato, Inscricao, InscricaoResumo, CriarInscricaoPayload, AvaliarInscricaoPayload } from "../types/processo";
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

  redefinirSenha(token: string, novaSenha: string): Promise<void> {
    return this.post<void>("/auth/reset-senha", { token, novaSenha }, false);
  }

  alterarSenha(senhaAtual: string, novaSenha: string): Promise<void> {
    return this.post<void>("/auth/alterar-senha", { senhaAtual, novaSenha });
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

  excluirProjeto(id: string): Promise<void> {
    return this.delete<void>(`/projetos/${id}`);
  }

  toggleFavorito(id: string): Promise<void> {
    return this.post<void>(`/projetos/${id}/favorito`);
  }

  buscarProcesso(id: string): Promise<Processo> {
    return this.get<Processo>(`/processos/${id}`);
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

  listarMinhasInscricoes(): Promise<InscricaoResumo[]> {
    return this.get<InscricaoResumo[]>("/inscricoes");
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

  obterPerfilDiscente(): Promise<{
    nome: string; matricula: string; curso: string | null;
    foto_url: string | null; curriculo_url: string | null;
    bio: string | null; linkedin: string | null;
    semestre: number | null; disponibilidade: string | null;
    interesses: string[] | null; email: string;
  }> {
    return this.get("/discentes/me");
  }

  atualizarPerfilDiscente(payload: Record<string, unknown>): Promise<void> {
    return this.put("/discentes/me", payload);
  }

  obterPerfilDocente(): Promise<{ nome: string; matricula: string; telefone: string | null; departamento: string | null; email: string; criado_em: string }> {
    return this.get("/docentes/me");
  }

  atualizarPerfilDocente(payload: { nome?: string; telefone?: string; departamento?: string }): Promise<void> {
    return this.put("/docentes/me", payload);
  }

  uploadFotoDiscente(file: File): Promise<{ url: string }> {
    return this.uploadFile("/discentes/me/foto", file);
  }

  uploadCurriculoDiscente(file: File): Promise<{ url: string }> {
    return this.uploadFile("/discentes/me/curriculo", file);
  }

  private async uploadFile(path: string, file: File): Promise<{ url: string }> {
    const formData = new FormData();
    formData.append("arquivo", file);
    const token = this.getToken();
    const response = await fetch(`${API_BASE_URL}${path}`, {
      method: "POST",
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      body: formData,
    });
    const body = await response.json().catch(() => null);
    if (!response.ok) {
      const message = body?.message ?? `Erro ${response.status}`;
      throw buildApiError(response.status, message, body);
    }
    return body as { url: string };
  }

  listarFavoritos(): Promise<Projeto[]> {
    return this.get<Projeto[]>("/discentes/favoritos");
  }

  listarProcessosProjeto(projetoId: string): Promise<Processo[]> {
    return this.get<Processo[]>(`/processos/projeto/${projetoId}`);
  }

  listarCamposFormulario(formularioId: string): Promise<CampoFormulario[]> {
    return this.get<CampoFormulario[]>(`/formularios/${formularioId}/campos`);
  }

  criarCampoFormulario(formularioId: string, payload: CriarCampoFormularioPayload): Promise<{ id: string }> {
    return this.post<{ id: string }>(`/formularios/${formularioId}/campos`, payload);
  }

  limparCamposPersonalizados(formularioId: string): Promise<void> {
    return this.delete<void>(`/formularios/${formularioId}/campos/personalizados`);
  }

  async uploadArquivo(file: File, processoId: string, campoId: string): Promise<{ url: string }> {
    const formData = new FormData();
    formData.append("arquivo", file);

    const token = this.getToken();
    const response = await fetch(
      `${API_BASE_URL}/uploads/candidatura?processoId=${processoId}&campoId=${campoId}`,
      {
        method: "POST",
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        body: formData,
      }
    );

    const body = await response.json().catch(() => null);
    if (!response.ok) {
      const message = body?.message ?? `Erro ${response.status}`;
      throw buildApiError(response.status, message, body);
    }

    return body as { url: string };
  }
}

export const paveApi = new PaveApiService();
