import { createFileRoute } from '@tanstack/react-router'
import Login from '@/lib/pages/Login/Login'

export const Route = createFileRoute('/login')({
  component: Login,
})