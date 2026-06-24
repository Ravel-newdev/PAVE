import Navbar from "../../layout/components/Navbar/Navbar";
import { User, Users, Briefcase, Bookmark, Leaf, School, Lightbulb, ArrowRight } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { projetos } from "../../../data/projetos";
import { useFavoritos } from "../../context/FavoritosContext";
import "./Home.css";

interface StatusTagProps {
  status: "ativa" | "pendente";
}

function StatusTag({ status }: StatusTagProps) {
  if (status === "ativa") {
    return (
      <span className="status-tag tag-ativa">
        <span style={{ color: "#27ae60", marginRight: "4px" }}>●</span> Vaga Ativa
      </span>
    );
  }
  return (
    <span className="status-tag tag-pendente">
      <span style={{ color: "#e67e22", marginRight: "4px" }}>●</span> Vaga Pendente
    </span>
  );
}

const HERO_CARDS = [
  {
    icon: <Leaf size={18} />,
    cls:  "fc-green",
    titulo: "Sustentabilidade na Comunidade",
    sub:    "Engenharia Ambiental · 15 vagas",
    badge:  "Extensão",
    badgeCls: "badge-ext",
    offset: false,
  },
  {
    icon: <School size={18} />,
    cls:  "fc-blue",
    titulo: "Apoio Escolar Transformador",
    sub:    "Pedagogia · 20 vagas",
    badge:  "Voluntariado",
    badgeCls: "badge-vol",
    offset: true,
  },
  {
    icon: <Lightbulb size={18} />,
    cls:  "fc-amber",
    titulo: "Inovação e Tecnologia Social",
    sub:    "Ciência da Computação · 10 vagas",
    badge:  "Bolsa",
    badgeCls: "badge-bol",
    offset: false,
  },
];

const vagasTotais = projetos.reduce((acc, p) => acc + (p.vagasTotal - p.vagasPreenchidas), 0);
const projetosAtivos = projetos.filter((p) => p.status === "ativa").length;
const areas = new Set(projetos.map((p) => p.area)).size;

export default function Home() {
  const { isSalvo, toggleSalvo } = useFavoritos();

  return (
    <div className="page-container">
      <Navbar />

      {/* ─── Hero ─── */}
      <section className="hero">
        <div className="hero-blob hero-blob-1" />
        <div className="hero-blob hero-blob-2" />
        <div className="hero-blob hero-blob-3" />

        <div className="hero-content">
          <div className="hero-pill">
            <span className="hero-pill-dot" />
            +200 projetos disponíveis
          </div>

          <h1 className="hero-title">
            Conecte-se a projetos<br />
            que <span className="highlight">transformam</span> vidas.
          </h1>

          <p className="hero-subtitle">
            Encontre oportunidades de extensão, voluntariado e bolsas
            e faça a diferença na sua comunidade.
          </p>

          <a href="/projetos/" className="btn-primary">
            Explorar projetos
            <ArrowRight size={17} />
          </a>

          <div className="hero-stats">
            <div className="hero-stat">
              <div className="hero-stat-num">{projetosAtivos}</div>
              <div className="hero-stat-lbl">Projetos ativos</div>
            </div>
            <div className="hero-stat-sep" />
            <div className="hero-stat">
              <div className="hero-stat-num">{vagasTotais}</div>
              <div className="hero-stat-lbl">Vagas abertas</div>
            </div>
            <div className="hero-stat-sep" />
            <div className="hero-stat">
              <div className="hero-stat-num">{areas}</div>
              <div className="hero-stat-lbl">Áreas de atuação</div>
            </div>
          </div>
        </div>

        <div className="hero-visual">
          {HERO_CARDS.map((c) => (
            <div key={c.titulo} className={`hero-float-card${c.offset ? " offset" : ""}`}>
              <div className={`hero-fc-icon ${c.cls}`}>{c.icon}</div>
              <div className="hero-fc-body">
                <div className="hero-fc-title">{c.titulo}</div>
                <div className="hero-fc-sub">{c.sub}</div>
              </div>
              <span className={`hero-fc-badge ${c.badgeCls}`}>{c.badge}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ─── Projetos em destaque ─── */}
      <section className="section">
        <div className="section-header">
          <h2 className="section-title">Projetos em destaque</h2>
          <Link to="/projetos" className="ver-todos">Ver todos ›</Link>
        </div>

        <div className="cards-grid">
          {projetos.slice(0, 3).map((p) => {
            const vagasDisp = p.vagasTotal - p.vagasPreenchidas;
            const salvo = isSalvo(p.id);

            return (
              <div key={p.id} className="project-card">
                <div className="card-header">
                  <div className="card-icon-wrap">
                    <div className={`card-icon ${p.iconClass}`}>
                      <Briefcase size={20} />
                    </div>
                    <div className="card-title-wrap">
                      <div className="card-title">{p.titulo}</div>
                      <div className="card-tags">
                        <StatusTag status={p.status} />
                        <span className={`badge ${p.badgeClass}`}>{p.badge}</span>
                      </div>
                    </div>
                  </div>

                  <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
                    <button
                      onClick={(e) => { e.preventDefault(); e.stopPropagation(); toggleSalvo(p.id); }}
                      style={{ background: "transparent", border: "none", cursor: "pointer", display: "flex", padding: 0 }}
                      aria-label={salvo ? "Remover dos salvos" : "Salvar projeto"}
                    >
                      <Bookmark size={20} className={salvo ? "fav-icon-filled" : "fav-icon-outline"} />
                    </button>

                    <Link to="/projetos/$id" params={{ id: String(p.id) }} className="arrow-btn" aria-label="Ver projeto">
                      →
                    </Link>
                  </div>
                </div>

                <p className="card-desc">{p.resumo}</p>

                <div className="card-footer">
                  <div className="card-meta">
                    <User size={16} className="meta-icon" style={{ marginRight: "4px" }} />
                    {p.professor.nome}
                  </div>
                  <div className="card-meta">
                    <Users size={16} className="meta-icon" style={{ marginRight: "4px" }} />
                    {vagasDisp} {vagasDisp === 1 ? "vaga" : "vagas"}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}