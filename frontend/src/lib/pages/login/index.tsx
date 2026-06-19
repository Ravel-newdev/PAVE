import { api } from '@/lib/services/constants'
import { useNavigate } from '@tanstack/react-router'
import { useState } from 'react'

const Login = () => {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [erro, setErro] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault()
    setErro('')

    if (!email || !senha) {
      setErro('Preencha e-mail e senha.')
      return
    }

    setLoading(true)
    try {
      const { data } = await api.post('/auth/login', { email, senha })
      localStorage.setItem('token', data.token)
      localStorage.setItem('tipo', data.tipo)
      if (data.tipo === 'docente') {
        navigate({ to: '/professor/projetos' })
      } else {
        navigate({ to: '/' })
      }
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message
      setErro(msg || 'E-mail ou senha inválidos.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F5F7FA]">
      <div className="w-full max-w-md">

        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-8 h-8 rounded-full bg-[#2E7D32] flex items-center justify-center">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M17 8C8 10 5.9 16.17 3.82 19.5c-.06.1.1.19.15.09C7 14 12 12.06 17 8z" fill="white"/>
                <path d="M17 8c0 0-2 7-10 11" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
            </div>
            <span className="text-2xl font-bold text-[#1B5E20] tracking-tight">PAVE</span>
          </div>
          <span className="text-xs text-gray-400 tracking-widest uppercase">UFC</span>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 px-8 py-10">
          <h1 className="text-xl font-semibold text-gray-800 mb-1">Entrar na plataforma</h1>
          <p className="text-sm text-gray-400 mb-7">Acesse com seu e-mail institucional</p>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-gray-600">E-mail institucional</label>
              <input
                type="email"
                placeholder="seunome@alu.ufc.br"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="border border-gray-200 rounded-lg px-4 py-2.5 text-sm outline-none focus:border-[#2E7D32] focus:ring-2 focus:ring-[#2E7D32]/10 transition"
              />
            </div>

            <div className="flex flex-col gap-1">
              <div className="flex justify-between items-center">
                <label className="text-sm font-medium text-gray-600">Senha</label>
                <a href="/recuperar-senha" className="text-xs text-[#2E7D32] hover:underline">
                  Esqueceu a senha?
                </a>
              </div>
              <input
                type="password"
                placeholder="••••••••"
                value={senha}
                onChange={e => setSenha(e.target.value)}
                className="border border-gray-200 rounded-lg px-4 py-2.5 text-sm outline-none focus:border-[#2E7D32] focus:ring-2 focus:ring-[#2E7D32]/10 transition"
              />
            </div>

            {erro && (
              <p className="text-sm text-red-500 bg-red-50 px-3 py-2 rounded-lg">{erro}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="bg-[#2E7D32] hover:bg-[#1B5E20] text-white font-medium py-2.5 rounded-lg text-sm transition disabled:opacity-60 mt-1"
            >
              {loading ? 'Entrando...' : 'Entrar'}
            </button>
          </form>

          <p className="text-center text-sm text-gray-400 mt-6">
            Não tem conta?{' '}
            <a href="/cadastro" className="text-[#2E7D32] font-medium hover:underline">
              Cadastre-se
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}

export default Login
