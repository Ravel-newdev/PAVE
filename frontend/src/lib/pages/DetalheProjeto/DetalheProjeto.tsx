import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { User, Users, Clock, Calendar, ChevronRight } from "lucide-react";
import Navbar from "../../layout/components/Navbar/Navbar";
import {
  TabSobre,
  TabAtividades,
  TabRequisitos,
  TabBeneficios,
  TabProfessor,
} from "../../layout/components/DetalheProjeto/ProjectTabs";
import { Sidebar } from "../../layout/components/DetalheProjeto/Sidebar";
import type { Project } from "../../../data/projetos";
import { useInscricoes } from "../../context/InscricoesContext";
import "./DetalheProjeto.css";

type TabId = "sobre" | "atividades" | "requisitos" | "beneficios" | "professor";

const TABS: { id: TabId; label: string }[] = [
  { id: "sobre",      label: "Sobre o projeto" },
  { id: "atividades", label: "Atividades"       },
  { id: "requisitos", label: "Requisitos"       },
  { id: "beneficios", label: "Benefícios"       },
  { id: "professor",  label: "Professor"        },
];

const tagColor = (t: string) =>
  t === "Voluntariado" ? "dp-tag--vol"
  : t === "Extensão"   ? "dp-tag--ext"
  :                      "dp-tag--blue";

/*  Componente principal  */
interface DetalheProjetoProps {
  projeto: Project;
  onApply?: () => void;
}

export default function DetalheProjeto({ projeto, onApply }: DetalheProjetoProps) {
  const [tab, setTab] = useState<TabId>("sobre");
  
  const { inscrever, isInscrito } = useInscricoes();
  const applied = isInscrito(projeto.id); // Verifica se já está inscrito globalmente

  const vagasDisp = projeto.vagasTotal - projeto.vagasPreenchidas;

  function handleApply() {
    if (applied || vagasDisp === 0) return;
    
    inscrever(projeto.id); // Salva a inscrição no estado global
    onApply?.();
  }

  return (
    <div className="dp-root">
      <Navbar />

      <div className="dp-page">
        <nav className="dp-breadcrumb" aria-label="Breadcrumb">
          <Link to="/projetos">Projetos</Link>
          <ChevronRight className="dp-breadcrumb-icon" size={16} />
          <span className="dp-breadcrumb__current">{projeto.titulo}</span>
        </nav>

        {/*  Hero  */}
        <div className="dp-hero">
          {projeto.bannerUrl ? (
            <img src={projeto.bannerUrl} alt="" className="dp-hero__bg-img" />
          ) : (
            <div className="dp-hero__bg-gradient" />
          )}
          <div className="dp-hero__overlay" />
          <div className="dp-hero__content">
            <div className="dp-hero__tags">
              {projeto.tipo.map((t) => (
                <span key={t} className={`dp-tag ${tagColor(t)}`}>{t}</span>
              ))}
            </div>
            <h1 className="dp-hero__title">{projeto.titulo}</h1>
            <p className="dp-hero__desc">{projeto.resumo}</p>

            <div className="dp-hero__meta">
              {[
                { icon: <User size={20} />,     main: projeto.professor.nome,        sub: projeto.professor.departamento },
                { icon: <Users size={20} />,    main: `${projeto.vagasTotal} vagas`, sub: `${projeto.vagasPreenchidas} preenchidas` },
                { icon: <Clock size={20} />,    main: projeto.cargaHoraria,          sub: "Carga horária" },
                { icon: <Calendar size={20} />, main: projeto.periodo,               sub: "Duração" },
              ].map((m, i) => (
                <div key={i} className="dp-meta-item">
                  <span className="dp-meta-item__icon">{m.icon}</span>
                  <div>
                    <div className="dp-meta-item__main">{m.main}</div>
                    <div className="dp-meta-item__sub">{m.sub}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="dp-body">
          <main className="dp-main">
            <div className="dp-card">
              {/* Navegação das abas */}
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

              {/* Conteúdo da aba ativa */}
              <div className="dp-tab-body">
                {tab === "sobre"      && <TabSobre      projeto={projeto} />}
                {tab === "atividades" && <TabAtividades projeto={projeto} />}
                {tab === "requisitos" && <TabRequisitos projeto={projeto} />}
                {tab === "beneficios" && <TabBeneficios projeto={projeto} />}
                {tab === "professor"  && (
                  <TabProfessor
                    projeto={projeto}
                    onViewProfile={() => setTab("professor")}
                  />
                )}
              </div>
            </div>
          </main>

          <aside className="dp-aside">
            <Sidebar
              projeto={projeto}
              applied={applied}
              onApply={handleApply}
              onViewProfessor={() => setTab("professor")}
            />
          </aside>
        </div>
      </div>

      <div className="dp-mobile-cta">
        <div className="dp-mobile-cta__info">
          <div className="dp-mobile-cta__vagas">
            {vagasDisp > 0 ? `${vagasDisp} vagas disponíveis` : "Vagas esgotadas"}
          </div>
          <div className="dp-mobile-cta__sub">de {projeto.vagasTotal} no total</div>
        </div>
        <button
          type="button"
          className={`dp-mobile-cta__btn${applied ? " dp-mobile-cta__btn--applied" : ""}`}
          disabled={applied || vagasDisp === 0}
          onClick={handleApply}
        >
          {applied ? "Inscrito!" : vagasDisp === 0 ? "Esgotado" : "Candidatar-se"}
        </button>
      </div>
    </div>
  );
}