import { useNavigate } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import { ArrowLeft, Bell, Save, Loader2, ChevronRight } from 'lucide-react'
import { api } from '@/lib/services/constants'

type FormPerfil = {
  nome: string
  email: string
  telefone: string
  departamento: string
  cidade: string
  data_nascimento: string
}

const EditarPerfil = () => {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [erro, setErro] = useState<string | null>(null)
  
  const [form, setForm] = useState<FormPerfil>({
    nome: '',
    email: '',
    telefone: '(85) 99999-1234',
    departamento: 'Instituto de Matemática',
    cidade: 'Fortaleza - CE',
    data_nascimento: '1985-04-12'
  })

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) { navigate({ to: '/login' }); return }
    try {
      const payload = JSON.parse(atob(token.split('.')[1]))
      setForm(prev => ({
        ...prev,
        email: payload.email || '',
        nome: payload.nome || payload.email.split('@')[0]
      }))
    } catch {
      navigate({ to: '/login' })
    }
  }, [navigate])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e: React.SyntheticEvent) => {
  e.preventDefault()
  setLoading(true)
  setErro(null)
  try {
    const token = localStorage.getItem('token')
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`
    await api.put('/docentes/me', {
      nome: form.nome,
      telefone: form.telefone,
      departamento: form.departamento,
    })
    window.location.href = '/professor/perfil'
  } catch {
    setErro('Ocorreu um erro ao atualizar as informações do perfil.')
  } finally {
    setLoading(false)
  }
}

  const iniciais = form.email.charAt(0).toUpperCase()

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans antialiased text-gray-800 flex flex-col justify-between">
      <div>
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
            <div className="w-8 h-8 rounded-xl bg-[#2E7D32] flex items-center justify-center text-sm font-semibold text-white">
              {iniciais}
            </div>
          </div>
        </header>

        <main className="max-w-3xl mx-auto px-6 py-10">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-gray-400 mb-6">
            <a href="/professor/perfil" className="hover:text-[#2E7D32] transition">Meu perfil</a>
            <ChevronRight className="w-3.5 h-3.5 text-gray-300" />
            <span className="text-gray-600">Editar informações</span>
          </div>

          <div className="mb-8 pb-4 border-b border-gray-100">
            <h1 className="text-3xl font-bold tracking-tight text-gray-900 mb-1.5">Editar perfil</h1>
            <p className="text-sm text-gray-500 font-medium">Modifique suas propriedades cadastrais e dados de contato institucionais.</p>
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 sm:p-8">
            <form onSubmit={handleSubmit} className="flex flex-col gap-6">
              
              <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider pb-2 border-b border-gray-50">Informações Pessoais</h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                    Nome Completo <span className="text-red-500">*</span>
                  </label>
                  <input
                    name="nome"
                    type="text"
                    value={form.nome}
                    onChange={handleChange}
                    className="border border-gray-200 rounded-xl h-11 px-4 text-sm font-medium text-gray-800 outline-none focus:border-[#2E7D32] focus:ring-4 focus:ring-[#2E7D32]/5 transition bg-gray-50/30 hover:bg-white"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">E-mail Institucional</label>
                  <input
                    name="email"
                    type="email"
                    disabled
                    value={form.email}
                    className="border border-gray-200 rounded-xl h-11 px-4 text-sm font-medium text-gray-400 bg-gray-100/60 outline-none cursor-not-allowed"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Telefone de Contato</label>
                  <input
                    name="telefone"
                    type="text"
                    value={form.telefone}
                    onChange={handleChange}
                    className="border border-gray-200 rounded-xl h-11 px-4 text-sm font-medium text-gray-800 outline-none focus:border-[#2E7D32] focus:ring-4 focus:ring-[#2E7D32]/5 transition bg-gray-50/30 hover:bg-white"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Centro / Departamento</label>
                  <input
                    name="departamento"
                    type="text"
                    value={form.departamento}
                    onChange={handleChange}
                    className="border border-gray-200 rounded-xl h-11 px-4 text-sm font-medium text-gray-800 outline-none focus:border-[#2E7D32] focus:ring-4 focus:ring-[#2E7D32]/5 transition bg-gray-50/30 hover:bg-white"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Data de Nascimento</label>
                  <input
                    name="data_nascimento"
                    type="date"
                    value={form.data_nascimento}
                    onChange={handleChange}
                    className="border border-gray-200 rounded-xl h-11 px-4 text-sm font-medium text-gray-800 outline-none focus:border-[#2E7D32] focus:ring-4 focus:ring-[#2E7D32]/5 transition bg-gray-50/30 hover:bg-white color-scheme-light"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Cidade / UF</label>
                  <input
                    name="cidade"
                    type="text"
                    value={form.cidade}
                    onChange={handleChange}
                    className="border border-gray-200 rounded-xl h-11 px-4 text-sm font-medium text-gray-800 outline-none focus:border-[#2E7D32] focus:ring-4 focus:ring-[#2E7D32]/5 transition bg-gray-50/30 hover:bg-white"
                  />
                </div>
              </div>

              {erro && (
                <div className="text-sm font-medium text-red-600 bg-red-50/80 border border-red-100 p-4 rounded-xl">
                  {erro}
                </div>
              )}

              {/* Ações do Formulário */}
              <div className="flex flex-col sm:flex-row items-center justify-end gap-3 pt-4 border-t border-gray-100 mt-2">
                <a
                  href="/professor/perfil"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 border border-gray-200 text-gray-500 font-semibold h-11 px-5 rounded-xl text-sm hover:bg-gray-50 hover:text-gray-800 transition"
                >
                  Cancelar
                </a>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#2E7D32] hover:bg-[#1B5E20] text-white font-semibold h-11 px-6 rounded-xl text-sm transition disabled:opacity-60 shadow-md shadow-[#2E7D32]/10"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Salvando...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      Salvar alterações
                    </>
                  )}
                </button>
              </div>

            </form>
          </div>
          
          <div className="flex justify-start mt-6">
            <a 
              href="/professor/perfil"
              className="inline-flex items-center gap-2 text-sm font-semibold text-gray-400 hover:text-gray-600 transition"
            >
              <ArrowLeft className="w-4 h-4" />
              Voltar ao perfil
            </a>
          </div>
        </main>
      </div>

      <footer className="bg-white border-t border-gray-100 mt-16 px-8 py-6 text-xs font-medium text-gray-400">
        <div className="max-w-3xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <span className="font-bold text-[#1B5E20] tracking-tight text-sm">PAVE <span className="text-gray-300 font-light">UFC</span></span>
          <span>© 2026 PAVE - UFC</span>
        </div>
      </footer>
    </div>
  )
}

export default EditarPerfil