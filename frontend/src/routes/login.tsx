import { createFileRoute } from '@tanstack/react-router'
import Login from '@/lib/pages/login'

export const Route = createFileRoute('/login')({
  component: Login,
})