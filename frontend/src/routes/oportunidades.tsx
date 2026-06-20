import { createFileRoute } from '@tanstack/react-router'
import MinhasOportunidades from '../lib/pages/Oportunidade/Oportunidade'
export const Route = createFileRoute('/oportunidades')({
  component: MinhasOportunidades,
})