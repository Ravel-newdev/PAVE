import { useState } from "react";
import type { DragEvent } from "react";
import { Search } from "lucide-react";
import { useCandidates } from "../../../hooks/useCandidates";
import { CandidateCard } from "../../KanbanCandidatos/components/CandidateCard";
import { CandidateDrawer } from "../../KanbanCandidatos/components/CandidateDrawer";
import { columns } from "../../KanbanCandidatos/data/columns";
import type { Candidate } from "../../KanbanCandidatos/types/candidate";
import "../../KanbanCandidatos/KanbanCandidatos.css";

export function CandidatosTab({ processoId }: { processoId: string }) {
  const [query, setQuery] = useState("");
  const [selectedCandidateId, setSelectedCandidateId] = useState<string | null>(null);

  const { candidates, candidatesByStatus, loadingCandidates, moveCandidate, startDragging, handleDrop } =
    useCandidates(processoId, query);

  const selectedCandidate: Candidate | null = selectedCandidateId
    ? (candidates.find((c) => c.id === selectedCandidateId) ?? null)
    : null;

  function handleDragOver(event: DragEvent<HTMLDivElement>) {
    event.preventDefault();
  }

  return (
    <div className={`kc-candidates-wrapper ${selectedCandidate ? "drawer-open" : ""}`}>
      <section className="kc-candidates-section">
        {loadingCandidates && <p className="kc-loading-message">Carregando candidatos...</p>}

        <label className="kc-search">
          <Search size={20} />
          <input
            type="text"
            placeholder="Buscar candidato..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </label>

        <div className="kc-kanban">
          {columns.map((column) => (
            <div
              className="kc-column"
              key={column.id}
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, column.id)}
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
                    key={candidate.id}
                    candidate={candidate}
                    isSelected={selectedCandidate?.id === candidate.id}
                    onClick={(c) => setSelectedCandidateId(c.id)}
                    onDragStart={startDragging}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      <CandidateDrawer
        candidate={selectedCandidate}
        onClose={() => setSelectedCandidateId(null)}
        onMove={moveCandidate}
      />
    </div>
  );
}
