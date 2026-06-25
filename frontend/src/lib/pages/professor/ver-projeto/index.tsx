import { api } from '@/lib/services/constants'
import { useNavigate, useParams } from '@tanstack/react-router'
import { useEffect, useState } from 'react'

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
          <span className="text-gray-600">Visão geral</span>
        </div>

        <div className="flex items-start justify-between mb-8 gap-4">
          <div>
            <h1 className="text-2xl font-semibold text-gray-800 mb-1">{projeto?.titulo || 'Projeto Sem Título'}</h1>
            <p className="text-sm text-gray-400">Visão geral e detalhes do projeto de extensão.</p>
          </div>
          <button
            onClick={() => navigate({ to: '/professor/projetos/$projetoId/editar', params: { projetoId } })}
            className="bg-[#2E7D32] hover:bg-[#1B5E20] text-white font-medium px-4 py-2 rounded-lg text-sm transition shrink-0">
            Editar projeto
        </button>
        </div>

        {erro ? (
          <p className="text-sm text-red-500 bg-red-50 px-3 py-2 rounded-lg">{erro}</p>
        ) : (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm px-8 py-8 flex flex-col gap-6">
            <div>
              <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Descrição</h3>
              <p className="text-sm text-gray-700 whitespace-pre-line leading-relaxed">
                {projeto?.descricao || 'Nenhuma descrição informada para este projeto.'}
              </p>
            </div>

            <hr className="border-gray-100" />

            <div className="grid grid-cols-2 gap-6">
              <div>
                <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Centro / Departamento</h3>
                <p className="text-sm text-gray-700">{projeto?.centro_dep || 'Não informado'}</p>
              </div>

              <div>
                <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Carga Horária Semanal</h3>
                <p className="text-sm text-gray-700">{projeto?.carga_hora ? `${projeto.carga_hora} horas` : 'Não informada'}</p>
              </div>

              <div>
                <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Data de Início</h3>
                <p className="text-sm text-gray-700">{projeto?.data_inic ? formatarData(projeto.data_inic) : 'Não informada'}</p>
              </div>

              <div>
                <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Data de Término</h3>
                <p className="text-sm text-gray-700">{projeto?.data_termino ? formatarData(projeto.data_termino) : 'Não informada'}</p>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}

export default VisaoProjeto