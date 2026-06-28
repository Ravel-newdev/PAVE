import type { Candidate } from "../types/candidate";

type CandidateCardProps = {
  candidate: Candidate;
  isSelected: boolean;
  onClick: (candidate: Candidate) => void;
  onDragStart: (candidateId: string) => void;
};

export function CandidateCard({ candidate, isSelected, onClick, onDragStart }: CandidateCardProps) {
  return (
    <button
      className={`kc-candidate-card ${isSelected ? "selected" : ""}`}
      onClick={() => onClick(candidate)}
      draggable
      onDragStart={(e) => { e.dataTransfer.setData("text/plain", candidate.id); onDragStart(candidate.id); }}
      type="button"
    >
      {candidate.avatar
        ? <img src={candidate.avatar} alt={`Foto de ${candidate.name}`} />
        : <span className="kc-avatar-initials">{candidate.name.charAt(0).toUpperCase()}</span>
      }
      <div>
        <strong>{candidate.name}</strong>
        <span>{candidate.shortCourse}</span>
        <small>{candidate.date}</small>
      </div>
    </button>
  );
}

