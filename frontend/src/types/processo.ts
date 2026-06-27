/**
 * @file processo.ts
 * @description Contratos de tipos para Processos Seletivos e Inscrições.
 * Espelha os endpoints /api/processos e /api/inscricoes documentados em rotas.md.
 */

/** Status de um processo seletivo. */
export type StatusProcesso = "aberto" | "encerrado" | "cancelado";

/** Processo seletivo retornado pelo backend. */
export interface Processo {
  id: string;
  projeto_id: string;
  formulario_id?: string;
  titulo: string;
  descricao?: string;
  data_inicio?: string;
  data_termino?: string;
  pdf_edital?: string;
  n_vagas?: number;
  status: StatusProcesso;
  criado_em: string;
}

/** Corpo de criação de processo — POST /api/processos. */
export interface CriarProcessoPayload {
  projeto_id: string;
  formulario_id?: string;
  titulo: string;
  descricao?: string;
  data_inicio?: string;
  data_termino?: string;
  pdf_edital?: string;
  n_vagas?: number;
}

/** Corpo de atualização de processo — PUT /api/processos/:id. */
export type AtualizarProcessoPayload = Partial<CriarProcessoPayload> & {
  status?: StatusProcesso;
};

/**
 * Status de uma inscrição conforme valores aceitos pelo backend
 * no endpoint POST /api/inscricoes/:id/avaliar.
 */
export type StatusInscricao = "em_analise" | "aprovado" | "reprovado" | "desistencia";

/**
 * Status normalizado para o Kanban — mapeamento interno do frontend.
 * Não é enviado ao backend; usado apenas para organização visual das colunas.
 */
export type ColunaKanban = "inscritos" | "avaliacao" | "aprovados" | "rejeitados";

/** Resposta individual de um campo de formulário. */
export interface RespostaCampo {
  campo_id: string;
  valor_texto?: string;
  arquivo_url?: string;
}

/** Corpo de inscrição em processo seletivo — POST /api/inscricoes. */
export interface CriarInscricaoPayload {
  ps_id: string;
  respostas?: RespostaCampo[];
}

/** Inscrição retornada pelo backend em GET /api/inscricoes e GET /api/inscricoes/:id. */
export interface Inscricao {
  id: string;
  ps_id: string;
  discente_id: string;
  status: StatusInscricao;
  nota?: number;
  comentario?: string;
  coluna_kanban?: number;
  criado_em: string;
  respostas?: RespostaCampo[];
}

/** Candidato retornado por GET /api/processos/:id/candidatos. */
export interface Candidato {
  id: string;
  discente_id: string;
  nome: string;
  curso?: string;
  email?: string;
  status: StatusInscricao;
  nota?: number;
  comentario?: string;
  coluna_kanban?: number;
  criado_em: string;
}

/** Corpo de avaliação de candidato — POST /api/inscricoes/:id/avaliar. */
export interface AvaliarInscricaoPayload {
  nota?: number;
  comentario?: string;
  novo_status: StatusInscricao;
  coluna_kanban?: number;
}

/** Resumo de inscrição retornado por GET /api/inscricoes (lista do discente). */
export interface InscricaoResumo {
  id: string;
  ps_id: string;
  data_inscricao: string;
  status: StatusInscricao;
  processo_titulo: string;
  projeto_titulo: string;
}
