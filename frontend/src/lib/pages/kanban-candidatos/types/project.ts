export type Project = {
  id: number;
  title: string;
  area: string;
  candidatesCount: number;
  vacancies: string;
  deadline: string;
  description: string;
};

export type ActiveTab = "overview" | "candidates";
export type DrawerTab = "inscricao" | "respostas" | "documentos" | "historico";
export type DotColor = "blue" | "amber" | "green" | "red";