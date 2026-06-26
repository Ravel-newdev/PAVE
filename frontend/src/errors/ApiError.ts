/**
 * @file ApiError.ts
 * @description Hierarquia de erros para comunicação com a API.
 *
 * Cada subclasse representa uma categoria semântica de falha HTTP,
 * permitindo tratamento granular por tipo sem inspecionar status codes
 * nos componentes. O AuthContext escuta AuthError para executar logout
 * automaticamente; demais erros são tratados localmente ou pelo ErrorBoundary.
 */

export class ApiError extends Error {
  public readonly status: number;
  public readonly details: unknown;

  constructor(message: string, status: number, details?: unknown) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.details = details;
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

/** 401 — Token ausente, inválido ou expirado. Dispara logout no AuthContext. */
export class AuthError extends ApiError {
  constructor(message = "Sessão expirada. Faça login novamente.", details?: unknown) {
    super(message, 401, details);
    this.name = "AuthError";
  }
}

/** 403 — Usuário autenticado sem permissão para o recurso. */
export class ForbiddenError extends ApiError {
  constructor(message = "Você não tem permissão para acessar este recurso.", details?: unknown) {
    super(message, 403, details);
    this.name = "ForbiddenError";
  }
}

/** 404 — Recurso não encontrado. */
export class NotFoundError extends ApiError {
  constructor(message = "Recurso não encontrado.", details?: unknown) {
    super(message, 404, details);
    this.name = "NotFoundError";
  }
}

/** 409 — Conflito de estado (ex: e-mail já cadastrado, matrícula duplicada). */
export class ConflictError extends ApiError {
  constructor(message = "Conflito com o estado atual do recurso.", details?: unknown) {
    super(message, 409, details);
    this.name = "ConflictError";
  }
}

/**
 * 422 — Erro de validação. Expõe o mapa de campos para uso direto
 * em formulários, sem lógica adicional nos componentes.
 */
export class ValidationError extends ApiError {
  public readonly fieldErrors: Record<string, string>;

  constructor(message = "Dados inválidos.", fieldErrors: Record<string, string> = {}, details?: unknown) {
    super(message, 422, details);
    this.name = "ValidationError";
    this.fieldErrors = fieldErrors;
  }
}

/**
 * Fábrica que constrói a subclasse correta a partir do status HTTP.
 * Centraliza a decisão de qual erro lançar, mantendo o PaveApiService limpo.
 */
export function buildApiError(status: number, message: string, details?: unknown): ApiError {
  switch (status) {
    case 401: return new AuthError(message, details);
    case 403: return new ForbiddenError(message, details);
    case 404: return new NotFoundError(message, details);
    case 409: return new ConflictError(message, details);
    case 422: {
      const fieldErrors =
        details && typeof details === "object" && "fieldErrors" in details
          ? (details as { fieldErrors: Record<string, string> }).fieldErrors
          : {};
      return new ValidationError(message, fieldErrors, details);
    }
    default:  return new ApiError(message, status, details);
  }
}