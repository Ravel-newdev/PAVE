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
  descricao: string;
  unidade: string;       // → centro_dep
  cargaHoraria: string;  // → carga_hora (número inteiro)
  dataInic: string;      // → data_inic (duração do projeto)
  dataTermino: string;   // → data_termino (duração do projeto)
  inscricaoInicio: string; // → processo seletivo data_inicio
  inscricaoFim: string;    // → processo seletivo data_termino
};
