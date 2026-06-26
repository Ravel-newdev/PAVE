/**
 * @file api.ts
 * @description Tipos utilitários para respostas padronizadas da API.
 * Usados pelo PaveApiService para tipar retornos genéricos.
 */

/** Envelope padrão de resposta para recursos únicos. */
export interface ApiResponse<T> {
  data: T;
  message?: string;
}

/** Envelope padrão de resposta para listagens. */
export interface ApiListResponse<T> {
  data: T[];
  total?: number;
  message?: string;
}
