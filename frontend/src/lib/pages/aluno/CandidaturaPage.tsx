import { useState } from "react";
import { ArrowLeft, ChevronRight } from "lucide-react";
import { Header } from "@/components/shared/Header";
import { Footer } from "@/components/shared/Footer";
import { Button } from "@/components/ui/button";
import { FormularioCandidatura } from "@/components/candidatura/FormularioCandidatura";
import { ProjetoInfoSidebar } from "@/components/candidatura/ProjetoInfoSidebar";
import type { Projeto, DadosAluno, CampoFormulario, RespostaCampo } from "@/types/candidatura";

interface Props {
  projeto?: Projeto;
  dadosAluno?: DadosAluno;
  campos?: CampoFormulario[];
}

const projetoVazio: Projeto = {
  id: "",
  titulo: "",
  tags: [],
  coordenador: "",
  vagas: 0,
  inscricoesAte: "",
  processoSeletivoId: "",
};

const alunoVazio: DadosAluno = {
  nomeCompleto: "",
  curso: "",
  matricula: "",
};

export default function CandidaturaPage({
  projeto = projetoVazio,
  dadosAluno = alunoVazio,
  campos = [],
}: Props) {
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(respostas: RespostaCampo[], arquivos: Record<string, File>) {
    if (!projeto.processoSeletivoId) {
      alert("Não foi possível identificar o processo seletivo. Volte e tente novamente.");
      return;
    }
    setIsLoading(true);
    try {
      // TODO: POST /api/inscricoes com { ps_id: projeto.processoSeletivoId, respostas }
      console.log("Candidatura enviada:", { ps_id: projeto.processoSeletivoId, respostas, arquivos });
      alert("Candidatura enviada com sucesso!");
    } catch (err) {
      console.error(err);
      alert("Ocorreu um erro. Tente novamente.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col">
      <Header paginaAtiva="Projetos" nomeUsuario="Ravena" notificacoesPendentes={1} />

      <div className="max-w-7xl mx-auto px-8 py-4 w-full">
        <div className="flex items-center gap-2 text-sm text-[#64748B]">
          <Button
            variant="ghost"
            onClick={() => window.history.back()}
            className="flex items-center gap-1 text-[#287999] hover:text-[#1E2E4F] font-semibold h-auto p-0 hover:bg-transparent text-sm"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Voltar
          </Button>
          <span className="text-[#E2E8F0] px-1">|</span>
          <span className="hover:text-[#334155] cursor-pointer">Projetos</span>
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
              onCancelar={() => window.history.back()}
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