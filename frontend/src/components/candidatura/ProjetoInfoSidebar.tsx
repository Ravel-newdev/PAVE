import { FolderOpen, GraduationCap, Heart, Calendar, ShieldCheck } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import type { Projeto } from "@/types/candidatura";

export function ProjetoInfoSidebar({ projeto }: { projeto: Projeto }) {
  return (
    <div className="space-y-4">
      {projeto.imagemUrl && (
        <div className="rounded-2xl overflow-hidden">
          <img src={projeto.imagemUrl} alt={projeto.titulo} className="w-full h-44 object-cover" />
        </div>
      )}

      <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-[0_4px_20px_rgba(0,0,0,0.04)] overflow-hidden">

        <div className="bg-linear-to-r from-[#1E2E4F] to-[#2a4070] p-5">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center shrink-0">
              <FolderOpen className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-white/60 text-xs font-medium mb-1">Projeto</p>
              <p className="text-white font-bold text-base leading-snug">{projeto.titulo}</p>
            </div>
          </div>

          {projeto.tags.length > 0 && (
            <div className="flex items-center gap-1.5 flex-wrap mt-3 pl-13">
              {projeto.tags.map((tag) => (
                <span key={tag} className="inline-flex items-center rounded-full bg-white/20 px-2.5 py-0.5 text-xs text-white font-medium">
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>

        <div className="p-5 space-y-4">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 bg-[#e8f3f7] rounded-lg flex items-center justify-center shrink-0">
              <GraduationCap className="w-4 h-4 text-[#287999]" />
            </div>
            <div>
              <p className="text-[#64748B] text-xs mb-0.5">Coordenação</p>
              <p className="text-[#1E2E4F] font-semibold text-sm">{projeto.coordenador}</p>
            </div>
          </div>

          <Separator className="bg-[#E2E8F0]" />

          <div className="flex items-start gap-3">
            <div className="w-8 h-8 bg-[#ecfdf5] rounded-lg flex items-center justify-center shrink-0">
              <Heart className="w-4 h-4 text-emerald-600" />
            </div>
            <div>
              <p className="text-[#64748B] text-xs mb-2">Vagas disponíveis</p>
              <span className="inline-flex items-center rounded-full bg-emerald-50 border border-emerald-200 px-3 py-1 text-xs font-bold text-emerald-700">
                {projeto.vagas} {projeto.vagas === 1 ? "vaga" : "vagas"}
              </span>
            </div>
          </div>

          <Separator className="bg-[#E2E8F0]" />

          <div className="flex items-start gap-3">
            <div className="w-8 h-8 bg-amber-50 rounded-lg flex items-center justify-center shrink-0">
              <Calendar className="w-4 h-4 text-amber-600" />
            </div>
            <div>
              <p className="text-[#64748B] text-xs mb-0.5">Inscrições abertas até</p>
              <p className="text-[#1E2E4F] font-semibold text-sm">{projeto.inscricoesAte}</p>
            </div>
          </div>

          <div className="bg-[#e8f3f7] rounded-xl p-4 flex items-start gap-3">
            <ShieldCheck className="w-5 h-5 text-[#287999] shrink-0 mt-0.5" />
            <p className="text-sm text-[#334155] leading-relaxed">
              Após o envio, sua candidatura será analisada pela equipe do projeto. Você receberá uma notificação com o resultado.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}