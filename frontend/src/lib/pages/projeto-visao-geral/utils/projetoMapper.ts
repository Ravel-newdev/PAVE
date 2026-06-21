import { projeto } from "../constants/projetoVisaoData";

function textFrom(data: Record<string, unknown>, keys: string[], fallback: string) {
  for (const key of keys) {
    const value = data[key];
    if (typeof value === "string" || typeof value === "number") return String(value);
  }
  return fallback;
}

export function mapProjeto(raw: unknown) {
  const root = (raw && typeof raw === "object" ? raw : {}) as Record<string, unknown>;
  const data = typeof root.data === "object" && root.data ? (root.data as Record<string, unknown>) : root;
  const vagasBolsistas = Number(data.vagasBolsistas ?? data.vagas_bolsistas ?? 12);
  const vagasVoluntarios = Number(data.vagasVoluntarios ?? data.vagas_voluntarios ?? 8);
  const palavras = data.palavrasChave ?? data.palavras_chave ?? data.tags;

  return {
    ...projeto,
    id: Number(data.id ?? data.projetoId ?? projeto.id),
    titulo: textFrom(data, ["titulo", "title", "nome"], projeto.titulo),
    status: textFrom(data, ["status"], projeto.status),
    area: textFrom(data, ["area", "areaTematica", "area_tematica"], projeto.area),
    inscritos: Number(data.inscritos ?? data.totalInscritos ?? projeto.inscritos),
    vagas: `${vagasBolsistas}/${vagasBolsistas + vagasVoluntarios} vagas`,
    prazo: textFrom(data, ["prazo", "dataFimInscricao", "fim_inscricoes"], projeto.prazo),
    descricao: textFrom(data, ["descricao", "description"], projeto.descricao),
    palavrasChave: Array.isArray(palavras) ? palavras.map(String) : projeto.palavrasChave,
  };
}

