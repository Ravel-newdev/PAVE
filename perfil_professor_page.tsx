import { useNavigate } from '@tanstack/react-router'
import { useEffect, useState } from 'react'

type Perfil = {
  id: string
  email: string
  tipo: string
  nome?: string
}

const PerfilProfessor = () => {
  const navigate = useNavigate()
  const [perfil, setPerfil] = useState<Perfil | null>(null)

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) { navigate({ to: '/login' }); return }
    try {
      const payload = JSON.parse(atob(token.split('.')[1]))
      setPerfil(payload)
    } catch {
      navigate({ to: '/login' })
    }
  }, [navigate])

  if (!perfil) return null

  const iniciais = perfil.email.charAt(0).toUpperCase()
  const nomeExibido = perfil.nome || perfil.email.split('@')[0]

  return (
    <div className="min-h-screen bg-[#F5F7FA]">
      {/* Header */}
      <header className="bg-white border-b border-gray-100 px-8 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-full bg-[#2E7D32] flex items-center justify-center">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M17 8c0 0-2 7-10 11" stroke="white" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </div>
          <span className="font-bold text-[#1B5E20] tracking-tight">PAVE <span className="text-gray-300 font-normal">UFC</span></span>
        </div>
        <nav className="flex items-center gap-6 text-sm">
          <a href="/" className="text-gray-500 hover:text-gray-800">Início</a>
          <a href="/professor/projetos" className="text-gray-500 hover:text-gray-800">Projetos</a>
        </nav>
        <div className="w-8 h-8 rounded-full bg-[#2E7D32] flex items-center justify-center text-sm font-medium text-white">
          {iniciais}
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-6 py-10">
        {/* Voltar */}
        <a href="/professor/projetos" className="flex items-center gap-1 text-sm text-gray-400 hover:text-gray-600 mb-6">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
            <path d="M19 12H5M12 5l-7 7 7 7" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Voltar
        </a>

        <div className="flex items-start justify-between mb-8">
          <div>
            <h1 className="text-2xl font-semibold text-gray-800">Meu Perfil</h1>
            <p className="text-sm text-gray-400 mt-1">Gerencie suas informações pessoais e preferências da conta.</p>
          </div>
        </div>

        {/* Card perfil */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm px-8 py-6 mb-6">
          <div className="flex items-center gap-6">
            {/* Avatar */}
            <div className="w-20 h-20 rounded-full bg-[#2E7D32] flex items-center justify-center text-2xl font-bold text-white shrink-0">
              {iniciais}
            </div>
            <div className="flex-1">
              <h2 className="text-lg font-semibold text-gray-800">{nomeExibido}</h2>
              <p className="text-sm text-[#2E7D32]">Docente</p>
              <div className="flex items-center gap-4 mt-2">
                <div className="flex items-center gap-1.5 text-sm text-gray-500">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                    <polyline points="22,6 12,13 2,6"/>
                  </svg>
                  {perfil.email}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Informações pessoais */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm px-8 py-6 mb-6">
          <h3 className="text-base font-semibold text-gray-800 mb-5">Informações pessoais</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1">
              <label className="text-xs font-medium text-gray-400 uppercase tracking-wide">Nome completo</label>
              <div className="border border-gray-200 rounded-lg px-4 py-2.5 text-sm text-gray-700 bg-gray-50">
                {nomeExibido}
              </div>
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs font-medium text-gray-400 uppercase tracking-wide">E-mail institucional</label>
              <div className="border border-gray-200 rounded-lg px-4 py-2.5 text-sm text-gray-700 bg-gray-50">
                {perfil.email}
              </div>
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs font-medium text-gray-400 uppercase tracking-wide">Telefone</label>
              <div className="border border-gray-200 rounded-lg px-4 py-2.5 text-sm text-gray-400 bg-gray-50 italic">
                Não informado
              </div>
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs font-medium text-gray-400 uppercase tracking-wide">Departamento</label>
              <div className="border border-gray-200 rounded-lg px-4 py-2.5 text-sm text-gray-400 bg-gray-50 italic">
                Não informado
              </div>
            </div>
          </div>
        </div>

        {/* Segurança */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm px-8 py-6">
          <h3 className="text-base font-semibold text-gray-800 mb-5">Segurança</h3>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Senha</p>
              <p className="text-sm text-gray-400 mt-0.5">••••••••••</p>
            </div>
            <button
              type="button"
              className="flex items-center gap-2 border border-gray-200 text-gray-600 text-sm font-medium px-4 py-2 rounded-lg hover:bg-gray-50 transition"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                <path d="M7 11V7a5 5 0 0110 0v4"/>
              </svg>
              Alterar senha
            </button>
          </div>

          {/* Logout */}
          <div className="border-t border-gray-100 mt-6 pt-6">
            <button
              type="button"
              onClick={() => {
                localStorage.removeItem('token')
                localStorage.removeItem('tipo')
                navigate({ to: '/login' })
              }}
              className="flex items-center gap-2 text-sm text-red-500 hover:text-red-600 font-medium transition"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Sair da conta
            </button>
          </div>
        </div>
      </main>
    </div>
  )
}

export default PerfilProfessor
