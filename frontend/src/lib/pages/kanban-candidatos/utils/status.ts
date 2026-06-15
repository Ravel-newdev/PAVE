import type { CandidateStatus } from "../types/candidate";

export function normalizeStatus(raw: unknown): CandidateStatus {
  const value = String(raw ?? "").toLowerCase();

  if (value.includes("avali")) return "avaliacao";
  if (value.includes("aprov")) return "aprovados";
  if (value.includes("rejeit")) return "rejeitados";
  return "inscritos";
}

export function backendStatus(status: CandidateStatus) {
  const labels: Record<CandidateStatus, string> = {
    inscritos: "INSCRITO",
    avaliacao: "EM_AVALIACAO",
    aprovados: "APROVADO",
    rejeitados: "REJEITADO",
  };

  return labels[status];
}

export function statusLabel(status: CandidateStatus): string {
  const labels: Record<CandidateStatus, string> = {
    inscritos: "Inscrita",
    avaliacao: "Em avaliação",
    aprovados: "Aprovada",
    rejeitados: "Rejeitada",
  };

  return labels[status];
}

export function transitionHistoryLabel(nextStatus: CandidateStatus): string {
  const now = new Date().toLocaleString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  const labels: Record<CandidateStatus, string> = {
    inscritos: "Movida para Inscritos",
    avaliacao: "Movida para Em avaliação",
    aprovados: "Aprovada",
    rejeitados: "Rejeitada",
  };

  return `${labels[nextStatus]} em ${now}`;
}

export function cardDateLabel(nextStatus: CandidateStatus): string {
  const labels: Record<CandidateStatus, string> = {
    inscritos: "Movido agora",
    avaliacao: "Movido agora",
    aprovados: "Aprovado agora",
    rejeitados: "Rejeitado agora",
  };

  return labels[nextStatus];
}