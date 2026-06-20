// src/routes/projetos.index.tsx
import { createFileRoute } from '@tanstack/react-router'
import CatalogoProjeto from '../lib/pages/CatalagoProjeto/CatalogoProjeto'

export const Route = createFileRoute('/projetos/')({
  validateSearch: (search: Record<string, unknown>): { q?: string } => ({
    q: typeof search.q === "string" ? search.q : undefined,
  }),
  component: CatalogoProjeto,
})