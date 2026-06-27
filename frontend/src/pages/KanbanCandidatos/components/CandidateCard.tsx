import type { Candidate } from "../types/candidate";

type CandidateCardProps = {
  candidate: Candidate;
  isSelected: boolean;
  onClick: (candidate: Candidate) => void;
  onDragStart: (candidateId: number) => void;
};

export function CandidateCard({ candidate, isSelected, onClick, onDragStart }: CandidateCardProps) {
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

