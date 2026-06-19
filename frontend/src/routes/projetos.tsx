import { createFileRoute } from '@tanstack/react-router'
import ProjetosProfessor from '@/lib/pages/professor'

export const Route = createFileRoute('/projetos')({
  component: ProjetosProfessor,
})
