import { createFileRoute } from "@tanstack/react-router";
import CandidaturaPage from "@/lib/pages/aluno/CandidaturaPage";

export const Route = createFileRoute("/candidatura")({
  component: CandidaturaPage,
});
