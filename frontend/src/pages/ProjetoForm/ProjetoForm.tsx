import { useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  CalendarDays, ClipboardList, FileText, PartyPopper,
  Plus, Save, Send, Trash2, Users,
} from "lucide-react";
import { ProfessorNavbar } from "@/layout/components/professor/ProfessorNavbar";
import "./ProjetoForm.css";
import { paveApi } from "@/services/PaveApiService";
import { ApiError } from "@/errors/ApiError";
import { useSearch } from "@tanstack/react-router";
import { FieldLabel, Section } from "./components/FormFields";
import {
  initialCreateData,
  initialDocumentos,
  initialEditData,
  modelosPergunta,
  perguntasEdit,
  tipoPerguntaLabels,
} from "./constants/projetoFormConstants";
import type { DocumentoSolicitado, FormData, Pergunta, ProjetoFormMode, TipoPergunta } from "./types/projetoFormTypes";
import {
  buildProcessoPayload,
  buildProjetoPayload,
  createPergunta,
  mapProjetoToFormData,
  validateForm,
} from "./utils/projetoFormUtils";

function SuccessScreen({ isEdit, onReset }: { isEdit: boolean; onReset: () => void }) {
  const navigate = useNavigate();
  return (
    <div className="pf-success-overlay">
      <div className="pf-success-card">
        <PartyPopper size={52} className="pf-success-icon" />
        <h2 className="pf-success-title">
          {isEdit ? "Projeto atualizado!" : "Projeto publicado!"}
        </h2>
        <p className="pf-success-desc">
          {isEdit
            ? "As alterações foram salvas e já estão visíveis na plataforma."
            : "Seu projeto já está visível no catálogo para todos os estudantes."}
        </p>
        <div className="pf-success-actions">
          <button
            type="button"
            className="pf-button pf-button-secondary"
            onClick={() => void navigate({ to: "/professor" })}
          >
            Ir para o início
          </button>
          {!isEdit && (
            <button type="button" className="pf-button pf-button-primary" onClick={onReset}>
              Criar outro projeto
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default function ProjetoForm({ mode = "create" }: { mode?: ProjetoFormMode }) {
  const isEdit = mode === "edit";
  const [formData, setFormData] = useState<FormData>(isEdit ? initialEditData : initialCreateData);
  const [documentos, setDocumentos] = useState<DocumentoSolicitado[]>(initialDocumentos);
  const [perguntas, setPerguntas] = useState<Pergunta[]>(isEdit ? perguntasEdit : []);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(isEdit);
  const [erro, setErro] = useState<string | null>(null);
  const [published, setPublished] = useState(false);

  const { projetoId: searchProjetoId } = useSearch({ strict: false }) as { projetoId?: string };
  const projetoId = searchProjetoId ?? "";
  const navigate = useNavigate();

  useEffect(() => {
    if (!isEdit) return;
    let cancelled = false;
    async function loadProjeto() {
      try {
        setLoading(true);
        const projeto = await paveApi.buscarProjeto(projetoId);
        if (cancelled) return;
        setFormData((current) => ({ ...current, ...mapProjetoToFormData(projeto) }));
      } catch (error) {
        console.error("Erro ao carregar projeto:", error);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    loadProjeto();
    return () => { cancelled = true; };
  }, [isEdit, projetoId]);

  const updateField = (field: keyof FormData, value: string) =>
    setFormData((current) => ({ ...current, [field]: value }));

  const toggleDocumento = (id: DocumentoSolicitado["id"]) =>
    setDocumentos((current) =>
      current.map((doc) => doc.id === id ? { ...doc, selecionado: !doc.selecionado } : doc)
    );

  const addPergunta = (tipo: TipoPergunta = "resposta-curta") =>
    setPerguntas((current) => [...current, createPergunta(tipo)]);

  const addPerguntaModelo = (modelo: Omit<Pergunta, "id">) =>
    setPerguntas((current) => [...current, { ...modelo, id: Date.now() + Math.floor(Math.random() * 1000) }]);

  const updatePergunta = (id: number, field: keyof Pergunta, value: string | boolean | string[]) =>
    setPerguntas((current) =>
      current.map((p) => {
        if (p.id !== id) return p;
        if (field === "tipo") {
          const novoTipo = value as TipoPergunta;
          return { ...p, tipo: novoTipo, opcoes: novoTipo === "sim-nao" ? ["Sim","Não"] : novoTipo === "multipla-escolha" ? (p.opcoes.length > 0 ? p.opcoes : [""]) : [] };
        }
        return { ...p, [field]: value };
      })
    );

  const updateOpcao = (perguntaId: number, optionIndex: number, value: string) =>
    setPerguntas((current) =>
      current.map((p) => p.id !== perguntaId ? p : { ...p, opcoes: p.opcoes.map((o, i) => i === optionIndex ? value : o) })
    );

  const addOpcao = (perguntaId: number) =>
    setPerguntas((current) =>
      current.map((p) => p.id !== perguntaId ? p : { ...p, opcoes: [...p.opcoes, ""] })
    );

  const removeOpcao = (perguntaId: number, optionIndex: number) =>
    setPerguntas((current) =>
      current.map((p) => p.id !== perguntaId ? p : { ...p, opcoes: p.opcoes.filter((_, i) => i !== optionIndex) })
    );

  const removePergunta = (id: number) =>
    setPerguntas((current) => current.filter((p) => p.id !== id));

  async function saveProject(status: "rascunho" | "ativo") {
    const validationError = validateForm(formData);
    if (validationError) { setErro(validationError); return; }
    setErro(null);
    setSaving(true);
    try {
      const projetoPayload = buildProjetoPayload(formData);
      const response = isEdit
        ? await paveApi.atualizarProjeto(projetoId, projetoPayload)
        : await paveApi.criarProjeto(projetoPayload);

      const idCriado = response.id ?? projetoId;

      if (status === "ativo") {
        await paveApi.alterarStatusProjeto(idCriado, { status: "ativo" });
      }

      const temProcesso = Boolean(formData.inscricaoInicio && formData.inscricaoFim);
      if (temProcesso) {
        const processoPayload = buildProcessoPayload(idCriado, formData, documentos, perguntas);
        if (isEdit) {
          await paveApi.atualizarProcesso(idCriado, processoPayload).catch((e) => console.error("Processo não atualizado:", e));
        } else {
          await paveApi.criarProcesso(processoPayload).catch((e) => console.error("Processo não criado:", e));
        }
      }

      if (status === "rascunho") {
        void navigate({ to: "/professor" });
      } else {
        setPublished(true);
      }
    } catch (error) {
      setErro(error instanceof ApiError ? error.message : "Erro ao salvar o projeto. Tente novamente.");
    } finally {
      setSaving(false);
    }
  }

  function handleReset() {
    setPublished(false);
    setFormData(initialCreateData);
    setDocumentos(initialDocumentos);
    setPerguntas([]);
    setErro(null);
  }

  if (published) return <SuccessScreen isEdit={isEdit} onReset={handleReset} />;

  return (
    <main className="pf-page">
      <ProfessorNavbar />

      <div className="pf-container">
        {loading && <div className="pf-card">Carregando dados do projeto...</div>}

        <div className="pf-header-row">
          <div>
            <h1>{isEdit ? "Editar projeto" : "Criar projeto"}</h1>
            <p>{isEdit ? "Atualize as informações do projeto de extensão." : "Preencha as informações do seu projeto de extensão."}</p>
          </div>
          <div className="pf-header-actions">
            <button className="pf-button pf-button-secondary" type="button" onClick={() => void saveProject("rascunho")} disabled={saving}>
              <Save size={18} /> Salvar rascunho
            </button>
            <button className="pf-button pf-button-primary" type="button" onClick={() => void saveProject("ativo")} disabled={saving}>
              <Send size={18} /> {saving ? "Salvando..." : isEdit ? "Salvar alterações" : "Publicar projeto"}
            </button>
          </div>
        </div>

        {erro && (
          <div className="pf-error-banner">{erro}</div>
        )}

        <form className="pf-form" onSubmit={(e) => e.preventDefault()}>

          <Section icon={<FileText size={20} />} title="Informações básicas">
            <div className="pf-field-full">
              <FieldLabel required>Título do projeto</FieldLabel>
              <input
                className="pf-input"
                value={formData.titulo}
                onChange={(e) => updateField("titulo", e.target.value.slice(0, 120))}
                placeholder="Ex.: Educação Ambiental nas Escolas Públicas"
              />
              <span className="pf-counter">{formData.titulo.length}/120</span>
            </div>

            <div className="pf-grid-2">
              <div>
                <FieldLabel>Unidade responsável</FieldLabel>
                <input
                  className="pf-input"
                  value={formData.unidade}
                  onChange={(e) => updateField("unidade", e.target.value)}
                  placeholder="Ex.: Departamento de Computação"
                />
              </div>
              <div>
                <FieldLabel>Carga horária semanal (horas)</FieldLabel>
                <input
                  className="pf-input"
                  type="number"
                  min="1"
                  max="40"
                  value={formData.cargaHoraria}
                  onChange={(e) => updateField("cargaHoraria", e.target.value)}
                  placeholder="Ex.: 12"
                />
              </div>
            </div>

            <div className="pf-field-full">
              <FieldLabel required>Descrição do projeto</FieldLabel>
              <p className="pf-help">Explique os objetivos, atividades e impacto esperado do projeto.</p>
              <textarea
                className="pf-input pf-textarea"
                value={formData.descricao}
                onChange={(e) => updateField("descricao", e.target.value.slice(0, 2000))}
                placeholder="Descreva seu projeto..."
              />
              <span className="pf-counter">{formData.descricao.length}/2000</span>
            </div>
          </Section>

          <Section icon={<CalendarDays size={20} />} title="Período do projeto">
            <div className="pf-grid-2">
              <div>
                <FieldLabel>Data de início</FieldLabel>
                <input className="pf-input" type="date" value={formData.dataInic}    onChange={(e) => updateField("dataInic", e.target.value)} />
              </div>
              <div>
                <FieldLabel>Data de término</FieldLabel>
                <input className="pf-input" type="date" value={formData.dataTermino} onChange={(e) => updateField("dataTermino", e.target.value)} />
              </div>
            </div>
          </Section>

          <Section icon={<Users size={20} />} title="Processo seletivo">
            <div className="pf-grid-2">
              <div>
                <FieldLabel>Início das inscrições</FieldLabel>
                <input className="pf-input" type="date" value={formData.inscricaoInicio} onChange={(e) => updateField("inscricaoInicio", e.target.value)} />
              </div>
              <div>
                <FieldLabel>Encerramento das inscrições</FieldLabel>
                <input className="pf-input" type="date" value={formData.inscricaoFim}    onChange={(e) => updateField("inscricaoFim", e.target.value)} />
              </div>
            </div>

            <div className="pf-field-full">
              <FieldLabel>Itens solicitados ao candidato</FieldLabel>
              <p className="pf-help">Selecione documentos e informações que o candidato deverá enviar.</p>
              <div className="pf-document-grid">
                {documentos.map((doc) => (
                  <label className="pf-document-option" key={doc.id}>
                    <input type="checkbox" checked={doc.selecionado} onChange={() => toggleDocumento(doc.id)} />
                    <span><strong>{doc.label}</strong><small>{doc.descricao}</small></span>
                  </label>
                ))}
              </div>
            </div>

            <div className="pf-field-full">
              <FieldLabel>Perguntas personalizadas</FieldLabel>
              <p className="pf-help">Adicione perguntas que os candidatos responderão ao se inscrever.</p>

              <div className="pf-template-row" aria-label="Modelos de pergunta">
                {modelosPergunta.map((modelo) => (
                  <button className="pf-template-button" type="button" key={modelo.texto} onClick={() => addPerguntaModelo(modelo)}>
                    <Plus size={15} />{modelo.texto}
                  </button>
                ))}
              </div>

              {perguntas.length > 0 && (
                <div className="pf-questions-list">
                  {perguntas.map((pergunta, index) => (
                    <div className="pf-question-card" key={pergunta.id}>
                      <div className="pf-question-card-header">
                        <span className="pf-question-number">{index + 1}</span>
                        <select
                          className="pf-input pf-question-type"
                          value={pergunta.tipo}
                          onChange={(e) => updatePergunta(pergunta.id, "tipo", e.target.value as TipoPergunta)}
                        >
                          {Object.entries(tipoPerguntaLabels).map(([tipo, label]) => (
                            <option value={tipo} key={tipo}>{label}</option>
                          ))}
                        </select>
                        <label className="pf-required-toggle">
                          <input type="checkbox" checked={pergunta.obrigatoria} onChange={(e) => updatePergunta(pergunta.id, "obrigatoria", e.target.checked)} />
                          Obrigatória
                        </label>
                        <button className="pf-delete-question" type="button" onClick={() => removePergunta(pergunta.id)} aria-label="Remover pergunta">
                          <Trash2 size={17} />
                        </button>
                      </div>

                      <input
                        className="pf-input pf-question-title-input"
                        value={pergunta.texto}
                        onChange={(e) => updatePergunta(pergunta.id, "texto", e.target.value)}
                        placeholder="Escreva a pergunta. Ex.: Qual seu semestre atual?"
                      />

                      {pergunta.tipo === "resposta-curta" && <div className="pf-answer-preview">Resposta curta do candidato</div>}
                      {pergunta.tipo === "paragrafo"      && <div className="pf-answer-preview pf-answer-preview-large">Resposta em parágrafo do candidato</div>}
                      {pergunta.tipo === "sim-nao"        && <div className="pf-options-preview"><span>○ Sim</span><span>○ Não</span></div>}

                      {pergunta.tipo === "multipla-escolha" && (
                        <div className="pf-options-editor">
                          {pergunta.opcoes.map((opcao, optionIndex) => (
                            <div className="pf-option-row" key={`${pergunta.id}-${optionIndex}`}>
                              <span>○</span>
                              <input className="pf-input" value={opcao} onChange={(e) => updateOpcao(pergunta.id, optionIndex, e.target.value)} placeholder={`Opção ${optionIndex + 1}`} />
                              <button type="button" className="pf-remove-option" onClick={() => removeOpcao(pergunta.id, optionIndex)}>Remover</button>
                            </div>
                          ))}
                          <button className="pf-add-option" type="button" onClick={() => addOpcao(pergunta.id)}>
                            <Plus size={15} /> Adicionar opção
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}

              <button className="pf-add-question" type="button" onClick={() => addPergunta()}>
                <Plus size={17} /> Adicionar pergunta em branco
              </button>
            </div>
          </Section>

          <Section icon={<ClipboardList size={20} />} title="Revisão">
            <div className="pf-review-grid">
              {[
                { label: "Título",          value: formData.titulo },
                { label: "Unidade",         value: formData.unidade },
                { label: "Carga horária",   value: formData.cargaHoraria ? `${formData.cargaHoraria}h/semana` : "" },
                { label: "Período",         value: formData.dataInic && formData.dataTermino ? `${formData.dataInic} → ${formData.dataTermino}` : "" },
                { label: "Inscrições",      value: formData.inscricaoInicio && formData.inscricaoFim ? `${formData.inscricaoInicio} → ${formData.inscricaoFim}` : "" },
                { label: "Perguntas",       value: perguntas.length > 0 ? `${perguntas.length} pergunta(s)` : "Nenhuma" },
              ].map(({ label, value }) => (
                <div key={label} className="pf-review-item">
                  <div className="pf-review-label">{label}</div>
                  <div className="pf-review-value">{value || "—"}</div>
                </div>
              ))}
            </div>
            {formData.descricao && (
              <div className="pf-review-desc">
                <div className="pf-review-label">Descrição</div>
                <div className="pf-review-value" style={{ marginTop: 4 }}>{formData.descricao}</div>
              </div>
            )}
          </Section>

          <div className="pf-bottom-actions">
            <button className="pf-button pf-button-secondary" type="button" onClick={() => window.history.back()}>Cancelar</button>
            <div>
              <button className="pf-button pf-button-secondary" type="button" onClick={() => void saveProject("rascunho")} disabled={saving}>
                <Save size={18} /> Salvar rascunho
              </button>
              <button className="pf-button pf-button-primary" type="button" onClick={() => void saveProject("ativo")} disabled={saving}>
                <Send size={18} /> {saving ? "Salvando..." : isEdit ? "Salvar alterações" : "Publicar projeto"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </main>
  );
}
