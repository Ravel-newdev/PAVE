import React, { useState, useEffect } from "react";
import { IoNotificationsOutline } from "react-icons/io5";
import { FiSearch, FiChevronDown, FiMenu, FiX } from "react-icons/fi";
import logo from "../../assets/logo.png"; 
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

export default function Navbar() {
  const width = useWindowWidth();
  const isMobile = width < 768;
  
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeNav, setActiveNav] = useState("Inicio");
  
  const userName = "fulaninha";
  const navItems = ["Inicio", "Projetos", "Minhas Oportunidades"];

  return (
    <>
      <nav className="navbar">
        <div className="navbar-left">
          <a href="#" className="logo">
            {/* Imagem do logo renderizada aqui */}
            <img src={logo} alt="PAVE" className="logo-img" />
            <span className="logo-text">PAVE</span>
          </a>
          
          {!isMobile && (
            <div className="nav-links">
              {navItems.map((item) => (
                <a
                  key={item}
                  href="#"
                  className={`nav-link${activeNav === item ? " active" : ""}`}
                  onClick={(e) => { e.preventDefault(); setActiveNav(item); }}
                >
                  {item}
                </a>
              ))}
            </div>
          )}
        </div>

        <div className="navbar-right">
          {!isMobile && (
            <div className="search-bar">
              <FiSearch className="search-icon" />
              <input placeholder="Buscar projetos, áreas ou professores..." />
            </div>
          )}

          <div className="nav-actions">
            <button className="notif-btn" aria-label="Notificações">
              <IoNotificationsOutline size={22} color="rgba(255,255,255,0.8)" />
              <span className="notif-dot" />
            </button>
            
            {!isMobile && <div className="divider-v" />}
            
            {!isMobile && (
              <div className="user-profile">
                <div className="avatar">{userName.charAt(0)}</div>
                <div className="user-info">
                  <div className="user-name">Olá, {userName}!</div>
                  <div className="user-role">Estudante</div>
                </div>
                <FiChevronDown className="chevron" />
              </div>
            )}
          </div>

          {isMobile && (
            <button className="hamburger" onClick={() => setMenuOpen(!menuOpen)} aria-label="Menu">
              {menuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
            </button>
          )}
        </div>
      </nav>

      {/* Menu Mobile */}
      {isMobile && menuOpen && (
        <div className="mobile-menu">
          {navItems.map((item) => (
            <a
              key={item}
              href="#"
              className={`mobile-menu-link${activeNav === item ? " active" : ""}`}
              onClick={(e) => { 
                e.preventDefault(); 
                setActiveNav(item);
                setMenuOpen(false); 
              }}
            >
              {item}
            </a>
          ))}
        </div>
      )}
    </>
  );
}