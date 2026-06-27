import { createFileRoute } from '@tanstack/react-router'
import KanbanCandidatos from '@/pages/KanbanCandidatos/KanbanCandidatos'

export const Route = createFileRoute('/professor/kanban-candidatos')({
  component: KanbanCandidatos,
})
