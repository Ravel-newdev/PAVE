import { createFileRoute } from "@tanstack/react-router";
import KanbanCandidatos from "../pages/KanbanCandidatos/KanbanCandidatos";

export const Route = createFileRoute("/kanban-candidatos")({
  component: KanbanCandidatos,
});
