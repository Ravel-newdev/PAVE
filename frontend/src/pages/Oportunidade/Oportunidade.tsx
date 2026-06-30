import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import {
  ClipboardList, Heart, CheckCircle2, Clock,
  BookmarkX, ChevronRight, Loader2, AlertCircle,
} from "lucide-react";
import Navbar from "@/layout/components/Navbar/Navbar";
import { paveApi } from "@/services/PaveApiService";
import type { InscricaoResumo, StatusInscricao } from "@/types/processo";
import type { Projeto } from "@/types/projeto";
import "./Oportunidade.css";

const STATUS_LABEL: Record<StatusInscricao, string> = {
  em_analise: "Em análise",
  aprovado:   "Aprovado",
  reprovado:  "Reprovado",
  desistencia: "Desistência",
};

const STATUS_COLOR: Record<StatusInscricao, string> = {
  em_analise:  "#f59e0b",
  aprovado:    "#10b981",
  reprovado:   "#ef4444",
  desistencia: "#94a3b8",
};

const STATUS_BG: Record<StatusInscricao, string> = {
  em_analise:  "#fef3c7",
  aprovado:    "#ecfdf5",
  reprovado:   "#fee2e2",
  desistencia: "#f1f5f9",
};

function formatarData(iso: string) {
  return new Date(iso).toLocaleDateString("pt-BR");
}

const TABS = [
  { icon: <ClipboardList size={16} />, label: "Minhas Candidaturas" },
  { icon: <Heart size={16} />,         label: "Favoritos"           },
];

export default function MinhasOportunidades() {
  const [activeTab, setActiveTab] = useState(0);
  const [inscricoes, setInscricoes] = useState<InscricaoResumo[]>([]);
  const [favoritos,  setFavoritos]  = useState<Projeto[]>([]);
  const [loading,    setLoading]    = useState(true);
  const [erro,       setErro]       = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setErro(null);
    Promise.all([
      paveApi.listarMinhasInscricoes(),
      paveApi.listarFavoritos(),
    ])
      .then(([ins, favs]) => {
        setInscricoes(ins);
        setFavoritos(favs);
      })
      .catch(() => setErro("Não foi possível carregar seus dados. Tente novamente."))
      .finally(() => setLoading(false));
  }, []);

  const pendentes = inscricoes.filter((i) => i.status === "em_analise").length;
  const aprovadas = inscricoes.filter((i) => i.status === "aprovado").length;

  const STATS = [
    { icon: <ClipboardList size={22} />, color: "blue",   number: inscricoes.length, sub: "candidaturas"      },
    { icon: <Clock size={22} />,         color: "amber",  number: pendentes,         sub: "em análise"        },
    { icon: <CheckCircle2 size={22} />,  color: "green",  number: aprovadas,         sub: "aprovadas"         },
    { icon: <Heart size={22} />,         color: "purple", number: favoritos.length,  sub: "projetos favoritos"},
  ];

  return (
    <div className="pave-root">
      <Navbar />
      <main className="main">
        <div className="page-header">
          <div className="header-content">
            <h1>Minhas Oportunidades</h1>
            <p>Acompanhe suas candidaturas e projetos favoritos.</p>
          </div>
        </div>

        <div className="stats-grid">
          {STATS.map((s, i) => (
            <div className="stat-card" key={i}>
              <div className={`stat-icon-wrap ${s.color}`}>{s.icon}</div>
              <div className="stat-info">
                <h3>{s.number}</h3>
                <p>{s.sub}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="tabs">
          {TABS.map((t, i) => (
            <button
              key={i}
              className={`tab-btn${activeTab === i ? " active" : ""}`}
              onClick={() => setActiveTab(i)}
            >
              <span className="tab-icon">{t.icon}</span>
              {t.label}
              {i === 0 && inscricoes.length > 0 && (
                <span className="tab-badge">{inscricoes.length}</span>
              )}
              {i === 1 && favoritos.length > 0 && (
                <span className="tab-badge">{favoritos.length}</span>
              )}
            </button>
          ))}
        </div>

        {loading ? (
          <div style={{ display: "flex", justifyContent: "center", padding: "64px 0" }}>
            <Loader2 size={32} style={{ animation: "spin 1s linear infinite", color: "#287999" }} />
          </div>
        ) : erro ? (
          <div className="empty-state">
            <AlertCircle size={48} className="empty-state-icon" />
            <h3>Erro ao carregar</h3>
            <p>{erro}</p>
          </div>
        ) : activeTab === 0 ? (
          inscricoes.length === 0 ? (
            <div className="empty-state">
              <ClipboardList size={48} className="empty-state-icon" />
              <h3>Nenhuma candidatura ainda</h3>
              <p>Explore projetos e candidate-se a um processo seletivo.</p>
              <Link to="/projetos" className="btn-outline mt-3">
                Explorar projetos <ChevronRight size={14} />
              </Link>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              {inscricoes.map((ins) => (
                <div
                  key={ins.id}
                  style={{
                    background: "#fff",
                    borderRadius: "16px",
                    border: "1px solid #E2E8F0",
                    padding: "20px 24px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: "16px",
                    boxShadow: "0 4px 20px rgba(0,0,0,0.03)",
                  }}
                >
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: 700, fontSize: "15px", color: "#1E293B", marginBottom: "4px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {ins.projeto_titulo}
                    </div>
                    <div style={{ fontSize: "13px", color: "#64748B" }}>
                      {ins.processo_titulo}
                    </div>
                    <div style={{ fontSize: "12px", color: "#94A3B8", marginTop: "4px" }}>
                      Inscrito em {formatarData(ins.data_inscricao)}
                    </div>
                  </div>
                  <span
                    style={{
                      padding: "4px 12px",
                      borderRadius: "999px",
                      fontSize: "12px",
                      fontWeight: 700,
                      color: STATUS_COLOR[ins.status],
                      background: STATUS_BG[ins.status],
                      whiteSpace: "nowrap",
                      flexShrink: 0,
                    }}
                  >
                    {STATUS_LABEL[ins.status]}
                  </span>
                </div>
              ))}
            </div>
          )
        ) : (
          favoritos.length === 0 ? (
            <div className="empty-state">
              <BookmarkX size={48} className="empty-state-icon" />
              <h3>Nenhum projeto favorito</h3>
              <p>Marque projetos como favoritos para acompanhá-los aqui.</p>
              <Link to="/projetos" className="btn-outline mt-3">
                Explorar projetos <ChevronRight size={14} />
              </Link>
            </div>
          ) : (
            <div className="projects-grid">
              {favoritos.map((p) => (
                <div className="project-card" key={p.id}>
                  <div className="card-body" style={{ paddingTop: "20px" }}>
                    <div className="tag-row">
                      {p.tags.slice(0, 3).map((t) => (
                        <span key={t.id} className="tag">{t.nome}</span>
                      ))}
                    </div>
                    <h3 className="card-title">{p.titulo}</h3>
                    <div className="prof-row">
                      <div className="prof-avatar">{p.autor_nome.charAt(0).toUpperCase()}</div>
                      <span className="prof-name">{p.autor_nome}</span>
                    </div>
                    <div className="card-actions">
                      <Link to="/projetos/$id" params={{ id: p.id }} className="btn-primary" style={{ textAlign: "center" }}>
                        Ver projeto <ChevronRight size={14} />
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )
        )}
      </main>
    </div>
  );
}