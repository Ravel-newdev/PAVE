import { createFileRoute } from '@tanstack/react-router'
import PerfilProfessor from '@/lib/pages/professor/perfil'

export const Route = createFileRoute('/professor/perfil/')({
  component: PerfilProfessor,
})

