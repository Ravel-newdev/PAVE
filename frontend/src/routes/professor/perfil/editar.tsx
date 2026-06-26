import { createFileRoute } from '@tanstack/react-router'
import EditarPerfil from '@/lib/pages/professor/editarperfil'

export const Route = createFileRoute('/professor/perfil/editar')({
  component: EditarPerfil,
})
