import { createFileRoute } from "@tanstack/react-router";
import NotificacoesPage from "../../pages/aluno/NotificacoesPage";

export const Route = createFileRoute("/aluno/notificacoes")({
  component: NotificacoesPage,
});
