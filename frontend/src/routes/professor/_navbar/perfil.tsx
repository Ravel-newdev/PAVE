import { createFileRoute } from "@tanstack/react-router";
import PerfilProfessor from "../../../pages/professor/PerfilProfessorPage";

export const Route = createFileRoute("/professor/_navbar/perfil")({
  component: PerfilProfessor,
});
