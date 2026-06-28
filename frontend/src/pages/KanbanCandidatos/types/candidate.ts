import type { DotColor } from "./project";

export type CandidateStatus = "inscritos" | "avaliacao" | "aprovados" | "rejeitados";

export type Candidate = {
  id: string;
  name: string;
  course: string;
  shortCourse: string;
  ira: string;
  status: CandidateStatus;
  date: string;
  avatar: string;
  type: "Bolsista" | "Voluntário";
  registeredAt: string;
  motivation: string;
  availability: string;
  experience: string;
  documents: { label: string; tipo: string; arquivo_url?: string; valor_texto?: string }[];
  history: string[];
};

export type Column = {
  id: CandidateStatus;
  title: string;
  dot: DotColor;
};