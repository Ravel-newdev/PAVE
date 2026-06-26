import { createFileRoute } from '@tanstack/react-router'
import ProjetoVisaoGeral from '@/pages/projeto-visao-geral/ProjetoVisaoGeral'

export const Route = createFileRoute('/professor/projeto-visao-geral')({
  component: ProjetoVisaoGeral,
})
