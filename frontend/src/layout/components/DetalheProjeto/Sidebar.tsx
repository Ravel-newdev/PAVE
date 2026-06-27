import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { Loader2, SendHorizonal } from "lucide-react";
import type { Projeto } from "@/types/projeto";
import { useAuth } from "@/context/AuthContext";
import { paveApi } from "@/services/PaveApiService";

interface SidebarProps {
  projeto: Projeto;
}

function formatarData(iso?: string) {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("pt-BR");
}

export function Sidebar({ projeto }: SidebarProps) {
  const { session } = useAuth();
  const navigate = useNavigate();
  const [candidatando, setCandidatando] = useState(false);
  const [semProcesso, setSemProcesso] = useState(false);

  async function handleCandidatar() {
    setSemProcesso(false);
    setCandidatando(true);
    try {
      const processos = await paveApi.listarProcessosProjeto(projeto.id);
      if (processos.length === 0) {
        setSemProcesso(true);
        return;
      }
      await navigate({ to: "/aluno/candidatura", search: { processoId: processos[0].id } });
    } catch {
      setSemProcesso(true);
    } finally {
      setCandidatando(false);
    }
  }

  return (
    <>
      {session?.tipo === "discente" && projeto.status === "ativo" && (
        <div className="dp-card dp-card--pad" style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          <button
            onClick={() => void handleCandidatar()}
            disabled={candidatando}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "8px",
              width: "100%",
              padding: "12px 0",
              background: "linear-gradient(135deg, #287999, #1e5c75)",
              color: "#fff",
              border: "none",
              borderRadius: "12px",
              fontWeight: 700,
              fontSize: "15px",
              cursor: candidatando ? "not-allowed" : "pointer",
              opacity: candidatando ? 0.75 : 1,
              transition: "opacity 0.15s",
            }}
          >
            {candidatando
              ? <><Loader2 size={16} style={{ animation: "spin 1s linear infinite" }} /> Verificando...</>
              : <><SendHorizonal size={16} /> Candidatar-se</>
            }
          </button>

          {semProcesso && (
            <p style={{ fontSize: "12px", color: "#ef4444", textAlign: "center", margin: 0 }}>
              Não há processo seletivo aberto para este projeto.
            </p>
          )}
        </div>
      )}

      <div className="dp-card dp-card--pad">
        <div className="dp-aside-title dp-aside-title--expand">Informações principais</div>
        {(
          [
            { label: "Status",        value: projeto.status },
            { label: "Centro/Depto",  value: projeto.centro_dep },
            { label: "Carga horária", value: projeto.carga_hora ? `${projeto.carga_hora}h/semana` : undefined },
            { label: "Início",        value: formatarData(projeto.data_inic) },
            { label: "Término",       value: formatarData(projeto.data_termino) },
          ] as { label: string; value?: string }[]
        )
          .filter((r) => r.value && r.value !== "—")
          .map((row) => (
            <div key={row.label} className="dp-info-row">
              <span className="dp-info-row__label">{row.label}</span>
              <span className="dp-info-row__value">{row.value}</span>
            </div>
          ))}
      </div>

      <div className="dp-card dp-card--pad">
        <div className="dp-aside-title">Professor responsável</div>
        <div className="dp-prof-mini">
          <div className="dp-prof-mini__avatar">{projeto.autor_nome.charAt(0).toUpperCase()}</div>
          <div>
            <div className="dp-prof-mini__name">{projeto.autor_nome}</div>
            <div className="dp-prof-mini__dept">{projeto.centro_dep ?? "—"}</div>
          </div>
        </div>
      </div>

      {projeto.tags.length > 0 && (
        <div className="dp-card dp-card--pad">
          <div className="dp-aside-title">Áreas de atuação</div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", marginTop: "8px" }}>
            {projeto.tags.map((t) => (
              <span key={t.id} className="dp-tag dp-tag--blue">{t.nome}</span>
            ))}
          </div>
        </div>
      )}
    </>
  );
}
