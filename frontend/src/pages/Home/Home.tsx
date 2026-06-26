import { useEffect, useState } from "react";
import { Briefcase, Users, ArrowRight, Bookmark } from "lucide-react";
import { Link } from "@tanstack/react-router";
import Navbar from "../../layout/components/Navbar/Navbar";
import { paveApi } from "../../services/PaveApiService";
import { ApiError } from "../../errors/ApiError";
import type { Projeto } from "../../types/projeto";
import "./Home.css";

export default function Home() {
  const [projetos, setProjetos] = useState<Projeto[]>([]);
  const [favoritos, setFavoritos] = useState<Set<string>>(new Set());
  const [erro, setErro] = useState<string | null>(null);

  useEffect(() => {
    paveApi.listarProjetos("ativo")
      .then(setProjetos)
      .catch((e) => setErro(e instanceof ApiError ? e.message : "Erro ao carregar projetos."));

    paveApi.listarFavoritos()
      .then((favs) => setFavoritos(new Set(favs.map((p) => p.id))))
      .catch(() => {});
  }, []);

  async function toggleFavorito(e: React.MouseEvent, id: string) {
    e.preventDefault();
    e.stopPropagation();
    try {
      await paveApi.toggleFavorito(id);
      setFavoritos((prev) => {
        const next = new Set(prev);
        next.has(id) ? next.delete(id) : next.add(id);
        return next;
      });
    } catch (err) {
      console.error("Erro ao alternar favorito:", err);
    }
  }

  const projetosAtivos = projetos.length;
  const totalVagas = projetos.reduce((acc, p) => acc + (p.n_vagas ?? 0), 0);
  const areas = new Set(projetos.map((p) => p.centro_dep).filter(Boolean)).size;

  return (
    <div className="page-container">
      <Navbar />

      <section className="hero">
        <div className="hero-blob hero-blob-1" />
        <div className="hero-blob hero-blob-2" />
        <div className="hero-blob hero-blob-3" />

        <div className="hero-content">
          <div className="hero-pill">
            <span className="hero-pill-dot" />
            {projetosAtivos} projetos disponíveis
          </div>

          <h1 className="hero-title">
            Conecte-se a projetos<br />
            que <span className="highlight">transformam</span> vidas.
          </h1>

          <p className="hero-subtitle">
            Encontre oportunidades de extensão, voluntariado e bolsas
            e faça a diferença na sua comunidade.
          </p>

          <Link to="/projetos" className="btn-primary">
            Explorar projetos
            <ArrowRight size={17} />
          </Link>

          <div className="hero-stats">
            <div className="hero-stat">
              <div className="hero-stat-num">{projetosAtivos}</div>
              <div className="hero-stat-lbl">Projetos ativos</div>
            </div>
            <div className="hero-stat-sep" />
            <div className="hero-stat">
              <div className="hero-stat-num">{totalVagas}</div>
              <div className="hero-stat-lbl">Vagas abertas</div>
            </div>
            <div className="hero-stat-sep" />
            <div className="hero-stat">
              <div className="hero-stat-num">{areas}</div>
              <div className="hero-stat-lbl">Áreas de atuação</div>
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="section-header">
          <h2 className="section-title">Projetos em destaque</h2>
          <Link to="/projetos" className="ver-todos">Ver todos ›</Link>
        </div>

        {erro && <p className="text-sm text-red-600 mb-4">{erro}</p>}

        <div className="cards-grid">
          {projetos.slice(0, 3).map((p) => (
            <div key={p.id} className="project-card">
              <div className="card-header">
                <div className="card-icon-wrap">
                  <div className="card-icon icon-green">
                    <Briefcase size={20} />
                  </div>
                  <div className="card-title-wrap">
                    <div className="card-title">{p.titulo}</div>
                    <div className="card-tags">
                      {p.tags.map((t) => (
                        <span key={t.id} className="badge badge-active">{t.nome}</span>
                      ))}
                    </div>
                  </div>
                </div>

                <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
                  <button
                    onClick={(e) => toggleFavorito(e, p.id)}
                    style={{ background: "transparent", border: "none", cursor: "pointer", display: "flex", padding: 0 }}
                    aria-label={favoritos.has(p.id) ? "Remover dos favoritos" : "Favoritar projeto"}
                  >
                    <Bookmark size={20} className={favoritos.has(p.id) ? "fav-icon-filled" : "fav-icon-outline"} />
                  </button>

                  <Link to="/projetos/$id" params={{ id: p.id }} className="arrow-btn" aria-label="Ver projeto">
                    →
                  </Link>
                </div>
              </div>

              <p className="card-desc">{p.descricao ?? ""}</p>

              <div className="card-footer">
                <div className="card-meta">
                  <Users size={16} className="meta-icon" style={{ marginRight: "4px" }} />
                  {p.autor_nome}
                </div>
                <div className="card-meta">
                  <Briefcase size={16} className="meta-icon" style={{ marginRight: "4px" }} />
                  {p.n_vagas ?? 0} {(p.n_vagas ?? 0) === 1 ? "vaga" : "vagas"}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
