import type { LucideIcon } from "lucide-react";

interface Props {
  icone: LucideIcon;
  corIcone: string;
  corFundo: string;
  valor: number;
  titulo: string;
  subtitulo: string;
}

export function EstatisticaCard({ icone: Icone, corIcone, corFundo, valor, titulo, subtitulo }: Props) {
  return (
    <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-[0_4px_20px_rgba(0,0,0,0.03)] p-6 flex items-center gap-4 hover:shadow-[0_8px_30px_rgba(0,0,0,0.08)] hover:-translate-y-1 transition-all duration-300">
      <div className={`flex items-center justify-center w-14 h-14 rounded-2xl ${corFundo} shrink-0`}>
        <Icone className={`w-6 h-6 ${corIcone}`} />
      </div>
      <div>
        <p className="text-2xl font-bold text-[#1E2E4F]">{valor}</p>
        <p className="text-sm font-semibold text-[#334155]">{titulo}</p>
        <p className="text-xs text-[#64748B]">{subtitulo}</p>
      </div>
    </div>
  );
}