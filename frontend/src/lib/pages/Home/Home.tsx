import Navbar from "../../layout/components/Navbar/Navbar";
import heroImg from "../../../assets/hero.png";
import { User, Users, Briefcase, Bookmark } from "lucide-react";
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

export default function Home() {
  const { isSalvo, toggleSalvo } = useFavoritos();

  return (
    <div className="page-container">
      <Navbar />

      <section className="hero">
        <div className="hero-content">
          <h1 className="hero-title">
            Conecte-se a projetos<br />
            que <span className="highlight">transformam</span> vidas.
          </h1>
          <p className="hero-subtitle">
            Encontre oportunidades de extensão, voluntariado e bolsas e faça a diferença na comunidade.
          </p>
          
          <Link to="/projetos" className="btn-primary">
            Explorar projetos
            <span className="btn-arrow">→</span>
          </Link>
        </div>

        <div className="hero-illustration">
          <img src={heroImg} alt="Estudantes conectados a projetos" className="hero-img" />
        </div>
      </section>

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
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        toggleSalvo(p.id);
                      }}
                      style={{ background: "transparent", border: "none", cursor: "pointer", display: "flex", padding: 0 }}
                      aria-label={salvo ? "Remover dos salvos" : "Salvar projeto"}
                      title={salvo ? "Remover dos salvos" : "Salvar projeto"}
                    >
                      <Bookmark 
                        size={20} 
                        className={salvo ? "fav-icon-filled" : "fav-icon-outline"} 
                      />
                    </button>

                    <Link
                      to="/projetos/$id"
                      params={{ id: String(p.id) }}
                      className="arrow-btn"
                      aria-label="Ver projeto"
                    >
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