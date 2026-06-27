import type { DocumentoSolicitado, FormData, Pergunta, TipoPergunta } from "../types/projetoFormTypes";

export const initialCreateData: FormData = {
  titulo: "",
  area: "",
  unidade: "",
  descricao: "",
  palavrasChave: "",
  vagasBolsistas: "",
  vagasVoluntarios: "",
  cargaHoraria: "",
  inscricaoInicio: "",
  inscricaoFim: "",
  divulgacaoResultado: "",
  mensagemCandidatos: "",
};

export const initialEditData: FormData = {
  titulo: "Apoio ao Ensino de Matemática",
  area: "Educação",
  unidade: "Instituto de Matemática",
  descricao:
    "O projeto tem como objetivo apoiar o processo de ensino e aprendizagem em Matemática por meio de monitorias, oficinas e materiais didáticos, contribuindo para a melhoria do desempenho acadêmico dos estudantes.",
  palavrasChave: "matemática, ensino, monitoria, aprendizagem, educação",
  vagasBolsistas: "12",
  vagasVoluntarios: "8",
  cargaHoraria: "12h semanais",
  inscricaoInicio: "2025-06-15",
  inscricaoFim: "2025-06-30",
  divulgacaoResultado: "2025-07-05",
  mensagemCandidatos:
    "Olá! Responda o formulário com atenção. Entraremos em contato após a etapa de avaliação.",
};

export const initialDocumentos: DocumentoSolicitado[] = [
  {
    id: "historico",
    label: "Histórico escolar",
    descricao: "Solicitar envio do histórico acadêmico.",
    selecionado: true,
  },
  {
    id: "curriculo",
    label: "Currículo",
    descricao: "Solicitar currículo ou resumo de experiências.",
    selecionado: true,
  },
  {
    id: "cartaMotivacao",
    label: "Carta de motivação",
    descricao: "Solicitar texto explicando o interesse no projeto.",
    selecionado: false,
  },
  {
    id: "comprovanteMatricula",
    label: "Comprovante de matrícula",
    descricao: "Solicitar comprovante atual do aluno.",
    selecionado: false,
  },
];

export const perguntasEdit: Pergunta[] = [
  {
    id: 1,
    texto: "Qual seu semestre atual?",
    tipo: "multipla-escolha",
    opcoes: ["1º", "2º", "3º", "4º", "5º", "6º", "7º", "8º", "N/A"],
    obrigatoria: true,
  },
  {
    id: 2,
    texto: "Você tem IRA maior ou igual a 7?",
    tipo: "sim-nao",
    opcoes: ["Sim", "Não"],
    obrigatoria: true,
  },
  {
    id: 3,
    texto: "Descreva sua experiência com monitoria ou ensino.",
    tipo: "paragrafo",
    opcoes: [],
    obrigatoria: false,
  },
];

export const areaOptions = ["Educação", "Meio Ambiente", "Saúde", "Cultura", "Tecnologia", "Comunicação"];
export const unidadeOptions = [
  "Instituto de Matemática",
  "Instituto de Ciências do Mar",
  "Faculdade de Medicina",
  "Centro de Tecnologia",
  "Pró-Reitoria de Extensão",
];
export const cargaOptions = ["4h semanais", "8h semanais", "12h semanais", "16h semanais", "20h semanais"];

export const modelosPergunta: Omit<Pergunta, "id">[] = [
  {
    texto: "Qual seu semestre atual?",
    tipo: "multipla-escolha",
    opcoes: ["1º", "2º", "3º", "4º", "5º", "6º", "7º", "8º", "N/A"],
    obrigatoria: true,
  },
  {
    texto: "Você tem IRA maior ou igual a 7?",
    tipo: "sim-nao",
    opcoes: ["Sim", "Não"],
    obrigatoria: true,
  },
  {
    texto: "Você tem experiência com a área do projeto?",
    tipo: "paragrafo",
    opcoes: [],
    obrigatoria: false,
  },
  {
    texto: "Por que você deseja participar deste projeto?",
    tipo: "paragrafo",
    opcoes: [],
    obrigatoria: true,
  },
];

export const tipoPerguntaLabels: Record<TipoPergunta, string> = {
  "resposta-curta": "Resposta curta",
  paragrafo: "Parágrafo",
  "multipla-escolha": "Múltipla escolha",
  "sim-nao": "Sim/Não",
};
