import { Users, Mail, ChevronRight } from "lucide-react";
import type { Project } from "../../../../data/projetos";

interface SidebarProps {
  projeto: Project;
  applied: boolean;
  onApply: () => void;
  onViewProfessor: () => void;
}

export function Sidebar({ projeto, applied, onApply, onViewProfessor }: SidebarProps) {
  const vagasDisp = projeto.vagasTotal - projeto.vagasPreenchidas;
  const pct       = (projeto.vagasPreenchidas / projeto.vagasTotal) * 100;
  const p         = projeto.professor;

  return (
    <>
      {/*  Card de vagas  */}
      <div className="dp-card">
        <div className="dp-vagas-header">
          <div className="dp-vagas-info">
            <div className="dp-vagas-icon">
              <Users size={24} />
            </div>
            <div>
              <div className="dp-vagas-title">Vagas disponíveis</div>
              <div className="dp-vagas-sub">
                {vagasDisp > 0 ? `${vagasDisp} vagas disponíveis` : "Sem vagas"} de{" "}
                {projeto.vagasTotal} no total
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
            type="button"
            className={`dp-cta-btn${
              applied
                ? " dp-cta-btn--applied"
                : vagasDisp === 0
                ? " dp-cta-btn--disabled"
                : ""
            }`}
            disabled={applied || vagasDisp === 0}
            onClick={onApply}
          >
            {applied
              ? "Candidatura enviada!"
              : vagasDisp === 0
              ? "Vagas esgotadas"
              : "Candidatar-se"}
          </button>

          {!applied && vagasDisp > 0 && (
            <div className="dp-cta-hint">
              <Users size={14} style={{ display: "inline", marginRight: 4 }} />
              {projeto.vagasPreenchidas} pessoas já se inscreveram
            </div>
          )}
        </div>
      </div>

      {/*  Informações do projeto  */}
      <div className="dp-card dp-card--pad">
        <div className="dp-aside-title dp-aside-title--expand">Informações principais</div>
        {(
          [
            { label: "Tipo",         value: projeto.tipo[projeto.tipo.length - 1], primary: true },
            { label: "Área",         value: projeto.area },
            { label: "Público alvo", value: projeto.publicoAlvo },
            { label: "Modalidade",   value: projeto.modalidade },
            { label: "Local",        value: projeto.local },
            { label: "Carga horária",value: projeto.cargaHoraria },
            { label: "Período",      value: projeto.periodo },
          ] as { label: string; value: string; primary?: boolean }[]
        ).map((row, i) => (
          <div key={i} className="dp-info-row">
            <span className="dp-info-row__label">{row.label}</span>
            <span
              className={`dp-info-row__value${
                row.primary ? " dp-info-row__value--primary" : ""
              }`}
            >
              {row.value}
            </span>
          </div>
        ))}
      </div>

      <div className="dp-card dp-card--pad">
        <div className="dp-aside-title">Professor responsável</div>
        <div className="dp-prof-mini">
          <div className="dp-prof-mini__avatar">{p.nome.charAt(6)}</div>
          <div>
            <div className="dp-prof-mini__name">{p.nome}</div>
            <div className="dp-prof-mini__dept">{p.departamento}</div>
          </div>
        </div>
        <div className="dp-prof-mini__email">
          <Mail size={14} style={{ marginRight: 6 }} />
          {p.email}
        </div>
        <button type="button" className="dp-prof-btn" onClick={onViewProfessor}>
          Ver perfil do professor <ChevronRight size={16} />
        </button>
      </div>
    </>
  );
}