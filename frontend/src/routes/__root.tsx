import { createRootRoute, Outlet } from '@tanstack/react-router'

import { Layout } from "../lib/layout";
import { FavoritosProvider } from '../lib/context/FavoritosContext'
import { InscricoesProvider } from '../lib/context/InscricoesContext'

export const Route = createRootRoute({
  component: () => (
    <FavoritosProvider>
      <InscricoesProvider>
        <Layout>
          <Outlet />
        </Layout>
      </InscricoesProvider>
    </FavoritosProvider>
  ),
})