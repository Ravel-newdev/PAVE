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

export function readText(data: Record<string, unknown>, keys: string[], fallback = "") {
  for (const key of keys) {
    const value = data[key];
    if (typeof value === "string" || typeof value === "number") return String(value);
  }
  return fallback;
}

export function mapProjetoToFormData(raw: unknown): Partial<FormData> {
  const data = (raw && typeof raw === "object" ? raw : {}) as Record<string, unknown>;
  const nested = typeof data.data === "object" && data.data ? (data.data as Record<string, unknown>) : data;

  return {
    titulo: readText(nested, ["titulo", "title", "nome"], initialEditData.titulo),
    area: readText(nested, ["area", "areaTematica", "area_tematica", "tag"], initialEditData.area),
    unidade: readText(nested, ["unidade", "unidadeResponsavel", "unidade_responsavel"], initialEditData.unidade),
    descricao: readText(nested, ["descricao", "description"], initialEditData.descricao),
    palavrasChave: Array.isArray(nested.palavrasChave)
      ? nested.palavrasChave.join(", ")
      : readText(nested, ["palavrasChave", "palavras_chave", "tags"], initialEditData.palavrasChave),
    vagasBolsistas: readText(nested, ["vagasBolsistas", "vagas_bolsistas", "qtd_bolsistas"], initialEditData.vagasBolsistas),
    vagasVoluntarios: readText(nested, ["vagasVoluntarios", "vagas_voluntarios", "qtd_voluntarios"], initialEditData.vagasVoluntarios),
    cargaHoraria: readText(nested, ["cargaHoraria", "carga_horaria", "cargaHorariaSemanal"], initialEditData.cargaHoraria),
  };
}

export function buildProjetoPayload(formData: FormData, status: "rascunho" | "ativo") {
  const palavrasChave = formData.palavrasChave
    .split(",")
    .map((palavra) => palavra.trim())
    .filter(Boolean);

  return {
    titulo: formData.titulo,
    descricao: formData.descricao,
    area: formData.area,
    areaTematica: formData.area,
    unidade: formData.unidade,
    unidadeResponsavel: formData.unidade,
    vagasBolsistas: Number(formData.vagasBolsistas || 0),
    vagasVoluntarios: Number(formData.vagasVoluntarios || 0),
    cargaHoraria: formData.cargaHoraria,
    cargaHorariaSemanal: formData.cargaHoraria,
    palavrasChave,
    status,
  };
}

export function buildProcessoPayload(
  projetoId: string,
  formData: FormData,
  _documentos: DocumentoSolicitado[],
  _perguntas: Pergunta[],
): CriarProcessoPayload {
  return {
    projeto_id: projetoId,
    titulo: formData.titulo,
    descricao: formData.mensagemCandidatos || undefined,
    data_inicio: formData.inscricaoInicio || undefined,
    data_termino: formData.inscricaoFim || undefined,
  };
}

