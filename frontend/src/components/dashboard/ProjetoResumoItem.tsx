import { Sprout, BookOpen, Trophy, Briefcase, Users, Calendar, Clock, CheckCircle2, ChevronRight } from "lucide-react";
import type { ProjetoResumo } from "@/types/dashboard";

const categorias: Record<string, { icone: typeof Sprout; bg: string; cor: string }> = {
  Educação:    { icone: Sprout,   bg: "bg-emerald-50 border border-emerald-200", cor: "text-emerald-600" },
  Linguística: { icone: BookOpen, bg: "bg-[#e8f3f7] border border-[#c5dfe8]",   cor: "text-[#287999]"  },
  Cultura:     { icone: Trophy,   bg: "bg-purple-50 border border-purple-200",   cor: "text-purple-600" },
};
const padrao = { icone: Briefcase, bg: "bg-[#F8FAFC] border border-[#E2E8F0]", cor: "text-[#64748B]" };

interface Props {
  projeto: ProjetoResumo;
  onClick?: (id: string) => void;
}

export function ProjetoResumoItem({ projeto, onClick }: Props) {
  const { icone: Icone, bg, cor } = categorias[projeto.categoria] ?? padrao;
  const encerrado = projeto.status === "encerrado";

  return (
    <div
      onClick={() => onClick?.(projeto.id)}
      className="flex items-center gap-4 px-6 py-4 cursor-pointer hover:bg-[#F8FAFC] transition-colors"
    >
      <div className={`flex items-center justify-center w-11 h-11 rounded-xl ${bg} shrink-0`}>
        <Icone className={`w-5 h-5 ${cor}`} />
      </div>

      <div className="min-w-0 flex-1">
        <p className="text-[15px] font-bold text-[#1E2E4F] truncate">{projeto.titulo}</p>
        <p className="text-sm text-[#64748B]">{projeto.categoria}</p>
      </div>

      <div className="flex items-center gap-1.5 w-20 shrink-0">
        <Users className="w-4 h-4 text-[#287999]" />
        <div className="leading-tight">
          <p className="text-sm font-bold text-[#1E2E4F]">{projeto.inscritos}</p>
          <p className="text-xs text-[#64748B]">inscritos</p>
        </div>
      </div>

      <div className="flex items-center gap-1.5 w-20 shrink-0">
        <Calendar className="w-4 h-4 text-[#287999]" />
        <div className="leading-tight">
          <p className="text-sm font-bold text-[#1E2E4F]">{projeto.vagasPreenchidas}/{projeto.vagasTotal}</p>
          <p className="text-xs text-[#64748B]">vagas</p>
        </div>
      </div>

      <div className="flex items-center gap-1.5 w-28 shrink-0">
        {encerrado ? (
          <>
            <CheckCircle2 className="w-4 h-4 text-[#287999]" />
            <div className="leading-tight">
              <p className="text-sm font-bold text-[#1E2E4F]">Finalizado em</p>
              <p className="text-xs text-[#64748B]">{projeto.finalizadoEm}</p>
            </div>
          </>
        ) : (
          <>
            <Clock className="w-4 h-4 text-[#287999]" />
            <div className="leading-tight">
              <p className="text-sm font-bold text-[#1E2E4F]">{projeto.diasRestantes} dias</p>
              <p className="text-xs text-[#64748B]">restantes</p>
            </div>
          </>
        )}
      </div>

      <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold shrink-0 ${
        encerrado ? "bg-[#F8FAFC] border border-[#E2E8F0] text-[#64748B]" : "bg-emerald-50 border border-emerald-200 text-emerald-700"
      }`}>
        {!encerrado && <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />}
        {encerrado ? "Encerrado" : "Ativo"}
      </span>

      <ChevronRight className="w-4 h-4 text-[#E2E8F0] shrink-0" />
    </div>
  );
}