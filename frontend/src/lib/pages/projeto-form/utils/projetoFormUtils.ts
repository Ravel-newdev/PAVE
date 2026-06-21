import { initialEditData } from "../constants/projetoFormConstants";
import type { DocumentoSolicitado, FormData, Pergunta, TipoPergunta } from "../types/projetoFormTypes";

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
  projetoId: string | number,
  formData: FormData,
  documentos: DocumentoSolicitado[],
  perguntas: Pergunta[],
) {
  return {
    projetoId,
    idProjeto: projetoId,
    dataInicioInscricao: formData.inscricaoInicio,
    dataFimInscricao: formData.inscricaoFim,
    dataResultado: formData.divulgacaoResultado,
    mensagemCandidatos: formData.mensagemCandidatos,
    documentosSolicitados: documentos
      .filter((documento) => documento.selecionado)
      .map((documento) => documento.id),
    formulario: perguntas.map((pergunta) => ({
      texto: pergunta.texto,
      tipo: pergunta.tipo,
      opcoes: pergunta.opcoes.filter(Boolean),
      obrigatoria: pergunta.obrigatoria,
    })),
  };
}

