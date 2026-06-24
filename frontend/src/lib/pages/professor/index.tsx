import { api } from '@/lib/services/constants'
import { useEffect, useState } from 'react'
import { useNavigate } from '@tanstack/react-router'
type Projeto = {
  id: number
  titulo: string
  area_tematica: string
  tipo_vaga: string
  status: 'ativo' | 'rascunho' | 'encerrado'
  total_inscritos: number
  vagas_preenchidas: number
  total_vagas: number
  dias_restantes: number | null
  data_fim_inscricoes: string | null
}

const badgeStyles = {
  ativo: 'bg-green-100 text-green-700',
  rascunho: 'bg-gray-100 text-gray-500',
  encerrado: 'bg-red-100 text-red-600',
}

const badgeLabel = {
  ativo: 'Ativo',
  rascunho: 'Rascunho',
  encerrado: 'Encerrado',
}

const ProjetorProfessor = () => {
  const navigate = useNavigate()
  const [projetos, setProjetos] = useState<Projeto[]>([])
  const [loading, setLoading] = useState(true)
  const [busca, setBusca] = useState('')
  const [filtroStatus, setFiltroStatus] = useState('todos')
  const [menuAberto, setMenuAberto] = useState<string | null>(null)

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) {
      navigate({ to: '/login' })
      return
    }
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`
    api.get('/projetos')
      .then(res => setProjetos(res.data))
      .catch(() => setProjetos([]))
      .finally(() => setLoading(false))
  }, [navigate])

  const projetosFiltrados = projetos.filter(p => {
    const matchBusca = p.titulo.toLowerCase().includes(busca.toLowerCase())
    const matchStatus = filtroStatus === 'todos' || p.status === filtroStatus
    return matchBusca && matchStatus
  })

  const grupos = ['ativo', 'rascunho', 'encerrado'] as const

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
          <a href="/professor/projetos" className="text-[#2E7D32] font-medium border-b-2 border-[#2E7D32] pb-0.5">Projetos</a>
        </nav>
        <div className="flex items-center gap-3">
          <button type="button" className="text-gray-400 hover:text-gray-600">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
              <path d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6 6 0 10-12 0v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"/>
            </svg>
          </button>
          <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-sm font-medium text-gray-600">P</div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-8">
        {/* Título + botão */}
        <div className="flex items-start justify-between mb-6">
          <div>
            <h1 className="text-2xl font-semibold text-gray-800">Meus projetos</h1>
            <p className="text-sm text-gray-400 mt-0.5">Gerencie seus projetos de extensão e processos seletivos.</p>
          </div>
          <a
            href="/professor/projetos/novo"
            className="flex items-center gap-2 bg-[#2E7D32] hover:bg-[#1B5E20] text-white text-sm font-medium px-4 py-2.5 rounded-lg transition"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <path d="M12 5v14M5 12h14" strokeLinecap="round"/>
            </svg>
            Novo projeto
          </a>
        </div>

        {/* Filtros */}
        <div className="flex gap-3 mb-8">
          <div className="relative flex-1 max-w-xs">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/>
            </svg>
            <input
              type="text"
              placeholder="Buscar projetos..."
              value={busca}
              onChange={e => setBusca(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-lg outline-none focus:border-[#2E7D32] focus:ring-2 focus:ring-[#2E7D32]/10 transition bg-white"
            />
          </div>
          <select
            value={filtroStatus}
            onChange={e => setFiltroStatus(e.target.value)}
            className="text-sm border border-gray-200 rounded-lg px-3 py-2 outline-none focus:border-[#2E7D32] bg-white text-gray-600"
          >
            <option value="todos">Todos os status</option>
            <option value="ativo">Ativos</option>
            <option value="rascunho">Rascunhos</option>
            <option value="encerrado">Encerrados</option>
          </select>
        </div>

        {loading ? (
          <div className="text-center py-20 text-gray-400 text-sm">Carregando projetos...</div>
        ) : projetosFiltrados.length === 0 ? (
          <div className="text-center py-20 text-gray-400 text-sm">Nenhum projeto encontrado.</div>
        ) : (
          <div className="flex flex-col gap-10">
            {grupos.map(grupo => {
              const lista = projetosFiltrados.filter(p => p.status === grupo)
              if (lista.length === 0) return null
              const labelGrupo = { ativo: 'Ativos', rascunho: 'Rascunhos', encerrado: 'Encerrados' }[grupo]
              const corGrupo = { ativo: 'text-green-700', rascunho: 'text-gray-500', encerrado: 'text-red-600' }[grupo]
              return (
                <div key={grupo}>
                  <h2 className={`text-sm font-semibold mb-3 ${corGrupo}`}>
                    {labelGrupo} ({lista.length})
                  </h2>
                  <div className="flex flex-col gap-3">
                    {lista.map(p => (
                      <div key={p.id} className="bg-white rounded-xl border border-gray-100 px-5 py-4 flex items-center gap-4 hover:shadow-sm transition">
                        {/* Ícone */}
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${p.status === 'ativo' ? 'bg-green-50' : p.status === 'rascunho' ? 'bg-gray-100' : 'bg-red-50'}`}>
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={p.status === 'ativo' ? '#2E7D32' : p.status === 'rascunho' ? '#9CA3AF' : '#DC2626'} strokeWidth="1.5" aria-hidden="true">
                            <path d="M9 12h6M9 16h6M13 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V9z" strokeLinecap="round"/>
                            <path d="M13 2v7h7"/>
                          </svg>
                        </div>

                        {/* Info */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-gray-800 text-sm truncate">{p.titulo}</span>
                            <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${badgeStyles[p.status]}`}>
                              {badgeLabel[p.status]}
                            </span>
                          </div>
                          <div className="flex items-center gap-3 mt-1 text-xs text-gray-400">
                            <span>{p.area_tematica}</span>
                            <span>·</span>
                            <span>{p.tipo_vaga}</span>
                            {p.data_fim_inscricoes && (
                              <>
                                <span>·</span>
                                <span className="text-[#2E7D32]">Inscrições até {new Date(p.data_fim_inscricoes).toLocaleDateString('pt-BR')}</span>
                              </>
                            )}
                          </div>
                        </div>

                        {/* Stats */}
                        {p.status === 'ativo' && (
                          <div className="hidden sm:flex items-center gap-5 text-xs text-gray-500 shrink-0">
                            <div className="flex items-center gap-1">
                              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/></svg>
                              <span>{p.total_inscritos} inscritos</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></svg>
                              <span>{p.vagas_preenchidas}/{p.total_vagas} vagas</span>
                            </div>
                            {p.dias_restantes != null && (
                              <div className="flex items-center gap-1">
                                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>
                                <span>{p.dias_restantes} dias restantes</span>
                              </div>
                            )}
                          </div>
                        )}

                        <div className="relative ml-2">
                          <button type="button" onClick={() => setMenuAberto(menuAberto === p.id ? null : p.id)} className="text-gray-300 hover:text-gray-500">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                              <circle cx="12" cy="5" r="1.5"/><circle cx="12" cy="12" r="1.5"/><circle cx="12" cy="19" r="1.5"/>
                            </svg>
                          </button>
                          {menuAberto === p.id && (
                            <div className="absolute right-0 top-6 z-10 bg-white border border-gray-100 rounded-xl shadow-lg py-1 w-44">

                             <a href={`/professor/projetos/${p.id}/editar`} className="flex items-center gap-2 px-4 py-2 text-sm text-gray-600 hover:bg-gray-50">
                              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                                <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/>
                                <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/>
                              </svg>
                                Editar projeto
                              </a>
                            </div>
                          )}
                          </div>
                        </div>
                    ))}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </main>
    </div>
  )
}

export default ProjetorProfessor
