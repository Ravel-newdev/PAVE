/**
 * @file projeto.ts
 * @description Contratos de tipos para o domínio de Projetos.
 * Campos espelham o schema Zod do backend (projeto.schema.js)
 * e as colunas do banco de dados. Campos do protótipo sem equivalente
 * no backend foram removidos.
 */

/** Valores válidos para status de projeto conforme updateStatusSchema. */
export type StatusProjeto = "rascunho" | "ativo" | "encerrado" | "suspenso";

/** Tag retornada por GET /api/tags. */
export interface Tag {
  id: string;
  nome: string;
}

/**
 * Projeto retornado pelo backend em GET /api/projetos e GET /api/projetos/:id.
 * O campo autor_nome é injetado pelo service na query de JOIN com docentes.
 */
export interface Projeto {
  id: string;
  titulo: string;
  descricao?: string;
  carga_hora?: number;
  data_inic?: string;
  data_termino?: string;
  centro_dep?: string;
  status: StatusProjeto;
  autor_id: string;
  autor_nome: string;
  tags: Tag[];
  criado_em: string;
  n_vagas?: number | null;
}

/** Corpo de criação de projeto — POST /api/projetos. */
export interface CriarProjetoPayload {
  titulo: string;
  descricao?: string;
  carga_hora?: number;
  data_inic?: string;
  data_termino?: string;
  centro_dep?: string;
  tags?: string[];
}

/** Corpo de atualização de projeto — PUT /api/projetos/:id. */
export type AtualizarProjetoPayload = Partial<CriarProjetoPayload>;

/** Corpo de alteração de status — PATCH /api/projetos/:id/status. */
export interface AlterarStatusProjetoPayload {
  status: StatusProjeto;
}

/**
 * Estatísticas derivadas localmente a partir da listagem de projetos.
 * Não existe endpoint dedicado — são calculadas no hook useDashboardProfessor.
 */
export interface EstatisticasProjetos {
  projetosAtivos: number;
  projetosRascunho: number;
  projetosEncerrados: number;
  projetosSuspensos: number;
}
