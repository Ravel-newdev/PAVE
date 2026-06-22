import { CheckSquare, Calendar, Clock, MessageSquare, Star, Info } from "lucide-react";
import type { Notificacao, TipoNotificacao } from "@/types/notificacao";

const estilos: Record<TipoNotificacao, { icone: typeof CheckSquare; bg: string; cor: string }> = {
  aprovacao:    { icone: CheckSquare,   bg: "bg-green-100",   cor: "text-green-600"  },
  novo_projeto: { icone: Calendar,      bg: "bg-blue-100",    cor: "text-blue-600"   },
  prazo:        { icone: Clock,         bg: "bg-amber-100",   cor: "text-amber-600"  },
  atualizacao:  { icone: MessageSquare, bg: "bg-emerald-100", cor: "text-emerald-600"},
  favorito:     { icone: Star,          bg: "bg-purple-100",  cor: "text-purple-600" },
  sistema:      { icone: Info,          bg: "bg-gray-100",    cor: "text-gray-500"   },
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
      className="flex items-start gap-4 px-6 py-4 cursor-pointer hover:bg-gray-50 transition-colors"
    >
      <div className="w-2 pt-2 shrink-0">
        {!notificacao.lida && <span className="block w-2 h-2 rounded-full bg-[#1B3F3F]" />}
      </div>

      <div className={`flex items-center justify-center w-10 h-10 rounded-xl ${bg} shrink-0`}>
        <Icone className={`w-5 h-5 ${cor}`} />
      </div>

      <div className="flex-1 min-w-0">
        <p
          className="text-[15px] font-bold text-gray-900"
          style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
        >
          {notificacao.titulo}
        </p>
        <p className="text-sm text-gray-500 font-sans mt-0.5">{notificacao.mensagem}</p>
      </div>

      {notificacao.dataFormatada && (
        <span className="text-sm text-gray-400 font-sans whitespace-nowrap shrink-0">
          {notificacao.dataFormatada}
        </span>
      )}
    </div>
  );
}