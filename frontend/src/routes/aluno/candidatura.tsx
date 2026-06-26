import { createFileRoute } from "@tanstack/react-router";
import CandidaturaPage from "../../pages/aluno/CandidaturaPage";

export const Route = createFileRoute("/aluno/candidatura")({
  component: CandidaturaPage,
});
