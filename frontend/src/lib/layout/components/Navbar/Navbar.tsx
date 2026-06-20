import { useState, useEffect } from "react";
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
  { label: "Início",               to: "/",             icon: <Home size={16} />       },
  { label: "Projetos",             to: "/projetos/",    icon: <FolderOpen size={16} /> },
  { label: "Minhas Oportunidades", to: "/oportunidade", icon: <Bookmark size={16} />   },
];

export default function Navbar() {
  const width    = useWindowWidth();
  const isMobile = width < 768;

  const [menuOpen, setMenuOpen] = useState(false);
  const [query,    setQuery]    = useState("");

  const currentPath = typeof window !== "undefined" ? window.location.pathname : "/";
  const userName    = "Mariana";

  function buscar(fecharMenu = false) {
    const termo = query.trim();
    const url = termo ? `/projetos/?q=${encodeURIComponent(termo)}` : "/projetos/";
    window.location.href = url;
    if (fecharMenu) setMenuOpen(false);
  }

  return (
    <>
      <nav className="navbar">
        <div className="navbar-left">
          <a href="/" className="logo">
            <img src={logo} alt="PAVE" className="logo-img" />
            <span className="logo-text">PAVE</span>
          </a>

          {!isMobile && (
            <div className="nav-links">
              {navItems.map((item) => {
                const base = item.to.replace(/\/$/, "");
                const isActive =
                  item.to === "/"
                    ? currentPath === "/"
                    : currentPath.startsWith(base);
                return (
                  <a
                    key={item.label}
                    href={item.to}
                    className={`nav-link${isActive ? " active" : ""}`}
                  >
                    {item.icon}
                    {item.label}
                  </a>
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
            <a
              key={item.label}
              href={item.to}
              className="mobile-menu-link"
              onClick={() => setMenuOpen(false)}
            >
              {item.icon}
              {item.label}
            </a>
          ))}
        </div>
      )}
    </>
  );
}