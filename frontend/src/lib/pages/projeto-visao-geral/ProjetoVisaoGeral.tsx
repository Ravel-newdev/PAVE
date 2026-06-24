import { Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  BarChart3,
  Briefcase,
  Calendar,
  CheckCircle2,
  Download,
  Edit3,
  FileText,
  GraduationCap,
  Info,
  Tag,
  Target,
  Timer,
  Users,
  XCircle,
} from "lucide-react";
import "./ProjetoVisaoGeral.css";
import { getIdFromUrl, paveApi } from "../../services/paveApi";
import { ProfessorTopbar } from "./components/ProfessorTopbar";
import { StatCard } from "./components/StatCard";
import { projeto } from "./constants/projetoVisaoData";
import { mapProjeto } from "./utils/projetoMapper";

export default function ProjetoVisaoGeral() {
  const projetoId = getIdFromUrl("1");
  const [currentProjeto, setCurrentProjeto] = useState(projeto);
  const navigate = useNavigate();

  useEffect(() => {
    let cancelled = false;

    async function loadProjeto() {
      try {
        const response = await paveApi.buscarProjeto(projetoId);
        if (!cancelled) setCurrentProjeto(mapProjeto(response));
      } catch (error) {
        console.warn("Não foi possível buscar o projeto. Mantendo dados de exemplo.", error);
      }
    }

    loadProjeto();

    return () => {
      cancelled = true;
    };
  }, [projetoId]);

  const handleEditProject = () => {
    navigate({ to: "/editar-projeto", search: { id: projetoId } as never });
  };

  const handleExport = () => {
    const content = `Projeto,${currentProjeto.titulo}\nInscritos,${currentProjeto.inscritos}\nVagas,${currentProjeto.vagas}`;
    const blob = new Blob([content], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "projeto.csv";
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleFinish = async () => {
    const confirmed = window.confirm("Deseja finalizar a seleção deste projeto?");
    if (!confirmed) return;

    try {
      await paveApi.alterarStatusProjeto(projetoId, "encerrado");
      setCurrentProjeto((current) => ({ ...current, status: "Encerrado" }));
      alert("Seleção finalizada.");
    } catch (error) {
      console.error(error);
      alert("Não foi possível finalizar. Verifique o backend e o token.");
    }
  };


  return (
    <main className="po-page">
      <ProfessorTopbar />

      <div className="po-container">
        <div className="po-breadcrumb">
          <Link to="/projeto-visao-geral">Projetos</Link>
          <span>›</span>
          <span>{currentProjeto.titulo}</span>
        </div>

        <section className="po-project-header">
          <div>
            <div className="po-title-row">
              <h1>{currentProjeto.titulo}</h1>
              <span className="po-status">{currentProjeto.status}</span>
            </div>

            <div className="po-meta-row">
              <span><GraduationCap size={18} /> {currentProjeto.area}</span>
              <span><Users size={18} /> {currentProjeto.inscritos} inscritos</span>
              <span><Briefcase size={18} /> {currentProjeto.vagas}</span>
              <span><Calendar size={18} /> {currentProjeto.prazo}</span>
            </div>

            <p className="po-description">{currentProjeto.descricao}</p>
          </div>

          <div className="po-actions">
            <button className="po-button po-button-secondary" type="button" onClick={handleEditProject}>
              <Edit3 size={18} />
              Editar projeto
            </button>
            <button className="po-button po-button-secondary" type="button" onClick={handleExport}>
              <Download size={18} />
              Exportar
            </button>
            <button className="po-button po-button-danger" type="button" onClick={handleFinish}>
              Finalizar seleção
            </button>
          </div>
        </section>

        <div className="po-tabs" role="tablist">
          <Link className="po-tab po-tab-active" to="/projeto-visao-geral" search={{ id: projetoId } as never}>Visão geral</Link>
          <Link className="po-tab" to="/kanban-candidatos" search={{ processoId: projetoId } as never}>Candidatos</Link>
        </div>

        <section className="po-grid-main">
          <div className="po-card po-about-card">
            <h2><span><FileText size={20} /></span> Sobre o projeto</h2>
            <p>{currentProjeto.descricao}</p>

            <h3><span><Target size={20} /></span> Objetivos</h3>
            <ul>
              {currentProjeto.objetivos.map((objetivo) => (
                <li key={objetivo}>{objetivo}</li>
              ))}
            </ul>

            <h3><span><Tag size={20} /></span> Palavras-chave</h3>
            <div className="po-tags">
              {currentProjeto.palavrasChave.map((tag) => (
                <span key={tag}>{tag}</span>
              ))}
            </div>
          </div>

          <div className="po-side-stack">
            <div className="po-card">
              <h2><span><BarChart3 size={20} /></span> Resumo da seleção</h2>
              <div className="po-stats-grid">
                <StatCard icon={<Users size={22} />} value={currentProjeto.resumoSelecao.inscritos} label="Inscritos" variant="blue" />
                <StatCard icon={<Timer size={22} />} value={currentProjeto.resumoSelecao.avaliacao} label="Em avaliação" variant="amber" />
                <StatCard icon={<CheckCircle2 size={22} />} value={currentProjeto.resumoSelecao.aprovados} label="Aprovados" variant="green" />
                <StatCard icon={<XCircle size={22} />} value={currentProjeto.resumoSelecao.rejeitados} label="Rejeitados" variant="red" />
              </div>
            </div>

            <div className="po-card">
              <h2><span><Calendar size={20} /></span> Cronograma</h2>
              <div className="po-schedule-list">
                {currentProjeto.cronograma.map(([label, value]) => (
                  <div className="po-schedule-row" key={label}>
                    <span>{label}</span>
                    <strong>{value}</strong>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="po-card po-info-card">
          <h2><span><Info size={20} /></span> Informações gerais</h2>
          <div className="po-info-grid">
            {currentProjeto.informacoes.map((item) => (
              <div className="po-info-item" key={item.label}>
                <span>{item.icon}</span>
                <div>
                  <small>{item.label}</small>
                  <strong>{item.value}</strong>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
