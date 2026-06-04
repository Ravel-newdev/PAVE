import { createFileRoute } from '@tanstack/react-router'
import Cadastro from '#/lib/pages/cadastro'

export const Route = createFileRoute('/cadastro')({
  component: Cadastro,
})

