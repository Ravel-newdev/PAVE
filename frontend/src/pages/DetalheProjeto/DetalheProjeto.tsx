import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { User, Clock, Calendar, ChevronRight } from "lucide-react";
import Navbar from "../../layout/components/Navbar/Navbar";
import { TabSobre, TabRequisitos, TabProfessor } from "../../layout/components/DetalheProjeto/ProjectTabs";
import { Sidebar } from "../../layout/components/DetalheProjeto/Sidebar";
import type { Projeto } from "../../types/projeto";
import "./DetalheProjeto.css";

type TabId = "sobre" | "requisitos" | "professor";

const TABS: { id: TabId; label: string }[] = [
  { id: "sobre",      label: "Sobre o projeto" },
  { id: "requisitos", label: "Requisitos"       },
  { id: "professor",  label: "Professor"        },
];

const tagColor = (nome: string) =>
  nome === "Voluntariado" ? "dp-tag--vol"
  : nome === "Extensão"   ? "dp-tag--ext"
  :                         "dp-tag--blue";

interface DetalheProjetoProps {
  projeto: Projeto;
}

export default function DetalheProjeto({ projeto }: DetalheProjetoProps) {
  const [tab, setTab] = useState<TabId>("sobre");

  return (
    <div className="dp-root">
      <Navbar />

      <div className="dp-page">
        <nav className="dp-breadcrumb" aria-label="Breadcrumb">
          <Link to="/projetos">Projetos</Link>
          <ChevronRight className="dp-breadcrumb-icon" size={16} />
          <span className="dp-breadcrumb__current">{projeto.titulo}</span>
        </nav>

        <div className="dp-hero">
          <div className="dp-hero__bg-gradient" />
          <div className="dp-hero__overlay" />
          <div className="dp-hero__content">
            <div className="dp-hero__tags">
              {projeto.tags.map((t) => (
                <span key={t.id} className={`dp-tag ${tagColor(t.nome)}`}>{t.nome}</span>
              ))}
            </div>
            <h1 className="dp-hero__title">{projeto.titulo}</h1>
            <p className="dp-hero__desc">{projeto.descricao ?? ""}</p>

            <div className="dp-hero__meta">
              {[
                { icon: <User size={20} />,     main: projeto.autor_nome,  sub: projeto.centro_dep ?? "Universidade" },
                projeto.carga_hora
                  ? { icon: <Clock size={20} />,    main: `${projeto.carga_hora}h/sem`, sub: "Carga horária" }
                  : null,
                projeto.data_inic
                  ? { icon: <Calendar size={20} />, main: new Date(projeto.data_inic).toLocaleDateString("pt-BR"), sub: "Início" }
                  : null,
              ]
                .filter(Boolean)
                .map((m, i) => (
                  <div key={i} className="dp-meta-item">
                    <span className="dp-meta-item__icon">{m!.icon}</span>
                    <div>
                      <div className="dp-meta-item__main">{m!.main}</div>
                      <div className="dp-meta-item__sub">{m!.sub}</div>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>

        <div className="dp-body">
          <main className="dp-main">
            <div className="dp-card">
              <div className="dp-tabs" role="tablist">
                {TABS.map((t) => (
                  <button
                    key={t.id}
                    type="button"
                    role="tab"
                    aria-selected={tab === t.id}
                    className={`dp-tab${tab === t.id ? " dp-tab--active" : ""}`}
                    onClick={() => setTab(t.id)}
                  >
                    {t.label}
                  </button>
                ))}
              </div>

              <div className="dp-tab-body">
                {tab === "sobre"      && <TabSobre      projeto={projeto} />}
                {tab === "requisitos" && <TabRequisitos projeto={projeto} />}
                {tab === "professor"  && <TabProfessor  projeto={projeto} />}
              </div>
            </div>
          </main>

          <aside className="dp-aside">
            <Sidebar projeto={projeto} />
          </aside>
        </div>
      </div>
    </div>
  );
}
