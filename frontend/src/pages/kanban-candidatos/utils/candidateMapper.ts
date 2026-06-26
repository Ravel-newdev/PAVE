import type { Candidate } from "../types/candidate";
import { normalizeStatus, statusLabel, cardDateLabel } from "./status";

export function readString(data: Record<string, unknown>, keys: string[], fallback = "") {
  for (const key of keys) {
    const value = data[key];
    if (typeof value === "string" || typeof value === "number") return String(value);
  }
  return fallback;
}

export function mapCandidate(raw: unknown, index: number): Candidate {
  const data = (raw && typeof raw === "object" ? raw : {}) as Record<string, unknown>;
  const discente = typeof data.discente === "object" && data.discente ? (data.discente as Record<string, unknown>) : {};
  const usuario = typeof data.usuario === "object" && data.usuario ? (data.usuario as Record<string, unknown>) : {};
  const status = normalizeStatus(data.status ?? data.etapa ?? data.situacao);
  const name = readString(data, ["nome", "name", "discenteNome", "nomeDiscente"], readString(discente, ["nome", "name"], readString(usuario, ["nome", "name"], `Candidato ${index + 1}`)));
  const course = readString(data, ["curso", "course"], readString(discente, ["curso", "course"], "Curso não informado"));
  const inscricaoId = data.id ?? data.inscricaoId ?? data.id_inscricao ?? index + 1;

  return {
    id: Number(inscricaoId),
    name,
    course,
    shortCourse: course,
    ira: readString(data, ["ira"], "Não informado"),
    status,
    date: readString(data, ["data", "date", "criadoEm", "createdAt"], status === "inscritos" ? "Inscrito recentemente" : cardDateLabel(status)),
    avatar: readString(data, ["avatar", "foto", "photoUrl"], `https://i.pravatar.cc/120?img=${(index % 50) + 1}`),
    type: readString(data, ["tipo", "tipoVaga", "vaga"], "Voluntário") === "Bolsista" ? "Bolsista" : "Voluntário",
    registeredAt: readString(data, ["registeredAt", "dataInscricao", "criadoEm", "createdAt"], "Data não informada"),
    motivation: readString(data, ["motivacao", "motivation", "resumo"], "Resposta não informada."),
    availability: readString(data, ["disponibilidade", "availability"], "Não informada."),
    experience: readString(data, ["experiencia", "experience"], "Não informada."),
    documents: Array.isArray(data.documentos) ? data.documentos.map(String) : [],
    history: Array.isArray(data.historico)
      ? data.historico.map(String)
      : ["Inscrição recebida", `Status atual: ${statusLabel(status)}`],
  };
}