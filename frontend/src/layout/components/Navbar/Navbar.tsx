import { useState, useEffect, useRef } from "react";
import {
  Home, FolderOpen, Bookmark,
  Bell, ChevronDown, Menu, X, Search,
  Settings, LogOut,
} from "lucide-react";
import { Link, useNavigate } from "@tanstack/react-router";
import logo from "../../../assets/pave-logo-detalhada-512.png";
import { useAuth } from "@/context/AuthContext";
import { paveApi } from "@/services/PaveApiService";
import "./Navbar.css";

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

function deriveNome(email: string): string {
  const local = email.split("@")[0] ?? email;
  return local
    .replace(/[._-]/g, " ")
    .split(" ")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

const navItems = [
  { label: "Início",               to: "/",             icon: <Home size={16} />       },
  { label: "Projetos",             to: "/projetos",     icon: <FolderOpen size={16} /> },
  { label: "Minhas Oportunidades", to: "/aluno/oportunidades", icon: <Bookmark size={16} />   },
];

export default function Navbar() {
  const width    = useWindowWidth();
  const isMobile = width < 768;

  const { session, logout } = useAuth();
  const navigate = useNavigate();

  const [menuOpen,     setMenuOpen]     = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [query,        setQuery]        = useState("");
  const [naoLidas,     setNaoLidas]     = useState(0);
  const [fotoUrl,      setFotoUrl]      = useState<string | null>(null);

  const dropdownRef = useRef<HTMLDivElement>(null);

  const currentPath = typeof window !== "undefined" ? window.location.pathname : "/";
  const nome        = session ? deriveNome(session.email) : "";
  const inicial     = nome.charAt(0).toUpperCase();

  useEffect(() => {
    if (!session) return;
    paveApi.listarNotificacoes()
      .then((ns) => setNaoLidas(ns.filter((n) => !n.lida).length))
      .catch(() => {});
    if (session.tipo === "discente") {
      paveApi.obterPerfilDiscente()
        .then((p) => setFotoUrl(p.foto_url))
        .catch(() => {});
    }
  }, [session]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function buscar(fecharMenu = false) {
    const termo = query.trim();
    void navigate({ to: "/projetos", search: (prev) => ({ ...prev, ...(termo ? { q: termo } : {}) }) });
    if (fecharMenu) setMenuOpen(false);
  }

  return (
    <>
      <nav className="navbar">
        <div className="navbar-left">
          <Link to="/" className="logo">
            <img src={logo} alt="PAVE" className="logo-img" />
            <span className="logo-text">PAVE</span>
          </Link>

          {!isMobile && (
            <div className="nav-links">
              {navItems.map((item) => {
                const base = item.to.replace(/\/$/, "");
                const isActive =
                  item.to === "/"
                    ? currentPath === "/"
                    : currentPath.startsWith(base);
                return (
                  <Link
                    key={item.label}
                    to={item.to}
                    className={`nav-link${isActive ? " active" : ""}`}
                  >
                    {item.icon}
                    {item.label}
                  </Link>
                );
              })}
            </div>
          )}
        </div>

        <div className="navbar-right">
          {!isMobile && (
            <div className="search-bar">
              <Search
                size={16}
                className="search-icon"
                style={{ cursor: "pointer", flexShrink: 0 }}
                onClick={() => buscar()}
              />
              <input
                placeholder="Buscar projetos, áreas ou professores..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && buscar()}
              />
            </div>
          )}

          <div className="nav-actions">
            <Link to="/aluno/notificacoes" className="notif-btn" aria-label="Notificações">
              <Bell size={22} color="rgba(255,255,255,0.8)" />
              {naoLidas > 0 && (
                <>
                  <span className="notif-dot" />
                  <span className="notif-badge">{naoLidas > 99 ? "99+" : naoLidas}</span>
                </>
              )}
            </Link>

            {!isMobile && <div className="divider-v" />}

            {!isMobile && (
              <div className="user-profile-wrap" ref={dropdownRef}>
                <button
                  className="user-profile"
                  onClick={() => setDropdownOpen((v) => !v)}
                  aria-expanded={dropdownOpen}
                  aria-haspopup="true"
                >
                  <div className="avatar">
                    {fotoUrl
                      ? <img src={fotoUrl} alt={nome} className="w-full h-full object-cover rounded-full" />
                      : inicial}
                  </div>
                  <div className="user-info">
                    <div className="user-name">Olá, {nome}</div>
                  </div>
                  <ChevronDown
                    size={16}
                    className={`chevron${dropdownOpen ? " chevron--open" : ""}`}
                  />
                </button>

                {dropdownOpen && (
                  <div className="user-dropdown">
                    <Link
                      to="/aluno/perfil"
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
            )}
          </div>

          {isMobile && (
            <button
              className="hamburger"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Menu"
            >
              {menuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          )}
        </div>
      </nav>

      {isMobile && menuOpen && (
        <div className="mobile-menu">
          <div className="mobile-search">
            <Search size={15} className="search-icon" />
            <input
              placeholder="Buscar projetos..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && buscar(true)}
            />
          </div>
          {navItems.map((item) => (
            <Link
              key={item.label}
              to={item.to}
              className="mobile-menu-link"
              onClick={() => setMenuOpen(false)}
            >
              {item.icon}
              {item.label}
            </Link>
          ))}
          <Link to="/aluno/notificacoes" className="mobile-menu-link" onClick={() => setMenuOpen(false)}>
            <Bell size={16} />
            Notificações {naoLidas > 0 && `(${naoLidas})`}
          </Link>
          <button className="mobile-menu-link mobile-logout" onClick={() => { setMenuOpen(false); logout(); }}>
            <LogOut size={16} />
            Sair
          </button>
        </div>
      )}
    </>
  );
}
