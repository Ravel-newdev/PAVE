// src/routes/projetos.index.tsx
import { createFileRoute } from '@tanstack/react-router'
import CatalogoProjeto from '../lib/pages/CatalagoProjeto/CatalogoProjeto'

export const Route = createFileRoute('/projetos/')({
  component: CatalogoProjeto,
})
