import React, { useState, useMemo } from "react";
import Navbar from "../../components/Navbar/Navbar";
import { 
  FiSearch, FiStar, FiHeart, FiCalendar, FiUsers, 
  FiMapPin, FiMonitor, FiLayers, FiFilter, FiChevronDown, FiZap
} from "react-icons/fi";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import "./Oportunidades.css";

const PROJECTS = [
  {
    id: 1,
    img: "https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?w=600&q=80",
    tags: [{ label: "Extensão", cls: "extensao" }, { label: "Voluntariado", cls: "voluntariado" }],
    title: "Sustentabilidade na Comunidade",
    desc: "Projeto de educação ambiental voltado para práticas sustentáveis e conscientização comunitária.",
    professor: "Prof. Carlos Mendes",
    profInitials: "CM",
    vagas: 15,
    modalidade: "Presencial",
    modalidadeIcon: <FiMapPin />,
  },
  {
    id: 2,
    img: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=600&q=80",
    tags: [{ label: "Bolsa", cls: "bolsa" }, { label: "Extensão", cls: "extensao" }],
    title: "Desenvolvimento de Software",
    desc: "Desenvolva soluções tecnológicas para problemas reais e projetos de impacto social.",
    professor: "Profa. Juliana Alves",
    profInitials: "JA",
    vagas: 8,
    modalidade: "Remoto",
    modalidadeIcon: <FiMonitor />,
  },
  {
    id: 3,
    img: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=600&q=80",
    tags: [{ label: "Voluntariado", cls: "voluntariado" }, { label: "Híbrido", cls: "hibrido" }],
    title: "Apoio Escolar Transformador",
    desc: "Aulas de reforço e mentorias para alunos do ensino fundamental e médio.",
    professor: "Prof. Ricardo Silva",
    profInitials: "RS",
    vagas: 12,
    modalidade: "Híbrido",
    modalidadeIcon: <FiLayers />,
  },
];

const STATS = [
  { icon: <FiStar />, color: "blue", number: 12, label: "Recomendações", sub: "novas oportunidades" },
  { icon: <FiHeart />, color: "green", number: 5, label: "Favoritos", sub: "projetos salvos" },
  { icon: <FiZap />, color: "amber", number: 8, label: "Novas oportunidades", sub: "vagas abertas hoje" },
  { icon: <FiCalendar />, color: "purple", number: 3, label: "Inscrições ativas", sub: "em andamento" },
];

const TIPO_FILTERS = ["Todos", "Bolsa", "Voluntariado", "Extensão"];
const MODALIDADE_FILTERS = ["Todos", "Presencial", "Remoto", "Híbrido"];
const TABS = [
  { icon: <FiStar />, label: "Recomendadas para você" },
  { icon: <FiHeart />, label: "Favoritos" },
  { icon: <FiCalendar />, label: "Em andamento" },
];

export default function MinhasOportunidades() {
  const [tipoFilter, setTipoFilter] = useState("Todos");
  const [modalidadeFilter, setModalidadeFilter] = useState("Todos");
  const [activeTab, setActiveTab] = useState(0);
  const [liked, setLiked] = useState({ 1: true });

  const toggleLike = (id) => setLiked(prev => ({ ...prev, [id]: !prev[id] }));

  const clearFilters = () => {
    setTipoFilter("Todos");
    setModalidadeFilter("Todos");
  };

  const projetosFiltrados = useMemo(() => {
    let list = PROJECTS;

    if (tipoFilter !== "Todos") {
      list = list.filter(p => p.tags.some(t => t.label === tipoFilter));
    }

    if (modalidadeFilter !== "Todos") {
      list = list.filter(p => p.modalidade === modalidadeFilter);
    }

    if (activeTab === 1) {
      list = list.filter((p) => liked[p.id]);
    }

    return list;
  }, [activeTab, liked, tipoFilter, modalidadeFilter]);

  return (
    <div className="pave-root">
      <Navbar />

      <main className="main">
        {/* Header Aprimorado */}
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

        {/* Filters */}
        <div className="filters-container">
          <div className="filters">
            <div className="filter-group">
              <span className="filter-label">Tipo de vaga</span>
              <div className="filter-btns">
                {TIPO_FILTERS.map(f => (
                  <button
                    key={f}
                    className={`filter-btn${tipoFilter === f ? " active" : ""}`}
                    onClick={() => setTipoFilter(f)}
                  >
                    {f}
                  </button>
                ))}
              </div>
            </div>

            <div className="filter-group">
              <span className="filter-label">Modalidade</span>
              <div className="filter-btns">
                {MODALIDADE_FILTERS.map(f => (
                  <button
                    key={f}
                    className={`filter-btn${modalidadeFilter === f ? " active" : ""}`}
                    onClick={() => setModalidadeFilter(f)}
                  >
                    {f}
                  </button>
                ))}
              </div>
            </div>

            <div className="filter-group">
              <span className="filter-label">Área de atuação</span>
              <div className="filter-select-wrap">
                <select className="filter-select">
                  <option value="">Todas as áreas</option>
                  <option>Tecnologia</option>
                  <option>Educação</option>
                  <option>Saúde</option>
                  <option>Meio Ambiente</option>
                </select>
                <FiChevronDown className="select-chevron" />
              </div>
            </div>

            <button className="clear-btn" onClick={clearFilters}>
              <FiFilter className="clear-icon" /> Limpar filtros
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="tabs">
          {TABS.map((t, i) => (
            <button
              key={i}
              className={`tab-btn${activeTab === i ? " active" : ""}`}
              onClick={() => setActiveTab(i)}
            >
              <span className="tab-icon">{t.icon}</span> {t.label}
            </button>
          ))}
        </div>

        {/* Projects Grid */}
        {projetosFiltrados.length > 0 ? (
          <div className="projects-grid">
            {projetosFiltrados.map(p => (
              <div className="project-card" key={p.id}>
                <div className="card-img">
                  <img src={p.img} alt={p.title} loading="lazy" />
                  <div className="card-img-overlay"></div>
                  <button
                    className={`fav-btn${liked[p.id] ? " liked" : ""}`}
                    onClick={() => toggleLike(p.id)}
                    title={liked[p.id] ? "Remover dos favoritos" : "Adicionar aos favoritos"}
                  >
                    {liked[p.id] ? <FaHeart className="fav-icon-filled" /> : <FaRegHeart className="fav-icon-outline" />}
                  </button>
                </div>
                <div className="card-body">
                  <div className="tag-row">
                    {p.tags.map(t => (
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
                      <FiUsers className="meta-icon" />
                      <span>{p.vagas} vagas</span>
                    </div>
                    <div className="meta-item">
                      <span className="meta-icon">{p.modalidadeIcon}</span>
                      <span>{p.modalidade}</span>
                    </div>
                  </div>
                  <div className="card-actions">
                    <button className="btn-outline">Detalhes</button>
                    <button className="btn-primary">Candidatar-se</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <FiSearch className="empty-state-icon" />
            <h3>Nenhuma oportunidade encontrada</h3>
            <p>Tente remover ou alterar os filtros para ver mais projetos.</p>
            <button className="btn-outline mt-3" onClick={clearFilters}>Limpar todos os filtros</button>
          </div>
        )}

        {/* Load More */}
        {projetosFiltrados.length > 0 && (
          <div className="load-more-wrap">
            <button className="load-more-btn">
              Mostrar mais oportunidades <FiChevronDown />
            </button>
          </div>
        )}
      </main>
    </div>
  );
}