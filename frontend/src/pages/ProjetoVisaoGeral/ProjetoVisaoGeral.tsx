import { Link, useNavigate, useSearch } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Briefcase, Calendar, Download, Edit3, GraduationCap, Trash2 } from "lucide-react";
import "./ProjetoVisaoGeral.css";
import { paveApi } from "../../services/PaveApiService";
import { ProfessorTopbar } from "./components/ProfessorTopbar";
import { VisaoGeralTab } from "./tabs/VisaoGeralTab";
import { CandidatosTab } from "./tabs/CandidatosTab";
import type { Projeto } from "../../types/projeto";

type Aba = "visao-geral" | "candidatos";

export default function ProjetoVisaoGeral() {
  const { id, aba = "visao-geral" } = useSearch({ strict: false }) as { id?: string; aba?: Aba };
  const projetoId = id ?? "";
  const navigate = useNavigate();

  const [projeto, setProjeto] = useState<Projeto | null>(null);
  const [processoId, setProcessoId] = useState<string | null>(null);
  const [erro, setErro] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState(false);

  useEffect(() => {
    if (!projetoId) { void navigate({ to: "/professor" }); return; }
    let cancelled = false;

    async function carregar() {
      try {
        const [proj, processos] = await Promise.all([
          paveApi.buscarProjeto(projetoId),
          paveApi.listarProcessosProjeto(projetoId),
        ]);
        if (cancelled) return;
        setProjeto(proj);
        if (processos.length > 0) setProcessoId(processos[0].id);
      } catch (e) {
        if (!cancelled) setErro(e instanceof Error ? e.message : "Erro ao carregar projeto.");
      }
    }

    void carregar();
    return () => { cancelled = true; };
  }, [projetoId, navigate]);

  async function handleFinish() {
    if (!projeto) return;
    try {
      await paveApi.alterarStatusProjeto(projeto.id, { status: "encerrado" });
      setProjeto((p) => p ? { ...p, status: "encerrado" } : p);
    } catch (e) {
      setErro(e instanceof Error ? e.message : "Erro ao finalizar.");
    }
  }

  async function handleDelete() {
    if (!projeto) return;
    try {
      await paveApi.excluirProjeto(projeto.id);
      void navigate({ to: "/professor" });
    } catch (e) {
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
          <Link
            className={`po-tab ${aba === "visao-geral" ? "po-tab-active" : ""}`}
            to="/professor/projeto-visao-geral"
            search={{ id: projetoId, aba: "visao-geral" } as never}
          >
            Visão geral
          </Link>
          {processoId ? (
            <Link
              className={`po-tab ${aba === "candidatos" ? "po-tab-active" : ""}`}
              to="/professor/projeto-visao-geral"
              search={{ id: projetoId, aba: "candidatos" } as never}
            >
              Candidatos
            </Link>
          ) : (
            <span className="po-tab" style={{ opacity: 0.4, cursor: "not-allowed" }} title="Nenhum processo seletivo aberto">
              Candidatos
            </span>
          )}
        </div>

        {aba === "visao-geral" && <VisaoGeralTab projeto={projeto} />}
        {aba === "candidatos" && processoId && <CandidatosTab processoId={processoId} />}
      </div>
    </main>
  );
}
