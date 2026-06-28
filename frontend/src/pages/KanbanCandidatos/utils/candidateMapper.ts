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
  const status = normalizeStatus(data.status ?? data.etapa ?? data.situacao);

  // Backend retorna inscricao_id (listarCandidatos) ou id (outros endpoints)
  const inscricaoId = String(data.inscricao_id ?? data.id ?? index + 1);

  // Backend retorna candidato_nome (listarCandidatos)
  const name = readString(data, ["candidato_nome", "nome", "name", "discenteNome", "nomeDiscente"], `Candidato ${index + 1}`);
  const course = readString(data, ["curso", "course"], "Curso não informado");

  const dataInscricao = readString(data, ["data_inscricao", "dataInscricao", "criadoEm", "createdAt"], "");
  const dateLabel = dataInscricao
    ? `Inscrito em ${new Date(dataInscricao).toLocaleDateString("pt-BR")}`
    : status === "inscritos" ? "Inscrito recentemente" : cardDateLabel(status);

  return {
    id: inscricaoId,
    name,
    course,
    shortCourse: course,
    ira: readString(data, ["ira"], "Não informado"),
    status,
    date: dateLabel,
    avatar: readString(data, ["foto_url", "avatar", "foto", "photoUrl"], ""),
    type: "Voluntário",
    registeredAt: dataInscricao
      ? new Date(dataInscricao).toLocaleString("pt-BR")
      : "Data não informada",
    motivation: readString(data, ["motivacao", "motivation", "resumo"], "Não informada."),
    availability: readString(data, ["disponibilidade", "availability"], "Não informada."),
    experience: readString(data, ["experiencia", "experience"], "Não informada."),
    documents: Array.isArray(data.documentos) ? data.documentos.map(String) : [],
    history: Array.isArray(data.historico)
      ? data.historico.map(String)
      : ["Inscrição recebida", `Status atual: ${statusLabel(status)}`],
  };
}