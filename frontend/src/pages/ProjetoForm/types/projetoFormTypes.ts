export type ProjetoFormMode = "create" | "edit";

export type TipoPergunta = "resposta-curta" | "paragrafo" | "multipla-escolha" | "sim-nao";

export type Pergunta = {
  id: number;
  texto: string;
  tipo: TipoPergunta;
  opcoes: string[];
  obrigatoria: boolean;
};

export type DocumentoSolicitado = {
  id: "historico" | "curriculo" | "cartaMotivacao" | "comprovanteMatricula";
  label: string;
  descricao: string;
  selecionado: boolean;
};

export type FormData = {
  titulo: string;
  area: string;
  unidade: string;
  descricao: string;
  palavrasChave: string;
  vagasBolsistas: string;
  vagasVoluntarios: string;
  cargaHoraria: string;
  inscricaoInicio: string;
  inscricaoFim: string;
  divulgacaoResultado: string;
  mensagemCandidatos: string;
};
