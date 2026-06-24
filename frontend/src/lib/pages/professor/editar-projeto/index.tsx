import { api } from '@/lib/services/constants'
import { useNavigate, useParams } from '@tanstack/react-router'
import { useEffect, useState } from 'react'

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
      <div className="min-h-screen bg-[#F5F7FA] flex items-center justify-center">
        <p className="text-sm text-gray-400">Carregando projeto...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#F5F7FA]">
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
        <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-sm font-medium text-gray-600">P</div>
      </header>

      <main className="max-w-2xl mx-auto px-6 py-10">
        <div className="flex items-center gap-2 text-sm text-gray-400 mb-6">
          <a href="/professor/projetos" className="hover:text-gray-600">Projetos</a>
          <span>›</span>
          <span className="text-gray-600">Editar projeto</span>
        </div>

        <h1 className="text-2xl font-semibold text-gray-800 mb-1">Editar projeto</h1>
        <p className="text-sm text-gray-400 mb-8">Atualize as informações do projeto de extensão.</p>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm px-8 py-8">
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">

            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-gray-600">
                Título <span className="text-red-400">*</span>
              </label>
              <input
                name="titulo"
                type="text"
                value={form.titulo}
                onChange={handleChange}
                className="border border-gray-200 rounded-lg px-4 py-2.5 text-sm outline-none focus:border-[#2E7D32] focus:ring-2 focus:ring-[#2E7D32]/10 transition"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-gray-600">Descrição</label>
              <textarea
                name="descricao"
                value={form.descricao}
                onChange={handleChange}
                rows={4}
                className="border border-gray-200 rounded-lg px-4 py-2.5 text-sm outline-none focus:border-[#2E7D32] focus:ring-2 focus:ring-[#2E7D32]/10 transition resize-none"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-gray-600">Centro / Departamento</label>
              <input
                name="centro_dep"
                type="text"
                value={form.centro_dep}
                onChange={handleChange}
                className="border border-gray-200 rounded-lg px-4 py-2.5 text-sm outline-none focus:border-[#2E7D32] focus:ring-2 focus:ring-[#2E7D32]/10 transition"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-gray-600">Carga horária semanal (h)</label>
              <input
                name="carga_hora"
                type="number"
                min={1}
                value={form.carga_hora}
                onChange={handleChange}
                className="border border-gray-200 rounded-lg px-4 py-2.5 text-sm outline-none focus:border-[#2E7D32] focus:ring-2 focus:ring-[#2E7D32]/10 transition"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-gray-600">Data de início</label>
                <input
                  name="data_inic"
                  type="date"
                  value={form.data_inic}
                  onChange={handleChange}
                  className="border border-gray-200 rounded-lg px-4 py-2.5 text-sm outline-none focus:border-[#2E7D32] focus:ring-2 focus:ring-[#2E7D32]/10 transition"
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-gray-600">Data de término</label>
                <input
                  name="data_termino"
                  type="date"
                  value={form.data_termino}
                  onChange={handleChange}
                  className="border border-gray-200 rounded-lg px-4 py-2.5 text-sm outline-none focus:border-[#2E7D32] focus:ring-2 focus:ring-[#2E7D32]/10 transition"
                />
              </div>
            </div>

            {erro && (
              <p className="text-sm text-red-500 bg-red-50 px-3 py-2 rounded-lg">{erro}</p>
            )}

            <div className="flex gap-3 pt-2">
              <a
                href="/professor/projetos"
                className="flex-1 text-center border border-gray-200 text-gray-600 font-medium py-2.5 rounded-lg text-sm hover:bg-gray-50 transition"
              >
                Cancelar
              </a>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-[#2E7D32] hover:bg-[#1B5E20] text-white font-medium py-2.5 rounded-lg text-sm transition disabled:opacity-60"
              >
                {loading ? 'Salvando...' : 'Salvar alterações'}
              </button>
            </div>

          </form>
        </div>
      </main>
    </div>
  )
}

export default EditarProjeto
