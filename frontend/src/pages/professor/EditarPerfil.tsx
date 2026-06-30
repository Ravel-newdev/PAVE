import { useNavigate } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Save, Loader2, ChevronRight, Eye, EyeOff } from 'lucide-react'
import { paveApi } from '../../services/PaveApiService'

const formatarTelefone = (valor: string) => {
  const digits = valor.replace(/\D/g, '').slice(0, 11)
  if (digits.length <= 2) return digits.length ? `(${digits}` : ''
  if (digits.length <= 6) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`
  if (digits.length <= 10) return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`
  return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`
}

const schema = z.object({
  nome: z.string().min(3, 'Nome deve ter ao menos 3 caracteres.').max(100, 'Nome muito longo.'),
  telefone: z
    .string()
    .regex(/^\(\d{2}\) \d{4,5}-\d{4}$/, 'Telefone inválido. Use (XX) XXXXX-XXXX.')
    .or(z.literal(''))
    .optional(),
  departamento: z.string().max(100, 'Departamento muito longo.').optional(),
  senhaAtual: z.string().optional(),
  novaSenha: z
    .string()
    .refine((v) => !v || v.length >= 6, 'A nova senha deve ter ao menos 6 caracteres.')
    .optional(),
  confirmarSenha: z.string().optional(),
}).refine(
  (d) => !d.novaSenha || !!d.senhaAtual,
  { path: ['senhaAtual'], message: 'Informe a senha atual para alterá-la.' }
).refine(
  (d) => !d.novaSenha || d.novaSenha === d.confirmarSenha,
  { path: ['confirmarSenha'], message: 'As senhas não coincidem.' }
)

type FormPerfil = z.infer<typeof schema>

const navy  = '#1E2E4F'
const teal  = '#287999'
const bg    = '#f7f9fb'
const border = '#e8edf2'
const muted = '#637488'

const card: React.CSSProperties = {
  background: '#fff',
  borderRadius: 16,
  border: `1px solid ${border}`,
  boxShadow: '0 2px 12px rgba(30,46,79,0.06)',
  padding: '28px 32px',
  marginBottom: 20,
}

const fieldLabel: React.CSSProperties = {
  display: 'block',
  fontSize: 11,
  fontWeight: 700,
  color: muted,
  textTransform: 'uppercase',
  letterSpacing: '0.05em',
  marginBottom: 6,
}

const sectionTitle: React.CSSProperties = {
  fontSize: 13,
  fontWeight: 800,
  color: navy,
  textTransform: 'uppercase',
  letterSpacing: '0.05em',
  margin: '0 0 20px',
  paddingBottom: 12,
  borderBottom: `1px solid ${border}`,
}

const EditarPerfil = () => {
  const navigate = useNavigate()
  const [carregando, setCarregando] = useState(true)
  const [email, setEmail] = useState('')
  const [erroApi, setErroApi] = useState<string | null>(null)
  const [showSenhaAtual, setShowSenhaAtual] = useState(false)
  const [showNovaSenha, setShowNovaSenha] = useState(false)
  const [showConfirmar, setShowConfirmar] = useState(false)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormPerfil>({ resolver: zodResolver(schema) })

  useEffect(() => {
    if (window.location.hash === '#senha') {
      document.getElementById('senha')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }, [carregando])

  useEffect(() => {
    let cancelled = false
    async function carregar() {
      try {
        const data = await paveApi.obterPerfilDocente()
        if (!cancelled) {
          setEmail(data.email)
          reset({
            nome: data.nome,
            telefone: data.telefone ? formatarTelefone(data.telefone) : '',
            departamento: data.departamento ?? '',
            senhaAtual: '',
            novaSenha: '',
            confirmarSenha: '',
          })
        }
      } catch (e) {
        if (!cancelled) setErroApi(e instanceof Error ? e.message : 'Erro ao carregar perfil.')
      } finally {
        if (!cancelled) setCarregando(false)
      }
    }
    void carregar()
    return () => { cancelled = true }
  }, [reset])

  const onSubmit = async (data: FormPerfil) => {
    setErroApi(null)
    try {
      await paveApi.atualizarPerfilDocente({
        nome: data.nome,
        telefone: data.telefone || undefined,
        departamento: data.departamento || undefined,
      })
      if (data.novaSenha && data.senhaAtual) {
        await paveApi.alterarSenha(data.senhaAtual, data.novaSenha)
      }
      void navigate({ to: '/professor/perfil' as never })
    } catch (e) {
      setErroApi(e instanceof Error ? e.message : 'Erro ao atualizar perfil.')
    }
  }

  const inputStyle = (hasError: boolean): React.CSSProperties => ({
    width: '100%',
    height: 44,
    padding: '0 16px',
    fontSize: 14,
    fontWeight: 500,
    color: navy,
    background: hasError ? '#fff5f5' : bg,
    border: `1.5px solid ${hasError ? '#f87171' : border}`,
    borderRadius: 10,
    outline: 'none',
    fontFamily: 'inherit',
    boxSizing: 'border-box',
    transition: 'border-color 0.15s',
  })

  const pwdWrap: React.CSSProperties = { position: 'relative' }
  const eyeBtn: React.CSSProperties = {
    position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)',
    background: 'none', border: 'none', cursor: 'pointer', color: '#9caab8', display: 'flex',
  }

  if (carregando) return (
    <div style={{ minHeight: '100vh', background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <p style={{ fontSize: 14, color: muted }}>Carregando...</p>
    </div>
  )

  return (
    <div style={{ minHeight: '100vh', background: bg, fontFamily: "'DM Sans', 'Nunito', sans-serif", color: navy }}>
      <main style={{ maxWidth: 800, margin: '0 auto', padding: '40px 24px 64px' }}>

        {/* Breadcrumb */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, fontWeight: 600, color: muted, marginBottom: 24, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
          <button type="button" onClick={() => navigate({ to: '/professor/perfil' })}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: teal, fontWeight: 700, fontSize: 12, fontFamily: 'inherit', padding: 0 }}>
            Meu perfil
          </button>
          <ChevronRight size={14} color={border} />
          <span style={{ color: navy }}>Editar informações</span>
        </div>

        {/* Header */}
        <div style={{ marginBottom: 28, paddingBottom: 20, borderBottom: `1px solid ${border}` }}>
          <h1 style={{ fontSize: 26, fontWeight: 800, color: navy, margin: '0 0 6px' }}>Editar perfil</h1>
          <p style={{ fontSize: 14, color: muted, margin: 0 }}>Modifique suas informações cadastrais e dados de contato.</p>
        </div>

        <form onSubmit={(e) => void handleSubmit(onSubmit)(e)}>

          {/* Card informações pessoais */}
          <div style={card}>
            <h3 style={sectionTitle}>Informações pessoais</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 16 }}>

              <div>
                <label style={fieldLabel}>Nome completo <span style={{ color: '#f87171' }}>*</span></label>
                <input {...register('nome')} type="text" style={inputStyle(!!errors.nome)} />
                {errors.nome && <span style={{ fontSize: 12, color: '#dc2626', marginTop: 4, display: 'block' }}>{errors.nome.message}</span>}
              </div>

              <div>
                <label style={fieldLabel}>E-mail institucional</label>
                <input type="email" disabled value={email}
                  style={{ ...inputStyle(false), color: muted, cursor: 'not-allowed', opacity: 0.7 }} />
              </div>

              <div>
                <label style={fieldLabel}>Telefone de contato</label>
                <input
                  {...register('telefone')}
                  type="text"
                  placeholder="(XX) XXXXX-XXXX"
                  maxLength={15}
                  style={inputStyle(!!errors.telefone)}
                  onChange={(e) => {
                    e.target.value = formatarTelefone(e.target.value)
                    void register('telefone').onChange(e)
                  }}
                />
                {errors.telefone && <span style={{ fontSize: 12, color: '#dc2626', marginTop: 4, display: 'block' }}>{errors.telefone.message}</span>}
              </div>

              <div>
                <label style={fieldLabel}>Centro / Departamento</label>
                <input {...register('departamento')} type="text" style={inputStyle(!!errors.departamento)} />
                {errors.departamento && <span style={{ fontSize: 12, color: '#dc2626', marginTop: 4, display: 'block' }}>{errors.departamento.message}</span>}
              </div>
            </div>
          </div>

          {/* Card senha */}
          <div id="senha" style={{ ...card, scrollMarginTop: 24 }}>
            <h3 style={sectionTitle}>Alterar senha</h3>
            <p style={{ fontSize: 13, color: muted, margin: '-12px 0 20px' }}>Deixe em branco para manter a senha atual.</p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 16 }}>

              <div>
                <label style={fieldLabel}>Senha atual</label>
                <div style={pwdWrap}>
                  <input {...register('senhaAtual')} type={showSenhaAtual ? 'text' : 'password'}
                    style={{ ...inputStyle(!!errors.senhaAtual), paddingRight: 40 }} />
                  <button type="button" style={eyeBtn} onClick={() => setShowSenhaAtual(v => !v)}>
                    {showSenhaAtual ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                {errors.senhaAtual && <span style={{ fontSize: 12, color: '#dc2626', marginTop: 4, display: 'block' }}>{errors.senhaAtual.message}</span>}
              </div>

              <div>
                <label style={fieldLabel}>Nova senha</label>
                <div style={pwdWrap}>
                  <input {...register('novaSenha')} type={showNovaSenha ? 'text' : 'password'}
                    style={{ ...inputStyle(!!errors.novaSenha), paddingRight: 40 }} />
                  <button type="button" style={eyeBtn} onClick={() => setShowNovaSenha(v => !v)}>
                    {showNovaSenha ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                {errors.novaSenha && <span style={{ fontSize: 12, color: '#dc2626', marginTop: 4, display: 'block' }}>{errors.novaSenha.message}</span>}
              </div>

              <div>
                <label style={fieldLabel}>Confirmar nova senha</label>
                <div style={pwdWrap}>
                  <input {...register('confirmarSenha')} type={showConfirmar ? 'text' : 'password'}
                    style={{ ...inputStyle(!!errors.confirmarSenha), paddingRight: 40 }} />
                  <button type="button" style={eyeBtn} onClick={() => setShowConfirmar(v => !v)}>
                    {showConfirmar ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                {errors.confirmarSenha && <span style={{ fontSize: 12, color: '#dc2626', marginTop: 4, display: 'block' }}>{errors.confirmarSenha.message}</span>}
              </div>
            </div>
          </div>

          {/* Erro API */}
          {erroApi && (
            <div style={{ fontSize: 13, color: '#dc2626', background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 10, padding: '12px 16px', marginBottom: 16 }}>
              {erroApi}
            </div>
          )}

          {/* Ações */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12 }}>
            <button type="button" onClick={() => navigate({ to: '/professor/perfil' })}
              style={{ height: 42, padding: '0 20px', fontSize: 13, fontWeight: 700, color: navy, background: '#fff', border: `1.5px solid ${border}`, borderRadius: 10, cursor: 'pointer', fontFamily: 'inherit' }}>
              Cancelar
            </button>
            <button type="submit" disabled={isSubmitting}
              style={{ height: 42, padding: '0 24px', fontSize: 13, fontWeight: 700, color: '#fff', background: isSubmitting ? '#4a7a96' : teal, border: 'none', borderRadius: 10, cursor: isSubmitting ? 'not-allowed' : 'pointer', display: 'inline-flex', alignItems: 'center', gap: 8, fontFamily: 'inherit', transition: 'background 0.15s' }}>
              {isSubmitting
                ? <><Loader2 size={15} style={{ animation: 'spin 1s linear infinite' }} />Salvando...</>
                : <><Save size={15} />Salvar alterações</>}
            </button>
          </div>
        </form>
      </main>
    </div>
  )
}

export default EditarPerfil