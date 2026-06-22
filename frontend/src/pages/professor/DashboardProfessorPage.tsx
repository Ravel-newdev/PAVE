import { Plus, Folder, FileEdit, Flag, PauseCircle, FolderX, BellOff } from "lucide-react";
import { Header } from "@/components/shared/Header";
import { Footer } from "@/components/shared/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardAction, CardContent } from "@/components/ui/card";
import { EstatisticaCard } from "@/components/dashboard/EstatisticaCard";
import { ProjetoResumoItem } from "@/components/dashboard/ProjetoResumoItem";
import { NotificacaoResumoItem } from "@/components/dashboard/NotificacaoResumoItem";
import type { EstatisticasDashboard, ProjetoResumo, NotificacaoResumo } from "@/types/dashboard";

// Mock temporário — remova quando for integrar com a API
const projetosMock: ProjetoResumo[] = [
  {
    id: "1",
    titulo: "Apoio ao Ensino de Matemática",
    categoria: "Educação",
    inscritos: 18,
    vagasPreenchidas: 12,
    vagasTotal: 20,
    status: "ativo",
    diasRestantes: 15,
  },
  {
    id: "2",
    titulo: "Projeto de Leitura e Produção de Textos",
    categoria: "Linguística",
    inscritos: 7,
    vagasPreenchidas: 8,
    vagasTotal: 10,
    status: "ativo",
    diasRestantes: 30,
  },
  {
    id: "3",
    titulo: "Comunicação e Cultura Universitária",
    categoria: "Cultura",
    inscritos: 22,
    vagasPreenchidas: 10,
    vagasTotal: 10,
    status: "encerrado",
    finalizadoEm: "20/05/2025",
  },
];

const notificacoesMock: NotificacaoResumo[] = [
  {
    id: "1",
    tipo: "candidatura",
    titulo: "Nova candidatura recebida",
    mensagem: 'João Pedro Souza se inscreveu no processo seletivo do projeto "Apoio ao Ensino de Matemática".',
    dataFormatada: "2h atrás",
  },
  {
    id: "2",
    tipo: "novo_projeto",
    titulo: "Novo projeto publicado",
    mensagem: 'O projeto "Apoio ao Ensino de Matemática" está com inscrições abertas.',
    dataFormatada: "Hoje, 14:30",
  },
  {
    id: "3",
    tipo: "resultado",
    titulo: "Resultado divulgado",
    mensagem: 'Você divulgou o resultado do projeto "Comunicação e Cultura Universitária".',
    dataFormatada: "Ontem, 10:15",
  },
];

const estatisticasMock: EstatisticasDashboard = {
  projetosAtivos: 4,
  projetosRascunho: 2,
  projetosEncerrados: 6,
  projetosSuspensos: 1,
};

interface Props {
  nomeProfessor?: string;
  estatisticas?: EstatisticasDashboard;
  projetos?: ProjetoResumo[];
  notificacoes?: NotificacaoResumo[];
}

export default function DashboardProfessorPage({
  nomeProfessor = "Carlos",
  estatisticas = estatisticasMock,
  projetos = projetosMock,
  notificacoes = notificacoesMock,
}: Props) {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header
        perfil="professor"
        paginaAtiva="Início"
        nomeUsuario={`Prof. ${nomeProfessor}`}
        notificacoesPendentes={notificacoes.length}
      />

      <main className="max-w-6xl mx-auto px-8 py-8 flex-1 w-full space-y-6">

        <Card className="block p-8">
          <h1
            className="text-2xl font-bold text-gray-900 flex items-center gap-2"
            style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
          >
            Bem-vindo, Prof. {nomeProfessor}! 👋
          </h1>
          <p className="text-gray-500 font-sans mt-2 max-w-md">
            Aqui você gerencia seus projetos de extensão e processos seletivos.
          </p>
          <Button className="font-sans bg-[#1B3F3F] hover:bg-[#163333] text-white mt-5">
            <Plus className="w-4 h-4" />
            Novo projeto
          </Button>
        </Card>

        <div className="grid grid-cols-2 gap-5">
          <EstatisticaCard icone={Folder}      corFundo="bg-green-100"  corIcone="text-green-600"  valor={estatisticas.projetosAtivos}     titulo="Projetos ativos" subtitulo="Publicados"     />
          <EstatisticaCard icone={FileEdit}    corFundo="bg-blue-100"   corIcone="text-blue-600"   valor={estatisticas.projetosRascunho}   titulo="Rascunhos"       subtitulo="Não publicados" />
          <EstatisticaCard icone={Flag}        corFundo="bg-purple-100" corIcone="text-purple-600" valor={estatisticas.projetosEncerrados} titulo="Encerrados"      subtitulo="Atualmente"     />
          <EstatisticaCard icone={PauseCircle} corFundo="bg-amber-100"  corIcone="text-amber-600"  valor={estatisticas.projetosSuspensos}  titulo="Suspensos"       subtitulo="Atualmente"     />
        </div>

        <Card className="block overflow-hidden">
          <CardHeader className="border-b border-gray-100 px-6 py-4">
            <CardTitle
              className="text-base font-bold text-gray-900"
              style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
            >
              Meus projetos (recentes)
            </CardTitle>
            <CardAction>
              <a href="#" className="text-sm text-[#1B3F3F] font-medium font-sans hover:underline">
                Ver todos os projetos →
              </a>
            </CardAction>
          </CardHeader>

          {projetos.length === 0 ? (
            <CardContent className="flex flex-col items-center justify-center py-14 text-center">
              <div className="flex items-center justify-center w-12 h-12 rounded-full bg-gray-100 mb-3">
                <FolderX className="w-6 h-6 text-gray-400" />
              </div>
              <p className="text-sm font-sans text-gray-500">Você ainda não criou nenhum projeto.</p>
            </CardContent>
          ) : (
            <div className="divide-y divide-gray-100">
              {projetos.map((p) => <ProjetoResumoItem key={p.id} projeto={p} />)}
            </div>
          )}
        </Card>

        <Card className="block overflow-hidden">
          <CardHeader className="border-b border-gray-100 px-6 py-4">
            <CardTitle
              className="text-base font-bold text-gray-900"
              style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
            >
              Notificações recentes
            </CardTitle>
            <CardAction>
              <a href="#" className="text-sm text-[#1B3F3F] font-medium font-sans hover:underline">
                Ver todas →
              </a>
            </CardAction>
          </CardHeader>

          {notificacoes.length === 0 ? (
            <CardContent className="flex flex-col items-center justify-center py-14 text-center">
              <div className="flex items-center justify-center w-12 h-12 rounded-full bg-gray-100 mb-3">
                <BellOff className="w-6 h-6 text-gray-400" />
              </div>
              <p className="text-sm font-sans text-gray-500">Nenhuma notificação por aqui ainda.</p>
            </CardContent>
          ) : (
            <div className="divide-y divide-gray-100">
              {notificacoes.map((n) => <NotificacaoResumoItem key={n.id} notificacao={n} />)}
            </div>
          )}
        </Card>

      </main>

      <Footer />
    </div>
  );
}