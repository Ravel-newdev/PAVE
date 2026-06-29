import { createFileRoute } from '@tanstack/react-router'
import EditarPerfil from '@/pages/professor/EditarPerfil'

export const Route = createFileRoute('/professor/perfil/editar')({
  component: EditarPerfil,
})