import { createFileRoute } from '@tanstack/react-router'
import MinhasOportunidades from '@/lib/pages/Oportunidades/Oportunidades'

export const Route = createFileRoute('/oportunidades')({
  component: MinhasOportunidades,
})