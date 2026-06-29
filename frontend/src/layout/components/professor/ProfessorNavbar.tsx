import { useEffect, useRef, useState } from "react";
import { Link } from "@tanstack/react-router";
import { Bell, ChevronDown, Home, LogOut, Settings, User } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import "./ProfessorNavbar.css";

export function ProfessorNavbar() {
  const { session, logout } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const nome = session?.nome ?? "";
  const inicial = nome.charAt(0).toUpperCase() || "P";

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

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
          <Link to="/professor/perfil" className="nav-link" activeProps={{ className: "nav-link active" }}>
            <User size={18} />
            <span>Meu Perfil</span>
          </Link>
        </div>
      </div>

      <div className="navbar-right">
        <button className="notif-btn" type="button" aria-label="Notificações">
          <Bell size={20} color="#fff" />
        </button>

        <div className="divider-v" />

        <div className="user-profile-wrap" ref={dropdownRef}>
          <button
            className="user-profile"
            type="button"
            onClick={() => setDropdownOpen((v) => !v)}
            aria-expanded={dropdownOpen}
            aria-haspopup="true"
          >
            <div className="avatar">{inicial}</div>
            <div className="user-info">
              <div className="user-name">Olá, {nome.split(" ")[0]}</div>
            </div>
            <ChevronDown size={16} className={`chevron${dropdownOpen ? " chevron--open" : ""}`} />
          </button>

          {dropdownOpen && (
            <div className="user-dropdown">
              <Link
                to="/professor/perfil"
                className="user-dropdown-item"
                onClick={() => setDropdownOpen(false)}
              >
                <Settings size={15} />
                Configurações
              </Link>
              <button
                className="user-dropdown-item user-dropdown-item--danger"
                onClick={() => { setDropdownOpen(false); logout(); }}
              >
                <LogOut size={15} />
                Sair
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
