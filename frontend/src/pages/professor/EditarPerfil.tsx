import { useNavigate } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { ArrowLeft, Save, Loader2, ChevronRight, Eye, EyeOff } from 'lucide-react'
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
  } = useForm<FormPerfil>({
    resolver: zodResolver(schema),
  })

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

  const inputClass = (hasError: boolean) =>
    `border rounded-xl h-11 px-4 text-sm font-medium text-gray-800 outline-none focus:ring-4 transition bg-gray-50/30 hover:bg-white ${
      hasError
        ? 'border-red-400 focus:border-red-400 focus:ring-red-400/10'
        : 'border-gray-200 focus:border-[#2E7D32] focus:ring-[#2E7D32]/5'
    }`

  if (carregando) return (
    <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center">
      <p className="text-sm text-gray-400">Carregando...</p>
    </div>
  )

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans antialiased text-gray-800 flex flex-col justify-between">
      <div>
        <main className="max-w-3xl mx-auto px-6 py-10">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-gray-400 mb-6">
            <button type="button" onClick={() => navigate({ to: '/professor/perfil' })} className="hover:text-[#2E7D32] transition">Meu perfil</button>
            <ChevronRight className="w-3.5 h-3.5 text-gray-300" />
            <span className="text-gray-600">Editar informações</span>
          </div>

          <div className="mb-8 pb-4 border-b border-gray-100">
            <h1 className="text-3xl font-bold tracking-tight text-gray-900 mb-1.5">Editar perfil</h1>
            <p className="text-sm text-gray-500 font-medium">Modifique suas propriedades cadastrais e dados de contato institucionais.</p>
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 sm:p-8">
            <form onSubmit={(e) => void handleSubmit(onSubmit)(e)} className="flex flex-col gap-6">
              <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider pb-2 border-b border-gray-50">Informações Pessoais</h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                    Nome Completo <span className="text-red-500">*</span>
                  </label>
                  <input {...register('nome')} type="text" className={inputClass(!!errors.nome)} />
                  {errors.nome && <span className="text-xs text-red-500 font-medium">{errors.nome.message}</span>}
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">E-mail Institucional</label>
                  <input type="email" disabled value={email}
                    className="border border-gray-200 rounded-xl h-11 px-4 text-sm font-medium text-gray-400 bg-gray-100/60 outline-none cursor-not-allowed" />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Telefone de Contato</label>
                  <input
                    {...register('telefone')}
                    type="text"
                    placeholder="(XX) XXXXX-XXXX"
                    maxLength={15}
                    className={inputClass(!!errors.telefone)}
                    onChange={(e) => {
                      e.target.value = formatarTelefone(e.target.value)
                      void register('telefone').onChange(e)
                    }}
                  />
                  {errors.telefone && <span className="text-xs text-red-500 font-medium">{errors.telefone.message}</span>}
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Centro / Departamento</label>
                  <input {...register('departamento')} type="text" className={inputClass(!!errors.departamento)} />
                  {errors.departamento && <span className="text-xs text-red-500 font-medium">{errors.departamento.message}</span>}
                </div>
              </div>

              <h3 id="senha" className="text-sm font-bold text-gray-900 uppercase tracking-wider pb-2 border-b border-gray-50 mt-2 scroll-mt-8">Alterar Senha</h3>
              <p className="text-xs text-gray-400 -mt-4">Deixe em branco para manter a senha atual.</p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Senha atual</label>
                  <div className="relative">
                    <input {...register('senhaAtual')} type={showSenhaAtual ? 'text' : 'password'}
                      className={`${inputClass(!!errors.senhaAtual)} pr-10 w-full`} />
                    <button type="button" onClick={() => setShowSenhaAtual(v => !v)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                      {showSenhaAtual ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                  {errors.senhaAtual && <span className="text-xs text-red-500 font-medium">{errors.senhaAtual.message}</span>}
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Nova senha</label>
                  <div className="relative">
                    <input {...register('novaSenha')} type={showNovaSenha ? 'text' : 'password'}
                      className={`${inputClass(!!errors.novaSenha)} pr-10 w-full`} />
                    <button type="button" onClick={() => setShowNovaSenha(v => !v)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                      {showNovaSenha ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                  {errors.novaSenha && <span className="text-xs text-red-500 font-medium">{errors.novaSenha.message}</span>}
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Confirmar nova senha</label>
                  <div className="relative">
                    <input {...register('confirmarSenha')} type={showConfirmar ? 'text' : 'password'}
                      className={`${inputClass(!!errors.confirmarSenha)} pr-10 w-full`} />
                    <button type="button" onClick={() => setShowConfirmar(v => !v)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                      {showConfirmar ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                  {errors.confirmarSenha && <span className="text-xs text-red-500 font-medium">{errors.confirmarSenha.message}</span>}
                </div>
              </div>

              {erroApi && (
                <div className="text-sm font-medium text-red-600 bg-red-50/80 border border-red-100 p-4 rounded-xl">{erroApi}</div>
              )}

              <div className="flex flex-col sm:flex-row items-center justify-end gap-3 pt-4 border-t border-gray-100 mt-2">
                <button type="button" onClick={() => navigate({ to: '/professor/perfil' })} className="w-full sm:w-auto inline-flex items-center justify-center gap-2 border border-gray-200 text-gray-500 font-semibold h-11 px-5 rounded-xl text-sm hover:bg-gray-50 transition">
                  Cancelar
                </button>
                <button type="submit" disabled={isSubmitting}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#2E7D32] hover:bg-[#1B5E20] text-white font-semibold h-11 px-6 rounded-xl text-sm transition disabled:opacity-60 shadow-md shadow-[#2E7D32]/10">
                  {isSubmitting ? (<><Loader2 className="w-4 h-4 animate-spin" />Salvando...</>) : (<><Save className="w-4 h-4" />Salvar alterações</>)}
                </button>
              </div>
            </form>
          </div>

          <div className="flex justify-start mt-6">
            <button type="button" onClick={() => navigate({ to: '/professor/perfil' })} className="inline-flex items-center gap-2 text-sm font-semibold text-gray-400 hover:text-gray-600 transition">
              <ArrowLeft className="w-4 h-4" />
              Voltar ao perfil
            </button>
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
