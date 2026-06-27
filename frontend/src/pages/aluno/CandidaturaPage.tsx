import { useState, useEffect } from "react";
import { ArrowLeft, ChevronRight } from "lucide-react";
import { useSearch, useNavigate } from "@tanstack/react-router";
import { Header } from "@/components/shared/Header";
import { Footer } from "@/components/shared/Footer";
import { Button } from "@/layout/components/ui/button";
import { FormularioCandidatura } from "@/components/candidatura/FormularioCandidatura";
import { ProjetoInfoSidebar } from "@/components/candidatura/ProjetoInfoSidebar";
import { paveApi } from "@/services/PaveApiService";
import { useAuth } from "@/context/AuthContext";
import { ApiError } from "@/errors/ApiError";
import type { ProjetoCandidaturaView, CampoFormulario, RespostaCampo } from "@/types/candidatura";

export default function CandidaturaPage() {
  const { processoId } = useSearch({ strict: false }) as { processoId?: string };
  const { session } = useAuth();
  const navigate = useNavigate();

  const [projeto, setProjeto] = useState<ProjetoCandidaturaView | null>(null);
  const [campos, setCampos] = useState<CampoFormulario[]>([]);
  const [erro, setErro] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!processoId) {
      setErro("Processo seletivo não identificado.");
      return;
    }

    async function carregar() {
      try {
        const processo = await paveApi.buscarProcesso(processoId!);
        const projetoBase = await paveApi.buscarProjeto(processo.projeto_id);

        setProjeto({
          id: projetoBase.id,
          titulo: projetoBase.titulo,
          tags: projetoBase.tags,
          autor_nome: projetoBase.autor_nome,
          n_vagas: processo.n_vagas,
          data_termino: processo.data_termino,
          descricao: projetoBase.descricao,
          processoSeletivoId: processo.id,
        });

        if (processo.formulario_id) {
          const tiposCampo = await paveApi.listarTiposCampo();
          setCampos(tiposCampo.map((c) => ({
            id: c.id,
            label: c.nome,
            tipo: "texto" as const,
            obrigatoriedade: false,
          })));
        }
      } catch (e) {
        setErro(e instanceof ApiError ? e.message : "Erro ao carregar candidatura.");
      }
    }

    carregar();
  }, [processoId]);

  async function handleSubmit(respostas: RespostaCampo[]) {
    if (!projeto) return;
    setIsLoading(true);
    try {
      await paveApi.criarInscricao({ ps_id: projeto.processoSeletivoId, respostas });
      navigate({ to: "/aluno" });
    } catch (e) {
      setErro(e instanceof ApiError ? e.message : "Erro ao enviar candidatura.");
    } finally {
      setIsLoading(false);
    }
  }

  if (erro) return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col">
      <Header paginaAtiva="Projetos" />
      <main className="max-w-7xl mx-auto px-8 py-16 w-full flex-1">
        <p className="text-red-600">{erro}</p>
      </main>
      <Footer />
    </div>
  );

  if (!projeto) return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col">
      <Header paginaAtiva="Projetos" />
      <main className="max-w-7xl mx-auto px-8 py-16 w-full flex-1">
        <p className="text-[#64748B]">Carregando...</p>
      </main>
      <Footer />
    </div>
  );

  const dadosAluno = {
    nomeCompleto: session?.email?.split("@")[0] ?? "",
    curso: "",
    matricula: "",
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col">
      <Header paginaAtiva="Projetos" />

      <div className="max-w-7xl mx-auto px-8 py-4 w-full">
        <div className="flex items-center gap-2 text-sm text-[#64748B]">
          <Button
            variant="ghost"
            onClick={() => navigate({ to: "/aluno" })}
            className="flex items-center gap-1 text-[#287999] hover:text-[#1E2E4F] font-semibold h-auto p-0 hover:bg-transparent text-sm"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Voltar
          </Button>
          <span className="text-[#E2E8F0] px-1">|</span>
          <span>Projetos</span>
          <ChevronRight className="w-3 h-3 text-[#E2E8F0]" />
          <span className="truncate max-w-60 text-[#334155] font-medium">{projeto.titulo}</span>
          <ChevronRight className="w-3 h-3 text-[#E2E8F0]" />
          <span className="text-[#1E2E4F] font-semibold">Candidatar-se</span>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-8 pb-16 w-full flex-1">
        <div className="grid grid-cols-3 gap-8 items-start">
          <div className="col-span-2">
            <FormularioCandidatura
              tituloProjeto={projeto.titulo}
              dadosAluno={dadosAluno}
              campos={campos}
              onSubmit={handleSubmit}
              onCancelar={() => navigate({ to: "/aluno" })}
              isLoading={isLoading}
            />
          </div>
          <div className="col-span-1 sticky top-6">
            <ProjetoInfoSidebar projeto={projeto} />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
