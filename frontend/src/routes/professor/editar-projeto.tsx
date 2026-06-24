import { createFileRoute } from '@tanstack/react-router'
import EditarProjeto from '@/lib/pages/projeto-form/EditarProjeto'

export const Route = createFileRoute('/professor/editar-projeto')({
  component: EditarProjeto,
})
