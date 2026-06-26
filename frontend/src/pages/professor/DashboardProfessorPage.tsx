import { useEffect, useState } from "react";
import { Plus, Folder, FileEdit, Flag, PauseCircle, FolderX, BellOff } from "lucide-react";
import { useNavigate } from "@tanstack/react-router";
import { ProfessorNavbar } from "@/layout/componente-professor/ProfessorNavbar";
import { Footer } from "@/components/shared/Footer";
import { EstatisticaCard } from "@/components/dashboard/EstatisticaCard";
import { ProjetoResumoItem } from "@/components/dashboard/ProjetoResumoItem";
import { NotificacaoResumoItem } from "@/components/dashboard/NotificacaoResumoItem";
import { paveApi } from "@/services/PaveApiService";
import { useAuth } from "@/context/AuthContext";
import type { Projeto, EstatisticasProjetos } from "@/types/projeto";
import type { Notificacao } from "@/types/notificacao";

export default function DashboardProfessorPage() {
  const { session } = useAuth();
  const navigate = useNavigate();
  const [projetos, setProjetos] = useState<Projeto[]>([]);
  const [notificacoes, setNotificacoes] = useState<Notificacao[]>([]);
  const [estatisticas, setEstatisticas] = useState<EstatisticasProjetos>({
    projetosAtivos: 0, projetosRascunho: 0, projetosEncerrados: 0, projetosSuspensos: 0,
  });

  useEffect(() => {
    paveApi.listarProjetos().then((lista) => {
      setProjetos(lista);
      setEstatisticas({
        projetosAtivos:     lista.filter((p) => p.status === "ativo").length,
        projetosRascunho:   lista.filter((p) => p.status === "rascunho").length,
        projetosEncerrados: lista.filter((p) => p.status === "encerrado").length,
        projetosSuspensos:  lista.filter((p) => p.status === "suspenso").length,
      });
    }).catch(console.error);

    paveApi.listarNotificacoes().then(setNotificacoes).catch(console.error);
  }, []);

  const nome = session?.email?.split("@")[0] ?? "Professor";

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col">
      <ProfessorNavbar />

      <main className="max-w-6xl mx-auto px-8 py-8 flex-1 w-full space-y-6">
        <div
          className="rounded-2xl p-8 flex items-center justify-between gap-6 overflow-hidden relative"
          style={{ background: "linear-gradient(135deg, #eef2ee 0%, #e8ede8 60%, #dce8dc 100%)" }}
        >
          <div className="relative z-10">
            <span className="inline-block text-xs font-bold text-[#287999] bg-[#287999]/10 px-3 py-1 rounded-full mb-3">
              Painel do Professor
            </span>
            <h1 className="text-2xl font-bold text-[#1E2E4F]">Bem-vindo, Prof. {nome}! 👋</h1>
            <p className="text-[#64748B] mt-2 max-w-md">Aqui você gerencia seus projetos de extensão e processos seletivos.</p>
            <button
              onClick={() => navigate({ to: "/professor/criar-projeto" })}
              className="mt-5 inline-flex items-center gap-2 px-5 py-2.5 bg-[#1E2E4F] text-white text-sm font-semibold rounded-xl hover:-translate-y-0.5 hover:shadow-lg transition-all"
            >
              <Plus className="w-4 h-4" />
              Novo projeto
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-5">
          <EstatisticaCard icone={Folder}      corFundo="bg-[#e8f3f7]" corIcone="text-[#287999]"  valor={estatisticas.projetosAtivos}     titulo="Projetos ativos"  subtitulo="Publicados"     />
          <EstatisticaCard icone={FileEdit}    corFundo="bg-blue-50"   corIcone="text-blue-600"   valor={estatisticas.projetosRascunho}   titulo="Rascunhos"        subtitulo="Não publicados" />
          <EstatisticaCard icone={Flag}        corFundo="bg-purple-50" corIcone="text-purple-600" valor={estatisticas.projetosEncerrados} titulo="Encerrados"       subtitulo="Atualmente"     />
          <EstatisticaCard icone={PauseCircle} corFundo="bg-amber-50"  corIcone="text-amber-600"  valor={estatisticas.projetosSuspensos}  titulo="Suspensos"        subtitulo="Atualmente"     />
        </div>

        <section className="bg-white rounded-2xl border border-[#E2E8F0] shadow-[0_4px_20px_rgba(0,0,0,0.03)] overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-[#E2E8F0]">
            <h2 className="text-base font-bold text-[#1E2E4F] flex items-center gap-2">
              <span className="w-1 h-5 bg-[#287999] rounded-full" />
              Meus projetos (recentes)
            </h2>
          </div>

          {projetos.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="w-14 h-14 rounded-full bg-[#F8FAFC] border border-[#E2E8F0] flex items-center justify-center mb-3">
                <FolderX className="w-6 h-6 text-[#94a3b8]" />
              </div>
              <p className="font-semibold text-[#1E2E4F] mb-1">Nenhum projeto ainda</p>
              <p className="text-sm text-[#64748B]">Crie seu primeiro projeto de extensão.</p>
            </div>
          ) : (
            <div className="divide-y divide-[#E2E8F0]">
              {projetos.slice(0, 5).map((p) => (
                <ProjetoResumoItem
                  key={p.id}
                  projeto={p}
                  onClick={(id) => navigate({ to: "/professor/projeto-visao-geral", search: { id } as never })}
                />
              ))}
            </div>
          )}
        </section>

        <section className="bg-white rounded-2xl border border-[#E2E8F0] shadow-[0_4px_20px_rgba(0,0,0,0.03)] overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-[#E2E8F0]">
            <h2 className="text-base font-bold text-[#1E2E4F] flex items-center gap-2">
              <span className="w-1 h-5 bg-[#287999] rounded-full" />
              Notificações recentes
            </h2>
          </div>

          {notificacoes.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="w-14 h-14 rounded-full bg-[#F8FAFC] border border-[#E2E8F0] flex items-center justify-center mb-3">
                <BellOff className="w-6 h-6 text-[#94a3b8]" />
              </div>
              <p className="font-semibold text-[#1E2E4F] mb-1">Nenhuma notificação</p>
              <p className="text-sm text-[#64748B]">Você está em dia com tudo!</p>
            </div>
          ) : (
            <div className="divide-y divide-[#E2E8F0]">
              {notificacoes.slice(0, 5).map((n) => (
                <NotificacaoResumoItem key={n.id} notificacao={n} />
              ))}
            </div>
          )}
        </section>
      </main>

      <Footer />
    </div>
  );
}
