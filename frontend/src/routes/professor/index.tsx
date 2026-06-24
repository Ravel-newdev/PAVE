import { createFileRoute } from '@tanstack/react-router'
import DashboardProfessorPage from '@/lib/pages/professor/DashboardProfessorPage'

export const Route = createFileRoute('/professor/')({
  component: DashboardProfessorPage,
})