import {
  Briefcase,
  Building2,
  Calendar,
  Timer,
  Users,
} from "lucide-react";

import type { ProjetoVisao } from "../types/projetoVisaoTypes";

export const projeto: ProjetoVisao = {
  id: 1,
  titulo: "Apoio ao Ensino de Matemática",
  status: "Ativo",
  area: "Educação",
  inscritos: 18,
  vagas: "12/20 vagas",
  prazo: "Inscrições até 30/06/2025",
  descricao:
    "O projeto tem como objetivo apoiar o processo de ensino e aprendizagem em Matemática por meio de monitorias, oficinas e materiais didáticos, contribuindo para a melhoria do desempenho acadêmico dos estudantes.",
  objetivos: [
    "Apoiar estudantes com dificuldades em conteúdos de Matemática.",
    "Promover monitorias semanais presenciais.",
    "Desenvolver materiais didáticos complementares.",
    "Estimular o aprendizado colaborativo entre os estudantes.",
  ],
  palavrasChave: ["matemática", "ensino", "monitoria", "aprendizagem", "educação"],
  resumoSelecao: {
    inscritos: 24,
    avaliacao: 12,
    aprovados: 2,
    rejeitados: 4,
  },
  cronograma: [
    ["Início das inscrições", "15/06/2025"],
    ["Fim das inscrições", "30/06/2025"],
    ["Período de avaliação", "01/07/2025 a 04/07/2025"],
    ["Divulgação do resultado", "05/07/2025"],
    ["Início das atividades", "07/07/2025"],
  ],
  informacoes: [
    { label: "Área temática", value: "Educação", icon: <Building2 size={22} /> },
    { label: "Coordenador", value: "Prof. Carlos Almeida", icon: <Users size={22} /> },
    { label: "Unidade responsável", value: "Instituto de Matemática", icon: <Calendar size={22} /> },
    { label: "Vagas", value: "12 bolsas + 8 voluntárias", icon: <Briefcase size={22} /> },
    { label: "Carga horária", value: "12h semanais", icon: <Timer size={22} /> },
  ],
};
