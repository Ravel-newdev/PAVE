import { Link, useNavigate } from "@tanstack/react-router";
import { Bell, Home, LogOut } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import "./ProfessorNavbar.css";

export function ProfessorNavbar() {
  const navigate = useNavigate();
  const { logout } = useAuth();

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <Link className="logo" to="/professor">
          <img className="logo-img" src="/logo-pave.png" alt="PAVE" />
        </Link>

        <div className="nav-links">
          <Link to="/professor" className="nav-link" activeProps={{ className: "nav-link active" }}>
            <Home size={18} />
            <span>Início</span>
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
