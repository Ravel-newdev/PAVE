export type CandidateStatus = "inscritos" | "avaliacao" | "aprovados" | "rejeitados";


export type Candidate = {
  id: number;
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
  documents: string[];
  history: string[];
};