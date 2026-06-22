import { Sprout, BookOpen, Trophy, Briefcase, Users, Calendar, Clock, CheckCircle2, ChevronRight } from "lucide-react";
import type { ProjetoResumo } from "@/types/dashboard";

const categorias: Record<string, { icone: typeof Sprout; bg: string; cor: string }> = {
  Educação:   { icone: Sprout,    bg: "bg-green-100",  cor: "text-green-600"  },
  Linguística:{ icone: BookOpen,  bg: "bg-blue-100",   cor: "text-blue-600"   },
  Cultura:    { icone: Trophy,    bg: "bg-purple-100", cor: "text-purple-600" },
};
const padrao = { icone: Briefcase, bg: "bg-gray-100", cor: "text-gray-500" };

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
      className="flex items-center gap-4 px-6 py-4 cursor-pointer hover:bg-gray-50 transition-colors"
    >
      <div className={`flex items-center justify-center w-11 h-11 rounded-xl ${bg} shrink-0`}>
        <Icone className={`w-5 h-5 ${cor}`} />
      </div>

      <div className="min-w-0 flex-1">
        <p
          className="text-[15px] font-bold text-gray-900 truncate"
          style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
        >
          {projeto.titulo}
        </p>
        <p className="text-sm text-gray-400 font-sans">{projeto.categoria}</p>
      </div>

      <div className="flex items-center gap-1.5 w-20 shrink-0">
        <Users className="w-4 h-4 text-gray-300" />
        <div className="leading-tight">
          <p className="text-sm font-semibold text-gray-700 font-sans">{projeto.inscritos}</p>
          <p className="text-xs text-gray-400 font-sans">inscritos</p>
        </div>
      </div>

      <div className="flex items-center gap-1.5 w-20 shrink-0">
        <Calendar className="w-4 h-4 text-gray-300" />
        <div className="leading-tight">
          <p className="text-sm font-semibold text-gray-700 font-sans">
            {projeto.vagasPreenchidas}/{projeto.vagasTotal}
          </p>
          <p className="text-xs text-gray-400 font-sans">vagas</p>
        </div>
      </div>

      <div className="flex items-center gap-1.5 w-28 shrink-0">
        {encerrado ? (
          <>
            <CheckCircle2 className="w-4 h-4 text-gray-300" />
            <div className="leading-tight">
              <p className="text-sm font-semibold text-gray-700 font-sans">Finalizado em</p>
              <p className="text-xs text-gray-400 font-sans">{projeto.finalizadoEm}</p>
            </div>
          </>
        ) : (
          <>
            <Clock className="w-4 h-4 text-gray-300" />
            <div className="leading-tight">
              <p className="text-sm font-semibold text-gray-700 font-sans">{projeto.diasRestantes} dias</p>
              <p className="text-xs text-gray-400 font-sans">restantes</p>
            </div>
          </>
        )}
      </div>

      <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium font-sans shrink-0 ${
        encerrado ? "bg-gray-100 text-gray-500" : "bg-green-50 text-green-700"
      }`}>
        {!encerrado && <span className="w-1.5 h-1.5 rounded-full bg-green-500" />}
        {encerrado ? "Encerrado" : "Ativo"}
      </span>

      <ChevronRight className="w-4 h-4 text-gray-300 shrink-0" />
    </div>
  );
}