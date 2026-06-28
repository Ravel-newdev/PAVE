import { createFileRoute } from "@tanstack/react-router";
import EsqueciSenha from "@/pages/Login/EsqueciSenha";

export const Route = createFileRoute("/esqueci-senha")({
  component: EsqueciSenha,
});
