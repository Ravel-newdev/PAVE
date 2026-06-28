import { initialEditData } from "../constants/projetoFormConstants";
import type { DocumentoSolicitado, FormData, Pergunta, TipoPergunta } from "../types/projetoFormTypes";
import type { CriarProcessoPayload } from "@/types/processo";

export function createPergunta(tipo: TipoPergunta = "resposta-curta"): Pergunta {
  return {
    id: Date.now() + Math.floor(Math.random() * 1000),
    texto: "",
    tipo,
    opcoes: tipo === "sim-nao" ? ["Sim", "Não"] : tipo === "multipla-escolha" ? [""] : [],
    obrigatoria: false,
  };
}

function readText(data: Record<string, unknown>, keys: string[], fallback = ""): string {
  for (const key of keys) {
    const value = data[key];
    if (typeof value === "string" || typeof value === "number") return String(value);
  }
  return fallback;
}

export function mapProjetoToFormData(raw: unknown): Partial<FormData> {
  const data = (raw && typeof raw === "object" ? raw : {}) as Record<string, unknown>;
  const nested = typeof data.data === "object" && data.data ? (data.data as Record<string, unknown>) : data;

  const cargaRaw = readText(nested, ["carga_hora", "cargaHoraria"], "");
  const cargaNum = parseInt(cargaRaw, 10);

  return {
    titulo:       readText(nested, ["titulo"], initialEditData.titulo),
    descricao:    readText(nested, ["descricao"], initialEditData.descricao),
    unidade:      readText(nested, ["centro_dep", "unidade"], initialEditData.unidade),
    cargaHoraria: isNaN(cargaNum) ? "" : String(cargaNum),
    dataInic:     readText(nested, ["data_inic"], initialEditData.dataInic),
    dataTermino:  readText(nested, ["data_termino"], initialEditData.dataTermino),
  };
}

export function buildProjetoPayload(formData: FormData) {
  const carga = parseInt(formData.cargaHoraria, 10);
  return {
    titulo:       formData.titulo,
    descricao:    formData.descricao   || undefined,
    centro_dep:   formData.unidade     || undefined,
    carga_hora:   isNaN(carga) ? undefined : carga,
    data_inic:    formData.dataInic    || undefined,
    data_termino: formData.dataTermino || undefined,
  };
}

export function buildProcessoPayload(
  projetoId: string,
  formData: FormData,
  _documentos: DocumentoSolicitado[],
  _perguntas: Pergunta[],
): CriarProcessoPayload {
  return {
    projeto_id:   projetoId,
    titulo:       formData.titulo,
    data_inicio:  formData.inscricaoInicio || undefined,
    data_termino: formData.inscricaoFim    || undefined,
  };
}

export function validateForm(formData: FormData): string | null {
  if (!formData.titulo.trim()) return "O título do projeto é obrigatório.";
  if (formData.cargaHoraria && isNaN(parseInt(formData.cargaHoraria, 10))) return "Carga horária deve ser um número inteiro.";
  if (formData.dataInic && formData.dataTermino && formData.dataTermino < formData.dataInic) return "A data de término do projeto não pode ser anterior à data de início.";
  if (formData.inscricaoInicio && formData.inscricaoFim && formData.inscricaoFim < formData.inscricaoInicio) return "A data de encerramento das inscrições não pode ser anterior à data de início.";
  return null;
}
