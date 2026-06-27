import { createFileRoute, redirect } from "@tanstack/react-router";
import { paveApi } from "../../services/PaveApiService";
import { AuthError } from "../../errors/ApiError";
import DashboardProfessorPage from "../../pages/professor/DashboardProfessorPage";

function decodeTokenTipo(token: string): string | null {
  try {
    const base64Payload = token.split(".")[1];
    if (!base64Payload) return null;
    const json = atob(base64Payload.replace(/-/g, "+").replace(/_/g, "/"));
    const parsed = JSON.parse(json) as { tipo?: string; exp?: number };
    if (parsed.exp && Date.now() / 1000 > parsed.exp) return null;
    return parsed.tipo ?? null;
  } catch {
    return null;
  }
}

export const Route = createFileRoute("/professor/")({
  beforeLoad: () => {
    const token = paveApi.getToken();

    if (!token) throw redirect({ to: "/login" });

    const tipo = decodeTokenTipo(token);

    if (!tipo) {
      paveApi.clearToken();
      throw redirect({ to: "/login" });
    }

    if (tipo !== "docente") throw new AuthError("Acesso restrito a docentes.");
  },
  component: DashboardProfessorPage,
});
