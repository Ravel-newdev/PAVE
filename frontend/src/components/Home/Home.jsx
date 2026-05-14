import React, { useState, useEffect } from "react";
import logo from "../../assets/logo.png";
import { IoNotificationsOutline } from "react-icons/io5";
import { CgProfile } from "react-icons/cg";
import { IoSearchOutline } from "react-icons/io5";
import mainImage from "../../assets/main.jpeg";
import heroImg from "../../assets/hero.png"
import "./Home.css";


function useWindowWidth() {
  const [width, setWidth] = useState(
    typeof window !== "undefined" ? window.innerWidth : 1024
  );
  useEffect(() => {
    const handler = () => setWidth(window.innerWidth);
    window.addEventListener("resize", handler);
    return () => window.removeEventListener("resize", handler);
  }, []);
  return width;
}

function StatusTag({ status }) {
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

 {/* dados abaixo são gerado por ia apenas para exemplo visual */}

const projects = [
  
  {
    id: 1,
    icon: "",  
    iconClass: "icon-green",
    title: "Educação Tecnológica",
    badge: "Bolsa de Extensão",
    badgeClass: "badge-active",
    status: "ativa",
    desc: "Capacitação de jovens de escolas públicas em lógica de programação e robótica.",
    professor: "Prof. Carlos Silva",
    vagas: 2,
  },
  {
    id: 2,
    icon: "",
    iconClass: "icon-blue",
    title: "Horta Comunitária",
    badge: "Trabalho Voluntário",
    badgeClass: "badge-volunteer",
    status: "pendente",
    desc: "Criação e manutenção de hortas orgânicas em comunidades carentes da região.",
    professor: "Profa. Ana Rita",
    vagas: 5,
  },
  {
    id: 3,
    icon: "",
    iconClass: "icon-orange",
    title: "Saúde na Praça",
    badge: "Bolsa de Extensão",
    badgeClass: "badge-active",
    status: "ativa",
    desc: "Ações de aferição de pressão e orientação nutricional aos fins de semana.",
    professor: "Prof. Marcos Lima",
    vagas: 1,
  },
];              
export default function PaveHome() {
  const width = useWindowWidth();
  const isMobile = width < 768;
  
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeNav, setActiveNav] = useState("Inicio");
  
  const userName = "fulaninha";
  const navItems = ["Inicio", "Projetos", "Minhas Oportunidades"];

  return (
    <div className="page-container">
      
      <nav className="navbar">
        <div className="navbar-left">
          <a href="#" className="logo">
            <span className="logo-icon"></span> {/* colocar nossa logo */}
            <span className="logo-text">PAVE</span>
          </a>
          
          {!isMobile && (
            <div className="nav-links">
              {navItems.map((item) => (
                <a
                  key={item}
                  href="#"
                  className={`nav-link${activeNav === item ? " active" : ""}`}
                  onClick={(e) => { e.preventDefault(); setActiveNav(item); }}
                >
                  {item}
                </a>
              ))}
            </div>
          )}
        </div>

        <div className="navbar-right">
          {!isMobile && (
            <div className="search-bar">
              <span className="search-icon">🔍</span>
              <input placeholder="Buscar projetos, áreas ou professores..." />
            </div>
          )}

          <div className="nav-actions">
            <button className="notif-btn" aria-label="Notificações">
              <IoNotificationsOutline size={22} color="rgba(255,255,255,0.8)" />
              <span className="notif-dot" />
            </button>
            
            {!isMobile && <div className="divider-v" />}
            
            {!isMobile && (
              <div className="user-profile">
                <div className="avatar">{userName.charAt(0)}</div>
                <div className="user-info">
                  <div className="user-name">Olá, {userName}!</div>
                  <div className="user-role">Estudante</div>
                </div>
                <span className="chevron">▾</span>
              </div>
            )}
          </div>

          {isMobile && (
            <button className="hamburger" onClick={() => setMenuOpen(!menuOpen)} aria-label="Menu">
              {menuOpen ? "✕" : "☰"}
            </button>
          )}
        </div>
      </nav>

      {isMobile && menuOpen && (
        <div className="mobile-menu">
          {navItems.map((item) => (
            <a
              key={item}
              href="#"
              className={`mobile-menu-link${activeNav === item ? " active" : ""}`}
              onClick={(e) => { 
                e.preventDefault(); 
                setActiveNav(item);
                setMenuOpen(false); 
              }}
            >
              {item}
            </a>
          ))}
        </div>
      )}

      <section className="hero">
        <div className="hero-content">
          
          {/* nao estou conseguindo ajustar a imagem de forma que fique legal */}
          <h1 className="hero-title">
            Conecte-se a projetos<br />
            que <span className="highlight">transformam</span> vidas.
          </h1>
          <p className="hero-subtitle">
            Encontre oportunidades de extensão, voluntariado e bolsas e faça a diferença na comunidade.
          </p>
          <button className="btn-primary">
            Explorar projetos
            <span className="btn-arrow">→</span>
          </button>
        </div>

        {!isMobile && (
          <div className="hero-illustration"> 
            <img src={heroImg} alt="Estudantes conectados a projetos" className="hero-img" />
          </div> 
        )}
      </section>

      <section className="section">
        <div className="section-header">
          <h2 className="section-title">Projetos em destaque</h2>
          <a href="#" className="ver-todos">Ver todos ›</a>
        </div>
        
        <div className="cards-grid">
          {projects.map((p) => (
            <div key={p.id} className="project-card">
              <div className="card-header">
                <div className="card-icon-wrap">
                  <div className={`card-icon ${p.iconClass}`}>
                    <span>{p.icon}</span>
                  </div>
                  <div className="card-title-wrap">
                    <div className="card-title">{p.title}</div>
                    
                    <div className="card-tags">
                      <StatusTag status={p.status} />
                      <span className={`badge ${p.badgeClass}`}>{p.badge}</span>
                    </div>

                  </div>
                </div>
                <button className="arrow-btn" aria-label="Ver projeto">→</button>
              </div>
              <p className="card-desc">{p.desc}</p>
              <div className="card-footer">
                <div className="card-meta">
                  <span className="meta-icon">👤</span>
                  {p.professor}
                </div>
                <div className="card-meta">
                  <span className="meta-icon">👥</span>
                  {p.vagas} {p.vagas === 1 ? "vaga" : "vagas"}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
}