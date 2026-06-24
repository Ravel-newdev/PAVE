import { createFileRoute } from '@tanstack/react-router'
import NovoProjeto from '@/lib/pages/professor/novo-projeto'

export const Route = createFileRoute('/professor/projetos/novo')({
  component: NovoProjeto,
})