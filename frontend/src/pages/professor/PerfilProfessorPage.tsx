import { useNavigate } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import { Mail, Phone, MapPin, Calendar, Lock, LogOut, Edit2 } from 'lucide-react'
import { paveApi } from '../../services/PaveApiService'
import { useAuth } from '../../context/AuthContext'

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
  const { logout } = useAuth()
  const [perfil, setPerfil] = useState<Perfil | null>(null)
  const [loading, setLoading] = useState(true)
  const [erro, setErro] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    async function carregar() {
      try {
        const data = await paveApi.obterPerfilDocente()
        if (!cancelled) setPerfil(data)
      } catch (e) {
        if (!cancelled) setErro(e instanceof Error ? e.message : 'Erro ao carregar perfil.')
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    void carregar()
    return () => { cancelled = true }
  }, [])

  if (loading) return (
    <div style={{ minHeight: '100vh', background: '#f7f9fb', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <p style={{ fontSize: 14, color: '#637488' }}>Carregando perfil...</p>
    </div>
  )

  if (erro) return (
    <div style={{ minHeight: '100vh', background: '#f7f9fb', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <p style={{ fontSize: 14, color: '#dc2626' }}>{erro}</p>
    </div>
  )

  if (!perfil) return null

  const iniciais = perfil.nome?.charAt(0).toUpperCase() || perfil.email.charAt(0).toUpperCase()
  const membroDesde = perfil.criado_em
    ? new Date(perfil.criado_em).toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })
    : null

  const navy = '#1E2E4F'
  const teal = '#287999'
  const bg   = '#f7f9fb'
  const border = '#e8edf2'

  const card: React.CSSProperties = {
    background: '#fff',
    borderRadius: 16,
    border: `1px solid ${border}`,
    boxShadow: '0 2px 12px rgba(30,46,79,0.06)',
    padding: '28px 32px',
    marginBottom: 20,
  }

  const fieldLabel: React.CSSProperties = {
    fontSize: 11,
    fontWeight: 700,
    color: '#637488',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    marginBottom: 6,
    display: 'block',
  }

  const fieldValue: React.CSSProperties = {
    border: `1.5px solid ${border}`,
    borderRadius: 10,
    height: 44,
    padding: '0 16px',
    display: 'flex',
    alignItems: 'center',
    fontSize: 14,
    fontWeight: 600,
    color: navy,
    background: bg,
  }

  return (
    <div style={{ minHeight: '100vh', background: bg, fontFamily: "'DM Sans', 'Nunito', sans-serif", color: navy }}>
      <main style={{ maxWidth: 860, margin: '0 auto', padding: '40px 24px 64px' }}>

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16, marginBottom: 32 }}>
          <div>
            <h1 style={{ fontSize: 26, fontWeight: 800, color: navy, margin: '0 0 6px' }}>Meu Perfil</h1>
            <p style={{ fontSize: 14, color: '#637488', margin: 0 }}>Gerencie suas informações pessoais e preferências da conta.</p>
          </div>
          <button
            type="button"
            onClick={() => navigate({ to: '/professor/perfil-editar' })}
            style={{ display: 'inline-flex', alignItems: 'center', gap: 8, border: `1.5px solid ${border}`, background: '#fff', color: navy, fontWeight: 700, fontSize: 13, padding: '0 18px', height: 40, borderRadius: 10, cursor: 'pointer', whiteSpace: 'nowrap', transition: 'border-color 0.15s' }}
          >
            <Edit2 size={15} />
            Editar perfil
          </button>
        </div>

        {/* Card identidade */}
        <div style={card}>
          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 24 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
              <div style={{ width: 72, height: 72, borderRadius: 16, background: `linear-gradient(135deg, ${teal}, ${navy})`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28, fontWeight: 800, color: '#fff', flexShrink: 0 }}>
                {iniciais}
              </div>
              <div>
                <h2 style={{ fontSize: 18, fontWeight: 800, color: navy, margin: '0 0 2px' }}>{perfil.nome}</h2>
                <span style={{ fontSize: 11, fontWeight: 700, color: teal, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Docente</span>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginTop: 10 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: '#637488' }}>
                    <Mail size={14} color="#9caab8" /> {perfil.email}
                  </div>
                  {perfil.telefone && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: '#637488' }}>
                      <Phone size={14} color="#9caab8" /> {perfil.telefone}
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 20, borderLeft: `1px solid ${border}`, paddingLeft: 28 }}>
              {perfil.departamento && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{ width: 36, height: 36, borderRadius: 10, background: bg, border: `1px solid ${border}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <MapPin size={15} color="#9caab8" />
                  </div>
                  <div>
                    <span style={{ ...fieldLabel, marginBottom: 2 }}>Departamento</span>
                    <span style={{ fontSize: 13, fontWeight: 700, color: navy }}>{perfil.departamento}</span>
                  </div>
                </div>
              )}
              {membroDesde && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{ width: 36, height: 36, borderRadius: 10, background: bg, border: `1px solid ${border}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Calendar size={15} color="#9caab8" />
                  </div>
                  <div>
                    <span style={{ ...fieldLabel, marginBottom: 2 }}>Membro desde</span>
                    <span style={{ fontSize: 13, fontWeight: 700, color: navy }}>{membroDesde}</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Card informações */}
        <div style={card}>
          <h3 style={{ fontSize: 13, fontWeight: 800, color: navy, textTransform: 'uppercase', letterSpacing: '0.05em', margin: '0 0 20px', paddingBottom: 12, borderBottom: `1px solid ${border}` }}>
            Informações pessoais
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 }}>
            {[
              { label: 'Nome completo',      value: perfil.nome },
              { label: 'E-mail institucional', value: perfil.email },
              { label: 'Telefone',           value: perfil.telefone },
              { label: 'Departamento',       value: perfil.departamento },
            ].map(({ label, value }) => (
              <div key={label}>
                <span style={fieldLabel}>{label}</span>
                <div style={fieldValue}>
                  {value || <span style={{ color: '#9caab8', fontStyle: 'italic', fontWeight: 400 }}>Não informado</span>}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Card segurança */}
        <div style={card}>
          <h3 style={{ fontSize: 13, fontWeight: 800, color: navy, textTransform: 'uppercase', letterSpacing: '0.05em', margin: '0 0 20px', paddingBottom: 12, borderBottom: `1px solid ${border}` }}>
            Segurança
          </h3>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, background: bg, border: `1px solid ${border}`, borderRadius: 10, padding: '14px 18px' }}>
            <div>
              <span style={fieldLabel}>Senha da conta</span>
              <span style={{ fontSize: 14, color: navy, letterSpacing: '0.15em' }}>••••••••••</span>
            </div>
            <button
              type="button"
              onClick={() => navigate({ to: '/professor/perfil-editar', hash: 'senha' })}
              style={{ display: 'inline-flex', alignItems: 'center', gap: 8, border: `1.5px solid ${border}`, background: '#fff', color: navy, fontWeight: 700, fontSize: 12, padding: '0 16px', height: 38, borderRadius: 8, cursor: 'pointer', whiteSpace: 'nowrap' }}
            >
              <Lock size={13} />
              Alterar senha
            </button>
          </div>

          <div style={{ borderTop: `1px solid ${border}`, marginTop: 24, paddingTop: 20, display: 'flex', justifyContent: 'flex-end' }}>
            <button
              type="button"
              onClick={logout}
              style={{ display: 'inline-flex', alignItems: 'center', gap: 8, fontSize: 13, fontWeight: 700, color: '#dc2626', background: 'none', border: 'none', cursor: 'pointer', padding: '8px 12px', borderRadius: 8 }}
            >
              <LogOut size={15} />
              Sair da conta
            </button>
          </div>
        </div>

      </main>
    </div>
  )
}

export default PerfilProfessor