import { useState } from "react";
import { Check, BellOff } from "lucide-react";
import { Header } from "@/components/shared/Header";
import { Footer } from "@/components/shared/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { NotificacaoItem } from "@/components/notificacoes/NotificacaoItem";
import type { Notificacao } from "@/types/notificacao";

const notificacaoBoasVindas: Notificacao = {
  id: "boas-vindas",
  tipo: "sistema",
  titulo: "Bem-vindo(a) ao PAVE!",
  mensagem: "Explore projetos, participe de processos seletivos e faça a diferença na sua Universidade.",
  dataFormatada: "",
  lida: false,
};

interface Props {
  notificacoes?: Notificacao[];
}

export default function NotificacoesPage({ notificacoes: notificacoesApi = [] }: Props) {
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
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header paginaAtiva="Notificações" nomeUsuario="Ravena" notificacoesPendentes={naoLidas} />

      <main className="max-w-5xl mx-auto px-8 py-10 flex-1 w-full">
        <div className="flex items-start justify-between mb-6">
          <div>
            <h1
              className="text-3xl font-bold text-gray-900"
              style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
            >
              Notificações
            </h1>
            <p className="text-gray-500 mt-1 font-sans">Fique por dentro das suas atualizações.</p>
          </div>

          <Button
            variant="outline"
            onClick={marcarTodasComoLidas}
            disabled={naoLidas === 0}
            className="font-sans text-[#1B3F3F] border-gray-200 hover:bg-gray-50 disabled:opacity-50"
          >
            <Check className="w-4 h-4" />
            Marcar todas como lidas
          </Button>
        </div>

        <Card className="block overflow-hidden border border-gray-200">
          {lista.length === 0 ? (
            <CardContent className="flex flex-col items-center justify-center py-16 px-6 text-center">
              <div className="flex items-center justify-center w-12 h-12 rounded-full bg-gray-100 mb-3">
                <BellOff className="w-6 h-6 text-gray-400" />
              </div>
              <p className="text-sm font-sans text-gray-500">
                Você ainda não tem nenhuma notificação.
              </p>
            </CardContent>
          ) : (
            <div className="divide-y divide-gray-100">
              {lista.map((n) => (
                <NotificacaoItem key={n.id} notificacao={n} onClick={marcarComoLida} />
              ))}
            </div>
          )}
        </Card>
      </main>

      <Footer />
    </div>
  );
}