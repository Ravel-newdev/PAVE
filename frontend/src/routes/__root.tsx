import { createRootRoute, Outlet } from "@tanstack/react-router";
import { Component } from "react";
import type { ErrorInfo, ReactNode } from "react";
import { AuthProvider } from "../context/AuthContext";
import { Layout } from "../layout";

interface ErrorBoundaryState {
  hasError: boolean;
  message: string;
}

class GlobalErrorBoundary extends Component<{ children: ReactNode }, ErrorBoundaryState> {
  constructor(props: { children: ReactNode }) {
    super(props);
    this.state = { hasError: false, message: "" };
  }

  static getDerivedStateFromError(error: unknown): ErrorBoundaryState {
    const message = error instanceof Error ? error.message : "Ocorreu um erro inesperado.";
    return { hasError: true, message };
  }

  componentDidCatch(error: unknown, info: ErrorInfo): void {
    console.error("[GlobalErrorBoundary]", error, info.componentStack);
  }

  handleReset = (): void => {
    this.setState({ hasError: false, message: "" });
  };

  render(): ReactNode {
    if (this.state.hasError) {
      return (
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "100vh", gap: "1rem", fontFamily: "sans-serif", color: "#1E2E4F" }}>
          <h1 style={{ fontSize: "1.5rem", fontWeight: 700 }}>Algo deu errado</h1>
          <p style={{ color: "#64748B", maxWidth: 400, textAlign: "center" }}>{this.state.message}</p>
          <button onClick={this.handleReset} style={{ padding: "0.5rem 1.25rem", background: "#1E2E4F", color: "#fff", border: "none", borderRadius: 8, cursor: "pointer", fontWeight: 600 }}>
            Tentar novamente
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

export const Route = createRootRoute({
  component: () => (
    <GlobalErrorBoundary>
      <AuthProvider>
        <Layout>
          <Outlet />
        </Layout>
      </AuthProvider>
    </GlobalErrorBoundary>
  ),
});
