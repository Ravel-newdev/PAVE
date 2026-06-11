import { createFileRoute } from '@tanstack/react-router'
import DetalheProjeto from '@/lib/pages/DetalheProjeto/DetalheProjeto'

export const Route = createFileRoute('/detalheProjeto')({
  component: DetalheProjeto,
})
