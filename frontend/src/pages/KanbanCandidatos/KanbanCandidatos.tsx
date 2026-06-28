import { useState, useEffect } from "react";
import type { DragEvent } from "react";
import { Search } from "lucide-react";
import { ProfessorNavbar } from "@/layout/components/professor/ProfessorNavbar";
import "./KanbanCandidatos.css";
import { useSearch } from "@tanstack/react-router";

import type { Candidate } from "./types/candidate";
import type { Project } from "./types/project";
import { useCandidates } from "@/hooks/useCandidates";
import { ProjectSummary } from "./components/ProjectSummary";
import { CandidateCard } from "./components/CandidateCard";
import { CandidateDrawer } from "./components/CandidateDrawer";
import { paveApi } from "@/services/PaveApiService";
import { ApiError } from "@/errors/ApiError";

import { columns } from "./data/columns";

export default function KanbanCandidatos() {
  const [query, setQuery] = useState<string>("");
  const { processoId = "" } = useSearch({ strict: false }) as { processoId?: string };
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null);
  const [project, setProject] = useState<Project | null>(null);

  const {
    candidatesByStatus,
    loadingCandidates,
    moveCandidate,
    startDragging,
    handleDrop,
  } = useCandidates(processoId, query);

  useEffect(() => {
    if (!processoId) return;
    async function carregarProjeto() {
      try {
        const processo = await paveApi.buscarProcesso(processoId);
        const projeto = await paveApi.buscarProjeto(processo.projeto_id);
        setProject({
          id: processo.id,
          title: projeto.titulo,
          descricao: projeto.descricao ?? null,
          n_vagas: processo.n_vagas ?? null,
          data_termino: processo.data_termino ?? null,
          centro_dep: projeto.centro_dep ?? null,
        });
      } catch (e) {
        if (e instanceof ApiError) console.error(e.message);
      }
    }
    carregarProjeto();
  }, [processoId]);

  function handleDragOver(event: DragEvent<HTMLDivElement>) {
    event.preventDefault();
  }

  return (
    <div className={`kc-page ${selectedCandidate ? "drawer-open" : ""}`}>
      <ProfessorNavbar />

      <main className="kc-main">
        {project && <ProjectSummary project={project} />}

          <section className="kc-candidates-section">
            {loadingCandidates && <p className="kc-loading-message">Carregando candidatos do backend...</p>}
            <label className="kc-search">
              <Search size={20} />
              <input
                type="text"
                placeholder="Buscar candidato..."
                value={query}
                onChange={(event) => setQuery(event.target.value)}
              />
            </label>

            <div className="kc-kanban">
              {columns.map((column) => (
                <div
                  className="kc-column"
                  key={column.id}
                  onDragOver={handleDragOver}
                  onDrop={(event) => handleDrop(event, column.id)}
                >
                  <div className="kc-column-header">
                    <div>
                      <span className={`kc-dot ${column.dot}`} />
                      <h3>{column.title}</h3>
                    </div>
                    <strong>{candidatesByStatus[column.id].length}</strong>
                  </div>

                  <div className="kc-column-list">
                    {candidatesByStatus[column.id].map((candidate) => (
                      <CandidateCard
                        candidate={candidate}
                        key={candidate.id}
                        isSelected={selectedCandidate?.id === candidate.id}
                        onClick={setSelectedCandidate}
                        onDragStart={startDragging}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>
      </main>

      <CandidateDrawer
        candidate={selectedCandidate}
        onClose={() => setSelectedCandidate(null)}
        onMove={moveCandidate}
      />
    </div>
  );
}
