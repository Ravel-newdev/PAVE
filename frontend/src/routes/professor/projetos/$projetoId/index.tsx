import { createFileRoute } from '@tanstack/react-router'
import VerProjeto from '@/lib/pages/professor/ver-projeto'

export const Route = createFileRoute('/professor/projetos/$projetoId/')({
  component: VerProjeto,
})