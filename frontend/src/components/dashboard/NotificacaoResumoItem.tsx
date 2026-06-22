import { UserRound, Calendar, Megaphone, ChevronRight } from "lucide-react";
import type { NotificacaoResumo, TipoNotificacaoProfessor } from "@/types/dashboard";

const estilos: Record<TipoNotificacaoProfessor, { icone: typeof UserRound; bg: string; cor: string }> = {
  candidatura:  { icone: UserRound,  bg: "bg-green-100", cor: "text-green-600"  },
  novo_projeto: { icone: Calendar,   bg: "bg-blue-100",  cor: "text-blue-600"   },
  resultado:    { icone: Megaphone,  bg: "bg-purple-100",cor: "text-purple-600" },
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
      className="flex items-center gap-4 px-6 py-4 cursor-pointer hover:bg-gray-50 transition-colors"
    >
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
      <span className="text-sm text-gray-400 font-sans whitespace-nowrap shrink-0">
        {notificacao.dataFormatada}
      </span>
      <ChevronRight className="w-4 h-4 text-gray-300 shrink-0" />
    </div>
  );
}