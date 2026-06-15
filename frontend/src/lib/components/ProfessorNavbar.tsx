import { Bell, Briefcase, Home } from "lucide-react";
import "./navbar.css";

type ProfessorNavbarProps = {
  active?: "inicio" | "projetos";
};

export function ProfessorNavbar({ active = "projetos" }: ProfessorNavbarProps) {
  return (
    <nav className="navbar">
      <div className="navbar-left">
        <a className="logo" href="/">
          <img className="logo-img" src="/logo.png" alt="PAVE" />
        </a>

        <div className="nav-links">
          <a className={`nav-link ${active === "inicio" ? "active" : ""}`} href="/">
            <Home size={18} />
            <span>Início</span>
          </a>

          <a
            className={`nav-link ${active === "projetos" ? "active" : ""}`}
            href="/projeto-visao-geral"
          >
            <Briefcase size={18} />
            <span>Projetos</span>
          </a>
        </div>
      </div>

      <div className="navbar-right">
        <button className="notif-btn" type="button" aria-label="Notificações">
          <Bell size={20} color="#fff" />
          <span className="notif-badge">3</span>
        </button>

        <div className="user-profile">
          <img
            className="avatar-img"
            src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=80&q=80"
            alt="Prof. Carlos"
          />
          <div className="user-info">
            <div className="user-name">Prof. Carlos</div>
          </div>
        </div>
      </div>
    </nav>
  );
}
