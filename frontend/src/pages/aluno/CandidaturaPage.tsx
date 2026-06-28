import { useState, useEffect } from "react";
import { toast } from "sonner";
import { ArrowLeft, ChevronRight, CheckCircle2 } from "lucide-react";
import { useSearch, useNavigate } from "@tanstack/react-router";
import Navbar from "@/layout/components/Navbar/Navbar";
import { Button } from "@/layout/components/ui/button";
import { FormularioCandidatura } from "@/components/candidatura/FormularioCandidatura";
import { ProjetoInfoSidebar } from "@/components/candidatura/ProjetoInfoSidebar";
import { paveApi } from "@/services/PaveApiService";
import { useAuth } from "@/context/AuthContext";
import { ApiError } from "@/errors/ApiError";
import type { ProjetoCandidaturaView, CampoFormulario, RespostaCampo } from "@/types/candidatura";

export default function CandidaturaPage() {
  const { processoId } = useSearch({ from: "/aluno/candidatura" });
  const { session } = useAuth();
  const navigate = useNavigate();

  const [projeto, setProjeto] = useState<ProjetoCandidaturaView | null>(null);
  const [campos, setCampos] = useState<CampoFormulario[]>([]);
  const [perfil, setPerfil] = useState<{ nome: string; matricula: string; curso: string | null } | null>(null);
  const [jaInscrito, setJaInscrito] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!processoId) {
      setErro("Processo seletivo não identificado.");
      return;
    }

    async function carregar() {
      try {
        const [processo, perfilDiscente, minhasInscricoes] = await Promise.all([
          paveApi.buscarProcesso(processoId!),
          paveApi.obterPerfilDiscente(),
          paveApi.listarMinhasInscricoes(),
        ]);

        if (minhasInscricoes.some((i) => i.ps_id === processoId)) {
          setJaInscrito(true);
        }
        setPerfil(perfilDiscente);
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
          const camposFormulario = await paveApi.listarCamposFormulario(processo.formulario_id);
          setCampos(camposFormulario);
        }
      } catch (e) {
        setErro(e instanceof ApiError ? e.message : "Erro ao carregar candidatura.");
      }
    }

    carregar();
  }, [processoId]);

  async function handleSubmit(respostas: RespostaCampo[], arquivos: Record<string, File>, urlsPreenchidasUsadas: Record<string, string>) {
    if (!projeto || !processoId) return;
    setIsLoading(true);
    setErro(null);
    try {
      const respostasArquivos: RespostaCampo[] = [];

      // Campos com nova URL do perfil (sem upload novo)
      for (const [campoId, url] of Object.entries(urlsPreenchidasUsadas)) {
        if (!arquivos[campoId]) {
          respostasArquivos.push({ campo_id: campoId, arquivo_url: url });
        }
      }

      for (const [campoId, file] of Object.entries(arquivos)) {
        const { url } = await paveApi.uploadArquivo(file, processoId, campoId);
        respostasArquivos.push({ campo_id: campoId, arquivo_url: url });
      }

      await paveApi.criarInscricao({
        ps_id: projeto.processoSeletivoId,
        respostas: [...respostas, ...respostasArquivos],
      });

      toast.success("Candidatura enviada com sucesso!", {
        description: "Acompanhe o andamento em Minhas Oportunidades.",
      });

      await navigate({ to: "/aluno" });
    } catch (e) {
      if (e instanceof ApiError) {
        const det = e.details as { errors?: { campo: string; mensagem: string }[] } | null;
        const campos = det?.errors?.map((err) => `[${err.campo}]: ${err.mensagem}`).join(" | ");
        setErro(campos ? `${e.message} → ${campos}` : e.message);
      } else {
        setErro("Erro ao enviar candidatura.");
      }
    } finally {
      setIsLoading(false);
    }
  }

  if (erro) return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col">
      <Navbar />
      <main className="max-w-7xl mx-auto px-8 py-16 w-full flex-1">
        <p className="text-red-600">{erro}</p>
      </main>
    </div>
  );

  if (!projeto) return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col">
      <Navbar />
      <main className="max-w-7xl mx-auto px-8 py-16 w-full flex-1">
        <p className="text-[#64748B]">Carregando...</p>
      </main>
    </div>
  );

  const dadosAluno = {
    nomeCompleto: perfil?.nome ?? session?.email?.split("@")[0] ?? "",
    curso: perfil?.curso ?? "",
    matricula: perfil?.matricula ?? "",
  };

  const urlsCurriculoPerfil: Record<string, string> = {};
  if (perfil?.curriculo_url) {
    campos
      .filter((c) => c.chave_unica === "curriculo" && c.tipo === "arquivo")
      .forEach((c) => { urlsCurriculoPerfil[c.id] = perfil.curriculo_url!; });
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col">
      <Navbar />

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
            {jaInscrito ? (
              <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-[0_4px_20px_rgba(0,0,0,0.04)] p-10 flex flex-col items-center gap-4 text-center">
                <CheckCircle2 className="w-14 h-14 text-emerald-500" />
                <h2 className="text-xl font-bold text-[#1E2E4F]">Você já se candidatou a este processo</h2>
                <p className="text-[#64748B] text-sm max-w-sm">
                  Sua candidatura já foi registrada. Acompanhe o andamento em{" "}
                  <button
                    className="text-[#287999] font-semibold underline underline-offset-2"
                    onClick={() => navigate({ to: "/aluno/oportunidades" })}
                  >
                    Minhas Oportunidades
                  </button>.
                </p>
                <Button
                  variant="outline"
                  className="mt-2"
                  onClick={() => navigate({ to: "/aluno" })}
                >
                  Voltar para início
                </Button>
              </div>
            ) : (
              <FormularioCandidatura
                tituloProjeto={projeto.titulo}
                dadosAluno={dadosAluno}
                campos={campos}
                urlsPreenchidas={urlsCurriculoPerfil}
                onSubmit={handleSubmit}
                onCancelar={() => navigate({ to: "/aluno" })}
                isLoading={isLoading}
              />
            )}
          </div>
          <div className="col-span-1 sticky top-6">
            <ProjetoInfoSidebar projeto={projeto} />
          </div>
        </div>
      </main>

    </div>
  );
}
