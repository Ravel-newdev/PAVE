import React, { useState } from "react";
import { FaBars } from "react-icons/fa6";

function Navbar(){

    const[isOpen, setIsOpen] = useState(false);
    const toggleMenu = () => {
        setIsOpen(!isOpen);
    };
    return (
        <>
        <header>
            <div className="container">
            <nav>
                <div className="logo">
                    <h2>PAVE</h2>

                </div>
                <ul className={isOpen ? "nav-link active" : "nav-link"}>
                    <li>
                        <a href="/inicio" className="active">Início</a>
                    </li>
                    <li>
                        <a href="/projetos">Projetos</a>
                    </li>
                    <li>
                        <a href="/oportunidades">Minhas oportunidades</a>
                    </li>
                    <li>
                        <a href="/Notificacoes">Notificações</a>
                    </li>
                </ul>
                <div className="icon" onClick={toggleMenu}>
                <FaBars />
                </div>
            </nav>

        </div>;
        </header>
        <section>
            <div className="container">
                <div className="content">
                    <h2>Responsive Navbar</h2>
                </div>
            </div>
        </section>
        
        </>
    );
        
    
}

export default Navbar;