import { createFileRoute } from "@tanstack/react-router";
import ProjetoVisaoGeral from "../pages/ProjetoVisaoGeral/ProjetoVisaoGeral";

export const Route = createFileRoute("/projeto-visao-geral")({
  component: ProjetoVisaoGeral,
});
