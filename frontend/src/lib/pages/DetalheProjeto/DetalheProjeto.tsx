import { useState, type ReactNode } from "react";
import Navbar from "@/components/Navbar/Navbar";
import { 
  FiUsers, FiGlobe, FiCheckCircle, FiShield, 
  FiMessageCircle, FiFacebook, FiLinkedin, FiLink, 
  FiUser, FiClock, FiCalendar, FiMail, FiChevronRight 
} from "react-icons/fi";
import { MdOutlineEco } from "react-icons/md";
import "./DetalheProjeto.css";

type Stat = {
  valor: string;
  label: string;
  detalhe: string;
  icon: ReactNode;
};

type Professor = {
  nome: string;
  departamento: string;
  email: string;
};

type Projeto = {
  id: number;
  titulo: string;
  resumo: string;
  tipo: string[];
  area: string;
  publicoAlvo: string;
  modalidade: string;
  local: string;
  cargaHoraria: string;
  periodo: string;
  vagasTotal: number;
  vagasPreenchidas: number;
  stats: Stat[];
  atividades: string[];
  beneficios: string[];
  requisitos: string[];
  professor: Professor;
  descricaoCompleta: string;
  bannerUrl: string | null;
}; 

/* ─── Dados de exemplo ─ */
const PROJECT_EXAMPLE: Projeto = {
  id: 1,
  titulo: "Sustentabilidade na Comunidade",
  resumo: "Projeto de educação ambiental voltado para práticas sustentáveis e conscientização comunitária em bairros da cidade.",
  tipo: ["Extensão", "Voluntariado"],
  area: "Meio Ambiente",
  publicoAlvo: "Comunidade em geral",
  modalidade: "Presencial",
  local: "Bairros da cidade",
  cargaHoraria: "12h semanais",
  periodo: "Abril a Dezembro/2025",
  vagasTotal: 15,
  vagasPreenchidas: 12,
  stats: [
    { valor: "+200", label: "pessoas impactadas", detalhe: "desde o início do projeto", icon: <FiUsers /> },
    { valor: "12",   label: "ações realizadas",   detalhe: "em comunidades locais",    icon: <MdOutlineEco /> },
    { valor: "3",    label: "bairros atendidos",  detalhe: "na cidade",               icon: <FiGlobe /> },
  ],
  atividades: [
    "Participar de reuniões semanais de planejamento",
    "Apoiar na organização de oficinas e eventos",
    "Atuar em ações educativas nas comunidades",
    "Produzir relatórios e materiais de divulgação",
    "Acompanhar o impacto das ações realizadas",
  ],
  beneficios: [
    "Desenvolvimento pessoal e profissional",
    "Contribuição para o impacto social",
    "Horas complementares",
    "Certificado de participação",
  ],
  requisitos: [
    "Disponibilidade nos fins de semana",
    "Interesse em meio ambiente e sustentabilidade",
    "Comunicação clara e trabalho em equipe",
  ],
  professor: {
    nome: "Prof. Carlos Mendes",
    departamento: "Engenharia Ambiental",
    email: "carlos.mendes@instituicao.edu.br",
  },
  descricaoCompleta:
    "O projeto tem como objetivo promover a educação ambiental e incentivar práticas sustentáveis na comunidade. Atuamos em escolas, praças e centros comunitários com oficinas, palestras e ações de revitalização de espaços públicos.",
  bannerUrl: null,
};


/* ─── Tab content sections ─ */
function TabSobre({ projeto }: { projeto: Projeto }) {
  return (
    <div className="dp-fade-in">
      <h2 className="dp-section-title">Sobre o projeto</h2>
      <p className="dp-section-p">{projeto.descricaoCompleta}</p>

      <div className="dp-stats">
        {projeto.stats.map((s, i) => (
          <div key={i} className="dp-stat">
            <span className="dp-stat__icon">{s.icon}</span>
            <div>
              <div className="dp-stat__val">{s.valor}</div>
              <div className="dp-stat__lbl">{s.label}</div>
              <div className="dp-stat__sub">{s.detalhe}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="dp-two-col">
        <div className="dp-box">
          <h3 className="dp-box__title">O que você vai fazer</h3>
          <ul className="dp-list">
            {projeto.atividades.map((a, i) => (
              <li key={i} className="dp-list__bullet">
                <div className="dp-list__bullet-dot" />
                <span>{a}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="dp-box">
          <h3 className="dp-box__title">Por que participar?</h3>
          <ul className="dp-list">
            {projeto.beneficios.map((b, i) => (
              <li key={i} className="dp-list__check">
                <FiCheckCircle className="dp-list__check-icon" />
                <span>{b}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="dp-safety">
        <div className="dp-safety__icon-wrap">
          <FiShield className="dp-safety__icon" />
        </div>
        <div className="dp-safety__content">
          <div className="dp-safety__title">Ambiente seguro</div>
          <div className="dp-safety__desc">
            Todos os projetos passam por análise da instituição para garantir segurança e qualidade.
          </div>
        </div>
        <div className="dp-safety__share">
          <span className="dp-safety__share-label">Compartilhar</span>
          <div className="dp-share-buttons">
            <button className="dp-share-btn" aria-label="WhatsApp"><FiMessageCircle /></button>
            <button className="dp-share-btn" aria-label="Facebook"><FiFacebook /></button>
            <button className="dp-share-btn" aria-label="LinkedIn"><FiLinkedin /></button>
            <button className="dp-share-btn" aria-label="Copiar Link"><FiLink /></button>
          </div>
        </div>
      </div>
    </div>
  );
}

function TabAtividades({ projeto }: { projeto : Projeto }) {
  return (
    <div className="dp-fade-in">
      <h2 className="dp-section-title">Atividades do projeto</h2>
      <p className="dp-section-sub">Confira o que você irá realizar ao participar deste projeto.</p>
      {projeto.atividades.map((a, i) => (
        <div key={i} className="dp-activity">
          <span className="dp-activity__num">{i + 1}</span>
          <span className="dp-activity__text">{a}</span>
        </div>
      ))}
    </div>
  );
}

function TabRequisitos({ projeto }: {projeto: Projeto }) {
  return (
    <div className="dp-fade-in">
      <h2 className="dp-section-title">Requisitos</h2>
      <p className="dp-section-sub">Para se candidatar, é importante que você atenda aos seguintes critérios:</p>
      {projeto.requisitos.map((r, i) => (
        <div key={i} className="dp-req">
          <FiCheckCircle className="dp-req__icon" />
          <span className="dp-req__text">{r}</span>
        </div>
      ))}
    </div>
  );
}

function TabBeneficios({ projeto }: { projeto: Projeto }) {
  return (
    <div className="dp-fade-in">
      <h2 className="dp-section-title">Benefícios</h2>
      <p className="dp-section-sub">Veja o que você ganha ao participar deste projeto:</p>
      <div className="dp-beneficios-grid">
        {projeto.beneficios.map((b, i) => (
          <div key={i} className="dp-beneficio">
            <FiCheckCircle className="dp-beneficio__icon" />
            <span>{b}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function TabProfessor({ 
  projeto, 
  onViewProfile 
}: {
  projeto: Projeto;
  onViewProfile: () => void;
}) {
  const p = projeto.professor;
  return (
    <div className="dp-fade-in">
      <h2 className="dp-section-title" style={{ marginBottom: 20 }}>Professor responsável</h2>
      <div className="dp-prof-card">
        <div className="dp-prof-avatar">{p.nome.charAt(5)}</div>
        <div className="dp-prof-info">
          <div className="dp-prof-info__name">{p.nome}</div>
          <div className="dp-prof-info__dept">{p.departamento}</div>
          <div className="dp-prof-info__email">
            <FiMail /> {p.email}
          </div>
        </div>
        <button className="dp-outline-btn" onClick={onViewProfile}>
          Ver perfil <FiChevronRight />
        </button>
      </div>
    </div>
  );
}

/* ─── Sidebar ─ */
function Sidebar({ 
  projeto, 
  applied, 
  onApply, 
  onViewProfessor 
}: {
  projeto: Projeto;
  applied: boolean;
  onApply: () => void;
  onViewProfessor: () => void;
}) {
  const vagasDisp = projeto.vagasTotal - projeto.vagasPreenchidas;
  const pct = (projeto.vagasPreenchidas / projeto.vagasTotal) * 100;
  const p = projeto.professor;

  return (
    <>
      <div className="dp-card">
        <div className="dp-vagas-header">
          <div className="dp-vagas-info">
            <div className="dp-vagas-icon"><FiUsers /></div>
            <div>
              <div className="dp-vagas-title">Vagas disponíveis</div>
              <div className="dp-vagas-sub">
                {vagasDisp > 0 ? `${vagasDisp} vagas disponíveis` : "Sem vagas"} de {projeto.vagasTotal} no total
              </div>
            </div>
          </div>
          <div className="dp-progress-bar">
            <div
              className={`dp-progress-fill${pct >= 90 ? " dp-progress-fill--warn" : ""}`}
              style={{ width: `${pct}%` }}
            />
          </div>
        </div>
        <div className="dp-vagas-cta">
          <button
            className={`dp-cta-btn${applied ? " dp-cta-btn--applied" : vagasDisp === 0 ? " dp-cta-btn--disabled" : ""}`}
            disabled={applied || vagasDisp === 0}
            onClick={onApply}
          >
            {applied ? "Candidatura enviada!" : vagasDisp === 0 ? "Vagas esgotadas" : "Candidatar-se"}
          </button>
          {!applied && vagasDisp > 0 && (
            <div className="dp-cta-hint">
              <FiUsers style={{ display: 'inline', marginRight: '4px' }}/> 
              {projeto.vagasPreenchidas} pessoas já se inscreveram
            </div>
          )}
        </div>
      </div>

      <div className="dp-card dp-card--pad">
        <div className="dp-aside-title dp-aside-title--expand">Informações principais</div>
        {[
          { label: "Tipo", value: projeto.tipo[projeto.tipo.length - 1], primary: true },
          { label: "Área", value: projeto.area },
          { label: "Público alvo", value: projeto.publicoAlvo },
          { label: "Modalidade", value: projeto.modalidade },
          { label: "Local", value: projeto.local },
          { label: "Carga horária", value: projeto.cargaHoraria },
          { label: "Período", value: projeto.periodo },
        ].map((row, i) => (
          <div key={i} className="dp-info-row">
            <span className="dp-info-row__label">{row.label}</span>
            <span className={`dp-info-row__value${row.primary ? " dp-info-row__value--primary" : ""}`}>
              {row.value}
            </span>
          </div>
        ))}
      </div>

      <div className="dp-card dp-card--pad">
        <div className="dp-aside-title">Professor responsável</div>
        <div className="dp-prof-mini">
          <div className="dp-prof-mini__avatar">{p.nome.charAt(5)}</div>
          <div>
            <div className="dp-prof-mini__name">{p.nome}</div>
            <div className="dp-prof-mini__dept">{p.departamento}</div>
          </div>
        </div>
        <div className="dp-prof-mini__email">
          <FiMail /> {p.email}
        </div>
        <button className="dp-prof-btn" onClick={onViewProfessor}>
          Ver perfil do professor <FiChevronRight />
        </button>
      </div>
    </>
  );
}

/* ─── Main component ───────────────────────────────────────── */
export default function DetalheProjeto({ 
  projeto = PROJECT_EXAMPLE, 
  onBack, 
  onApply 
}: {
  projeto?: Projeto;
  onBack?: () => void;
  onApply?: () => void;
}) {
  const [tab, setTab] = useState("sobre");
  const [applied, setApplied] = useState(false);

  const vagasDisp = projeto.vagasTotal - projeto.vagasPreenchidas;

  function handleApply() {
    if (applied || vagasDisp === 0) return;
    setApplied(true);
    onApply?.();
  }

  const TABS = [
    { id: "sobre",      label: "Sobre o projeto" },
    { id: "atividades", label: "Atividades" },
    { id: "requisitos", label: "Requisitos" },
    { id: "beneficios", label: "Benefícios" },
    { id: "professor",  label: "Professor" },
  ];

  const tagColor = (t: string) => t === "Voluntariado" ? "dp-tag--vol" : t === "Extensão" ? "dp-tag--ext" : "dp-tag--blue";

  return (
    <div className="dp-root">
      <Navbar />

      <div className="dp-page">
        <nav className="dp-breadcrumb" aria-label="Breadcrumb">
          <a href="#" onClick={e => { e.preventDefault(); onBack?.(); }}>Projetos</a>
          <FiChevronRight className="dp-breadcrumb-icon" />
          <span className="dp-breadcrumb__current">{projeto.titulo}</span>
        </nav>

        <div className="dp-hero">
          {projeto.bannerUrl
            ? <img src={projeto.bannerUrl} alt="" className="dp-hero__bg-img" />
            : <div className="dp-hero__bg-gradient" />
          }
          <div className="dp-hero__overlay" />
          <div className="dp-hero__content">
            <div className="dp-hero__tags">
              {projeto.tipo.map(t => (
                <span key={t} className={`dp-tag ${tagColor(t)}`}>{t}</span>
              ))}
            </div>
            <h1 className="dp-hero__title">{projeto.titulo}</h1>
            <p className="dp-hero__desc">{projeto.resumo}</p>
            <div className="dp-hero__meta">
              {[
                { icon: <FiUser />,    main: projeto.professor.nome,       sub: projeto.professor.departamento },
                { icon: <FiUsers />,   main: `${projeto.vagasTotal} vagas`, sub: `${projeto.vagasPreenchidas} preenchidas` },
                { icon: <FiClock />,   main: projeto.cargaHoraria,         sub: "Carga horária" },
                { icon: <FiCalendar />,main: "Abr a Dez/2025",             sub: "Duração" },
              ].map((m, i) => (
                <div key={i} className="dp-meta-item">
                  <span className="dp-meta-item__icon">{m.icon}</span>
                  <div>
                    <div className="dp-meta-item__main">{m.main}</div>
                    <div className="dp-meta-item__sub">{m.sub}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="dp-body">
          <main className="dp-main">
            <div className="dp-card">
              <div className="dp-tabs" role="tablist">
                {TABS.map(t => (
                  <button
                    key={t.id}
                    role="tab"
                    aria-selected={tab === t.id}
                    className={`dp-tab${tab === t.id ? " dp-tab--active" : ""}`}
                    onClick={() => setTab(t.id)}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
              <div className="dp-tab-body">
                {tab === "sobre"      && <TabSobre      projeto={projeto} />}
                {tab === "atividades" && <TabAtividades projeto={projeto} />}
                {tab === "requisitos" && <TabRequisitos projeto={projeto} />}
                {tab === "beneficios" && <TabBeneficios projeto={projeto} />}
                {tab === "professor"  && <TabProfessor  projeto={projeto} onViewProfile={() => setTab("professor")} />}
              </div>
            </div>
          </main>

          <aside className="dp-aside">
            <Sidebar
              projeto={projeto}
              applied={applied}
              onApply={handleApply}
              onViewProfessor={() => setTab("professor")}
            />
          </aside>
        </div>
      </div>

      {/* Mobile sticky CTA */}
      <div className="dp-mobile-cta">
        <div className="dp-mobile-cta__info">
          <div className="dp-mobile-cta__vagas">
            {vagasDisp > 0 ? `${vagasDisp} vagas disponíveis` : "Vagas esgotadas"}
          </div>
          <div className="dp-mobile-cta__sub">de {projeto.vagasTotal} no total</div>
        </div>
        <button
          className={`dp-mobile-cta__btn${applied ? " dp-mobile-cta__btn--applied" : ""}`}
          disabled={applied || vagasDisp === 0}
          onClick={handleApply}
        >
          {applied ? "Inscrito!" : vagasDisp === 0 ? "Esgotado" : "Candidatar-se"}
        </button>
      </div>
    </div>
  );
}