import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";
import CandidaturaPage from "../../pages/aluno/CandidaturaPage";

const searchSchema = z.object({
  processoId: z.string(),
});

export const Route = createFileRoute("/aluno/candidatura")({
  validateSearch: searchSchema,
  component: CandidaturaPage,
});
