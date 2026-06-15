import { createFileRoute } from "@tanstack/react-router";
import EditarProjeto from "../pages/ProjetoForm/EditarProjeto";

export const Route = createFileRoute("/editar-projeto")({
  component: EditarProjeto,
});
