import type { ReactNode } from "react";
import { Users, Leaf, Globe, BookOpen, Heart, Lightbulb } from "lucide-react";

export interface ProjectStats {
  valor: string;
  label: string;
  detalhe: string;
  icon: ReactNode;
}

export interface Professor {
  nome: string;
  departamento: string;
  email: string;
}

export interface Project {
  id: number;
  titulo: string;
  resumo: string;
  tipo: string[];
  area: string;
  publicoAlvo: string;
  modalidade: string;
  local: string;
  cargaHoraria: string;
  periodo: string;
  vagasTotal: number;
  vagasPreenchidas: number;
  stats: ProjectStats[];
  atividades: string[];
  beneficios: string[];
  requisitos: string[];
  professor: Professor;
  descricaoCompleta: string;
  bannerUrl: string | null;
  badge: string;
  badgeClass: string;
  status: "ativa" | "pendente";
  iconClass: string;
}

export const projetos: Project[] = [
  {
    id: 1,
    titulo: "Educação Tecnológica",
    resumo: "Capacitação de jovens de escolas públicas em lógica de programação e robótica.",
    tipo: ["Extensão"],
    area: "Tecnologia e Educação",
    publicoAlvo: "Estudantes do ensino médio em escolas públicas",
    modalidade: "Presencial",
    local: "Escolas públicas de Fortaleza",
    cargaHoraria: "10h semanais",
    periodo: "Março a Dezembro/2025",
    vagasTotal: 6,
    vagasPreenchidas: 4,
    stats: [
      { valor: "+150", label: "alunos capacitados",  detalhe: "desde o início do projeto", icon: <Users size={26} /> },
      { valor: "8",    label: "turmas atendidas",    detalhe: "em escolas parceiras",       icon: <Leaf size={26} />  },
      { valor: "4",    label: "escolas envolvidas",  detalhe: "na rede pública",            icon: <Globe size={26} /> },
    ],
    atividades: [
      "Ministrar oficinas de lógica de programação",
      "Apoiar montagem e programação de kits de robótica",
      "Acompanhar a evolução dos alunos nas turmas",
      "Produzir material didático de apoio",
    ],
    beneficios: [
      "Desenvolvimento de habilidades de ensino",
      "Horas complementares",
      "Certificado de participação",
    ],
    requisitos: [
      "Conhecimento básico de lógica de programação",
      "Disponibilidade em horário escolar",
      "Boa comunicação com adolescentes",
    ],
    professor: {
      nome: "Prof. Carlos Silva",
      departamento: "Computação",
      email: "carlos.silva@instituicao.edu.br",
    },
    descricaoCompleta:
      "O projeto leva noções de lógica de programação e robótica educacional para jovens de escolas públicas, com oficinas práticas e kits de montagem, estimulando o interesse por tecnologia desde o ensino médio.",
    bannerUrl: null,
    badge: "Extensão",
    badgeClass: "badge-active",
    status: "ativa",
    iconClass: "icon-green",
  },
  {
    id: 2,
    titulo: "Horta Comunitária",
    resumo: "Criação e manutenção de hortas orgânicas em comunidades carentes da região.",
    tipo: ["Voluntariado"],
    area: "Meio Ambiente",
    publicoAlvo: "Comunidades em situação de vulnerabilidade",
    modalidade: "Presencial",
    local: "Bairros da periferia de Fortaleza",
    cargaHoraria: "8h semanais",
    periodo: "Abril a Novembro/2025",
    vagasTotal: 8,
    vagasPreenchidas: 3,
    stats: [
      { valor: "+90", label: "famílias beneficiadas", detalhe: "com alimentos da horta",  icon: <Users size={26} /> },
      { valor: "5",   label: "hortas implantadas",    detalhe: "em comunidades locais",   icon: <Leaf size={26} />  },
      { valor: "3",   label: "bairros atendidos",     detalhe: "na cidade",               icon: <Globe size={26} /> },
    ],
    atividades: [
      "Preparar canteiros e realizar plantio",
      "Organizar mutirões de manutenção das hortas",
      "Orientar moradores sobre cultivo orgânico",
      "Distribuir parte da colheita entre as famílias participantes",
    ],
    beneficios: [
      "Contribuição direta para segurança alimentar local",
      "Horas complementares",
      "Certificado de participação",
    ],
    requisitos: [
      "Disponibilidade nos fins de semana",
      "Disposição para trabalho ao ar livre",
      "Interesse em sustentabilidade e meio ambiente",
    ],
    professor: {
      nome: "Profa. Ana Rita",
      departamento: "Engenharia Ambiental",
      email: "ana.rita@instituicao.edu.br",
    },
    descricaoCompleta:
      "O projeto implanta e mantém hortas orgânicas comunitárias em bairros carentes, promovendo segurança alimentar, educação ambiental e geração de renda complementar para famílias da região.",
    bannerUrl: null,
    badge: "Voluntariado",
    badgeClass: "badge-volunteer",
    status: "pendente",
    iconClass: "icon-blue",
  },
  {
    id: 3,
    titulo: "Saúde na Praça",
    resumo: "Ações de aferição de pressão e orientação nutricional aos fins de semana.",
    tipo: ["Extensão"],
    area: "Saúde",
    publicoAlvo: "Comunidade em geral, com foco em idosos",
    modalidade: "Presencial",
    local: "Praças públicas de Fortaleza",
    cargaHoraria: "6h semanais",
    periodo: "Maio a Dezembro/2025",
    vagasTotal: 4,
    vagasPreenchidas: 3,
    stats: [
      { valor: "+300", label: "atendimentos realizados", detalhe: "desde o início do projeto", icon: <Users size={26} /> },
      { valor: "10",   label: "ações de saúde",          detalhe: "em praças públicas",        icon: <Leaf size={26} />  },
      { valor: "2",    label: "praças atendidas",         detalhe: "na cidade",                icon: <Globe size={26} /> },
    ],
    atividades: [
      "Aferir pressão arterial e glicemia da população",
      "Orientar sobre alimentação saudável",
      "Distribuir material informativo sobre prevenção",
      "Encaminhar casos de risco para unidades de saúde",
    ],
    beneficios: [
      "Prática clínica supervisionada",
      "Horas complementares",
      "Certificado de participação",
    ],
    requisitos: [
      "Disponibilidade nos fins de semana",
      "Estar cursando área de saúde (preferencial)",
      "Boa comunicação com o público",
    ],
    professor: {
      nome: "Prof. Marcos Lima",
      departamento: "Enfermagem",
      email: "marcos.lima@instituicao.edu.br",
    },
    descricaoCompleta:
      "O projeto leva ações básicas de saúde preventiva para praças públicas, com aferição de pressão e glicemia e orientação nutricional, ampliando o acesso da comunidade a cuidados de saúde simples e contínuos.",
    bannerUrl: null,
    badge: "Extensão",
    badgeClass: "badge-active",
    status: "ativa",
    iconClass: "icon-orange",
  },
  {
    id: 4,
    titulo: "Sustentabilidade na Comunidade",
    resumo: "Projeto de educação ambiental voltado para práticas sustentáveis e conscientização comunitária.",
    tipo: ["Extensão"],
    area: "Meio Ambiente",
    publicoAlvo: "Moradores de comunidades periféricas",
    modalidade: "Presencial",
    local: "Comunidades de Fortaleza",
    cargaHoraria: "8h semanais",
    periodo: "Fevereiro a Novembro/2025",
    vagasTotal: 15,
    vagasPreenchidas: 6,
    stats: [
      { valor: "+200", label: "pessoas impactadas",    detalhe: "nas ações realizadas",     icon: <Users size={26} /> },
      { valor: "12",   label: "oficinas realizadas",   detalhe: "de educação ambiental",    icon: <Leaf size={26} />  },
      { valor: "6",    label: "comunidades atendidas", detalhe: "na região metropolitana",  icon: <Globe size={26} /> },
    ],
    atividades: [
      "Realizar oficinas de educação ambiental",
      "Orientar sobre coleta seletiva e reciclagem",
      "Apoiar implantação de hortas comunitárias",
      "Produzir material informativo sobre sustentabilidade",
    ],
    beneficios: [
      "Horas complementares",
      "Certificado de participação",
      "Experiência em extensão universitária",
    ],
    requisitos: [
      "Interesse em meio ambiente e sustentabilidade",
      "Disponibilidade nos fins de semana",
      "Boa comunicação com o público",
    ],
    professor: {
      nome: "Prof. Carlos Mendes",
      departamento: "Engenharia Ambiental",
      email: "carlos.mendes@instituicao.edu.br",
    },
    descricaoCompleta:
      "O projeto promove educação ambiental em comunidades periféricas por meio de oficinas práticas sobre sustentabilidade, reciclagem e hortas orgânicas, contribuindo para a conscientização e melhoria da qualidade de vida local.",
    bannerUrl: null,
    badge: "Extensão",
    badgeClass: "badge-active",
    status: "ativa",
    iconClass: "icon-green",
  },
  {
    id: 5,
    titulo: "Apoio Escolar Transformador",
    resumo: "Aulas de reforço e atividades educativas para crianças e adolescentes.",
    tipo: ["Voluntariado"],
    area: "Educação",
    publicoAlvo: "Crianças e adolescentes de escolas públicas",
    modalidade: "Presencial",
    local: "Escolas públicas e centros comunitários",
    cargaHoraria: "6h semanais",
    periodo: "Março a Dezembro/2025",
    vagasTotal: 20,
    vagasPreenchidas: 8,
    stats: [
      { valor: "+180", label: "alunos atendidos",    detalhe: "em reforço escolar",      icon: <BookOpen size={26} /> },
      { valor: "15",   label: "turmas de reforço",   detalhe: "em diferentes escolas",   icon: <Users size={26} />    },
      { valor: "5",    label: "escolas parceiras",   detalhe: "na rede pública",          icon: <Globe size={26} />    },
    ],
    atividades: [
      "Ministrar aulas de reforço em matemática e português",
      "Desenvolver atividades lúdicas e educativas",
      "Acompanhar o desempenho dos alunos",
      "Produzir relatórios de progresso",
    ],
    beneficios: [
      "Horas complementares",
      "Certificado de participação",
      "Desenvolvimento de habilidades pedagógicas",
    ],
    requisitos: [
      "Estar cursando licenciatura ou áreas afins (preferencial)",
      "Paciência e habilidade de comunicação com crianças",
      "Disponibilidade no contra-turno escolar",
    ],
    professor: {
      nome: "Profa. Juliana Alves",
      departamento: "Pedagogia",
      email: "juliana.alves@instituicao.edu.br",
    },
    descricaoCompleta:
      "O projeto oferece aulas de reforço escolar e atividades educativas para crianças e adolescentes de escolas públicas, contribuindo para a redução da defasagem de aprendizagem e o desenvolvimento integral dos estudantes.",
    bannerUrl: null,
    badge: "Voluntariado",
    badgeClass: "badge-volunteer",
    status: "ativa",
    iconClass: "icon-blue",
  },
  {
    id: 6,
    titulo: "Inovação e Tecnologia Social",
    resumo: "Desenvolvimento de soluções tecnológicas para desafios sociais reais.",
    tipo: ["Bolsa"],
    area: "Tecnologia e Educação",
    publicoAlvo: "Comunidades vulneráveis e ONGs locais",
    modalidade: "Híbrido",
    local: "Campus universitário e remoto",
    cargaHoraria: "12h semanais",
    periodo: "Janeiro a Dezembro/2025",
    vagasTotal: 10,
    vagasPreenchidas: 3,
    stats: [
      { valor: "8",    label: "soluções desenvolvidas", detalhe: "em produção",          icon: <Lightbulb size={26} /> },
      { valor: "+500", label: "pessoas impactadas",     detalhe: "pelas soluções",       icon: <Users size={26} />     },
      { valor: "6",    label: "ONGs parceiras",         detalhe: "no projeto",           icon: <Heart size={26} />     },
    ],
    atividades: [
      "Levantar requisitos junto a ONGs e comunidades",
      "Desenvolver aplicações e sistemas de baixo custo",
      "Realizar testes e validações com usuários reais",
      "Documentar e publicar os resultados",
    ],
    beneficios: [
      "Bolsa financeira mensal",
      "Horas complementares",
      "Certificado de participação",
      "Possibilidade de publicação científica",
    ],
    requisitos: [
      "Estar cursando Ciência da Computação, Engenharia ou áreas afins",
      "Conhecimento de programação (qualquer linguagem)",
      "Interesse em impacto social",
    ],
    professor: {
      nome: "Prof. Ricardo Silva",
      departamento: "Ciência da Computação",
      email: "ricardo.silva@instituicao.edu.br",
    },
    descricaoCompleta:
      "O projeto une estudantes de tecnologia a ONGs e comunidades para desenvolver soluções digitais acessíveis que resolvam problemas reais, promovendo inovação com impacto social direto.",
    bannerUrl: null,
    badge: "Bolsa",
    badgeClass: "badge-active",
    status: "ativa",
    iconClass: "icon-orange",
  },
];

export function getProjetoPorId(id: number): Project | undefined {
  return projetos.find((p) => p.id === id);
}