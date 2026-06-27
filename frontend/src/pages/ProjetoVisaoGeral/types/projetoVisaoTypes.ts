import type { ReactNode } from "react";

export type StatVariant = "blue" | "amber" | "green" | "red";

export type ProjetoVisao = {
  id: number;
  titulo: string;
  status: string;
  area: string;
  inscritos: number;
  vagas: string;
  prazo: string;
  descricao: string;
  objetivos: string[];
  palavrasChave: string[];
  resumoSelecao: {
    inscritos: number;
    avaliacao: number;
    aprovados: number;
    rejeitados: number;
  };
  cronograma: string[][];
  informacoes: {
    label: string;
    value: string;
    icon: ReactNode;
  }[];
};
