import { createFileRoute } from '@tanstack/react-router'
import CadastroProjeto from '../../pages/CadastroProjeto/CadastroProjeto'

export const Route = createFileRoute('/professor/cadastrar-projeto')({
  component: CadastroProjeto,
})
