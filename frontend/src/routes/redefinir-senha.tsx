import { createFileRoute } from "@tanstack/react-router";
import RedefinirSenha from "@/pages/Login/RedefinirSenha";

export const Route = createFileRoute("/redefinir-senha")({
  validateSearch: (search: Record<string, unknown>) => ({
    token: typeof search.token === "string" ? search.token : undefined,
  }),
  component: RedefinirSenha,
});
