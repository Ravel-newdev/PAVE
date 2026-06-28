import { createFileRoute } from "@tanstack/react-router";
import DashboardProfessorPage from "../../pages/professor/DashboardProfessorPage";

export const Route = createFileRoute("/professor/")({
  component: DashboardProfessorPage,
});
