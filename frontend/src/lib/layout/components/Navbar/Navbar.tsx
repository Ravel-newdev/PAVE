import { useState, useEffect } from "react";
import { Link, useRouterState, useNavigate } from "@tanstack/react-router";
import {
  Home, FolderOpen, Bookmark, 
  Bell, Mail, ChevronDown, Menu, X, Search,
} from "lucide-react";
import logo from "../../../../assets/pave-logo-detalhada-512.png"; 
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

const navItems = [
  { label: "Início",               to: "/",              icon: <Home size={16} />       },
  { label: "Projetos",             to: "/projetos",      icon: <FolderOpen size={16} /> },
  { label: "Minhas Oportunidades", to: "/oportunidade", icon: <Bookmark size={16} />   },
] as const;

export default function Navbar() {
  const width       = useWindowWidth();
  const isMobile    = width < 768;
  const [menuOpen, setMenuOpen] = useState(false);
  const [query, setQuery] = useState("");
  const routerState = useRouterState();
  const navigate    = useNavigate();
  const currentPath = routerState.location.pathname;
  const userName    = "Mariana";

  function buscar() {
    const termo = query.trim();
    navigate({ to: "/projetos", search: termo ? { q: termo } : {} });
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
                const isActive =
                  item.to === "/"
                    ? currentPath === "/"
                    : currentPath.startsWith(item.to);
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
              <Search size={16} className="search-icon" onClick={buscar} style={{ cursor: "pointer" }} />
              <input
                placeholder="Buscar projetos, áreas ou professores..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && buscar()}
              />
            </div>
          )}
          <div className="nav-actions">
            <button className="notif-btn" aria-label="Mensagens">
              <Mail size={20} color="rgba(255,255,255,0.8)" />
            </button>
            <button className="notif-btn" aria-label="Notificações">
              <Bell size={22} color="rgba(255,255,255,0.8)" />
              <span className="notif-dot" />
              <span className="notif-badge">2</span>
            </button>
            {!isMobile && <div className="divider-v" />}
            {!isMobile && (
              <div className="user-profile">
                <div className="avatar">M</div>
                <div className="user-info">
                  <div className="user-name">Olá, {userName}</div>
                </div>
                <ChevronDown size={16} className="chevron" />
              </div>
            )}
          </div>
          {isMobile && (
            <button className="hamburger" onClick={() => setMenuOpen(!menuOpen)} aria-label="Menu">
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
              onKeyDown={(e) => {
                if (e.key === "Enter") { buscar(); setMenuOpen(false); }
              }}
            />
          </div>
          {navItems.map((item) => (
            <Link key={item.label} to={item.to} className="mobile-menu-link" onClick={() => setMenuOpen(false)}>
              {item.icon}
              {item.label}
            </Link>
          ))}
        </div>
      )}
    </>
  );
}