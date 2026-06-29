import { createFileRoute } from "@tanstack/react-router";
import EditarPerfil from "../../../pages/professor/EditarPerfil";

export const Route = createFileRoute("/professor/_navbar/perfil-editar")({
  component: EditarPerfil,
});
