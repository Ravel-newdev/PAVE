import { CheckCircle, Shield, MessageCircle, Facebook, Linkedin, Link as LinkIcon } from "lucide-react";
import type { Projeto } from "@/types/projeto";

export function TabSobre({ projeto }: { projeto: Projeto }) {
  return (
    <div className="dp-fade-in">
      <h2 className="dp-section-title">Sobre o projeto</h2>
      <p className="dp-section-p">{projeto.descricao ?? "Sem descrição disponível."}</p>

      <div className="dp-two-col">
        {projeto.tags.length > 0 && (
          <div className="dp-box">
            <h3 className="dp-box__title">Áreas de atuação</h3>
            <ul className="dp-list">
              {projeto.tags.map((t) => (
                <li key={t.id} className="dp-list__bullet">
                  <div className="dp-list__bullet-dot" />
                  <span>{t.nome}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="dp-box">
          <h3 className="dp-box__title">Informações gerais</h3>
          <ul className="dp-list">
            {projeto.carga_hora && (
              <li className="dp-list__bullet">
                <div className="dp-list__bullet-dot" />
                <span>Carga horária: {projeto.carga_hora}h/semana</span>
              </li>
            )}
            {projeto.data_inic && (
              <li className="dp-list__bullet">
                <div className="dp-list__bullet-dot" />
                <span>Início: {new Date(projeto.data_inic).toLocaleDateString("pt-BR")}</span>
              </li>
            )}
            {projeto.data_termino && (
              <li className="dp-list__bullet">
                <div className="dp-list__bullet-dot" />
                <span>Término: {new Date(projeto.data_termino).toLocaleDateString("pt-BR")}</span>
              </li>
            )}
            {projeto.centro_dep && (
              <li className="dp-list__bullet">
                <div className="dp-list__bullet-dot" />
                <span>Centro: {projeto.centro_dep}</span>
              </li>
            )}
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

export function TabRequisitos({ projeto }: { projeto: Projeto }) {
  return (
    <div className="dp-fade-in">
      <h2 className="dp-section-title">Requisitos</h2>
      <p className="dp-section-sub">
        Confira as áreas de conhecimento e o período de dedicação esperado.
      </p>
      {projeto.tags.length > 0
        ? projeto.tags.map((t) => (
            <div key={t.id} className="dp-req">
              <CheckCircle className="dp-req__icon" size={20} />
              <span className="dp-req__text">Conhecimentos em {t.nome}</span>
            </div>
          ))
        : <p className="dp-section-p">Nenhum requisito específico informado.</p>
      }
    </div>
  );
}

export function TabProfessor({ projeto }: { projeto: Projeto }) {
  const inicial = projeto.autor_nome.charAt(0).toUpperCase();
  return (
    <div className="dp-fade-in">
      <h2 className="dp-section-title" style={{ marginBottom: 20 }}>
        Professor responsável
      </h2>
      <div className="dp-prof-card">
        <div className="dp-prof-avatar">{inicial}</div>
        <div className="dp-prof-info">
          <div className="dp-prof-info__name">{projeto.autor_nome}</div>
          <div className="dp-prof-info__dept">{projeto.centro_dep ?? "—"}</div>
        </div>
      </div>
    </div>
  );
}
