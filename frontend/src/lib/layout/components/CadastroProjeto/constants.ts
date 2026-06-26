import type { ReactNode } from "react";

export const COLORS = {
  primary:      "#287999",
  primaryDark:  "#1a5f7a",
  primaryLight: "#e8f4f8",
  accent:       "#4CAF82",
  bg:           "#F4F7F4",
  white:        "#ffffff",
  border:       "#DDE5DD",
  text:         "#1a2e1a",
  textMuted:    "#6b7f6b",
  textLight:    "#9aab9a",
  error:        "#e05252",
  warning:      "#f0a500",
  success:      "#4CAF82",
  cardShadow:   "0 2px 16px rgba(40,121,153,0.08)",
};

export const steps = [
  { id: 1, label: "Informações Gerais"      },
  { id: 2, label: "Detalhes do Projeto"     },
  { id: 3, label: "Processo Seletivo"       },
  { id: 4, label: "Requisitos e Benefícios" },
  { id: 5, label: "Revisão"                 },
];

export interface Tip {
  icon: ReactNode;
  title: string;
  desc: string;
}

export const tipLabelsByStep: Record<number, { title: string; desc: string }[]> = {
  1: [
    { title: "Seja claro e objetivo",  desc: "Escolha um título que descreva bem o projeto."       },
    { title: "Adicione uma imagem",    desc: "Projetos com banner recebem muito mais inscrições."  },
    { title: "Resumo impactante",      desc: "200 caracteres para convencer o estudante."          },
  ],
  2: [
    { title: "Descreva o impacto",     desc: "Explique como o estudante vai crescer no projeto."   },
    { title: "Datas realistas",        desc: "Defina prazos que caibam no calendário acadêmico."  },
    { title: "Informe a modalidade",   desc: "Presencial, remoto ou híbrido — seja direto."        },
  ],
  3: [
    { title: "Perguntas relevantes",   desc: "Faça perguntas que realmente ajudem na seleção."     },
    { title: "Documentos essenciais",  desc: "Peça apenas o que vai realmente usar."               },
    { title: "Prazo claro",            desc: "Defina um prazo de inscrição com antecedência."      },
  ],
  4: [
    { title: "Requisitos realistas",   desc: "Liste apenas o necessário para participar."          },
    { title: "Destaque os benefícios", desc: "Certificado e horas complementares atraem muito."    },
    { title: "Seja transparente",      desc: "Candidatos bem informados se engajam mais."          },
  ],
  5: [
    { title: "Revise tudo",            desc: "Confira cada informação antes de publicar."          },
    { title: "Preview do card",        desc: "Veja como seu projeto aparece no catálogo."         },
    { title: "Pronto para publicar!",  desc: "Seu projeto ficará visível para os estudantes."      },
  ],
};

export const areaOptions = [
  "Tecnologia", "Saúde", "Educação", "Meio Ambiente",
  "Cultura", "Esporte", "Direito", "Engenharia", "Comunicação",
];

export const subAreaMap: Record<string, string[]> = {
  Tecnologia:      ["Desenvolvimento de Software", "Inteligência Artificial", "Redes", "Segurança"],
  Saúde:           ["Medicina", "Enfermagem", "Nutrição", "Fisioterapia"],
  Educação:        ["Pedagogia", "EAD", "Inclusão", "Alfabetização"],
  "Meio Ambiente": ["Sustentabilidade", "Reciclagem", "Fauna e Flora", "Energia"],
  Cultura:         ["Arte", "Música", "Teatro", "Literatura"],
  Esporte:         ["Futebol", "Atletismo", "Natação", "Esportes Coletivos"],
  Direito:         ["Direito Civil", "Ambiental", "Trabalhista", "Digital"],
  Engenharia:      ["Civil", "Elétrica", "Mecânica", "Química"],
  Comunicação:     ["Jornalismo", "Publicidade", "Mídias Sociais", "Fotografia"],
};