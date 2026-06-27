import { createFileRoute } from "@tanstack/react-router"
import CatalogoProjeto from "../pages/CatalogoProjeto/CatalogoProjeto"

export const Route = createFileRoute("/projetos/")({
  component: CatalogoProjeto,
})