import { useState } from "react";
import { ArrowLeft, ChevronRight } from "lucide-react";
import { Header } from "@/components/shared/Header";
import { Footer } from "@/components/shared/Footer";
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
    <div className="min-h-screen bg-gray-50">
      <Header paginaAtiva="Projetos" nomeUsuario="Ravena" notificacoesPendentes={1} />

      <div className="max-w-7xl mx-auto px-8 py-4">
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <button
            onClick={() => window.history.back()}
            className="flex items-center gap-1 text-[#1B3F3F] hover:underline font-medium"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Voltar
          </button>
          <span className="text-gray-300 px-1">|</span>
          <span>Projetos</span>
          <ChevronRight className="w-3 h-3 text-gray-300" />
          <span className="truncate max-w-60">{projeto.titulo}</span>
          <ChevronRight className="w-3 h-3 text-gray-300" />
          <span className="text-gray-700 font-medium">Candidatar-se</span>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-8 pb-16">
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