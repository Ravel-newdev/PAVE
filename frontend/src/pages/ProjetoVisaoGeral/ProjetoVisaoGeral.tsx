import { Link, useNavigate, useSearch } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { BarChart3, Briefcase, Calendar, CheckCircle2, Download, Edit3, FileText, GraduationCap, Info, Tag, Timer, Trash2, Users, XCircle } from "lucide-react";
import "./ProjetoVisaoGeral.css";
import { paveApi } from "../../services/PaveApiService";
import { ProfessorTopbar } from "./components/ProfessorTopbar";
import { StatCard } from "./components/StatCard";
import type { Projeto } from "../../types/projeto";

export default function ProjetoVisaoGeral() {
  const { id } = useSearch({ strict: false }) as { id?: string };
  const projetoId = id ?? "";
  const [projeto, setProjeto] = useState<Projeto | null>(null);
  const [erro, setErro] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!projetoId) {
      void navigate({ to: "/professor" });
      return;
    }
    let cancelled = false;

    paveApi.buscarProjeto(projetoId)
      .then((res) => { if (!cancelled) setProjeto(res); })
      .catch((e) => { if (!cancelled) setErro(e instanceof Error ? e.message : "Erro ao carregar projeto."); });

    return () => { cancelled = true; };
  }, [projetoId, navigate]);

  async function handleFinish() {
    if (!projeto) return;
    try {
      await paveApi.alterarStatusProjeto(projeto.id, { status: "encerrado" });
      setProjeto((p) => p ? { ...p, status: "encerrado" } : p);
    } catch (e: unknown) {
      setErro(e instanceof Error ? e.message : "Erro ao finalizar.");
    }
  }

  async function handleDelete() {
    if (!projeto) return;
    try {
      await paveApi.excluirProjeto(projeto.id);
      void navigate({ to: "/professor" });
    } catch (e: unknown) {
      setErro(e instanceof Error ? e.message : "Erro ao excluir.");
      setConfirmDelete(false);
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

  if (confirmDelete) return (
    <div className="po-page" style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "100vh" }}>
      <div style={{ background: "#fff", borderRadius: 16, padding: "40px 36px", textAlign: "center", boxShadow: "0 8px 40px rgba(30,46,79,0.1)", maxWidth: 400, width: "100%" }}>
        <Trash2 size={40} color="#dc2626" style={{ marginBottom: 16 }} />
        <h2 style={{ fontSize: 18, fontWeight: 700, color: "#1E2E4F", margin: "0 0 8px" }}>Excluir rascunho?</h2>
        <p style={{ fontSize: 14, color: "#64748B", margin: "0 0 24px" }}>Esta ação não pode ser desfeita. O projeto será removido permanentemente.</p>
        <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
          <button className="po-button po-button-secondary" type="button" onClick={() => setConfirmDelete(false)}>Cancelar</button>
          <button className="po-button po-button-danger" type="button" onClick={() => void handleDelete()}>Excluir</button>
        </div>
      </div>
    </div>
  );

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
            {projeto.status === "rascunho" ? (
              <button className="po-button po-button-danger" type="button" onClick={() => setConfirmDelete(true)}>
                <Trash2 size={18} /> Excluir rascunho
              </button>
            ) : (
              <button className="po-button po-button-danger" type="button" onClick={() => void handleFinish()} disabled={projeto.status === "encerrado"}>
                Finalizar seleção
              </button>
            )}
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
