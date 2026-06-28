import { Link, useNavigate, useLocation } from "@tanstack/react-router";
import { Briefcase, Calendar, Edit3, GraduationCap } from "lucide-react";
import "../../ProjetoVisaoGeral/ProjetoVisaoGeral.css";
import type { Project } from "../types/project";

type ProjectSummaryProps = {
  project: Project;
};

export function ProjectSummary({ project }: ProjectSummaryProps) {
  const navigate = useNavigate();
  const location = useLocation();

  const isOverview = location.pathname === "/professor/projeto-visao-geral";
  const isCandidates = location.pathname === "/professor/kanban-candidatos";

  return (
    <div className="po-container" style={{ paddingBottom: 0 }}>
      <div className="po-breadcrumb">
        <Link to="/professor/projeto-visao-geral" search={{ id: project.projetoId } as never}>Projetos</Link>
        <span>›</span>
        <span>{project.title}</span>
      </div>

      <div className="po-project-header">
        <div>
          <div className="po-title-row">
            <h1>{project.title}</h1>
            <span className="po-status">Ativo</span>
          </div>

          <div className="po-meta-row">
            {project.centro_dep && (
              <span><GraduationCap size={17} /> {project.centro_dep}</span>
            )}
            {project.n_vagas != null && (
              <span><Briefcase size={17} /> {project.n_vagas} vagas</span>
            )}
            {project.data_termino && (
              <span><Calendar size={17} /> Até {project.data_termino}</span>
            )}
          </div>

          {project.descricao && (
            <p className="po-description">{project.descricao}</p>
          )}
        </div>

        <div className="po-actions">
          <button
            className="po-button po-button-secondary"
            onClick={() => navigate({ to: "/professor/editar-projeto", search: { id: project.projetoId } as never })}
            type="button"
          >
            <Edit3 size={18} /> Editar projeto
          </button>
        </div>
      </div>

      <div className="po-tabs">
        <Link
          to="/professor/projeto-visao-geral"
          search={{ id: project.projetoId } as never}
          className={`po-tab ${isOverview ? "po-tab-active" : ""}`}
        >
          Visão geral
        </Link>
        <Link
          to="/professor/kanban-candidatos"
          search={{ processoId: project.id } as never}
          className={`po-tab ${isCandidates ? "po-tab-active" : ""}`}
        >
          Candidatos
        </Link>
      </div>
    </div>
  );
}
