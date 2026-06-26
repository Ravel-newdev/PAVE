import { useNavigate } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import { ArrowLeft, Bell, Mail, Phone, MapPin, Calendar, Lock, LogOut, Edit2 } from 'lucide-react'
import { api } from '@/lib/services/constants'
type Perfil = {
  nome: string
  email: string
  telefone: string | null
  departamento: string | null
  matricula: string
  criado_em: string
}

const PerfilProfessor = () => {
  const navigate = useNavigate()
  const [perfil, setPerfil] = useState<Perfil | null>(null)

  useEffect(() => {
  const token = localStorage.getItem('token')
  if (!token) { navigate({ to: '/login' }); return }
  api.defaults.headers.common['Authorization'] = `Bearer ${token}`
  api.get('/docentes/me')
    .then(res => setPerfil(res.data))
    .catch(() => navigate({ to: '/login' }))
}, [navigate])

  if (!perfil) return null

  const iniciais = perfil.email.charAt(0).toUpperCase()
  const nomeExibido = perfil.nome || perfil.email.split('@')[0]

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans antialiased text-gray-800 flex flex-col justify-between">
      <div>
        {/* Header Premium */}
        <header className="bg-white border-b border-gray-100 px-8 py-4 flex items-center justify-between sticky top-0 z-50 shadow-sm/5">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-[#2E7D32] flex items-center justify-center shadow-sm shadow-[#2E7D32]/20">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M17 8c0 0-2 7-10 11" stroke="white" strokeWidth="2.5" strokeLinecap="round"/>
              </svg>
            </div>
            <span className="font-bold text-lg text-[#1B5E20] tracking-tight">PAVE <span className="text-gray-300 font-light">UFC</span></span>
          </div>
          <nav className="flex items-center gap-8 text-sm font-medium">
            <a href="/" className="text-gray-400 hover:text-gray-600 transition">Início</a>
            <a href="/professor/projetos" className="text-gray-400 hover:text-gray-600 transition">Projetos</a>
          </nav>
          <div className="flex items-center gap-4">
            <button type="button" className="text-gray-400 hover:text-gray-600 transition p-1.5 hover:bg-gray-50 rounded-lg">
              <Bell className="w-5 h-5" />
            </button>
            <a 
              href="/professor/perfil" 
              className="w-8 h-8 rounded-xl bg-[#2E7D32] flex items-center justify-center text-sm font-semibold text-white border border-[#2E7D32]/20 shadow-sm shadow-[#2E7D32]/10 hover:scale-105 transition duration-200"
            >
              {iniciais}
            </a>
          </div>
        </header>

        <main className="max-w-4xl mx-auto px-6 py-10">
          <a href="/professor/projetos" className="inline-flex items-center gap-2 text-sm font-semibold text-[#2E7D32] hover:text-[#1B5E20] transition mb-6">
            <ArrowLeft className="w-4 h-4" />
            Voltar
          </a>

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-gray-900 mb-1.5">Meu Perfil</h1>
              <p className="text-sm text-gray-500 font-medium">Gerencie suas informações pessoais e preferências da conta.</p>
            </div>
            <a 
              href="/professor/perfil/editar" 
              className="inline-flex items-center justify-center gap-2 border border-gray-200 text-gray-600 font-semibold h-11 px-5 rounded-xl text-sm bg-white hover:bg-gray-50 hover:text-gray-900 transition shadow-sm shrink-0"
            >
              <Edit2 className="w-4 h-4 text-gray-400" />
              Editar perfil
            </a>
          </div>

          {/* Card Principal do Usuário (Sem o absolute problemático!) */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 sm:p-8 mb-6">
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
              <div className="flex items-center gap-6">
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[#2E7D32] to-[#1B5E20] flex items-center justify-center text-3xl font-bold text-white shrink-0 shadow-md shadow-[#2E7D32]/20">
                  {iniciais}
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900 tracking-tight">{nomeExibido}</h2>
                  <p className="text-xs font-bold text-[#2E7D32] uppercase tracking-wider mt-0.5">Coordenador de Extensão</p>
                  
                  <div className="flex flex-col gap-1.5 mt-3">
                    <div className="flex items-center gap-2 text-sm text-gray-500 font-medium">
                      <Mail className="w-4 h-4 text-gray-400" />
                      {perfil.email}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-500 font-medium">
                      <Phone className="w-4 h-4 text-gray-400" />
                      (85) 99999-1234
                    </div>
                  </div>
                </div>
              </div>

              {/* Grid de Informações Laterais do Figma */}
              <div className="flex flex-wrap gap-6 lg:border-l lg:border-gray-100 lg:pl-8 w-full lg:w-auto">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-gray-50 flex items-center justify-center text-gray-400 border border-gray-100">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider">Unidade</span>
                    <span className="text-sm font-semibold text-gray-700">Instituto de Matemática</span>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-gray-50 flex items-center justify-center text-gray-400 border border-gray-100">
                    <Calendar className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider">Membro desde</span>
                    <span className="text-sm font-semibold text-gray-700">Março de 2024</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Informações Pessoais */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 sm:p-8 mb-6">
            <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-6 pb-2 border-b border-gray-50">Informações pessoais</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Nome completo</label>
                <div className="border border-gray-200/60 rounded-xl h-11 px-4 flex items-center text-sm font-semibold text-gray-700 bg-gray-50/50">
                  {nomeExibido}
                </div>
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">E-mail institucional</label>
                <div className="border border-gray-200/60 rounded-xl h-11 px-4 flex items-center text-sm font-semibold text-gray-700 bg-gray-50/50">
                  {perfil.email}
                </div>
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Telefone</label>
                <div className="border border-gray-200/60 rounded-xl h-11 px-4 flex items-center text-sm font-semibold text-gray-700 bg-gray-50/50">
                  (85) 99999-1234
                </div>
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Departamento</label>
                <div className="border border-gray-200/60 rounded-xl h-11 px-4 flex items-center text-sm font-semibold text-gray-700 bg-gray-50/50">
                  Instituto de Matemática
                </div>
              </div>
            </div>
          </div>

          {/* Segurança */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 sm:p-8">
            <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-6 pb-2 border-b border-gray-50">Segurança</h3>
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-gray-50/50 border border-gray-100 rounded-xl p-4">
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Senha da Conta</p>
                <p className="text-sm text-gray-800 font-medium tracking-widest mt-1">••••••••••</p>
              </div>
              <button
                type="button"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 border border-gray-200 text-gray-600 text-xs font-bold px-4 h-10 rounded-xl bg-white hover:bg-gray-50 hover:text-gray-800 transition shadow-sm"
              >
                <Lock className="w-3.5 h-3.5" />
                Alterar senha
              </button>
            </div>

            <div className="border-t border-gray-100 mt-8 pt-6 flex justify-end">
              <button
                type="button"
                onClick={() => {
                  localStorage.removeItem('token')
                  localStorage.removeItem('tipo')
                  navigate({ to: '/login' })
                }}
                className="inline-flex items-center gap-2 text-sm text-red-500 hover:text-red-600 font-bold transition px-4 py-2 rounded-xl hover:bg-red-50/50"
              >
                <LogOut className="w-4 h-4" />
                Sair da conta
              </button>
            </div>
          </div>
        </main>
      </div>

      <footer className="bg-white border-t border-gray-100 mt-16 px-8 py-6 text-xs font-medium text-gray-400">
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <span className="font-bold text-[#1B5E20] tracking-tight text-sm">PAVE <span className="text-gray-300 font-light">UFC</span></span>
          <div className="flex flex-wrap items-center gap-6">
            <a href="#" className="hover:text-gray-600 transition">Sobre o PAVE</a>
            <a href="#" className="hover:text-gray-600 transition">Ajuda</a>
            <a href="#" className="hover:text-gray-600 transition">Política de Privacidade</a>
            <a href="#" className="hover:text-gray-600 transition">Termos de Uso</a>
          </div>
          <span>© 2026 PAVE - UFC</span>
        </div>
      </footer>
    </div>
  )
}

export default PerfilProfessor