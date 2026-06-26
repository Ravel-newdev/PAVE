import { createFileRoute } from '@tanstack/react-router'
import CadastroProjeto from '../pages/CadastroProjeto/CadastroProjeto'

export const Route = createFileRoute('/cadastroProjeto')({
  component: CadastroProjeto,
})
