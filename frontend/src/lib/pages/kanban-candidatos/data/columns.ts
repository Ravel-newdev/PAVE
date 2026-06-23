import type { Column } from "../types/candidate";

export const columns: Column[] = [
  { id: "inscritos", title: "Inscritos", dot: "blue" },
  { id: "avaliacao", title: "Em avaliação", dot: "amber" },
  { id: "aprovados", title: "Aprovados", dot: "green" },
  { id: "rejeitados", title: "Rejeitados", dot: "red" },
];