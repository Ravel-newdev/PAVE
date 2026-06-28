export type Project = {
  id: string;
  title: string;
  descricao: string | null;
  n_vagas: number | null;
  data_termino: string | null;
  centro_dep: string | null;
};

export type ActiveTab = "overview" | "candidates";
export type DrawerTab = "inscricao" | "respostas" | "documentos" | "historico";
export type DotColor = "blue" | "amber" | "green" | "red";
