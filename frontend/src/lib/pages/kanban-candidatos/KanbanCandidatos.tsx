import { useState } from "react";
import type { ChangeEvent, DragEvent } from "react";
import {
  Briefcase,
  Calendar,
  Search,
  X,
} from "lucide-react";
import { ProfessorNavbar } from "@/lib/layout/componente-professor/ProfessorNavbar";
import "./KanbanCandidatos.css";
import { getIdFromUrl } from "../../services/paveApi";

import type { Candidate, CandidateStatus } from "./types/candidate";
import { statusLabel } from "./utils/status";
import type { DrawerTab } from "./types/project";
import { useCandidates } from "@/lib/hooks/useCandidates";
import { ProjectSummary } from "./ProjectSummary";

import { columns } from "./data/columns";
import { project } from "./data/project";


function Header() {
  return <ProfessorNavbar active="projetos" />;
}

type CandidateCardProps = {
  candidate: Candidate;
  isSelected: boolean;
  onClick: (candidate: Candidate) => void;
  onDragStart: (candidateId: number) => void;
};

function CandidateCard({ candidate, isSelected, onClick, onDragStart }: CandidateCardProps) {
  return (
    <button
      className={`kc-candidate-card ${isSelected ? "selected" : ""}`}
      onClick={() => onClick(candidate)}
      draggable
      onDragStart={() => onDragStart(candidate.id)}
      type="button"
    >
      <img src={candidate.avatar} alt={`Foto de ${candidate.name}`} />
      <div>
        <strong>{candidate.name}</strong>
        <span>{candidate.shortCourse}</span>
        <small>{candidate.date}</small>
      </div>
    </button>
  );
}

type CandidateDrawerProps = {
  candidate: Candidate | null;
  onClose: () => void;
  onMove: (candidateId: number, nextStatus: CandidateStatus) => void;
};

function CandidateDrawer({ candidate, onClose, onMove }: CandidateDrawerProps) {
  const [activeDrawerTab, setActiveDrawerTab] = useState<DrawerTab>("inscricao");

  if (!candidate) return null;

  function handleStatusChange(event: ChangeEvent<HTMLSelectElement>) {
    onMove(candidate.id, event.target.value as CandidateStatus);
  }

  return (
    <aside className="kc-drawer" aria-label="Detalhes do candidato">
      <button className="kc-drawer-close" onClick={onClose} aria-label="Fechar detalhes" type="button">
        <X size={24} />
      </button>

      <div className="kc-drawer-profile">
        <img src={candidate.avatar} alt={`Foto de ${candidate.name}`} />
        <div>
          <h2>{candidate.name}</h2>
          <p>{candidate.course}</p>
          <select value={candidate.status} onChange={handleStatusChange}>
            {columns.map((column) => (
              <option value={column.id} key={column.id}>
                {statusLabel(column.id)}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="kc-drawer-tabs">
        <button
          className={activeDrawerTab === "inscricao" ? "active" : ""}
          onClick={() => setActiveDrawerTab("inscricao")}
          type="button"
        >
          Inscrição
        </button>
        <button
          className={activeDrawerTab === "respostas" ? "active" : ""}
          onClick={() => setActiveDrawerTab("respostas")}
          type="button"
        >
          Respostas
        </button>
        <button
          className={activeDrawerTab === "documentos" ? "active" : ""}
          onClick={() => setActiveDrawerTab("documentos")}
          type="button"
        >
          Documentos
        </button>
        <button
          className={activeDrawerTab === "historico" ? "active" : ""}
          onClick={() => setActiveDrawerTab("historico")}
          type="button"
        >
          Histórico
        </button>
      </div>

      {activeDrawerTab === "inscricao" && (
        <>
          <div className="kc-info-grid">
            <div>
              <Calendar size={16} />
              <span>Inscrição realizada em</span>
              <strong>{candidate.registeredAt}</strong>
            </div>
            <div>
              <Briefcase size={16} />
              <span>Tipo de vaga</span>
              <strong>{candidate.type}</strong>
            </div>
          </div>

          <section className="kc-summary-card">
            <h3>Resumo</h3>
            <h4>Motivação</h4>
            <p>{candidate.motivation}</p>
            <h4>Disponibilidade</h4>
            <p>{candidate.availability}</p>
            <button className="kc-link-button" onClick={() => setActiveDrawerTab("respostas")} type="button">
              Ver todas as respostas →
            </button>
          </section>
        </>
      )}

      {activeDrawerTab === "respostas" && (
        <section className="kc-summary-card">
          <h3>Respostas do formulário</h3>
          <h4>Motivação</h4>
          <p>{candidate.motivation}</p>
          <h4>Disponibilidade</h4>
          <p>{candidate.availability}</p>
          <h4>Experiência prévia</h4>
          <p>{candidate.experience}</p>
          <h4>IRA informado</h4>
          <p>{candidate.ira}</p>
        </section>
      )}

      {activeDrawerTab === "documentos" && (
        <section className="kc-summary-card">
          <h3>Documentos enviados</h3>
          <div className="kc-list-stack">
            {candidate.documents.map((document) => (
              <button className="kc-file-item" key={document} type="button">
                <Briefcase size={16} />
                {document}
              </button>
            ))}
          </div>
        </section>
      )}

      {activeDrawerTab === "historico" && (
        <section className="kc-summary-card">
          <h3>Histórico</h3>
          <div className="kc-list-stack">
            {candidate.history.map((item) => (
              <div className="kc-history-item" key={item}>
                <span />
                <p>{item}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      <div className="kc-drawer-actions">
        <button className="kc-btn kc-btn-light" onClick={() => onMove(candidate.id, "rejeitados")} type="button">
          Rejeitar
        </button>
        <button className="kc-btn kc-btn-warning" onClick={() => onMove(candidate.id, "avaliacao")} type="button">
          Mover para avaliação
        </button>
        <button className="kc-btn kc-btn-success" onClick={() => onMove(candidate.id, "aprovados")} type="button">
          Aprovar
        </button>
      </div>
    </aside>
  );
}

export default function KanbanCandidatos() {
  const [query, setQuery] = useState<string>("");
  const processoId = getIdFromUrl("1");
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null);

  const {
    candidatesByStatus,
    loadingCandidates,
    moveCandidate,
    startDragging,
    handleDrop,
  } = useCandidates(processoId, query)

  

  function handleDragOver(event: DragEvent<HTMLDivElement>) {
    event.preventDefault();
  }

  return (
    <div className={`kc-page ${selectedCandidate ? "drawer-open" : ""}`}>
      <Header />

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
