import { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "@tanstack/react-router";
import { Bell, ChevronDown, Home, LogOut, Settings, User } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import logo from "../../../assets/pave-logo-detalhada-512.png";
import "./ProfessorNavbar.css";

export function ProfessorNavbar() {
  const { session, logout } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const location = useLocation();
  const currentPath = location.pathname;

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

  const navItems = [
    { label: "Início",     to: "/professor",        icon: <Home size={16} /> },
    { label: "Meu Perfil", to: "/professor/perfil",  icon: <User size={16} /> },
  ];

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <Link to="/professor" className="logo">
          <img src={logo} alt="PAVE" className="logo-img" />
          <span className="logo-text">PAVE</span>
        </Link>

        <div className="nav-links">
          {navItems.map((item) => {
            const isActive =
              item.to === "/professor"
                ? currentPath === "/professor" || currentPath === "/professor/"
                : currentPath === item.to || currentPath.startsWith(item.to + "/");
            return (
              <Link
                key={item.to}
                to={item.to}
                activeProps={{}}
                className={`nav-link${isActive ? " nav-link--ativo" : ""}`}
              >
                {item.icon}
                {item.label}
              </Link>
            );
          })}
        </div>
      </div>

      <div className="navbar-right">
        <div className="nav-actions">
          <button className="notif-btn" type="button" aria-label="Notificações">
            <Bell size={22} color="rgba(255,255,255,0.8)" />
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
      </div>
    </nav>
  );
}