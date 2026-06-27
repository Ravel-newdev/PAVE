import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { paveApi } from "../services/PaveApiService";

function decodeTokenTipo(token: string): string | null {
  try {
    const payload = token.split(".")[1];
    if (!payload) return null;
    const json = atob(payload.replace(/-/g, "+").replace(/_/g, "/"));
    const parsed = JSON.parse(json) as { tipo?: string; exp?: number };
    if (parsed.exp && Date.now() / 1000 > parsed.exp) return null;
    return parsed.tipo ?? null;
  } catch {
    return null;
  }
}

export const Route = createFileRoute("/aluno")({
  beforeLoad: () => {
    const token = paveApi.getToken();
    if (!token) throw redirect({ to: "/login" });

    const tipo = decodeTokenTipo(token);
    if (!tipo) {
      paveApi.clearToken();
      throw redirect({ to: "/login" });
    }

    if (tipo !== "discente") throw redirect({ to: "/professor" });
  },
  component: () => <Outlet />,
});
