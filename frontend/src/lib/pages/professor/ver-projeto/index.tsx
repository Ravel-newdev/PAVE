import { api } from '@/lib/services/constants'
import { useNavigate, useParams } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import { 
  ArrowLeft, 
  Edit3, 
  Building2, 
  Clock, 
  CalendarDays, 
  FileText,
  ChevronRight,
  Bell
} from 'lucide-react'

interface Projeto {
  titulo: string
  descricao: string
  carga_hora: string
  data_inic: string
  data_termino: string
  centro_dep: string
}

const VisaoProjeto = () => {
  const navigate = useNavigate()
  const { projetoId } = useParams({ strict: false }) as { projetoId: string }
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState('')
  const [projeto, setProjeto] = useState<Projeto | null>(null)

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) { navigate({ to: '/login' }); return }
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`

    api.get(`/projetos/${projetoId}`)
      .then(res => setProjeto(res.data))
      .catch(() => setErro('Não foi possível carregar as informações do projeto.'))
      .finally(() => setCarregando(false))
  }, [projetoId, navigate])

  const formatarData = (dataStr: string) => {
    if (!dataStr) return 'Não informada'
    const [ano, mes, dia] = dataStr.split('T')[0].split('-')
    return `${dia}/${mes}/${ano}`
  }

  if (carregando) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex flex-col items-center justify-center gap-3 font-sans">
        <div className="w-6 h-6 border-2 border-[#2E7D32] border-t-transparent rounded-full animate-spin"></div>
        <p className="text-sm text-gray-400 font-medium">Carregando detalhes do projeto...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans antialiased text-gray-800">
      {/* Header Premium Unificado */}
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

      <main className="max-w-4xl mx-auto px-6 py-10">
        {/* Breadcrumb Customizado Figma */}
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-gray-400 mb-6">
          <a href="/professor/projetos" className="hover:text-[#2E7D32] transition flex items-center gap-1">
            Projetos
          </a>
          <ChevronRight className="w-3.5 h-3.5 text-gray-300" />
          <span className="text-gray-600">Visão geral</span>
        </div>

        {/* Topo do Projeto */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-10 pb-6 border-b border-gray-100">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-gray-900 mb-1.5">
              {projeto?.titulo || 'Projeto Sem Título'}
            </h1>
            <p className="text-sm text-gray-500 font-medium">Visão detalhada das especificações e métricas do projeto de extensão.</p>
          </div>
          
          <button
            onClick={() => navigate({ to: '/professor/projetos/$projetoId/editar', params: { projetoId } })}
            className="inline-flex items-center justify-center gap-2 bg-[#2E7D32] hover:bg-[#1B5E20] text-white text-sm font-semibold h-11 px-5 rounded-xl transition shadow-md shadow-[#2E7D32]/10 shrink-0"
          >
            <Edit3 className="w-4 h-4" />
            Editar projeto
          </button>
        </div>

        {erro ? (
          <div className="text-sm font-medium text-red-600 bg-red-50/80 border border-red-100 p-4 rounded-xl mb-6">
            {erro}
          </div>
        ) : (
          <div className="flex flex-col gap-8">
            
            {/* Bloco de Descrição Premium */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 sm:p-8">
              <div className="flex items-center gap-2 mb-4">
                <div className="p-1.5 bg-gray-50 rounded-lg text-gray-400">
                  <FileText className="w-4 h-4" />
                </div>
                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Descrição do Projeto</h3>
              </div>
              <p className="text-base text-gray-700 whitespace-pre-line leading-relaxed font-normal bg-slate-50/40 p-4 rounded-xl border border-dashed border-gray-100">
                {projeto?.descricao || 'Nenhuma descrição informada para este projeto.'}
              </p>
            </div>

            {/* Grid de Especificações Técnicas (Figma Cards) */}
            <div>
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4 px-1">Informações Estruturais</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                {/* Centro / Departamento */}
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex items-start gap-4">
                  <div className="p-3 bg-blue-50/60 text-blue-600 rounded-xl shrink-0">
                    <Building2 className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider">Centro / Departamento</span>
                    <span className="block text-base font-semibold text-gray-800 mt-1">
                      {projeto?.centro_dep || 'Não informado'}
                    </span>
                  </div>
                </div>

                {/* Carga Horária Semanal */}
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex items-start gap-4">
                  <div className="p-3 bg-amber-50/60 text-amber-600 rounded-xl shrink-0">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider">Carga Horária Semanal</span>
                    <span className="block text-base font-semibold text-gray-800 mt-1">
                      {projeto?.carga_hora ? `${projeto.carga_hora} horas semanais` : 'Não informada'}
                    </span>
                  </div>
                </div>

                {/* Data de Início */}
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex items-start gap-4">
                  <div className="p-3 bg-emerald-50/60 text-emerald-600 rounded-xl shrink-0">
                    <CalendarDays className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider">Data de Início</span>
                    <span className="block text-base font-semibold text-gray-800 mt-1">
                      {projeto?.data_inic ? formatarData(projeto.data_inic) : 'Não informada'}
                    </span>
                  </div>
                </div>

                {/* Data de Término */}
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex items-start gap-4">
                  <div className="p-3 bg-red-50/60 text-red-500 rounded-xl shrink-0">
                    <CalendarDays className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider">Data de Término</span>
                    <span className="block text-base font-semibold text-gray-800 mt-1">
                      {projeto?.data_termino ? formatarData(projeto.data_termino) : 'Não informada'}
                    </span>
                  </div>
                </div>

              </div>
            </div>

            {/* Ação de Voltar Discreta */}
            <div className="flex justify-start mt-2">
              <a 
                href="/professor/projetos" 
                className="inline-flex items-center gap-2 text-sm font-semibold text-gray-500 hover:text-gray-800 transition"
              >
                <ArrowLeft className="w-4 h-4" />
                Voltar para a lista de projetos
              </a>
            </div>

          </div>
        )}
      </main>
    </div>
  )
}

export default VisaoProjeto