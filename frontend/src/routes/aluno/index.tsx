import { createFileRoute } from "@tanstack/react-router";
import Home from "../../pages/DashboardAluno/DashboardAluno";

export const Route = createFileRoute("/aluno/")({
  component: Home,
});
