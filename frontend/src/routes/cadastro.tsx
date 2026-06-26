import { createFileRoute } from '@tanstack/react-router'
import Cadastro from '@/pages/cadastro'

export const Route = createFileRoute('/cadastro')({
  component: Cadastro,
})