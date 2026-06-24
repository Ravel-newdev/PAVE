export interface Projeto {
  id: string;
  titulo: string;
  tags: string[];
  coordenador: string;
  vagas: number;
  inscricoesAte: string;
  imagemUrl?: string;
  processoSeletivoId: string;
}

export interface DadosAluno {
  nomeCompleto: string;
  curso: string;
  matricula: string;
}

export interface CampoFormulario {
  id: string;
  chave_unica: string;
  label: string;
  tipo: "texto" | "textarea" | "arquivo";
  obrigatoriedade: boolean;
}

export interface RespostaCampo {
  campo_id: string;
  valor_texto?: string;
  arquivo_url?: string;
}

export interface FormularioCandidaturaData {
  respostas: RespostaCampo[];
}

export type FormErrors = Record<string, string | undefined>;