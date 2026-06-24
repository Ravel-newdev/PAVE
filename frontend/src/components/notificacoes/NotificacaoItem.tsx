import { CheckSquare, Calendar, Clock, MessageSquare, Star, Info } from "lucide-react";
import type { Notificacao, TipoNotificacao } from "@/types/notificacao";

const estilos: Record<TipoNotificacao, { icone: typeof CheckSquare; bg: string; cor: string }> = {
  aprovacao:    { icone: CheckSquare,   bg: "bg-emerald-50 border border-emerald-200", cor: "text-emerald-600"  },
  novo_projeto: { icone: Calendar,      bg: "bg-[#e8f3f7] border border-[#c5dfe8]",   cor: "text-[#287999]"    },
  prazo:        { icone: Clock,         bg: "bg-amber-50 border border-amber-200",     cor: "text-amber-600"   },
  atualizacao:  { icone: MessageSquare, bg: "bg-blue-50 border border-blue-200",       cor: "text-blue-600"    },
  favorito:     { icone: Star,          bg: "bg-purple-50 border border-purple-200",   cor: "text-purple-600"  },
  sistema:      { icone: Info,          bg: "bg-[#F8FAFC] border border-[#E2E8F0]",    cor: "text-[#64748B]"   },
};

interface Props {
  notificacao: Notificacao;
  onClick: (id: string) => void;
}

export function NotificacaoItem({ notificacao, onClick }: Props) {
  const { icone: Icone, bg, cor } = estilos[notificacao.tipo];

  return (
    <div
      onClick={() => onClick(notificacao.id)}
      className={`flex items-start gap-4 px-6 py-4 cursor-pointer transition-colors hover:bg-[#F8FAFC] ${!notificacao.lida ? "bg-[#e8f3f7]/30" : ""}`}
    >
      <div className="w-2 pt-2 shrink-0">
        {!notificacao.lida && <span className="block w-2 h-2 rounded-full bg-[#287999]" />}
      </div>

      <div className={`flex items-center justify-center w-10 h-10 rounded-xl ${bg} shrink-0`}>
        <Icone className={`w-5 h-5 ${cor}`} />
      </div>

      <div className="flex-1 min-w-0">
        <p className={`text-[15px] font-bold ${notificacao.lida ? "text-[#334155]" : "text-[#1E2E4F]"}`}>
          {notificacao.titulo}
        </p>
        <p className="text-sm text-[#64748B] mt-0.5">{notificacao.mensagem}</p>
      </div>

      {notificacao.dataFormatada && (
        <span className="text-xs text-[#94a3b8] whitespace-nowrap shrink-0 mt-1">
          {notificacao.dataFormatada}
        </span>
      )}
    </div>
  );
}