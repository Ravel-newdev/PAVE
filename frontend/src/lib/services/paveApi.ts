export type RequestOptions = RequestInit & {
  auth?: boolean;
};

export class ApiError extends Error {
  status: number;
  details: unknown;

  constructor(message: string, status: number, details?: unknown) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.details = details;
  }
}

const API_BASE_URL =
  (import.meta.env.VITE_API_URL as string | undefined)?.replace(/\/$/, "") ??
  "http://localhost:3000/api";

export function getAuthToken() {
  return (
    localStorage.getItem("token") ||
    localStorage.getItem("authToken") ||
    localStorage.getItem("accessToken") ||
    sessionStorage.getItem("token") ||
    sessionStorage.getItem("authToken") ||
    sessionStorage.getItem("accessToken")
  );
}

export async function apiRequest<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const token = getAuthToken();
  const headers = new Headers(options.headers);

  if (!headers.has("Content-Type") && options.body && !(options.body instanceof FormData)) {
    headers.set("Content-Type", "application/json");
  }

  if (options.auth !== false && token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers,
  });

  const contentType = response.headers.get("content-type");
  const hasJson = contentType?.includes("application/json");
  const data = hasJson ? await response.json().catch(() => null) : await response.text().catch(() => "");

  if (!response.ok) {
    const message =
      typeof data === "object" && data && "message" in data
        ? String((data as { message?: unknown }).message)
        : `Erro na requisição ${response.status}`;
    throw new ApiError(message, response.status, data);
  }

  return data as T;
}

export type ProjetoPayload = Record<string, unknown>;
export type ProcessoPayload = Record<string, unknown>;

export const paveApi = {
  listarProjetos: () => apiRequest<unknown[]>("/projetos"),
  buscarProjeto: (projetoId: string | number) => apiRequest<unknown>(`/projetos/${projetoId}`),
  criarProjeto: (payload: ProjetoPayload) =>
    apiRequest<unknown>("/projetos", {
      method: "POST",
      body: JSON.stringify(payload),
    }),
  atualizarProjeto: (projetoId: string | number, payload: ProjetoPayload) =>
    apiRequest<unknown>(`/projetos/${projetoId}`, {
      method: "PUT",
      body: JSON.stringify(payload),
    }),
  alterarStatusProjeto: (projetoId: string | number, status: string) =>
    apiRequest<unknown>(`/projetos/${projetoId}/status`, {
      method: "PATCH",
      body: JSON.stringify({ status }),
    }),
  criarProcesso: (payload: ProcessoPayload) =>
    apiRequest<unknown>("/processos", {
      method: "POST",
      body: JSON.stringify(payload),
    }),
  atualizarProcesso: (processoId: string | number, payload: ProcessoPayload) =>
    apiRequest<unknown>(`/processos/${processoId}`, {
      method: "PUT",
      body: JSON.stringify(payload),
    }),
  listarCandidatos: (processoId: string | number) =>
    apiRequest<unknown[]>(`/processos/${processoId}/candidatos`),
  moverCandidato: (processoId: string | number, inscricaoId: string | number, status: string) =>
    apiRequest<unknown>(`/processos/${processoId}/candidatos/${inscricaoId}`, {
      method: "PATCH",
      body: JSON.stringify({ status, etapa: status }),
    }),
};

export function getIdFromUrl(fallback = "1") {
  const params = new URLSearchParams(window.location.search);
  const idFromQuery = params.get("id") || params.get("projetoId") || params.get("processoId");
  const lastPathPart = window.location.pathname.split("/").filter(Boolean).at(-1);
  return idFromQuery || (lastPathPart && /^\d+$/.test(lastPathPart) ? lastPathPart : fallback);
}

export function extractId(response: unknown): string | number | null {
  if (!response || typeof response !== "object") return null;
  const data = response as Record<string, unknown>;
  const nested = typeof data.data === "object" && data.data ? (data.data as Record<string, unknown>) : null;
  const id = data.id ?? data.projetoId ?? data.id_projeto ?? nested?.id ?? nested?.projetoId ?? nested?.id_projeto;
  return typeof id === "string" || typeof id === "number" ? id : null;
}
