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

/** Campo de formulário retornado por GET /api/formularios/:id/campos. */
export interface CampoFormulario {
  id: string;
  chave_unica: string;
  label: string;
  tipo: "texto" | "texto_longo" | "arquivo" | "numero" | "selecao" | "data";
  obrigatorio: boolean;
  ordem: number;
  opcoes?: string[] | null;
}

export interface CriarCampoFormularioPayload {
  tipo_chave: string;
  label_override?: string;
  opcoes?: string[];
  obrigatorio?: boolean;
  ordem?: number;
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

export interface DadosAluno {
  nomeCompleto: string;
  curso: string;
  matricula: string;
}
