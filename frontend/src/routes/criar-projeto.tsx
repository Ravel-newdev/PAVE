import { createFileRoute } from "@tanstack/react-router";
import CriarProjeto from "../pages/ProjetoForm/CriarProjeto";

export const Route = createFileRoute("/criar-projeto")({
  component: CriarProjeto,
});
