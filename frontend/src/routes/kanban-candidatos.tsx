import { createFileRoute } from '@tanstack/react-router'
import KanbanCandidatos from '@/lib/pages/kanban-candidatos/KanbanCandidatos'

export const Route = createFileRoute('/kanban-candidatos')({
  component: KanbanCandidatos,
})
