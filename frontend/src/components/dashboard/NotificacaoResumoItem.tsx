import { UserRound, Calendar, Megaphone, ChevronRight } from "lucide-react";
import type { NotificacaoResumo, TipoNotificacaoProfessor } from "@/types/dashboard";

const estilos: Record<TipoNotificacaoProfessor, { icone: typeof UserRound; bg: string; cor: string }> = {
  candidatura:  { icone: UserRound, bg: "bg-emerald-50 border border-emerald-200", cor: "text-emerald-600" },
  novo_projeto: { icone: Calendar,  bg: "bg-[#e8f3f7] border border-[#c5dfe8]",   cor: "text-[#287999]"  },
  resultado:    { icone: Megaphone, bg: "bg-purple-50 border border-purple-200",   cor: "text-purple-600" },
};

interface Props {
  notificacao: NotificacaoResumo;
  onClick?: (id: string) => void;
}

export function NotificacaoResumoItem({ notificacao, onClick }: Props) {
  const { icone: Icone, bg, cor } = estilos[notificacao.tipo];

  return (
    <div
      onClick={() => onClick?.(notificacao.id)}
      className="flex items-center gap-4 px-6 py-4 cursor-pointer hover:bg-[#F8FAFC] transition-colors"
    >
      <div className={`flex items-center justify-center w-10 h-10 rounded-xl ${bg} shrink-0`}>
        <Icone className={`w-5 h-5 ${cor}`} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[15px] font-bold text-[#1E2E4F]">{notificacao.titulo}</p>
        <p className="text-sm text-[#64748B] mt-0.5">{notificacao.mensagem}</p>
      </div>
      <span className="text-xs text-[#94a3b8] whitespace-nowrap shrink-0">{notificacao.dataFormatada}</span>
      <ChevronRight className="w-4 h-4 text-[#E2E8F0] shrink-0" />
    </div>
  );
}