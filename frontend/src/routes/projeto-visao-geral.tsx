import { createFileRoute } from '@tanstack/react-router'
import ProjetoVisaoGeral from '@/lib/pages/projeto-visao-geral/ProjetoVisaoGeral'

export const Route = createFileRoute('/projeto-visao-geral')({
  component: ProjetoVisaoGeral,
})
