import { createFileRoute, Outlet, redirect } from '@tanstack/react-router'
import { paveApi } from '../services/PaveApiService'

export const Route = createFileRoute('/projetos')({
  beforeLoad: () => {
    if (!paveApi.getToken()) throw redirect({ to: '/login' });
  },
  component: () => <Outlet />,
})
