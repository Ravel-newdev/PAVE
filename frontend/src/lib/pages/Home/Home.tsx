import Navbar from "@/components/Navbar/Navbar";
import heroImg from "@/assets/hero.png";
import "./Home.css";

function StatusTag({ status }: { status: string }) {
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

// Dados gerados para exemplo visual
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

export default function Home() {
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
          <button className="btn-primary">
            Explorar projetos
            <span className="btn-arrow">→</span>
          </button>
        </div>

        <div className="hero-illustration"> 
          <img src={heroImg} alt="Estudantes conectados a projetos" className="hero-img" />
        </div> 
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