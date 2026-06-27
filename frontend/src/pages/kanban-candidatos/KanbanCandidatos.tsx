import { useState } from "react";
import type { DragEvent } from "react";
import { Search } from "lucide-react";
import { ProfessorNavbar } from "@/layout/componente-professor/ProfessorNavbar";
import "./KanbanCandidatos.css";
import { useSearch } from "@tanstack/react-router";

import type { Candidate } from "./types/candidate";
import { useCandidates } from "@/hooks/useCandidates";
import { ProjectSummary } from "./components/ProjectSummary";
import { CandidateCard } from "./components/CandidateCard";
import { CandidateDrawer } from "./components/CandidateDrawer";

import { columns } from "./data/columns";
import { project } from "./data/project";

export default function KanbanCandidatos() {
  const [query, setQuery] = useState<string>("");
  const { processoId = "" } = useSearch({ strict: false }) as { processoId?: string };
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null);

  const {
    candidatesByStatus,
    loadingCandidates,
    moveCandidate,
    startDragging,
    handleDrop,
  } = useCandidates(processoId, query);

  function handleDragOver(event: DragEvent<HTMLDivElement>) {
    event.preventDefault();
  }

  return (
    <div className={`kc-page ${selectedCandidate ? "drawer-open" : ""}`}>
      <ProfessorNavbar />

      <main className="kc-main">
        <ProjectSummary project={project}/>

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
