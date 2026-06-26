import { Link, useLocation } from "@tanstack/react-router";
import { Bell, Briefcase, Home } from "lucide-react";
import "./navbar.css";

export function ProfessorNavbar() {
  const location = useLocation();

  const isInicio = location.pathname === "/professor";
  
  const isProjetos =
    location.pathname.includes("/projeto-visao-geral") ||
    location.pathname.includes("/kanban-candidatos") ||
    location.pathname.includes("/projeto-form");

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <Link className="logo" to="/professor">
          <img className="logo-img" src="/logo.png" alt="PAVE" />
        </Link>

        <div className="nav-links">
          <Link
            to="/professor"
            className={`nav-link ${isInicio ? "active" : ""}`}
          >
            <Home size={18} />
            <span>Início</span>
          </Link>

          <Link
            to="/professor/projeto-visao-geral"
            className={`nav-link ${isProjetos ? "active" : ""}`}
          >
            <Briefcase size={18} />
            <span>Projetos</span>
          </Link>
        </div>
      </div>

      <div className="navbar-right">
        <button
          className="notif-btn"
          type="button"
          aria-label="Notificações"
        >
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