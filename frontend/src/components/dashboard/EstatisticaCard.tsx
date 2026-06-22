import type { LucideIcon } from "lucide-react";
import { Card } from "@/components/ui/card";

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
    <Card className="flex-row items-center gap-4 px-5 py-5">
      <div className={`flex items-center justify-center w-12 h-12 rounded-xl ${corFundo} shrink-0`}>
        <Icone className={`w-6 h-6 ${corIcone}`} />
      </div>
      <div>
        <p
          className="text-2xl font-bold text-gray-900 leading-tight"
          style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
        >
          {valor}
        </p>
        <p className="text-sm text-gray-700 font-sans">{titulo}</p>
        <p className="text-xs text-gray-400 font-sans">{subtitulo}</p>
      </div>
    </Card>
  );
}