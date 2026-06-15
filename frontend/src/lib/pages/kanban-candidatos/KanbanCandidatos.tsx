import { Link, useNavigate, useLocation } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import type { ChangeEvent, DragEvent } from "react";
import {
  Briefcase,
  Calendar,
  Download,
  Edit3,
  GraduationCap,
  Search,
  Users,
  X,
} from "lucide-react";
import { ProfessorNavbar } from "@/lib/layout/componente-professor/ProfessorNavbar";
import "./KanbanCandidatos.css";
import { getIdFromUrl, paveApi } from "../../services/paveApi";

import type { Candidate, CandidateStatus } from "./types/candidate";
import type { Project, DrawerTab, DotColor  } from "./types/project";
import { initialCandidates } from "./data/candidates";

type Column = {
  id: CandidateStatus;
  title: string;
  dot: DotColor;
};

const project: Project = {
  id: 1,
  title: "Apoio ao Ensino de Matemática",
  area: "Educação",
  candidatesCount: 18,
  vacancies: "12/20 vagas",
  deadline: "Inscrições até 30/06/2025",
  description:
    "O projeto tem como objetivo apoiar o processo de ensino e aprendizagem em Matemática por meio de monitorias, oficinas e materiais didáticos, contribuindo para a melhoria do desempenho acadêmico dos estudantes.",
};

const columns: Column[] = [
  { id: "inscritos", title: "Inscritos", dot: "blue" },
  { id: "avaliacao", title: "Em avaliação", dot: "amber" },
  { id: "aprovados", title: "Aprovados", dot: "green" },
  { id: "rejeitados", title: "Rejeitados", dot: "red" },
];


function normalizeStatus(raw: unknown): CandidateStatus {
  const value = String(raw ?? "").toLowerCase();

  if (value.includes("avali")) return "avaliacao";
  if (value.includes("aprov")) return "aprovados";
  if (value.includes("rejeit")) return "rejeitados";
  return "inscritos";
}

function backendStatus(status: CandidateStatus) {
  const labels: Record<CandidateStatus, string> = {
    inscritos: "INSCRITO",
    avaliacao: "EM_AVALIACAO",
    aprovados: "APROVADO",
    rejeitados: "REJEITADO",
  };

  return labels[status];
}

function readString(data: Record<string, unknown>, keys: string[], fallback = "") {
  for (const key of keys) {
    const value = data[key];
    if (typeof value === "string" || typeof value === "number") return String(value);
  }
  return fallback;
}

function mapCandidate(raw: unknown, index: number): Candidate {
  const data = (raw && typeof raw === "object" ? raw : {}) as Record<string, unknown>;
  const discente = typeof data.discente === "object" && data.discente ? (data.discente as Record<string, unknown>) : {};
  const usuario = typeof data.usuario === "object" && data.usuario ? (data.usuario as Record<string, unknown>) : {};
  const status = normalizeStatus(data.status ?? data.etapa ?? data.situacao);
  const name = readString(data, ["nome", "name", "discenteNome", "nomeDiscente"], readString(discente, ["nome", "name"], readString(usuario, ["nome", "name"], `Candidato ${index + 1}`)));
  const course = readString(data, ["curso", "course"], readString(discente, ["curso", "course"], "Curso não informado"));
  const inscricaoId = data.id ?? data.inscricaoId ?? data.id_inscricao ?? index + 1;

  return {
    id: Number(inscricaoId),
    name,
    course,
    shortCourse: course,
    ira: readString(data, ["ira"], "Não informado"),
    status,
    date: readString(data, ["data", "date", "criadoEm", "createdAt"], status === "inscritos" ? "Inscrito recentemente" : cardDateLabel(status)),
    avatar: readString(data, ["avatar", "foto", "photoUrl"], `https://i.pravatar.cc/120?img=${(index % 50) + 1}`),
    type: readString(data, ["tipo", "tipoVaga", "vaga"], "Voluntário") === "Bolsista" ? "Bolsista" : "Voluntário",
    registeredAt: readString(data, ["registeredAt", "dataInscricao", "criadoEm", "createdAt"], "Data não informada"),
    motivation: readString(data, ["motivacao", "motivation", "resumo"], "Resposta não informada."),
    availability: readString(data, ["disponibilidade", "availability"], "Não informada."),
    experience: readString(data, ["experiencia", "experience"], "Não informada."),
    documents: Array.isArray(data.documentos) ? data.documentos.map(String) : [],
    history: Array.isArray(data.historico)
      ? data.historico.map(String)
      : ["Inscrição recebida", `Status atual: ${statusLabel(status)}`],
  };
}

function statusLabel(status: CandidateStatus): string {
  const labels: Record<CandidateStatus, string> = {
    inscritos: "Inscrita",
    avaliacao: "Em avaliação",
    aprovados: "Aprovada",
    rejeitados: "Rejeitada",
  };

  return labels[status];
}


function transitionHistoryLabel(nextStatus: CandidateStatus): string {
  const now = new Date().toLocaleString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  const labels: Record<CandidateStatus, string> = {
    inscritos: "Movida para Inscritos",
    avaliacao: "Movida para Em avaliação",
    aprovados: "Aprovada",
    rejeitados: "Rejeitada",
  };

  return `${labels[nextStatus]} em ${now}`;
}

function cardDateLabel(nextStatus: CandidateStatus): string {
  const labels: Record<CandidateStatus, string> = {
    inscritos: "Movido agora",
    avaliacao: "Movido agora",
    aprovados: "Aprovado agora",
    rejeitados: "Rejeitado agora",
  };

  return labels[nextStatus];
}

function Header() {
  return <ProfessorNavbar active="projetos" />;
}

type ProjectSummaryProps = {};

function ProjectSummary() {
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

type CandidateCardProps = {
  candidate: Candidate;
  isSelected: boolean;
  onClick: (candidate: Candidate) => void;
  onDragStart: (candidateId: number) => void;
};

function CandidateCard({ candidate, isSelected, onClick, onDragStart }: CandidateCardProps) {
  return (
    <button
      className={`kc-candidate-card ${isSelected ? "selected" : ""}`}
      onClick={() => onClick(candidate)}
      draggable
      onDragStart={() => onDragStart(candidate.id)}
      type="button"
    >
      <img src={candidate.avatar} alt={`Foto de ${candidate.name}`} />
      <div>
        <strong>{candidate.name}</strong>
        <span>{candidate.shortCourse}</span>
        <small>{candidate.date}</small>
      </div>
    </button>
  );
}

type CandidateDrawerProps = {
  candidate: Candidate | null;
  onClose: () => void;
  onMove: (candidateId: number, nextStatus: CandidateStatus) => void;
};

function CandidateDrawer({ candidate, onClose, onMove }: CandidateDrawerProps) {
  const [activeDrawerTab, setActiveDrawerTab] = useState<DrawerTab>("inscricao");

  if (!candidate) return null;

  function handleStatusChange(event: ChangeEvent<HTMLSelectElement>) {
    onMove(candidate.id, event.target.value as CandidateStatus);
  }

  return (
    <aside className="kc-drawer" aria-label="Detalhes do candidato">
      <button className="kc-drawer-close" onClick={onClose} aria-label="Fechar detalhes" type="button">
        <X size={24} />
      </button>

      <div className="kc-drawer-profile">
        <img src={candidate.avatar} alt={`Foto de ${candidate.name}`} />
        <div>
          <h2>{candidate.name}</h2>
          <p>{candidate.course}</p>
          <select value={candidate.status} onChange={handleStatusChange}>
            {columns.map((column) => (
              <option value={column.id} key={column.id}>
                {statusLabel(column.id)}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="kc-drawer-tabs">
        <button
          className={activeDrawerTab === "inscricao" ? "active" : ""}
          onClick={() => setActiveDrawerTab("inscricao")}
          type="button"
        >
          Inscrição
        </button>
        <button
          className={activeDrawerTab === "respostas" ? "active" : ""}
          onClick={() => setActiveDrawerTab("respostas")}
          type="button"
        >
          Respostas
        </button>
        <button
          className={activeDrawerTab === "documentos" ? "active" : ""}
          onClick={() => setActiveDrawerTab("documentos")}
          type="button"
        >
          Documentos
        </button>
        <button
          className={activeDrawerTab === "historico" ? "active" : ""}
          onClick={() => setActiveDrawerTab("historico")}
          type="button"
        >
          Histórico
        </button>
      </div>

      {activeDrawerTab === "inscricao" && (
        <>
          <div className="kc-info-grid">
            <div>
              <Calendar size={16} />
              <span>Inscrição realizada em</span>
              <strong>{candidate.registeredAt}</strong>
            </div>
            <div>
              <Briefcase size={16} />
              <span>Tipo de vaga</span>
              <strong>{candidate.type}</strong>
            </div>
          </div>

          <section className="kc-summary-card">
            <h3>Resumo</h3>
            <h4>Motivação</h4>
            <p>{candidate.motivation}</p>
            <h4>Disponibilidade</h4>
            <p>{candidate.availability}</p>
            <button className="kc-link-button" onClick={() => setActiveDrawerTab("respostas")} type="button">
              Ver todas as respostas →
            </button>
          </section>
        </>
      )}

      {activeDrawerTab === "respostas" && (
        <section className="kc-summary-card">
          <h3>Respostas do formulário</h3>
          <h4>Motivação</h4>
          <p>{candidate.motivation}</p>
          <h4>Disponibilidade</h4>
          <p>{candidate.availability}</p>
          <h4>Experiência prévia</h4>
          <p>{candidate.experience}</p>
          <h4>IRA informado</h4>
          <p>{candidate.ira}</p>
        </section>
      )}

      {activeDrawerTab === "documentos" && (
        <section className="kc-summary-card">
          <h3>Documentos enviados</h3>
          <div className="kc-list-stack">
            {candidate.documents.map((document) => (
              <button className="kc-file-item" key={document} type="button">
                <Briefcase size={16} />
                {document}
              </button>
            ))}
          </div>
        </section>
      )}

      {activeDrawerTab === "historico" && (
        <section className="kc-summary-card">
          <h3>Histórico</h3>
          <div className="kc-list-stack">
            {candidate.history.map((item) => (
              <div className="kc-history-item" key={item}>
                <span />
                <p>{item}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      <div className="kc-drawer-actions">
        <button className="kc-btn kc-btn-light" onClick={() => onMove(candidate.id, "rejeitados")} type="button">
          Rejeitar
        </button>
        <button className="kc-btn kc-btn-warning" onClick={() => onMove(candidate.id, "avaliacao")} type="button">
          Mover para avaliação
        </button>
        <button className="kc-btn kc-btn-success" onClick={() => onMove(candidate.id, "aprovados")} type="button">
          Aprovar
        </button>
      </div>
    </aside>
  );
}

export default function KanbanCandidatos() {
  const [query, setQuery] = useState<string>("");
  const processoId = getIdFromUrl("1");
  const [candidates, setCandidates] = useState<Candidate[]>(initialCandidates);
  const [loadingCandidates, setLoadingCandidates] = useState(false);
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null);
  const [draggedCandidateId, setDraggedCandidateId] = useState<number | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function loadCandidates() {
      try {
        setLoadingCandidates(true);
        const response = await paveApi.listarCandidatos(processoId);
        const list = Array.isArray(response)
          ? response
          : response && typeof response === "object" && Array.isArray((response as { data?: unknown }).data)
            ? ((response as { data: unknown[] }).data)
            : [];

        if (!cancelled && list.length > 0) {
          setCandidates(list.map(mapCandidate));
        }
      } catch (error) {
        console.warn("Não foi possível buscar candidatos. Mantendo dados mockados.", error);
      } finally {
        if (!cancelled) setLoadingCandidates(false);
      }
    }

    loadCandidates();

    return () => {
      cancelled = true;
    };
  }, [processoId]);

  const filteredCandidates = useMemo<Candidate[]>(() => {
    const term = query.trim().toLowerCase();
    if (!term) return candidates;

    return candidates.filter(
      (candidate) =>
        candidate.name.toLowerCase().includes(term) ||
        candidate.course.toLowerCase().includes(term) ||
        candidate.status.toLowerCase().includes(term),
    );
  }, [candidates, query]);

  const candidatesByStatus = useMemo<Record<CandidateStatus, Candidate[]>>(() => {
    return columns.reduce(
      (acc, column) => {
        acc[column.id] = filteredCandidates.filter((candidate) => candidate.status === column.id);
        return acc;
      },
      {
        inscritos: [],
        avaliacao: [],
        aprovados: [],
        rejeitados: [],
      } as Record<CandidateStatus, Candidate[]>,
    );
  }, [filteredCandidates]);

  function handleDragOver(event: DragEvent<HTMLDivElement>) {
    event.preventDefault();
  }

  function handleDrop(event: DragEvent<HTMLDivElement>, nextStatus: CandidateStatus) {
    event.preventDefault();
    const idFromTransfer = Number(event.dataTransfer.getData("text/plain"));
    const candidateId = draggedCandidateId ?? idFromTransfer;

    if (!candidateId) return;

    moveCandidate(candidateId, nextStatus);
    setDraggedCandidateId(null);
  }

  function startDragging(candidateId: number) {
    setDraggedCandidateId(candidateId);
  }

  function moveCandidate(candidateId: number, nextStatus: CandidateStatus) {
    let updatedCandidate: Candidate | null = null;

    setCandidates((currentCandidates) =>
      currentCandidates.map((candidate) => {
        if (candidate.id !== candidateId) return candidate;

        if (candidate.status === nextStatus) {
          updatedCandidate = candidate;
          return candidate;
        }

        const nextCandidate: Candidate = {
          ...candidate,
          status: nextStatus,
          date: cardDateLabel(nextStatus),
          history: [...candidate.history, transitionHistoryLabel(nextStatus)],
        };

        updatedCandidate = nextCandidate;
        return nextCandidate;
      }),
    );

    setSelectedCandidate((current) => {
      if (!current || current.id !== candidateId) return current;
      if (current.status === nextStatus) return current;

      return updatedCandidate ?? {
        ...current,
        status: nextStatus,
        date: cardDateLabel(nextStatus),
        history: [...current.history, transitionHistoryLabel(nextStatus)],
      };
    });

    paveApi.moverCandidato(processoId, candidateId, backendStatus(nextStatus)).catch((error) => {
      console.error("Erro ao atualizar status do candidato", error);
      alert("O candidato foi movido na tela, mas o backend não confirmou a alteração.");
    });
  }

  return (
    <div className={`kc-page ${selectedCandidate ? "drawer-open" : ""}`}>
      <Header />

      <main className="kc-main">
        <ProjectSummary />

          <section className="kc-candidates-section">
            {loadingCandidates && <p className="kc-loading-message">Carregando candidatos do backend...</p>}
            <label className="kc-search">
              <Search size={20} />
              <input
                type="text"
                placeholder="Buscar candidato..."
                value={query}
                onChange={(event) => setQuery(event.target.value)}
              />
            </label>

            <div className="kc-kanban">
              {columns.map((column) => (
                <div
                  className="kc-column"
                  key={column.id}
                  onDragOver={handleDragOver}
                  onDrop={(event) => handleDrop(event, column.id)}
                >
                  <div className="kc-column-header">
                    <div>
                      <span className={`kc-dot ${column.dot}`} />
                      <h3>{column.title}</h3>
                    </div>
                    <strong>{candidatesByStatus[column.id].length}</strong>
                  </div>

                  <div className="kc-column-list">
                    {candidatesByStatus[column.id].map((candidate) => (
                      <CandidateCard
                        candidate={candidate}
                        key={candidate.id}
                        isSelected={selectedCandidate?.id === candidate.id}
                        onClick={setSelectedCandidate}
                        onDragStart={startDragging}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>
      </main>

      <CandidateDrawer
        candidate={selectedCandidate}
        onClose={() => setSelectedCandidate(null)}
        onMove={moveCandidate}
      />
    </div>
  );
}
