import { Bell } from "lucide-react";
import type { Notificacao } from "@/types/notificacao";

interface Props {
  notificacao: Notificacao;
  onClick: (id: string) => void;
}

function formatarData(iso: string): string {
  if (!iso) return "";
  return new Date(iso).toLocaleString("pt-BR", {
    day: "2-digit", month: "2-digit", year: "numeric",
    hour: "2-digit", minute: "2-digit",
  });
}

export function NotificacaoItem({ notificacao, onClick }: Props) {
  return (
    <div
      onClick={() => onClick(notificacao.id)}
      className={`flex items-start gap-4 px-6 py-4 cursor-pointer transition-colors hover:bg-[#F8FAFC] ${!notificacao.lida ? "bg-[#e8f3f7]/30" : ""}`}
    >
      <div className="w-2 pt-2 shrink-0">
        {!notificacao.lida && <span className="block w-2 h-2 rounded-full bg-[#287999]" />}
      </div>

      <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-[#e8f3f7] border border-[#c5dfe8] shrink-0">
        <Bell className="w-5 h-5 text-[#287999]" />
      </div>

      <div className="flex-1 min-w-0">
        <p className={`text-[15px] font-bold ${notificacao.lida ? "text-[#334155]" : "text-[#1E2E4F]"}`}>
          {notificacao.titulo}
        </p>
        <p className="text-sm text-[#64748B] mt-0.5">{notificacao.mensagem}</p>
      </div>

      <span className="text-xs text-[#94a3b8] whitespace-nowrap shrink-0 mt-1">
        {formatarData(notificacao.criado_em)}
      </span>
    </div>
  );
}
