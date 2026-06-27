import { Link } from "@tanstack/react-router";
import { Bookmark, ChevronRight } from "lucide-react";
import { CARD_ICONS } from "./CardIcons";
import { paveApi } from "@/services/PaveApiService";
import { useState } from "react";
import type { Projeto } from "@/types/projeto";

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

interface Props {
  projeto: Projeto;
  index: number;
  favoritado?: boolean;
}

export function ProjetoCard({ projeto, index, favoritado = false }: Props) {
  const [salvo, setSalvo] = useState(favoritado);

  const primeiraTag = projeto.tags[0]?.nome ?? "Extensão";
  const badgeClass  = BADGE_CLASS[primeiraTag] ?? "badge-extensao";
  const vagasClass  = VAGAS_CLASS[primeiraTag] ?? "vagas-extensao";

  async function handleToggleFavorito(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    try {
      await paveApi.toggleFavorito(projeto.id);
      setSalvo((v) => !v);
    } catch (err) {
      console.error("Erro ao alternar favorito:", err);
    }
  }

  return (
    <article className="cat-card">
      <div className="cat-card-icon">
        {CARD_ICONS[index % CARD_ICONS.length]}
      </div>

      <div className="cat-card-top">
        <span className={`cat-badge ${badgeClass}`}>{primeiraTag}</span>

        <button
          className={`cat-bookmark${salvo ? " cat-bookmark--salvo" : ""}`}
          aria-label={salvo ? "Remover dos favoritos" : "Favoritar projeto"}
          title={salvo ? "Remover dos favoritos" : "Favoritar projeto"}
          onClick={handleToggleFavorito}
        >
          <Bookmark size={16} className={salvo ? "fav-icon-filled" : "fav-icon-outline"} />
        </button>
      </div>

      <h3 className="cat-card-title">{projeto.titulo}</h3>
      <p className="cat-card-desc">{projeto.descricao ?? ""}</p>

      <div className="cat-card-meta">
        <div className="cat-professor">
          <div className="cat-professor-avatar">
            {projeto.autor_nome.charAt(0)}
          </div>
          <div>
            <div className="cat-professor-nome">{projeto.autor_nome}</div>
            <div className="cat-professor-dept">{projeto.centro_dep ?? "—"}</div>
          </div>
        </div>

        <span className={`cat-vagas ${vagasClass}`}>
          {projeto.n_vagas != null
            ? `${projeto.n_vagas} ${projeto.n_vagas === 1 ? "vaga" : "vagas"}`
            : "Sem vagas informadas"}
        </span>
      </div>

      <Link
        to="/projetos/$id"
        params={{ id: projeto.id }}
        className="cat-card-btn"
      >
        Ver detalhes
        <ChevronRight size={16} />
      </Link>
    </article>
  );
}
