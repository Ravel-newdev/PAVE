import { createFileRoute } from '@tanstack/react-router'
import CriarProjeto from '@/pages/projeto-form/CriarProjeto'

export const Route = createFileRoute('/professor/criar-projeto')({
  component: CriarProjeto,
})
