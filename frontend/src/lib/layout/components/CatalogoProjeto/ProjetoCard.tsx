import { Link } from "@tanstack/react-router";
import { Bookmark, ChevronRight } from "lucide-react";
import { CARD_ICONS } from "./CardIcons";
import { useFavoritos } from "../../../context/FavoritosContext";

const BADGE_CLASS: Record<string, string> = {
  "Extensão":     "badge-extensao",
  "Voluntariado": "badge-voluntariado",
  "Bolsa":        "badge-bolsa",
};

const VAGAS_CLASS: Record<string, string> = {
  "Extensão":     "vagas-extensao",
  "Voluntariado": "vagas-voluntariado",
  "Bolsa":        "vagas-bolsa",
};

export interface ProjetoCardData {
  id: number;
  titulo: string;
  resumo: string;
  badge: string;
  vagasTotal: number;
  vagasPreenchidas: number;
  professor: { nome: string; departamento: string };
}

interface ProjetoCardProps {
  projeto: ProjetoCardData;
  index: number;
}

export function ProjetoCard({ projeto, index }: ProjetoCardProps) {
  const { isSalvo, toggleSalvo } = useFavoritos();
  const salvo = isSalvo(projeto.id);

  const vagasDisp  = projeto.vagasTotal - projeto.vagasPreenchidas;
  const badgeClass = BADGE_CLASS[projeto.badge] ?? "badge-extensao";
  const vagasClass = VAGAS_CLASS[projeto.badge] ?? "vagas-extensao";

  return (
    <article className="cat-card">
      <div className="cat-card-icon">
        {CARD_ICONS[index % CARD_ICONS.length]}
      </div>

      <div className="cat-card-top">
        <span className={`cat-badge ${badgeClass}`}>{projeto.badge}</span>
        
        <button
          className={`cat-bookmark${salvo ? " cat-bookmark--salvo" : ""}`}
          aria-label={salvo ? "Remover dos salvos" : "Salvar projeto"}
          title={salvo ? "Remover dos salvos" : "Salvar projeto"}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            toggleSalvo(projeto.id);
          }}
        >
          <Bookmark 
            size={16} 
            className={salvo ? "fav-icon-filled" : "fav-icon-outline"} 
          />
        </button>
      </div>

      <h3 className="cat-card-title">{projeto.titulo}</h3>
      <p className="cat-card-desc">{projeto.resumo}</p>

      <div className="cat-card-meta">
        <div className="cat-professor">
          <div className="cat-professor-avatar">
            {projeto.professor.nome.charAt(0)}
          </div>
          <div>
            <div className="cat-professor-nome">{projeto.professor.nome}</div>
            <div className="cat-professor-dept">{projeto.professor.departamento}</div>
          </div>
        </div>

        <span className={`cat-vagas ${vagasClass}`}>
          {vagasDisp > 0 ? `${vagasDisp} vagas` : "Sem vagas"}
        </span>
      </div>

      <Link
        to="/projetos/$id"
        params={{ id: String(projeto.id) }}
        className="cat-card-btn"
      >
        Ver detalhes
        <ChevronRight size={16} />
      </Link>
    </article>
  );
}