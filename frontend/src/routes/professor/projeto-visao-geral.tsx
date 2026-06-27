import { createFileRoute } from '@tanstack/react-router'
import ProjetoVisaoGeral from '@/pages/ProjetoVisaoGeral/ProjetoVisaoGeral'

export const Route = createFileRoute('/professor/projeto-visao-geral')({
  component: ProjetoVisaoGeral,
})
