import { createFileRoute } from '@tanstack/react-router'
import MinhasOportunidades from '../../pages/Oportunidade/Oportunidade'

export const Route = createFileRoute('/aluno/oportunidades')({
  component: MinhasOportunidades,
})
