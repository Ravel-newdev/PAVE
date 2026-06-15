import { Link, useNavigate, useLocation } from "@tanstack/react-router";
import {
  Briefcase,
  Calendar,
  Download,
  Edit3,
  GraduationCap,
  Users,
} from "lucide-react";

import { initialCandidates } from "./data/candidates";
import type { Project } from "./types/project";
import { statusLabel } from "./utils/status";

type ProjectSummaryProps = {
  project: Project;
};

export function ProjectSummary({
  project,
}: ProjectSummaryProps) {
  const navigate = useNavigate();
  const location = useLocation();

  const isOverview = location.pathname === "/projeto-visao-geral";
  const isCandidates = location.pathname === "/kanban-candidatos";

  function handleEditProject() {
    navigate({ to: "/editar-projeto", search: { id: project.id } as never });
  }

  function handleExport() {
    const header = "nome,curso,ira,status";
    const rows = initialCandidates.map((candidate) =>
      [candidate.name, candidate.course, candidate.ira, statusLabel(candidate.status)].join(","),
    );
    const blob = new Blob([[header, ...rows].join("\n")], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "candidatos-apoio-ensino-matematica.csv";
    link.click();
    URL.revokeObjectURL(url);
  }

  function handleFinishSelection() {
    const confirmed = window.confirm("Deseja finalizar esta seleção?");
    if (confirmed) {
      alert("Seleção finalizada com sucesso. Integre aqui com PATCH /api/projetos/:id/status.");
    }
  }

  return (
    <section className="kc-project-section">
      <div className="kc-breadcrumb">
        <Link to="/projeto-visao-geral">Projetos</Link>
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
            <span>
              <GraduationCap size={17} /> {project.area}
            </span>
            <span>
              <Users size={17} /> {project.candidatesCount} inscritos
            </span>
            <span>
              <Briefcase size={17} /> {project.vacancies}
            </span>
            <span>
              <Calendar size={17} /> {project.deadline}
            </span>
          </div>

          <p className="kc-project-description">{project.description}</p>
        </div>

        <div className="kc-actions">
          <button className="kc-btn kc-btn-light" onClick={handleEditProject} type="button">
            <Edit3 size={18} /> Editar projeto
          </button>
          <button className="kc-btn kc-btn-light" onClick={handleExport} type="button">
            <Download size={18} /> Exportar
          </button>
          <button className="kc-btn kc-btn-danger" onClick={handleFinishSelection} type="button">
            Finalizar seleção
          </button>
        </div>
      </div>

      <div className="kc-tabs" role="tablist" aria-label="Abas do projeto">
        <Link
          to="/projeto-visao-geral"
          search={{ id: project.id } as never}
          className={`kc-tab ${isOverview ? "active" : ""}`}
        >
          Visão geral
        </Link>

        <Link
          to="/kanban-candidatos"
          search={{ processoId: project.id } as never}
          className={`kc-tab ${isCandidates ? "active" : ""}`}
        >
          Candidatos
        </Link>
      </div>
    </section>
  );
}