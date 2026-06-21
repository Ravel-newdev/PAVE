import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/professor/projetos/novo')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/professor/projeto-novo"!</div>
}
