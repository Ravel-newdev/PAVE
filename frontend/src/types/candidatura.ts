/**
 * @file candidatura.ts
 * @description Contratos de tipos para o fluxo de candidatura do discente.
 * Campos corrigidos para espelhar os retornos reais do backend.
 * Nomes do protótipo (coordenador, vagas, inscricoesAte) substituídos
 * pelos campos reais (autor_nome, n_vagas, data_termino).
 */

import type { Tag } from "./projeto";

/**
 * Dados do projeto exibidos na sidebar de candidatura.
 * Combina dados de Projeto e Processo em uma única view model.
 */
export interface ProjetoCandidaturaView {
  id: string;
  titulo: string;
  tags: Tag[];
  autor_nome: string;
  n_vagas?: number;
  data_termino?: string;
  descricao?: string;
  processoSeletivoId: string;
}

/** Campo de formulário retornado pelo backend. */
export interface CampoFormulario {
  id: string;
  label: string;
  tipo: "texto" | "textarea" | "arquivo";
  obrigatoriedade: boolean;
}

/** Resposta individual de um campo — alinhada com POST /api/inscricoes. */
export interface RespostaCampo {
  campo_id: string;
  valor_texto?: string;
  arquivo_url?: string;
}

/** Dados submetidos no formulário de candidatura. */
export interface FormularioCandidaturaData {
  respostas: RespostaCampo[];
}

export type FormErrors = Record<string, string | undefined>;
