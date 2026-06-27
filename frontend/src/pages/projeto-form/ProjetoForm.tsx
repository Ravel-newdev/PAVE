import { useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import {
  ClipboardList,
  FileText,
  Plus,
  Save,
  Send,
  Trash2,
  Users,
} from "lucide-react";
import { ProfessorNavbar } from "@/layout/componente-professor/ProfessorNavbar";
import "./ProjetoForm.css";
import { paveApi } from "@/services/PaveApiService";
import { useSearch } from "@tanstack/react-router";
import { FieldLabel, Section, SelectField } from "./components/FormFields";
import {
  areaOptions,
  cargaOptions,
  initialCreateData,
  initialDocumentos,
  initialEditData,
  modelosPergunta,
  perguntasEdit,
  tipoPerguntaLabels,
  unidadeOptions,
} from "./constants/projetoFormConstants";
import type { DocumentoSolicitado, FormData, Pergunta, ProjetoFormMode, TipoPergunta } from "./types/projetoFormTypes";
import {
  buildProcessoPayload,
  buildProjetoPayload,
  createPergunta,
  mapProjetoToFormData,
} from "./utils/projetoFormUtils";

function ProfessorTopbar() {
  return <ProfessorNavbar />;
}

export default function ProjetoForm({ mode = "create" }: { mode?: ProjetoFormMode }) {
  const isEdit = mode === "edit";
  const [formData, setFormData] = useState<FormData>(isEdit ? initialEditData : initialCreateData);
  const [documentos, setDocumentos] = useState<DocumentoSolicitado[]>(initialDocumentos);
  const [perguntas, setPerguntas] = useState<Pergunta[]>(isEdit ? perguntasEdit : []);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(isEdit);
  const { projetoId: searchProjetoId } = useSearch({ strict: false }) as { projetoId?: string };
  const projetoId = searchProjetoId ?? "";
  const navigate = useNavigate();

  const totalCaracteresDescricao = formData.descricao.length;
  const totalCaracteresTitulo = formData.titulo.length;
  const totalCaracteresPalavras = formData.palavrasChave.length;
  const totalCaracteresMensagem = formData.mensagemCandidatos.length;

  const pageTitle = isEdit ? "Editar projeto" : "Criar projeto";
  const pageDescription = isEdit
    ? "Atualize as informações do projeto de extensão."
    : "Preencha as informações do seu projeto de extensão.";

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
        console.warn("Não foi possível buscar o projeto. Mantendo dados de exemplo.", error);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadProjeto();

    return () => {
      cancelled = true;
    };
  }, [isEdit, projetoId]);

  const updateField = (field: keyof FormData, value: string) => {
    setFormData((current) => ({ ...current, [field]: value }));
  };

  const toggleDocumento = (id: DocumentoSolicitado["id"]) => {
    setDocumentos((current) =>
      current.map((documento) =>
        documento.id === id ? { ...documento, selecionado: !documento.selecionado } : documento
      )
    );
  };

  const addPergunta = (tipo: TipoPergunta = "resposta-curta") => {
    setPerguntas((current) => [...current, createPergunta(tipo)]);
  };

  const addPerguntaModelo = (modelo: Omit<Pergunta, "id">) => {
    setPerguntas((current) => [
      ...current,
      { ...modelo, id: Date.now() + Math.floor(Math.random() * 1000) },
    ]);
  };

  const updatePergunta = (id: number, field: keyof Pergunta, value: string | boolean | string[]) => {
    setPerguntas((current) =>
      current.map((pergunta) => {
        if (pergunta.id !== id) return pergunta;

        if (field === "tipo") {
          const novoTipo = value as TipoPergunta;
          return {
            ...pergunta,
            tipo: novoTipo,
            opcoes:
              novoTipo === "sim-nao"
                ? ["Sim", "Não"]
                : novoTipo === "multipla-escolha"
                  ? pergunta.opcoes.length > 0
                    ? pergunta.opcoes
                    : [""]
                  : [],
          };
        }

        return { ...pergunta, [field]: value };
      })
    );
  };

  const updateOpcao = (perguntaId: number, optionIndex: number, value: string) => {
    setPerguntas((current) =>
      current.map((pergunta) => {
        if (pergunta.id !== perguntaId) return pergunta;
        const opcoesAtualizadas = pergunta.opcoes.map((opcao, index) =>
          index === optionIndex ? value : opcao
        );
        return { ...pergunta, opcoes: opcoesAtualizadas };
      })
    );
  };

  const addOpcao = (perguntaId: number) => {
    setPerguntas((current) =>
      current.map((pergunta) =>
        pergunta.id === perguntaId ? { ...pergunta, opcoes: [...pergunta.opcoes, ""] } : pergunta
      )
    );
  };

  const removeOpcao = (perguntaId: number, optionIndex: number) => {
    setPerguntas((current) =>
      current.map((pergunta) => {
        if (pergunta.id !== perguntaId) return pergunta;
        return { ...pergunta, opcoes: pergunta.opcoes.filter((_, index) => index !== optionIndex) };
      })
    );
  };

  const removePergunta = (id: number) => {
    setPerguntas((current) => current.filter((pergunta) => pergunta.id !== id));
  };

  const payloadPreview = useMemo(
    () => ({
      ...formData,
      documentosSolicitados: documentos.filter((documento) => documento.selecionado).map((documento) => documento.id),
      perguntas,
    }),
    [formData, documentos, perguntas]
  );

  async function saveProject(status: "rascunho" | "ativo") {
    if (!formData.titulo.trim() || !formData.area || !formData.unidade || !formData.descricao.trim()) {
      alert("Preencha os campos obrigatórios antes de continuar.");
      return;
    }

    try {
      setSaving(true);
      const projetoPayload = buildProjetoPayload(formData, status);
      const response = isEdit
        ? await paveApi.atualizarProjeto(projetoId, projetoPayload)
        : await paveApi.criarProjeto(projetoPayload);

      const idCriado = response.id ?? projetoId;
      const processoPayload = buildProcessoPayload(idCriado, formData, documentos, perguntas);

      const temProcesso = Boolean(formData.inscricaoInicio && formData.inscricaoFim);
      if (temProcesso) {
        if (isEdit) {
          await paveApi.atualizarProcesso(idCriado, processoPayload).catch((error) => {
            console.warn("Processo seletivo não atualizado. Confira se o backend espera id do processo ou id do projeto.", error);
          });
        } else {
          await paveApi.criarProcesso(processoPayload).catch((error) => {
            console.warn("Projeto salvo, mas processo seletivo não foi criado.", error);
          });
        }
      }

      alert(status === "rascunho" ? "Rascunho salvo com sucesso." : isEdit ? "Projeto atualizado com sucesso." : "Projeto publicado com sucesso.");
      navigate({ to: "/professor/projeto-visao-geral", search: { id: idCriado } as never });
    } catch (error) {
      console.error("Erro ao salvar projeto", error, payloadPreview);
      alert("Não foi possível salvar. Verifique se você está logada e se o backend está rodando.");
    } finally {
      setSaving(false);
    }
  }

  const handleSaveDraft = () => saveProject("rascunho");

  const handleSubmit = () => saveProject("ativo");

  const handleCancel = () => {
    window.history.back();
  };

  return (
    <main className="pf-page">
      <ProfessorTopbar />

      <div className="pf-container">
        {loading && <div className="pf-card">Carregando dados do projeto...</div>}
        <div className="pf-header-row">
          <div>
            <h1>{pageTitle}</h1>
            <p>{pageDescription}</p>
          </div>

          <div className="pf-header-actions">
            <button className="pf-button pf-button-secondary" type="button" onClick={handleSaveDraft} disabled={saving}>
              <Save size={18} />
              Salvar rascunho
            </button>
            <button className="pf-button pf-button-primary" type="button" onClick={handleSubmit} disabled={saving}>
              <Send size={18} />
              {saving ? "Salvando..." : isEdit ? "Salvar alterações" : "Publicar projeto"}
            </button>
          </div>
        </div>

        <form className="pf-form" onSubmit={(event) => event.preventDefault()}>
          <Section icon={<FileText size={20} />} title="Informações básicas">
            <div className="pf-field-full">
              <FieldLabel required>Título do projeto</FieldLabel>
              <input
                className="pf-input"
                value={formData.titulo}
                onChange={(event) => updateField("titulo", event.target.value.slice(0, 120))}
                placeholder="Ex.: Educação Ambiental nas Escolas Públicas"
              />
              <span className="pf-counter">{totalCaracteresTitulo}/120</span>
            </div>

            <div className="pf-grid-2">
              <div>
                <FieldLabel required>Área temática</FieldLabel>
                <SelectField
                  value={formData.area}
                  onChange={(value) => updateField("area", value)}
                  placeholder="Selecione uma área"
                  options={areaOptions}
                />
              </div>
              <div>
                <FieldLabel required>Unidade responsável</FieldLabel>
                <SelectField
                  value={formData.unidade}
                  onChange={(value) => updateField("unidade", value)}
                  placeholder="Selecione a unidade"
                  options={unidadeOptions}
                />
              </div>
            </div>

            <div className="pf-field-full">
              <FieldLabel required>Descrição do projeto</FieldLabel>
              <p className="pf-help">Explique os objetivos, atividades e impacto esperado do projeto.</p>
              <textarea
                className="pf-input pf-textarea"
                value={formData.descricao}
                onChange={(event) => updateField("descricao", event.target.value.slice(0, 2000))}
                placeholder="Descreva seu projeto..."
              />
              <span className="pf-counter">{totalCaracteresDescricao}/2000</span>
            </div>

            <div className="pf-field-full">
              <FieldLabel>Palavras-chave (até 5)</FieldLabel>
              <p className="pf-help">Adicione palavras-chave que descrevem seu projeto.</p>
              <input
                className="pf-input"
                value={formData.palavrasChave}
                onChange={(event) => updateField("palavrasChave", event.target.value.slice(0, 100))}
                placeholder="Ex.: meio ambiente, sustentabilidade, educação"
              />
              <span className="pf-counter">{totalCaracteresPalavras}/100</span>
            </div>
          </Section>

          <Section icon={<Users size={20} />} title="Vagas e participação">
            <div className="pf-grid-3">
              <div>
                <FieldLabel required>Vagas para bolsistas</FieldLabel>
                <input
                  className="pf-input"
                  value={formData.vagasBolsistas}
                  onChange={(event) => updateField("vagasBolsistas", event.target.value)}
                  placeholder="Ex.: 10"
                  inputMode="numeric"
                />
                <p className="pf-help">Vagas destinadas a alunos bolsistas.</p>
              </div>
              <div>
                <FieldLabel required>Vagas para voluntários</FieldLabel>
                <input
                  className="pf-input"
                  value={formData.vagasVoluntarios}
                  onChange={(event) => updateField("vagasVoluntarios", event.target.value)}
                  placeholder="Ex.: 6"
                  inputMode="numeric"
                />
                <p className="pf-help">Vagas destinadas a alunos voluntários.</p>
              </div>
              <div>
                <FieldLabel>Carga horária semanal</FieldLabel>
                <SelectField
                  value={formData.cargaHoraria}
                  onChange={(value) => updateField("cargaHoraria", value)}
                  placeholder="Selecione a carga horária"
                  options={cargaOptions}
                />
                <p className="pf-help">Horas semanais dedicadas ao projeto.</p>
              </div>
            </div>
          </Section>

          <Section icon={<ClipboardList size={20} />} title="Processo seletivo e formulário de inscrição">
            <div className="pf-grid-processo">
              <div>
                <FieldLabel required>Período de inscrições</FieldLabel>
                <div className="pf-date-row">
                  <input
                    className="pf-input"
                    type="date"
                    value={formData.inscricaoInicio}
                    onChange={(event) => updateField("inscricaoInicio", event.target.value)}
                  />
                  <span>→</span>
                  <input
                    className="pf-input"
                    type="date"
                    value={formData.inscricaoFim}
                    onChange={(event) => updateField("inscricaoFim", event.target.value)}
                  />
                </div>
              </div>
              <div>
                <FieldLabel required>Divulgação dos resultados</FieldLabel>
                <input
                  className="pf-input"
                  type="date"
                  value={formData.divulgacaoResultado}
                  onChange={(event) => updateField("divulgacaoResultado", event.target.value)}
                />
              </div>
            </div>

            <div className="pf-field-full">
              <FieldLabel>Mensagem aos candidatos (opcional)</FieldLabel>
              <p className="pf-help">Mensagem inicial que os candidatos verão ao acessar o formulário de inscrição.</p>
              <textarea
                className="pf-input pf-message"
                value={formData.mensagemCandidatos}
                onChange={(event) => updateField("mensagemCandidatos", event.target.value.slice(0, 500))}
                placeholder="Escreva uma mensagem para os candidatos..."
              />
              <span className="pf-counter">{totalCaracteresMensagem}/500</span>
            </div>

            <div className="pf-field-full">
              <FieldLabel>Itens solicitados ao candidato</FieldLabel>
              <p className="pf-help">Selecione documentos e informações padrão que o candidato deverá enviar.</p>

              <div className="pf-document-grid">
                {documentos.map((documento) => (
                  <label className="pf-document-option" key={documento.id}>
                    <input
                      type="checkbox"
                      checked={documento.selecionado}
                      onChange={() => toggleDocumento(documento.id)}
                    />
                    <span>
                      <strong>{documento.label}</strong>
                      <small>{documento.descricao}</small>
                    </span>
                  </label>
                ))}
              </div>
            </div>

            <div className="pf-field-full">
              <FieldLabel>Perguntas personalizadas</FieldLabel>
              <p className="pf-help">Monte perguntas no estilo Google Forms. Use modelos prontos ou crie uma pergunta do zero.</p>

              <div className="pf-template-row" aria-label="Modelos de pergunta">
                {modelosPergunta.map((modelo) => (
                  <button className="pf-template-button" type="button" key={modelo.texto} onClick={() => addPerguntaModelo(modelo)}>
                    <Plus size={15} />
                    {modelo.texto}
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
                          onChange={(event) => updatePergunta(pergunta.id, "tipo", event.target.value as TipoPergunta)}
                        >
                          {Object.entries(tipoPerguntaLabels).map(([tipo, label]) => (
                            <option value={tipo} key={tipo}>{label}</option>
                          ))}
                        </select>
                        <label className="pf-required-toggle">
                          <input
                            type="checkbox"
                            checked={pergunta.obrigatoria}
                            onChange={(event) => updatePergunta(pergunta.id, "obrigatoria", event.target.checked)}
                          />
                          Obrigatória
                        </label>
                        <button className="pf-delete-question" type="button" onClick={() => removePergunta(pergunta.id)} aria-label="Remover pergunta">
                          <Trash2 size={17} />
                        </button>
                      </div>

                      <input
                        className="pf-input pf-question-title-input"
                        value={pergunta.texto}
                        onChange={(event) => updatePergunta(pergunta.id, "texto", event.target.value)}
                        placeholder="Escreva a pergunta. Ex.: Qual seu semestre atual?"
                      />

                      {pergunta.tipo === "resposta-curta" && (
                        <div className="pf-answer-preview">Resposta curta do candidato</div>
                      )}

                      {pergunta.tipo === "paragrafo" && (
                        <div className="pf-answer-preview pf-answer-preview-large">Resposta em parágrafo do candidato</div>
                      )}

                      {pergunta.tipo === "sim-nao" && (
                        <div className="pf-options-preview">
                          <span>○ Sim</span>
                          <span>○ Não</span>
                        </div>
                      )}

                      {pergunta.tipo === "multipla-escolha" && (
                        <div className="pf-options-editor">
                          {pergunta.opcoes.map((opcao, optionIndex) => (
                            <div className="pf-option-row" key={`${pergunta.id}-${optionIndex}`}>
                              <span>○</span>
                              <input
                                className="pf-input"
                                value={opcao}
                                onChange={(event) => updateOpcao(pergunta.id, optionIndex, event.target.value)}
                                placeholder={`Opção ${optionIndex + 1}`}
                              />
                              <button type="button" className="pf-remove-option" onClick={() => removeOpcao(pergunta.id, optionIndex)}>
                                Remover
                              </button>
                            </div>
                          ))}
                          <button className="pf-add-option" type="button" onClick={() => addOpcao(pergunta.id)}>
                            <Plus size={15} />
                            Adicionar opção
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}

              <button className="pf-add-question" type="button" onClick={() => addPergunta()}>
                <Plus size={17} />
                Adicionar pergunta em branco
              </button>
            </div>
          </Section>

          <div className="pf-bottom-actions">
            <button className="pf-button pf-button-secondary" type="button" onClick={handleCancel}>Cancelar</button>
            <div>
              <button className="pf-button pf-button-secondary" type="button" onClick={handleSaveDraft} disabled={saving}>
                <Save size={18} />
                Salvar rascunho
              </button>
              <button className="pf-button pf-button-primary" type="button" onClick={handleSubmit} disabled={saving}>
                <Send size={18} />
                {saving ? "Salvando..." : isEdit ? "Salvar alterações" : "Publicar projeto"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </main>
  );
}
