import { useState, useMemo, useEffect,  type DragEvent } from "react";

import { initialCandidates } from "../pages/kanban-candidatos/data/candidates";
import { paveApi } from "../services/paveApi";

import type {
  Candidate,
  CandidateStatus,
} from "../pages/kanban-candidatos/types/candidate";

import { columns } from "@/lib/pages/kanban-candidatos/data/columns";

import {
  backendStatus,
  cardDateLabel,
  transitionHistoryLabel,
} from "@/lib/pages/kanban-candidatos/utils/status";

import { mapCandidate } from "../pages/kanban-candidatos/utils/candidateMapper";

export function useCandidates(
  processoId: string,
  query: string
) {
  const [candidates, setCandidates] =
    useState<Candidate[]>(initialCandidates);

  const [loadingCandidates, setLoadingCandidates] =
    useState(false);

  const [draggedCandidateId, setDraggedCandidateId] = useState<number | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function loadCandidates() {
      try {
        setLoadingCandidates(true);

        const response =
          await paveApi.listarCandidatos(processoId);

        const list = Array.isArray(response)
          ? response
          : response &&
              typeof response === "object" &&
              Array.isArray(
                (response as { data?: unknown }).data
              )
          ? (response as { data: unknown[] }).data
          : [];

        if (!cancelled && list.length > 0) {
          setCandidates(list.map(mapCandidate));
        }
      } catch (error) {
        console.warn(
          "Não foi possível buscar candidatos.",
          error
        );
      } finally {
        if (!cancelled) {
          setLoadingCandidates(false);
        }
      }
    }

    loadCandidates();

    return () => {
      cancelled = true;
    };
  }, [processoId]);

  const filteredCandidates = useMemo(() => {
    const term = query.trim().toLowerCase();

    if (!term) return candidates;

    return candidates.filter(
      (candidate) =>
        candidate.name.toLowerCase().includes(term) ||
        candidate.course.toLowerCase().includes(term) ||
        candidate.status.toLowerCase().includes(term)
    );
  }, [candidates, query]);

  const candidatesByStatus = useMemo<
    Record<CandidateStatus, Candidate[]>
  >(() => {
    return columns.reduce(
      (acc, column) => {
        acc[column.id] = filteredCandidates.filter(
          (candidate) =>
            candidate.status === column.id
        );

        return acc;
      },
      {
        inscritos: [],
        avaliacao: [],
        aprovados: [],
        rejeitados: [],
      } as Record<CandidateStatus, Candidate[]>
    );
  }, [filteredCandidates]);

  function moveCandidate(
    candidateId: number,
    nextStatus: CandidateStatus
  ) {
    setCandidates((currentCandidates) =>
      currentCandidates.map((candidate) => {
        if (candidate.id !== candidateId) {
          return candidate;
        }

        if (candidate.status === nextStatus) {
          return candidate;
        }

        return {
          ...candidate,
          status: nextStatus,
          date: cardDateLabel(nextStatus),
          history: [
            ...candidate.history,
            transitionHistoryLabel(nextStatus),
          ],
        };
      })
    );

    paveApi
      .moverCandidato(
        processoId,
        candidateId,
        backendStatus(nextStatus)
      )
      .catch((error) => {
        console.error(
          "Erro ao atualizar status",
          error
        );
      });
    }

    function startDragging(candidateId: number) {
        setDraggedCandidateId(candidateId);
    }

    function handleDrop(event: DragEvent<HTMLDivElement>, nextStatus: CandidateStatus) {
    event.preventDefault();
    const idFromTransfer = Number(event.dataTransfer.getData("text/plain"));
    const candidateId = draggedCandidateId ?? idFromTransfer;

    if (!candidateId) return;

    moveCandidate(candidateId, nextStatus);
    setDraggedCandidateId(null);
  }

  return {
    loadingCandidates,
    candidates,
    handleDrop,
    startDragging,
    candidatesByStatus,
    moveCandidate,
  };
}