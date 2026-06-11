import { createFileRoute } from '@tanstack/react-router'
import CadastroProjeto from '#/lib/pages/CadastroProjeto/CadastroProjeto'

export const Route = createFileRoute('/cadastroProjeto')({
  component: CadastroProjeto,
})
