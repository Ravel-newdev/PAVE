import type { ProfileFormData } from "@/types/perfilAluno";

type BackendPerfil = {
  nome: string;
  email: string;
  curso: string | null;
  foto_url: string | null;
  curriculo_url: string | null;
  bio: string | null;
  semestre: number | null;
  disponibilidade: string | null;
  interesses: string[] | null;
};

const disponibilidadeToForm: Record<string, ProfileFormData["availability"]> = {
  manha:    "morning",
  tarde:    "afternoon",
  noite:    "night",
  integral: "fulltime",
};

const formToDisponibilidade: Record<string, string> = {
  morning:   "manha",
  afternoon: "tarde",
  night:     "noite",
  fulltime:  "integral",
};

export function backendToForm(perfil: BackendPerfil): ProfileFormData {
  const partes = (perfil.nome ?? "").split(" ");
  return {
    firstName:       partes[0] ?? "",
    lastName:        partes.slice(1).join(" "),
    email:           perfil.email ?? "",
    avatar:          perfil.foto_url ?? "",
    course:          perfil.curso ?? "",
    semester:        perfil.semestre ? String(perfil.semestre) : "",
    about:           perfil.bio ?? "",
    interests:       perfil.interesses ?? [],
    curriculo_url:   perfil.curriculo_url ?? "",
    availability:    disponibilidadeToForm[perfil.disponibilidade ?? ""] ?? undefined,
    remote:          false,
    notifications:   true,
    currentPassword: "",
    newPassword:     "",
    confirmPassword: "",
  };
}

export function formToBackend(data: ProfileFormData): Record<string, unknown> {
  return {
    nome:            `${data.firstName} ${data.lastName}`.trim(),
    bio:             data.about || null,
    curso:           data.course || null,
    semestre:        data.semester ? Number(data.semester) : null,
    disponibilidade: data.availability ? formToDisponibilidade[data.availability] ?? null : null,
    interesses:      data.interests,
  };
}
