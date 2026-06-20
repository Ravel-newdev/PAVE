// src/routes/projetos.tsx
import { createFileRoute, Outlet } from '@tanstack/react-router'

export const Route = createFileRoute('/projetos')({
  component: () => <Outlet />,
})