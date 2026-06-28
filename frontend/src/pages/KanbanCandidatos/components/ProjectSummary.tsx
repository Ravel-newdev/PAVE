import { Link, useNavigate, useLocation } from "@tanstack/react-router";
import {
  Briefcase,
  Calendar,
  Edit3,
  GraduationCap,
} from "lucide-react";

import type { Project } from "../types/project";

type ProjectSummaryProps = {
  project: Project;
};

export function ProjectSummary({ project }: ProjectSummaryProps) {
  const navigate = useNavigate();
  const location = useLocation();

  const isOverview = location.pathname === "/professor/projeto-visao-geral";
  const isCandidates = location.pathname === "/professor/kanban-candidatos";

  function handleEditProject() {
    navigate({ to: "/professor/editar-projeto", search: { id: project.id } as never });
  }

  return (
    <section className="kc-project-section">
      <div className="kc-breadcrumb">
        <Link to="/professor/projeto-visao-geral">Projetos</Link>
        <span>›</span>
        <span>{project.title}</span>
      </div>

      <div className="kc-project-topline">
        <div>
          <h1>
            {project.title}
            <span className="kc-status-pill">Ativo</span>
          </h1>

          <div className="kc-meta-row">
            {project.centro_dep && (
              <span>
                <GraduationCap size={17} /> {project.centro_dep}
              </span>
            )}
            {project.n_vagas != null && (
              <span>
                <Briefcase size={17} /> {project.n_vagas} vagas
              </span>
            )}
            {project.data_termino && (
              <span>
                <Calendar size={17} /> Até {project.data_termino}
              </span>
            )}
          </div>

          {project.descricao && (
            <p className="kc-project-description">{project.descricao}</p>
          )}
        </div>

        <div className="kc-actions">
          <button className="kc-btn kc-btn-light" onClick={handleEditProject} type="button">
            <Edit3 size={18} /> Editar projeto
          </button>
        </div>
      </div>

      <div className="kc-tabs" role="tablist" aria-label="Abas do projeto">
        <Link
          to="/professor/projeto-visao-geral"
          search={{ id: project.id } as never}
          className={`kc-tab ${isOverview ? "active" : ""}`}
        >
          Visão geral
        </Link>

        <Link
          to="/professor/kanban-candidatos"
          search={{ processoId: project.id } as never}
          className={`kc-tab ${isCandidates ? "active" : ""}`}
        >
          Candidatos
        </Link>
      </div>
    </section>
  );
}
