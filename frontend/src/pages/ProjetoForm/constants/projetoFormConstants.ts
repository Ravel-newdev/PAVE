import type { DocumentoSolicitado, FormData, Pergunta, TipoPergunta } from "../types/projetoFormTypes";

export const initialCreateData: FormData = {
  titulo: "",
  descricao: "",
  unidade: "",
  cargaHoraria: "",
  dataInic: "",
  dataTermino: "",
  inscricaoInicio: "",
  inscricaoFim: "",
};

export const initialEditData: FormData = {
  titulo: "",
  descricao: "",
  unidade: "",
  cargaHoraria: "",
  dataInic: "",
  dataTermino: "",
  inscricaoInicio: "",
  inscricaoFim: "",
};

export const initialDocumentos: DocumentoSolicitado[] = [
  { id: "historico",            label: "Histórico escolar",      descricao: "Solicitar envio do histórico acadêmico.",          selecionado: true  },
  { id: "curriculo",            label: "Currículo",              descricao: "Solicitar currículo ou resumo de experiências.",    selecionado: true  },
  { id: "cartaMotivacao",       label: "Carta de motivação",     descricao: "Solicitar texto explicando o interesse no projeto.",selecionado: false },
  { id: "comprovanteMatricula", label: "Comprovante de matrícula",descricao: "Solicitar comprovante atual do aluno.",            selecionado: false },
];

export const perguntasEdit: Pergunta[] = [];

export const modelosPergunta: Omit<Pergunta, "id">[] = [
  { texto: "Qual seu semestre atual?",                        tipo: "multipla-escolha", opcoes: ["1º","2º","3º","4º","5º","6º","7º","8º","N/A"], obrigatoria: true  },
  { texto: "Você tem IRA maior ou igual a 7?",               tipo: "sim-nao",          opcoes: ["Sim","Não"],                                   obrigatoria: true  },
  { texto: "Você tem experiência com a área do projeto?",    tipo: "paragrafo",        opcoes: [],                                              obrigatoria: false },
  { texto: "Por que você deseja participar deste projeto?",  tipo: "paragrafo",        opcoes: [],                                              obrigatoria: true  },
];

export const tipoPerguntaLabels: Record<TipoPergunta, string> = {
  "resposta-curta":  "Resposta curta",
  paragrafo:         "Parágrafo",
  "multipla-escolha":"Múltipla escolha",
  "sim-nao":         "Sim/Não",
};
