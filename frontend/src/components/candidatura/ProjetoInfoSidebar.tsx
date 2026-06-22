import { FolderOpen, GraduationCap, Heart, Calendar, ShieldCheck } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import type { Projeto } from "@/types/candidatura";

export function ProjetoInfoSidebar({ projeto }: { projeto: Projeto }) {
  return (
    <div>
      {projeto.imagemUrl && (
        <div className="rounded-xl overflow-hidden mb-4">
          <img src={projeto.imagemUrl} alt={projeto.titulo} className="w-full h-44 object-cover" />
        </div>
      )}

      <Card>
        <CardContent className="space-y-4 px-5 py-5">

          <div className="flex items-start gap-3">
            <FolderOpen className="w-4 h-4 text-gray-400 mt-1 shrink-0" />
            <p
              className="text-lg font-bold text-gray-900 leading-snug"
              style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
            >
              {projeto.titulo}
            </p>
          </div>

          {projeto.tags.length > 0 && (
            <div className="flex items-center gap-1.5 flex-wrap pl-7">
              {projeto.tags.map((tag) => (
                <span key={tag} className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs text-gray-600 font-sans">
                  {tag}
                </span>
              ))}
            </div>
          )}

          <Separator className="bg-gray-100" />

          <div className="flex items-start gap-3">
            <GraduationCap className="w-4 h-4 text-gray-400 mt-0.5 shrink-0" />
            <div>
              <p className="text-sm text-gray-400 mb-0.5">Coordenação</p>
              <p className="text-sm text-gray-700 font-sans">{projeto.coordenador}</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <Heart className="w-4 h-4 text-gray-400 mt-0.5 shrink-0" />
            <div>
              <p className="text-sm text-gray-400 mb-2">Vagas disponíveis</p>
              <span className="inline-flex items-center rounded-full bg-green-50 px-3 py-1 text-xs font-semibold text-green-700 font-sans">
                {projeto.vagas} {projeto.vagas === 1 ? "vaga" : "vagas"}
              </span>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <Calendar className="w-4 h-4 text-gray-400 mt-0.5 shrink-0" />
            <div>
              <p className="text-sm text-gray-400 mb-0.5">Inscrições abertas até</p>
              <p className="text-sm text-gray-700 font-sans">{projeto.inscricoesAte}</p>
            </div>
          </div>

          <div className="bg-[#EEF5F4] rounded-xl p-4 flex items-start gap-3">
            <ShieldCheck className="w-5 h-5 text-[#1B3F3F] shrink-0 mt-0.5" />
            <p className="text-sm text-gray-600 leading-relaxed">
              Após o envio, sua candidatura será analisada pela equipe do projeto. Você receberá
              uma notificação com o resultado.
            </p>
          </div>

        </CardContent>
      </Card>
    </div>
  );
}