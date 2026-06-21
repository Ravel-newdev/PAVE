import { createFileRoute } from '@tanstack/react-router'
import CriarProjeto from '@/lib/pages/projeto-form/CriarProjeto'

export const Route = createFileRoute('/criar-projeto')({
  component: CriarProjeto,
})
