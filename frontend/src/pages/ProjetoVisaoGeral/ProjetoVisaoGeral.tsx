import { Link, useNavigate, useSearch } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { BarChart3, Briefcase, Calendar, CheckCircle2, Download, Edit3, FileText, GraduationCap, Info, Tag, Timer, Users, XCircle } from "lucide-react";
import "./ProjetoVisaoGeral.css";
import { paveApi } from "../../services/PaveApiService";
import { ProfessorTopbar } from "./components/ProfessorTopbar";
import { StatCard } from "./components/StatCard";
import { mapProjeto } from "./utils/projetoMapper";
import type { Projeto } from "../../types/projeto";

export default function ProjetoVisaoGeral() {
  const { id } = useSearch({ strict: false }) as { id?: string };
  const projetoId = id ?? "";
  const [projeto, setProjeto] = useState<Projeto | null>(null);
  const [erro, setErro] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!projetoId) return;
    let cancelled = false;

    paveApi.buscarProjeto(projetoId)
      .then((res) => { if (!cancelled) setProjeto(mapProjeto(res)); })
      .catch((e) => { if (!cancelled) setErro(e.message); });

    return () => { cancelled = true; };
  }, [projetoId]);

  async function handleFinish() {
    if (!projeto || !window.confirm("Deseja finalizar a seleção deste projeto?")) return;
    try {
      await paveApi.alterarStatusProjeto(projeto.id, { status: "encerrado" });
      setProjeto((p) => p ? { ...p, status: "encerrado" } : p);
    } catch (e: unknown) {
      alert(e instanceof Error ? e.message : "Erro ao finalizar.");
    }
  }

  function handleExport() {
    if (!projeto) return;
    const content = `Projeto,${projeto.titulo}\nAutor,${projeto.autor_nome}\nStatus,${projeto.status}`;
    const blob = new Blob([content], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${projeto.titulo}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  }

  if (erro) return <p className="po-page" style={{ padding: "2rem" }}>{erro}</p>;
  if (!projeto) return <p className="po-page" style={{ padding: "2rem" }}>Carregando...</p>;

  return (
    <main className="po-page">
      <ProfessorTopbar />

      <div className="po-container">
        <div className="po-breadcrumb">
          <Link to="/professor">Projetos</Link>
          <span>›</span>
          <span>{projeto.titulo}</span>
        </div>

        <section className="po-project-header">
          <div>
            <div className="po-title-row">
              <h1>{projeto.titulo}</h1>
              <span className="po-status">{projeto.status}</span>
            </div>

            <div className="po-meta-row">
              <span><GraduationCap size={18} /> {projeto.autor_nome}</span>
              <span><Briefcase size={18} /> {projeto.centro_dep ?? "—"}</span>
              <span><Calendar size={18} /> {projeto.data_termino ?? "—"}</span>
            </div>

            <p className="po-description">{projeto.descricao}</p>
          </div>

          <div className="po-actions">
            <button className="po-button po-button-secondary" type="button" onClick={() => navigate({ to: "/professor/editar-projeto", search: { id: projeto.id } as never })}>
              <Edit3 size={18} /> Editar projeto
            </button>
            <button className="po-button po-button-secondary" type="button" onClick={handleExport}>
              <Download size={18} /> Exportar
            </button>
            <button className="po-button po-button-danger" type="button" onClick={handleFinish}>
              Finalizar seleção
            </button>
          </div>
        </section>

        <div className="po-tabs" role="tablist">
          <Link className="po-tab po-tab-active" to="/professor/projeto-visao-geral" search={{ id: projetoId } as never}>Visão geral</Link>
          <Link className="po-tab" to="/professor/kanban-candidatos" search={{ processoId: projetoId } as never}>Candidatos</Link>
        </div>

        <section className="po-grid-main">
          <div className="po-card po-about-card">
            <h2><span><FileText size={20} /></span> Sobre o projeto</h2>
            <p>{projeto.descricao ?? "Sem descrição."}</p>

            <h3><span><Tag size={20} /></span> Tags</h3>
            <div className="po-tags">
              {projeto.tags.length > 0
                ? projeto.tags.map((t) => <span key={t.id}>{t.nome}</span>)
                : <span>Nenhuma tag cadastrada.</span>}
            </div>
          </div>

          <div className="po-side-stack">
            <div className="po-card">
              <h2><span><BarChart3 size={20} /></span> Resumo da seleção</h2>
              <div className="po-stats-grid">
                <StatCard icon={<Users size={22} />} value={0} label="Inscritos" variant="blue" />
                <StatCard icon={<Timer size={22} />} value={0} label="Em avaliação" variant="amber" />
                <StatCard icon={<CheckCircle2 size={22} />} value={0} label="Aprovados" variant="green" />
                <StatCard icon={<XCircle size={22} />} value={0} label="Rejeitados" variant="red" />
              </div>
            </div>

            <div className="po-card">
              <h2><span><Info size={20} /></span> Informações gerais</h2>
              <div className="po-info-grid">
                <div className="po-info-item">
                  <span><Calendar size={18} /></span>
                  <div><small>Início</small><strong>{projeto.data_inic ?? "—"}</strong></div>
                </div>
                <div className="po-info-item">
                  <span><Calendar size={18} /></span>
                  <div><small>Término</small><strong>{projeto.data_termino ?? "—"}</strong></div>
                </div>
                <div className="po-info-item">
                  <span><Briefcase size={18} /></span>
                  <div><small>Carga horária</small><strong>{projeto.carga_hora ? `${projeto.carga_hora}h` : "—"}</strong></div>
                </div>
                <div className="po-info-item">
                  <span><GraduationCap size={18} /></span>
                  <div><small>Departamento</small><strong>{projeto.centro_dep ?? "—"}</strong></div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
