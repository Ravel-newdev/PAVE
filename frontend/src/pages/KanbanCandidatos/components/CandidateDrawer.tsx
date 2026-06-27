import { useState } from "react";
import type { ChangeEvent } from "react";
import { Briefcase, Calendar, X } from "lucide-react";

import type { Candidate, CandidateStatus } from "../types/candidate";
import type { DrawerTab } from "../types/project";
import { columns } from "../data/columns";
import { statusLabel } from "../utils/status";

type CandidateDrawerProps = {
  candidate: Candidate | null;
  onClose: () => void;
  onMove: (candidateId: number, nextStatus: CandidateStatus) => void;
};

export function CandidateDrawer({ candidate, onClose, onMove }: CandidateDrawerProps) {
  const [activeDrawerTab, setActiveDrawerTab] = useState<DrawerTab>("inscricao");

  if (!candidate) return null;

  const currentCandidate = candidate;

  function handleStatusChange(event: ChangeEvent<HTMLSelectElement>) {
    onMove(currentCandidate.id, event.target.value as CandidateStatus);
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

