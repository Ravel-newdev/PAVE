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

const mock = {
  projeto: {
    id: "1",
    titulo: "Educação Ambiental nas Escolas Públicas",
    tags: ["Meio Ambiente", "Educação"],
    coordenador: "Prof. Carlos Alencar",
    vagas: 6,
    inscricoesAte: "30/05/2025 às 23:59",
    processoSeletivoId: "ps-001",
  } as Projeto,

  aluno: {
    nomeCompleto: "Ravena Marques Carvalho",
    curso: "Ciência da Computação",
    matricula: "552345",
  } as DadosAluno,

  campos: [
    { id: "c1", chave_unica: "motivacao",    label: "Por que você tem interesse em participar deste projeto?",                          tipo: "textarea", obrigatoriedade: true },
    { id: "c2", chave_unica: "experiencias", label: "Quais experiências ou habilidades você acredita que podem contribuir com o projeto?", tipo: "textarea", obrigatoriedade: true },
    { id: "c3", chave_unica: "dedicacao",    label: "Como você pretende se dedicar ao projeto?",                                          tipo: "textarea", obrigatoriedade: true },
    { id: "c4", chave_unica: "curriculo",    label: "Anexe seu currículo (PDF)",                                                          tipo: "arquivo",  obrigatoriedade: true },
  ] as CampoFormulario[],
};

// Mock temporário — remova quando integrar com a API
const projetoMock: Projeto = {
  id: "1",
  titulo: "Educação Ambiental nas Escolas Públicas",
  tags: ["Meio Ambiente", "Educação"],
  coordenador: "Prof. Carlos Alencar",
  vagas: 6,
  inscricoesAte: "30/06/2026 às 23:59",
  processoSeletivoId: "ps-uuid-mock-001",
};

const alunoMock: DadosAluno = {
  nomeCompleto: "Ravena Marques Carvalho",
  curso: "Ciência da Computação",
  matricula: "552345",
};

const camposMock: CampoFormulario[] = [
  { id: "c1", chave_unica: "motivacao",    label: "Por que você tem interesse em participar deste projeto?",                     tipo: "textarea", obrigatoriedade: true },
  { id: "c2", chave_unica: "experiencias", label: "Quais experiências ou habilidades você acredita que podem contribuir com o projeto?", tipo: "textarea", obrigatoriedade: true },
  { id: "c3", chave_unica: "dedicacao",    label: "Como você pretende se dedicar ao projeto?",                                   tipo: "textarea", obrigatoriedade: true },
  { id: "c4", chave_unica: "curriculo",    label: "Anexe seu currículo (PDF)",                                                   tipo: "arquivo",  obrigatoriedade: true },
];

export default function CandidaturaPage({
  projeto = mock.projeto,
  dadosAluno = mock.aluno,
  campos = mock.campos,
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