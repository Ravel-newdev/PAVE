import { createFileRoute } from '@tanstack/react-router'
import PerfilProfessor from '@/pages/professor/PerfilProfessorPage'

export const Route = createFileRoute('/professor/perfil')({
  component: PerfilProfessor,
})