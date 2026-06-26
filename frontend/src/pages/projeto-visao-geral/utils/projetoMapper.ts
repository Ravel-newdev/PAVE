import type { Projeto } from "../../../types/projeto";

export function mapProjeto(raw: unknown): Projeto {
  const root = (raw && typeof raw === "object" ? raw : {}) as Record<string, unknown>;
  const data = (typeof root.data === "object" && root.data ? root.data : root) as Record<string, unknown>;

  return {
    id: String(data.id ?? ""),
    titulo: String(data.titulo ?? ""),
    descricao: data.descricao ? String(data.descricao) : undefined,
    carga_hora: data.carga_hora ? Number(data.carga_hora) : undefined,
    data_inic: data.data_inic ? String(data.data_inic) : undefined,
    data_termino: data.data_termino ? String(data.data_termino) : undefined,
    centro_dep: data.centro_dep ? String(data.centro_dep) : undefined,
    status: (data.status as Projeto["status"]) ?? "rascunho",
    autor_id: String(data.autor_id ?? ""),
    autor_nome: String(data.autor_nome ?? ""),
    tags: Array.isArray(data.tags)
      ? data.tags.map((t: unknown) =>
          typeof t === "object" && t !== null
            ? { id: String((t as Record<string, unknown>).id ?? ""), nome: String((t as Record<string, unknown>).nome ?? "") }
            : { id: "", nome: String(t) }
        )
      : [],
    criado_em: String(data.criado_em ?? ""),
  };
}
