import { createFileRoute } from '@tanstack/react-router'
import KanbanCandidatos from '@/lib/pages/kanban-candidatos/KanbanCandidatos'

export const Route = createFileRoute('/professor/kanban-candidatos')({
  component: KanbanCandidatos,
})
