import { useState } from "react";
import { Check, BellOff } from "lucide-react";
import { Header } from "@/components/shared/Header";
import { Footer } from "@/components/shared/Footer";
import { NotificacaoItem } from "@/components/notificacoes/NotificacaoItem";
import type { Notificacao } from "@/types/notificacao";

const notificacaoBoasVindas: Notificacao = {
  id: "boas-vindas",
  tipo: "sistema",
  titulo: "Bem-vindo(a) ao PAVE!",
  mensagem: "Explore projetos, participe de processos seletivos e faça a diferença na sua universidade.",
  dataFormatada: "",
  lida: false,
};

const mock: Notificacao[] = [
  {
    id: "1",
    tipo: "aprovacao",
    titulo: "Sua candidatura foi aprovada!",
    mensagem: 'Parabéns! Você foi aprovado(a) no projeto "Educação Ambiental nas Escolas Públicas".',
    dataFormatada: "2h atrás",
    lida: false,
  },
  {
    id: "2",
    tipo: "novo_projeto",
    titulo: "Novo projeto publicado",
    mensagem: 'O projeto "Apoio ao Ensino de Matemática" está com inscrições abertas.',
    dataFormatada: "Ontem, 14:30",
    lida: false,
  },
  {
    id: "3",
    tipo: "prazo",
    titulo: "Inscrição próxima do prazo",
    mensagem: 'O prazo para se inscrever no projeto "Promoção da Saúde e Qualidade de Vida" termina em 2 dias.',
    dataFormatada: "Ontem, 09:15",
    lida: false,
  },
  {
    id: "4",
    tipo: "atualizacao",
    titulo: "Atualização na sua candidatura",
    mensagem: 'Seu status no projeto "Comunicação e Cultura Universitária" foi atualizado para "Em análise".',
    dataFormatada: "12/05/2025",
    lida: true,
  },
  {
    id: "5",
    tipo: "favorito",
    titulo: "Projeto adicionado aos favoritos",
    mensagem: 'O projeto "Sustentabilidade e Gestão de Resíduos" foi adicionado aos seus favoritos.',
    dataFormatada: "09/05/2025",
    lida: true,
  },
];

interface Props {
  notificacoes?: Notificacao[];
}

export default function NotificacoesPage({ notificacoes: notificacoesApi = mock }: Props) {
  const [lista, setLista] = useState<Notificacao[]>([
    ...notificacoesApi,
    notificacaoBoasVindas,
  ]);

  const naoLidas = lista.filter((n) => !n.lida).length;

  function marcarComoLida(id: string) {
    // TODO: PATCH /api/notificacoes/:id/lida
    setLista((prev) => prev.map((n) => (n.id === id ? { ...n, lida: true } : n)));
  }

  function marcarTodasComoLidas() {
    // TODO: chamar PATCH para cada notificação não lida
    setLista((prev) => prev.map((n) => ({ ...n, lida: true })));
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col">
      <Header paginaAtiva="Notificações" nomeUsuario="Ravena" notificacoesPendentes={naoLidas} />

      <main className="max-w-4xl mx-auto px-8 py-10 flex-1 w-full">

        <div className="flex items-start justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-[#1E2E4F] flex items-center gap-3">
              <span className="w-1 h-7 bg-[#287999] rounded-full inline-block" />
              Notificações
              {naoLidas > 0 && (
                <span className="text-xs font-bold bg-[#287999] text-white px-2.5 py-1 rounded-full">
                  {naoLidas} nova{naoLidas > 1 ? "s" : ""}
                </span>
              )}
            </h1>
            <p className="text-[#64748B] mt-1 ml-4">Fique por dentro das suas atualizações.</p>
          </div>

          <button
            onClick={marcarTodasComoLidas}
            disabled={naoLidas === 0}
            className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-[#287999] border border-[#287999]/30 rounded-lg hover:bg-[#e8f3f7] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <Check className="w-4 h-4" />
            Marcar todas como lidas
          </button>
        </div>

        <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-[0_4px_20px_rgba(0,0,0,0.04)] overflow-hidden">
          {lista.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="w-16 h-16 rounded-full bg-[#F8FAFC] border border-[#E2E8F0] flex items-center justify-center mb-4">
                <BellOff className="w-7 h-7 text-[#94a3b8]" />
              </div>
              <p className="font-semibold text-[#1E2E4F] mb-1">Nenhuma notificação</p>
              <p className="text-sm text-[#64748B]">Você está em dia com tudo!</p>
            </div>
          ) : (
            <div className="divide-y divide-[#E2E8F0]">
              {lista.map((n) => (
                <NotificacaoItem key={n.id} notificacao={n} onClick={marcarComoLida} />
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}