import { createRootRoute, Outlet } from '@tanstack/react-router'
import { FavoritosProvider } from '../lib/context/FavoritosContext'
import { InscricoesProvider } from '../lib/context/InscricoesContext' // <-- Importe aqui

export const Route = createRootRoute({
  component: () => (
    <FavoritosProvider>
      <InscricoesProvider> 
        <Outlet />
      </InscricoesProvider>
    </FavoritosProvider>
  ),
})