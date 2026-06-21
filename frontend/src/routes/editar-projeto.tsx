import { createFileRoute } from '@tanstack/react-router'
import EditarProjeto from '@/lib/pages/projeto-form/EditarProjeto'

export const Route = createFileRoute('/editar-projeto')({
  component: EditarProjeto,
})
