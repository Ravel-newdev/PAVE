import { UserRound, Calendar, Megaphone, ChevronRight } from "lucide-react";
import type { Notificacao } from "@/types/notificacao";

const estilos: Array<{ icone: typeof UserRound; bg: string; cor: string }> = [
  { icone: UserRound, bg: "bg-emerald-50 border border-emerald-200", cor: "text-emerald-600" },
  { icone: Calendar,  bg: "bg-[#e8f3f7] border border-[#c5dfe8]",   cor: "text-[#287999]"  },
  { icone: Megaphone, bg: "bg-purple-50 border border-purple-200",   cor: "text-purple-600" },
];

function formatarData(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString("pt-BR", { day: "2-digit", month: "short" });
}

function escolherEstilo(titulo: string) {
  if (/candidat/i.test(titulo)) return estilos[0];
  if (/projeto/i.test(titulo))  return estilos[1];
  return estilos[2];
}

interface Props {
  notificacao: Notificacao;
  onClick?: (id: string) => void;
}

export function NotificacaoResumoItem({ notificacao, onClick }: Props) {
  const { icone: Icone, bg, cor } = escolherEstilo(notificacao.titulo);

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
      <span className="text-xs text-[#94a3b8] whitespace-nowrap shrink-0">{formatarData(notificacao.criado_em)}</span>
      <ChevronRight className="w-4 h-4 text-[#E2E8F0] shrink-0" />
    </div>
  );
}
