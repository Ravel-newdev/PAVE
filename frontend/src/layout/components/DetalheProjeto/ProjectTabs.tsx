import {
  CheckCircle,
  Shield,
  MessageCircle,
  Facebook,
  Linkedin,
  Link as LinkIcon,
  Mail,
  ChevronRight,
} from "lucide-react";
import type { Project } from "../../../data/projetos";

export function TabSobre({ projeto }: { projeto: Project }) {
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
                <CheckCircle className="dp-list__check-icon" size={18} />
                <span>{b}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="dp-safety">
        <div className="dp-safety__icon-wrap">
          <Shield className="dp-safety__icon" size={24} />
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
            <button type="button" className="dp-share-btn" aria-label="WhatsApp"><MessageCircle size={18} /></button>
            <button type="button" className="dp-share-btn" aria-label="Facebook"><Facebook size={18} /></button>
            <button type="button" className="dp-share-btn" aria-label="LinkedIn"><Linkedin size={18} /></button>
            <button type="button" className="dp-share-btn" aria-label="Copiar Link"><LinkIcon size={18} /></button>
          </div>
        </div>
      </div>
    </div>
  );
}

export function TabAtividades({ projeto }: { projeto: Project }) {
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

export function TabRequisitos({ projeto }: { projeto: Project }) {
  return (
    <div className="dp-fade-in">
      <h2 className="dp-section-title">Requisitos</h2>
      <p className="dp-section-sub">
        Para se candidatar, é importante que você atenda aos seguintes critérios:
      </p>
      {projeto.requisitos.map((r, i) => (
        <div key={i} className="dp-req">
          <CheckCircle className="dp-req__icon" size={20} />
          <span className="dp-req__text">{r}</span>
        </div>
      ))}
    </div>
  );
}

export function TabBeneficios({ projeto }: { projeto: Project }) {
  return (
    <div className="dp-fade-in">
      <h2 className="dp-section-title">Benefícios</h2>
      <p className="dp-section-sub">Veja o que você ganha ao participar deste projeto:</p>
      <div className="dp-beneficios-grid">
        {projeto.beneficios.map((b, i) => (
          <div key={i} className="dp-beneficio">
            <CheckCircle className="dp-beneficio__icon" size={20} />
            <span>{b}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function TabProfessor({
  projeto,
  onViewProfile,
}: {
  projeto: Project;
  onViewProfile: () => void;
}) {
  const p = projeto.professor;
  return (
    <div className="dp-fade-in">
      <h2 className="dp-section-title" style={{ marginBottom: 20 }}>
        Professor responsável
      </h2>
      <div className="dp-prof-card">
        <div className="dp-prof-avatar">{p.nome.charAt(6)}</div>
        <div className="dp-prof-info">
          <div className="dp-prof-info__name">{p.nome}</div>
          <div className="dp-prof-info__dept">{p.departamento}</div>
          <div className="dp-prof-info__email">
            <Mail size={14} style={{ marginRight: 6 }} />
            {p.email}
          </div>
        </div>
        <button type="button" className="dp-outline-btn" onClick={onViewProfile}>
          Ver perfil <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
}