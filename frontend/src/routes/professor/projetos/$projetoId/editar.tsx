import { createFileRoute } from '@tanstack/react-router'
import EditarProjeto from '@/lib/pages/professor/editar-projeto'

export const Route = createFileRoute('/professor/projetos/$projetoId/editar')({
  component: EditarProjeto,
})