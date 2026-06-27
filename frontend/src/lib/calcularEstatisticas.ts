
import type { EstatisticasProjetos } from "@/types/projeto";

export interface ProjetoBruto {
  id: string;
  status: "rascunho" | "ativo" | "encerrado" | "suspenso";
  docente_id: string;
}

export function calcularEstatisticas(
  meuId: string,
  projetos: ProjetoBruto[]
): EstatisticasProjetos {
  const meusProjetos = projetos.filter((p) => p.docente_id === meuId);

  return {
    projetosAtivos: meusProjetos.filter((p) => p.status === "ativo").length,
    projetosRascunho: meusProjetos.filter((p) => p.status === "rascunho").length,
    projetosEncerrados: meusProjetos.filter((p) => p.status === "encerrado").length,
    projetosSuspensos: meusProjetos.filter((p) => p.status === "suspenso").length,
  };
}