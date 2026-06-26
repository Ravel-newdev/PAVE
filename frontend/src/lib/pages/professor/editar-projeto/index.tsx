import { api } from '@/lib/services/constants'
import { useNavigate, useParams } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import { ChevronRight, Bell, ArrowLeft, Save, Loader2 } from 'lucide-react'

const EditarProjeto = () => {
  const navigate = useNavigate()
  const { projetoId } = useParams({ strict: false }) as { projetoId: string }
  const [loading, setLoading] = useState(false)
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState('')
  const [form, setForm] = useState({
    titulo: '',
    descricao: '',
    carga_hora: '',
    data_inic: '',
    data_termino: '',
    centro_dep: '',
  })

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) { navigate({ to: '/login' }); return }
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`

    api.get(`/projetos/${projetoId}`)
      .then(res => {
        const p = res.data
        setForm({
          titulo: p.titulo || '',
          descricao: p.descricao || '',
          carga_hora: p.carga_hora?.toString() || '',
          data_inic: p.data_inic ? p.data_inic.split('T')[0] : '',
          data_termino: p.data_termino ? p.data_termino.split('T')[0] : '',
          centro_dep: p.centro_dep || '',
        })
      })
      .catch(() => setErro('Não foi possível carregar o projeto.'))
      .finally(() => setCarregando(false))
  }, [projetoId, navigate])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault()
    setErro('')

    if (!form.titulo) { setErro('O título é obrigatório.'); return }
    if (form.titulo.length < 5) { setErro('O título deve conter ao menos 5 caracteres.'); return }
    if (form.data_inic && form.data_termino && form.data_termino < form.data_inic) {
      setErro('A data de término não pode ser anterior à data de início.')
      return
    }

    setLoading(true)
    try {
      const payload: Record<string, unknown> = { titulo: form.titulo }
      if (form.descricao) payload.descricao = form.descricao
      if (form.carga_hora) payload.carga_hora = Number(form.carga_hora)
      if (form.data_inic) payload.data_inic = form.data_inic
      if (form.data_termino) payload.data_termino = form.data_termino
      if (form.centro_dep) payload.centro_dep = form.centro_dep

      await api.put(`/projetos/${projetoId}`, payload)
      navigate({ to: '/professor/projetos' })
    } catch (err) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message
      setErro(msg || 'Erro ao atualizar projeto.')
    } finally {
      setLoading(false)
    }
  }

  if (carregando) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex flex-col items-center justify-center gap-3 font-sans">
        <div className="w-6 h-6 border-2 border-[#2E7D32] border-t-transparent rounded-full animate-spin"></div>
        <p className="text-sm text-gray-400 font-medium">Carregando dados do formulário...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans antialiased text-gray-800">
      {/* Header Premium Alinhado */}
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
          <a href="/professor/projetos" className="text-[#2E7D32] border-b-2 border-[#2E7D32] pb-4 -mb-4">Projetos</a>
        </nav>
        <div className="flex items-center gap-4">
          <button type="button" className="text-gray-400 hover:text-gray-600 transition p-1.5 hover:bg-gray-50 rounded-lg">
            <Bell className="w-5 h-5" />
          </button>
          <div className="w-8 h-8 rounded-xl bg-gray-100 flex items-center justify-center text-sm font-semibold text-gray-600 border border-gray-200">P</div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-6 py-10">
        {/* Breadcrumb Figma */}
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-gray-400 mb-6">
          <a href="/professor/projetos" className="hover:text-[#2E7D32] transition">Projetos</a>
          <ChevronRight className="w-3.5 h-3.5 text-gray-300" />
          <span className="text-gray-600">Editar projeto</span>
        </div>

        <div className="mb-8 pb-4 border-b border-gray-100">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 mb-1.5">Editar projeto</h1>
          <p className="text-sm text-gray-500 font-medium">Modifique as propriedades e cronograma do projeto de extensão acadêmica.</p>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 sm:p-8">
          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                Título do Projeto <span className="text-red-500">*</span>
              </label>
              <input
                name="titulo"
                type="text"
                placeholder="Ex: Desenvolvimento de Sistema Computacional"
                value={form.titulo}
                onChange={handleChange}
                className="border border-gray-200 rounded-xl h-11 px-4 text-sm font-medium text-gray-800 outline-none focus:border-[#2E7D32] focus:ring-4 focus:ring-[#2E7D32]/5 transition bg-gray-50/30 hover:bg-white"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Descrição Detalhada</label>
              <textarea
                name="descricao"
                placeholder="Descreva as metas, metodologia e objetivos do projeto..."
                value={form.descricao}
                onChange={handleChange}
                rows={5}
                className="border border-gray-200 rounded-xl p-4 text-sm font-medium text-gray-800 outline-none focus:border-[#2E7D32] focus:ring-4 focus:ring-[#2E7D32]/5 transition resize-none bg-gray-50/30 hover:bg-white leading-relaxed"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Centro / Departamento</label>
                <input
                  name="centro_dep"
                  type="text"
                  placeholder="Ex: Centro de Tecnologia"
                  value={form.centro_dep}
                  onChange={handleChange}
                  className="border border-gray-200 rounded-xl h-11 px-4 text-sm font-medium text-gray-800 outline-none focus:border-[#2E7D32] focus:ring-4 focus:ring-[#2E7D32]/5 transition bg-gray-50/30 hover:bg-white"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Carga horária semanal (horas)</label>
                <input
                  name="carga_hora"
                  type="number"
                  min={1}
                  placeholder="Ex: 12"
                  value={form.carga_hora}
                  onChange={handleChange}
                  className="border border-gray-200 rounded-xl h-11 px-4 text-sm font-medium text-gray-800 outline-none focus:border-[#2E7D32] focus:ring-4 focus:ring-[#2E7D32]/5 transition bg-gray-50/30 hover:bg-white"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Data de início</label>
                <input
                  name="data_inic"
                  type="date"
                  value={form.data_inic}
                  onChange={handleChange}
                  className="border border-gray-200 rounded-xl h-11 px-4 text-sm font-medium text-gray-800 outline-none focus:border-[#2E7D32] focus:ring-4 focus:ring-[#2E7D32]/5 transition bg-gray-50/30 hover:bg-white color-scheme-light"
                />
              </div>
              
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Data de término</label>
                <input
                  name="data_termino"
                  type="date"
                  value={form.data_termino}
                  onChange={handleChange}
                  className="border border-gray-200 rounded-xl h-11 px-4 text-sm font-medium text-gray-800 outline-none focus:border-[#2E7D32] focus:ring-4 focus:ring-[#2E7D32]/5 transition bg-gray-50/30 hover:bg-white color-scheme-light"
                />
              </div>
            </div>

            {erro && (
              <div className="text-sm font-medium text-red-600 bg-red-50/80 border border-red-100 p-4 rounded-xl">
                {erro}
              </div>
            )}

            <div className="flex flex-col sm:flex-row items-center justify-end gap-3 pt-4 border-t border-gray-100 mt-2">
              <a
                href="/professor/projetos"
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
            href={`/professor/projetos`}
            className="inline-flex items-center gap-2 text-sm font-semibold text-gray-400 hover:text-gray-600 transition"
          >
            <ArrowLeft className="w-4 h-4" />
            Voltar para detalhes
          </a>
        </div>
      </main>
    </div>
  )
}

export default EditarProjeto