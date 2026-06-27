import { Briefcase, Calendar, Clock, CheckCircle2, ChevronRight } from "lucide-react";
import type { Projeto } from "@/types/projeto";

interface Props {
  projeto: Projeto;
  onClick?: (id: string) => void;
}

function diasRestantes(dataTermino?: string): number | null {
  if (!dataTermino) return null;
  const diff = new Date(dataTermino).getTime() - Date.now();
  return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
}

export function ProjetoResumoItem({ projeto, onClick }: Props) {
  const encerrado = projeto.status === "encerrado";
  const dias = diasRestantes(projeto.data_termino);

  return (
    <div
      onClick={() => onClick?.(projeto.id)}
      className="flex items-center gap-4 px-6 py-4 cursor-pointer hover:bg-[#F8FAFC] transition-colors"
    >
      <div className="flex items-center justify-center w-11 h-11 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] shrink-0">
        <Briefcase className="w-5 h-5 text-[#64748B]" />
      </div>

      <div className="min-w-0 flex-1">
        <p className="text-[15px] font-bold text-[#1E2E4F] truncate">{projeto.titulo}</p>
        <p className="text-sm text-[#64748B]">{projeto.centro_dep ?? "—"}</p>
      </div>

      <div className="flex items-center gap-1.5 w-24 shrink-0">
        <Calendar className="w-4 h-4 text-[#287999]" />
        <div className="leading-tight">
          <p className="text-sm font-bold text-[#1E2E4F]">—</p>
          <p className="text-xs text-[#64748B]">vagas</p>
        </div>
      </div>

      <div className="flex items-center gap-1.5 w-28 shrink-0">
        {encerrado ? (
          <>
            <CheckCircle2 className="w-4 h-4 text-[#287999]" />
            <div className="leading-tight">
              <p className="text-sm font-bold text-[#1E2E4F]">Encerrado</p>
              <p className="text-xs text-[#64748B]">{projeto.data_termino ?? "—"}</p>
            </div>
          </>
        ) : (
          <>
            <Clock className="w-4 h-4 text-[#287999]" />
            <div className="leading-tight">
              <p className="text-sm font-bold text-[#1E2E4F]">{dias !== null ? `${dias} dias` : "—"}</p>
              <p className="text-xs text-[#64748B]">restantes</p>
            </div>
          </>
        )}
      </div>

      <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold shrink-0 ${
        encerrado
          ? "bg-[#F8FAFC] border border-[#E2E8F0] text-[#64748B]"
          : "bg-emerald-50 border border-emerald-200 text-emerald-700"
      }`}>
        {!encerrado && <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />}
        {encerrado ? "Encerrado" : "Ativo"}
      </span>

      <ChevronRight className="w-4 h-4 text-[#E2E8F0] shrink-0" />
    </div>
  );
}
