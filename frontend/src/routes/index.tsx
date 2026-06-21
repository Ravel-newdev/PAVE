import { createFileRoute } from '@tanstack/react-router'
import Home from '@/lib/pages/Home/Home'

export const Route = createFileRoute('/')({
  component: Home,
})