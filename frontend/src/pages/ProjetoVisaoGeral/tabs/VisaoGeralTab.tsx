import { BarChart3, Briefcase, Calendar, CheckCircle2, FileText, GraduationCap, Info, Tag, Timer, Users, XCircle } from "lucide-react";
import { StatCard } from "../components/StatCard";
import type { Projeto } from "../../../types/projeto";

export function VisaoGeralTab({ projeto }: { projeto: Projeto }) {
  return (
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
  );
}
