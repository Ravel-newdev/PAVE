import { createFileRoute, redirect } from '@tanstack/react-router'
import EditarPerfil from '../../../lib/pages/professor/editarperfil'

export const Route = createFileRoute('/professor/perfil/editar')({
  beforeLoad: async () => {
    const token = localStorage.getItem('token')
    if (!token) {
      throw redirect({
        to: '/login',
      })
    }
  },
  component: EditarPerfil,
})