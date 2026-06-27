import { useState, useMemo, useEffect } from "react";
import type { DragEvent } from "react";
import { paveApi } from "../services/PaveApiService";
import { initialCandidates } from "../pages/KanbanCandidatos/data/candidates";
import { columns } from "../pages/KanbanCandidatos/data/columns";
import { cardDateLabel, transitionHistoryLabel, normalizeStatus } from "../pages/KanbanCandidatos/utils/status";
import { mapCandidate } from "../pages/KanbanCandidatos/utils/candidateMapper";
import type { Candidate, CandidateStatus } from "../pages/KanbanCandidatos/types/candidate";
import type { AvaliarInscricaoPayload } from "../types/processo";

function toBackendStatus(status: CandidateStatus): AvaliarInscricaoPayload["novo_status"] {
  const map: Record<CandidateStatus, AvaliarInscricaoPayload["novo_status"]> = {
    inscritos:  "em_analise",
    avaliacao:  "em_analise",
    aprovados:  "aprovado",
    rejeitados: "reprovado",
  };
  return map[status];
}

function toKanbanIndex(status: CandidateStatus): number {
  const map: Record<CandidateStatus, number> = {
    inscritos:  1,
    avaliacao:  2,
    aprovados:  3,
    rejeitados: 4,
  };
  return map[status];
}

export function useCandidates(processoId: string, query: string) {
  const [candidates, setCandidates] = useState<Candidate[]>(initialCandidates);
  const [loadingCandidates, setLoadingCandidates] = useState(false);
  const [draggedCandidateId, setDraggedCandidateId] = useState<number | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function loadCandidates(): Promise<void> {
      try {
        setLoadingCandidates(true);
        const list = await paveApi.listarCandidatos(processoId);
        if (!cancelled && list.length > 0) setCandidates(list.map(mapCandidate));
      } catch (error) {
        console.warn("Não foi possível buscar candidatos. Exibindo dados de exemplo.", error);
      } finally {
        if (!cancelled) setLoadingCandidates(false);
      }
    }

    loadCandidates();
    return () => { cancelled = true; };
  }, [processoId]);

  const filteredCandidates = useMemo(() => {
    const term = query.trim().toLowerCase();
    if (!term) return candidates;
    return candidates.filter(
      (c) =>
        c.name.toLowerCase().includes(term) ||
        c.course.toLowerCase().includes(term) ||
        normalizeStatus(c.status).toLowerCase().includes(term)
    );
  }, [candidates, query]);

  const candidatesByStatus = useMemo<Record<CandidateStatus, Candidate[]>>(() => {
    return columns.reduce(
      (acc, column) => {
        acc[column.id] = filteredCandidates.filter((c) => c.status === column.id);
        return acc;
      },
      { inscritos: [], avaliacao: [], aprovados: [], rejeitados: [] } as Record<CandidateStatus, Candidate[]>
    );
  }, [filteredCandidates]);

  function moveCandidate(candidateId: number, nextStatus: CandidateStatus): void {
    setCandidates((current) =>
      current.map((candidate) => {
        if (candidate.id !== candidateId || candidate.status === nextStatus) return candidate;
        return {
          ...candidate,
          status: nextStatus,
          date: cardDateLabel(nextStatus),
          history: [...candidate.history, transitionHistoryLabel(nextStatus)],
        };
      })
    );

    const payload: AvaliarInscricaoPayload = {
      novo_status: toBackendStatus(nextStatus),
      coluna_kanban: toKanbanIndex(nextStatus),
    };

    paveApi.avaliarInscricao(String(candidateId), payload).catch((error) => {
      console.error("Erro ao persistir movimentação do candidato:", error);
    });
  }

  function startDragging(candidateId: number): void {
    setDraggedCandidateId(candidateId);
  }

  function handleDrop(event: DragEvent<HTMLDivElement>, nextStatus: CandidateStatus): void {
    event.preventDefault();
    const idFromTransfer = Number(event.dataTransfer.getData("text/plain"));
    const candidateId = draggedCandidateId ?? idFromTransfer;
    if (!candidateId) return;
    moveCandidate(candidateId, nextStatus);
    setDraggedCandidateId(null);
  }

  return { candidates, loadingCandidates, candidatesByStatus, moveCandidate, startDragging, handleDrop };
}
