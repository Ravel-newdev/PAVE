import { Link, useLocation, useNavigate } from "@tanstack/react-router";
import { Bell, Briefcase, Home, LogOut } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import "./ProfessorNavbar.css";

export function ProfessorNavbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();

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

        <button
          type="button"
          className="nav-link"
          style={{ background: "none", border: "none", cursor: "pointer" }}
          onClick={() => { logout(); void navigate({ to: "/login" }); }}
          aria-label="Sair"
        >
          <LogOut size={18} />
          <span>Sair</span>
        </button>
      </div>
    </nav>
  );
}