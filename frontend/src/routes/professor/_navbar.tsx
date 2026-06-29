import { createFileRoute, Outlet } from "@tanstack/react-router";
import { ProfessorNavbar } from "../../layout/components/professor/ProfessorNavbar";

export const Route = createFileRoute("/professor/_navbar")({
  component: () => (
    <div style={{ display: "contents" }}>
      <ProfessorNavbar />
      <Outlet />
    </div>
  ),
});
