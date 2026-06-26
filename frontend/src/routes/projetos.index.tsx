import { createFileRoute } from "@tanstack/react-router"
import CatalogoProjeto from "../pages/CatalagoProjeto/CatalogoProjeto"

export const Route = createFileRoute("/projetos/")({
  component: CatalogoProjeto,
})