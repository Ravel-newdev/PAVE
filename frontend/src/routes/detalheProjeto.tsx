import { createFileRoute } from '@tanstack/react-router'
import DetalheProjeto from '../pages/DetalheProjeto/DetalheProjeto'

export const Route = createFileRoute('/detalheProjeto')({
  component: () => <DetalheProjeto projeto={{} as any} />,
})