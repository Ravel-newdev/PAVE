import { api } from '@/lib/services/constants'
import { useEffect, useState } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { 
  MoreVertical, 
  GraduationCap, 
  User, 
  Calendar, 
  Clock, 
  Users, 
  BookOpen, 
  Plus, 
  Search, 
  FolderKanban,
  Bell,
  Eye
} from 'lucide-react'

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
  ativo: 'bg-green-50 text-green-700 border border-green-200/60',
  rascunho: 'bg-gray-50 text-gray-500 border border-gray-200/60',
  encerrado: 'bg-red-50 text-red-600 border border-red-200/60',
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
  const [menuAberto, setMenuAberto] = useState<number | null>(null)

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
    <div className="min-h-screen bg-[#F8FAFC] font-sans antialiased text-gray-800">
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

      <main className="max-w-5xl mx-auto px-6 py-10">
        {/* Título + Botão Nova Ação */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-gray-900">Meus projetos</h1>
            <p className="text-sm text-gray-500 mt-0.5">Gerencie e acompanhe seus projetos de extensão cadastrados.</p>
          </div>
          <a
            href="/professor/projetos/novo"
            className="inline-flex items-center justify-center gap-2 bg-[#2E7D32] hover:bg-[#1B5E20] text-white text-sm font-semibold h-11 px-5 rounded-xl transition shadow-md shadow-[#2E7D32]/10"
          >
            <Plus className="w-4 h-4" />
            Novo projeto
          </a>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 mb-8">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Buscar projetos pelo título..."
              value={busca}
              onChange={e => setBusca(e.target.value)}
              className="w-full pl-10 pr-4 h-11 text-sm border border-gray-200 rounded-xl outline-none focus:border-[#2E7D32] focus:ring-4 focus:ring-[#2E7D32]/5 transition bg-white shadow-inner/5"
            />
          </div>
          <select
            value={filtroStatus}
            onChange={e => setFiltroStatus(e.target.value)}
            className="text-sm border border-gray-200 rounded-xl px-4 h-11 outline-none focus:border-[#2E7D32] bg-white text-gray-600 font-medium cursor-pointer transition shadow-inner/5"
          >
            <option value="todos">Todos os status</option>
            <option value="ativo">Ativos</option>
            <option value="rascunho">Rascunhos</option>
            <option value="encerrado">Encerrados</option>
          </select>
        </div>

        {loading ? (
          <div className="text-center py-24 text-gray-400 text-sm font-medium flex flex-col items-center gap-3">
            <div className="w-6 h-6 border-2 border-[#2E7D32] border-t-transparent rounded-full animate-spin"></div>
            Carregando projetos...
          </div>
        ) : projetosFiltrados.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl border border-gray-100 text-gray-400 text-sm font-medium shadow-sm">
            Nenhum projeto encontrado para os filtros aplicados.
          </div>
        ) : (
          <div className="flex flex-col gap-10">
            {grupos.map(grupo => {
              const lista = projetosFiltrados.filter(p => p.status === grupo)
              if (lista.length === 0) return null
              const labelGrupo = { ativo: 'Ativos', rascunho: 'Rascunhos', encerrado: 'Encerrados' }[grupo]
              const corGrupo = { ativo: 'text-green-800', rascunho: 'text-gray-500', encerrado: 'text-red-700' }[grupo]
              
              return (
                <div key={grupo} className="flex flex-col gap-3.5">
                  <h2 className={`text-xs font-bold uppercase tracking-wider ${corGrupo} px-1`}>
                    {labelGrupo} ({lista.length})
                  </h2>
                  <div className="flex flex-col gap-3.5">
                    {lista.map(p => (
                      <div key={p.id} className="bg-white rounded-2xl border border-gray-100 px-6 py-5 flex flex-col sm:flex-row sm:items-center justify-between gap-5 hover:shadow-md hover:border-gray-200/80 transition-all duration-200 group relative">
                        
                        <div className="flex items-start gap-4 flex-1 min-w-0">
                          <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 shadow-inner ${p.status === 'ativo' ? 'bg-green-50/70 text-green-600' : p.status === 'rascunho' ? 'bg-gray-50 text-gray-400' : 'bg-red-50/70 text-red-600'}`}>
                            <FolderKanban className="w-5 h-5" />
                          </div>

                          <div className="flex flex-col gap-1 min-w-0">
                            <div className="flex items-center gap-2.5 flex-wrap">
                              <h3 className="font-semibold text-gray-900 text-base leading-snug group-hover:text-[#2E7D32] transition truncate max-w-md">
                                {p.titulo}
                              </h3>
                              <span className={`text-[11px] px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider shrink-0 ${badgeStyles[p.status]}`}>
                                {badgeLabel[p.status]}
                              </span>
                            </div>
                            
                            <div className="flex items-center gap-3.5 flex-wrap text-xs text-gray-400 font-medium mt-0.5">
                              <span className="flex items-center gap-1 text-gray-500">
                                <BookOpen className="w-3.5 h-3.5 text-gray-400" /> {p.area_tematica || 'Sem Área'}
                              </span>
                              <span className="text-gray-200">•</span>
                              <span className="flex items-center gap-1 text-gray-500">
                                <User className="w-3.5 h-3.5 text-gray-400" /> {p.tipo_vaga || 'Não Definido'}
                              </span>
                              {p.data_fim_inscricoes && (
                                <>
                                  <span className="text-gray-200">•</span>
                                  <span className="flex items-center gap-1 text-[#2E7D32] font-semibold">
                                    Inscrições até {new Date(p.data_fim_inscricoes).toLocaleDateString('pt-BR')}
                                  </span>
                                </>
                              )}
                            </div>
                          </div>
                        </div>

                        {p.status === 'ativo' && (
                          <div className="flex items-center gap-8 text-xs text-gray-500 shrink-0 bg-gray-50/50 border border-gray-100 rounded-xl px-5 py-2.5 sm:mt-0">
                            <div className="flex items-center gap-2">
                              <Users className="w-4 h-4 text-gray-400" />
                              <div>
                                <span className="block text-gray-900 font-bold text-sm leading-none">{p.total_inscritos}</span>
                                <span className="text-[10px] text-gray-400 uppercase font-bold tracking-tight mt-0.5 block">inscritos</span>
                              </div>
                            </div>
                            <div className="w-px h-6 bg-gray-200"></div>
                            <div className="flex items-center gap-2">
                              <Calendar className="w-4 h-4 text-gray-400" />
                              <div>
                                <span className="block text-gray-900 font-bold text-sm leading-none">{p.vagas_preenchidas}/{p.total_vagas}</span>
                                <span className="text-[10px] text-gray-400 uppercase font-bold tracking-tight mt-0.5 block">vagas</span>
                              </div>
                            </div>
                            {p.dias_restantes != null && (
                              <>
                                <div className="w-px h-6 bg-gray-200"></div>
                                <div className="flex items-center gap-2">
                                  <Clock className="w-4 h-4 text-[#2E7D32]" />
                                  <div>
                                    <span className="block text-[#2E7D32] font-bold text-sm leading-none">{p.dias_restantes} d</span>
                                    <span className="text-[10px] text-gray-400 uppercase font-bold tracking-tight mt-0.5 block">restantes</span>
                                  </div>
                                </div>
                              </>
                            )}
                          </div>
                        )}

                        {/* Menu de Contexto 3 Pontinhos */}
                        <div className="relative self-end sm:self-center ml-2">
                          <button 
                            type="button" 
                            onClick={() => setMenuAberto(menuAberto === p.id ? null : p.id)} 
                            className="text-gray-400 hover:text-gray-600 p-1.5 hover:bg-gray-50 rounded-lg transition"
                          >
                            <MoreVertical className="w-4 h-4" />
                          </button>
                          {menuAberto === p.id && (
                            <>
                              <div className="fixed inset-0 z-10" onClick={() => setMenuAberto(null)} />
                              <div className="absolute right-0 top-8 z-20 bg-white border border-gray-100 rounded-xl shadow-xl py-1.5 w-44 animate-in fade-in slide-in-from-top-1 duration-150">
                                <button 
                                  onClick={() => {
                                    setMenuAberto(null);
                                    navigate({ to: `/professor/projetos/${p.id}` });
                                  }} 
                                  className="flex items-center gap-2 px-4 py-2 text-sm w-full text-left text-gray-600 hover:bg-gray-50 font-medium transition"
                                >
                                  <Eye className="w-4 h-4 text-gray-400" />
                                  Ver projeto
                                </button>
                              </div>
                            </>
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