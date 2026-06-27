import { useState, useMemo } from "react";
import { Link } from "@tanstack/react-router";
import {
  Star, Heart, Calendar, Users, MapPin, Monitor, Layers,
  Filter, ChevronDown, Zap, Search, ChevronRight, Bookmark,
} from "lucide-react";
import Navbar from "@/layout/components/Navbar/Navbar";
import { projetos } from "../../data/projetos";
import "./Oportunidade.css";

/* Mapeia projetos.tsx para o formato de card */
const PROJECTS = projetos.map((p) => ({
  id:           p.id,
  tags:         p.tipo.map((t) => ({ 
    label: t, 
    cls: t.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase() 
  })),
  title:        p.titulo,
  desc:         p.resumo,
  professor:    p.professor.nome,
  profInitials: p.professor.nome.split(" ").map((w) => w[0]).filter((_, i, a) => i === 0 || i === a.length - 1).join(""),
  vagas:        p.vagasTotal - p.vagasPreenchidas,
  modalidade:   p.modalidade,
  modalidadeIcon:     p.modalidade === "Remoto"  ? <Monitor size={14} /> :
                      p.modalidade === "Híbrido" ? <Layers size={14} />  :
                                                   <MapPin size={14} />,
  tipo: p.tipo,
  area: p.area,
}));

const TIPO_FILTERS       = ["Todos", "Bolsa", "Voluntariado", "Extensão"] as const;
const MODALIDADE_FILTERS = ["Todos", "Presencial", "Remoto", "Híbrido"]  as const;

const TABS = [
  { icon: <Star size={16} />,     label: "Recomendadas para você" },
  { icon: <Heart size={16} />,    label: "Favoritos"              },
  { icon: <Calendar size={16} />, label: "Em andamento"           },
];

export default function MinhasOportunidades() {
  const [salvosSet, setSalvosSet] = useState<Set<number>>(new Set());
  const salvos = salvosSet;
  const toggleSalvo = (id: number) => setSalvosSet((prev) => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n; });
  const isSalvo = (id: number) => salvosSet.has(id);
  const [inscricoes, setInscricoes] = useState<Set<number>>(new Set());
  const inscrever = (id: number) => setInscricoes((prev) => new Set([...prev, id]));
  const isInscrito = (id: number) => inscricoes.has(id);

  const [tipoFilter,      setTipoFilter]      = useState<string>("Todos");
  const [modalidadeFilter,setModalidadeFilter] = useState<string>("Todos");
  const [areaFilter,      setAreaFilter]      = useState<string>("Todas"); 
  const [activeTab,       setActiveTab]       = useState(0);

  const clearFilters = () => { 
    setTipoFilter("Todos"); 
    setModalidadeFilter("Todos"); 
    setAreaFilter("Todas");
  };

  const projetosFiltrados = useMemo(() => {
    let list = PROJECTS;
    
    // Filtros de Select e Botões
    if (tipoFilter !== "Todos")       list = list.filter((p) => p.tipo.includes(tipoFilter));
    if (modalidadeFilter !== "Todos") list = list.filter((p) => p.modalidade === modalidadeFilter);

    // Filtro para area
    if (areaFilter !== "Todas") {
      list = list.filter((p) => p.area.toLowerCase().includes(areaFilter.toLowerCase()));
    }
    
    // Filtros por Aba
    if (activeTab === 1) list = list.filter((p) => isSalvo(p.id));
    if (activeTab === 2) list = list.filter((p) => isInscrito(p.id)); // Filtra as inscrições em andamento

    return list;
  }, [activeTab, salvos, inscricoes, tipoFilter, modalidadeFilter, areaFilter]);

  const STATS = [
    { icon: <Star size={22} />,     color: "blue",   number: PROJECTS.length,      sub: "projetos disponíveis"  },
    { icon: <Heart size={22} />,    color: "green",  number: salvos.size,          sub: "projetos salvos"       },
    { icon: <Zap size={22} />,      color: "amber",  number: 8,                    sub: "vagas abertas hoje"     },
    { icon: <Calendar size={22} />, color: "purple", number: inscricoes.size,      sub: "inscrições em andamento"}, // Agora dinâmico
  ];

  // Lógica de texto dinâmico para os Empty States
  let emptyTitle = "Nenhuma oportunidade encontrada";
  let emptyDesc = "Tente remover ou alterar os filtros para ver mais projetos.";
  if (activeTab === 1) {
    emptyTitle = "Nenhum projeto salvo ainda";
    emptyDesc = "Salve projetos no catálogo clicando no ícone de bookmark.";
  } else if (activeTab === 2) {
    emptyTitle = "Nenhuma inscrição em andamento";
    emptyDesc = "Você ainda não se candidatou a nenhum projeto.";
  }

  return (
    <div className="pave-root">
      <Navbar />
      <main className="main">
        {/* Header */}
        <div className="page-header">
          <div className="header-content">
            <h1>Minhas Oportunidades</h1>
            <p>Descubra projetos incríveis alinhados aos seus interesses e impulsione sua jornada acadêmica.</p>
          </div>
        </div>

        {/* Stats */}
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

        {/* Filtros */}
        <div className="filters-container">
          <div className="filters">
            <div className="filter-group">
              <span className="filter-label">Tipo de vaga</span>
              <div className="filter-btns">
                {TIPO_FILTERS.map((f) => (
                  <button key={f} className={`filter-btn${tipoFilter === f ? " active" : ""}`} onClick={() => setTipoFilter(f)}>{f}</button>
                ))}
              </div>
            </div>
            <div className="filter-group">
              <span className="filter-label">Modalidade</span>
              <div className="filter-btns">
                {MODALIDADE_FILTERS.map((f) => (
                  <button key={f} className={`filter-btn${modalidadeFilter === f ? " active" : ""}`} onClick={() => setModalidadeFilter(f)}>{f}</button>
                ))}
              </div>
            </div>
            <div className="filter-group">
              <span className="filter-label">Área de atuação</span>
              <div className="filter-select-wrap">
                <select 
                  className="filter-select"
                  value={areaFilter}
                  onChange={(e) => setAreaFilter(e.target.value)}
                >
                  <option value="Todas">Todas as áreas</option>
                  <option value="Tecnologia">Tecnologia</option>
                  <option value="Educação">Educação</option>
                  <option value="Saúde">Saúde</option>
                  <option value="Meio Ambiente">Meio Ambiente</option>
                </select>
                <ChevronDown size={14} className="select-chevron" />
              </div>
            </div>
            <button className="clear-btn" onClick={clearFilters}>
              <Filter size={14} className="clear-icon" /> Limpar filtros
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="tabs">
          {TABS.map((t, i) => (
            <button key={i} className={`tab-btn${activeTab === i ? " active" : ""}`} onClick={() => setActiveTab(i)}>
              <span className="tab-icon">{t.icon}</span>
              {t.label}
              {i === 1 && salvos.size > 0 && (
                <span className="tab-badge">{salvos.size}</span>
              )}
              {i === 2 && inscricoes.size > 0 && (
                <span className="tab-badge">{inscricoes.size}</span>
              )}
            </button>
          ))}
        </div>

        {/* Cards */}
        {projetosFiltrados.length > 0 ? (
          <div className="projects-grid">
            {projetosFiltrados.map((p) => {
              const salvo = isSalvo(p.id);
              const inscrito = isInscrito(p.id);

              return (
                <div className="project-card" key={p.id}>
                  {/* Header colorido */}
                  <div className="card-img">
                    <div className={`card-img-placeholder tipo-${p.tags[0]?.cls ?? "extensao"}`}>
                      <span className="card-img-label">{p.tags[0]?.label}</span>
                    </div>
                    <button
                      className={`fav-btn${salvo ? " liked" : ""}`}
                      onClick={() => toggleSalvo(p.id)}
                      aria-label={salvo ? "Remover dos favoritos" : "Adicionar aos favoritos"}
                    >
                      <Bookmark size={18} className={salvo ? "fav-icon-filled" : "fav-icon-outline"} />
                    </button>
                  </div>
                  <div className="card-body">
                    <div className="tag-row">
                      {p.tags.map((t) => (
                        <span key={t.label} className={`tag ${t.cls}`}>{t.label}</span>
                      ))}
                    </div>
                    <h3 className="card-title">{p.title}</h3>
                    <p className="card-desc">{p.desc}</p>
                    <div className="prof-row">
                      <div className="prof-avatar">{p.profInitials}</div>
                      <span className="prof-name">{p.professor}</span>
                    </div>
                    <div className="meta-row">
                      <div className="meta-item">
                        <Users size={14} className="meta-icon" />
                        <span>{p.vagas} vagas</span>
                      </div>
                      <div className="meta-item">
                        <span className="meta-icon">{p.modalidadeIcon}</span>
                        <span>{p.modalidade}</span>
                      </div>
                    </div>
                    <div className="card-actions">
                      <Link to="/projetos/$id" params={{ id: String(p.id) }} className="btn-outline">
                        Detalhes
                      </Link>
                      
                      <button 
                        className="btn-primary"
                        onClick={() => inscrever(p.id)}
                        disabled={inscrito}
                        style={{ opacity: inscrito ? 0.7 : 1, cursor: inscrito ? 'default' : 'pointer' }}
                      >
                        {inscrito ? "Inscrito!" : "Candidatar-se"}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="empty-state">
            <Search size={48} className="empty-state-icon" />
            <h3>{emptyTitle}</h3>
            <p>{emptyDesc}</p>
            {activeTab === 1 || activeTab === 2 ? (
              <Link to="/projetos" className="btn-outline mt-3">
                Explorar projetos <ChevronRight size={14} />
              </Link>
            ) : (
              <button className="btn-outline mt-3" onClick={clearFilters}>
                Limpar todos os filtros
              </button>
            )}
          </div>
        )}
      </main>
    </div>
  );
}