import { createFileRoute } from '@tanstack/react-router'
import EditarProjeto from '@/pages/ProjetoForm/EditarProjeto'

export const Route = createFileRoute('/professor/editar-projeto')({
  component: EditarProjeto,
})
