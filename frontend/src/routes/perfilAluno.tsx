import { createFileRoute } from '@tanstack/react-router'
import ProfilePage from '@/pages/PerfilAluno'

export const Route = createFileRoute('/perfilAluno')({
  component: ProfilePage,
})
 