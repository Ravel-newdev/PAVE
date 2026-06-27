import { useState, useRef } from "react";
import type { DragEvent, ChangeEvent } from "react";
import { Upload, FileText, Trash2, CheckCircle2 } from "lucide-react";
import { Button } from "@/layout/components/ui/button";
import { Input } from "@/layout/components/ui/input";
import { Field, FieldLabel, FieldError } from "@/layout/components/ui/field";
import type { CampoFormulario, DadosAluno, RespostaCampo, FormErrors } from "@/types/candidatura";


interface Props {
  tituloProjeto: string;
  dadosAluno: DadosAluno;
  campos: CampoFormulario[];
  urlsPreenchidas?: Record<string, string>;
  onSubmit: (respostas: RespostaCampo[], arquivos: Record<string, File>, urlsPreenchidasUsadas: Record<string, string>) => void;
  onCancelar: () => void;
  isLoading?: boolean;
}

export function FormularioCandidatura({
  tituloProjeto,
  dadosAluno,
  campos,
  urlsPreenchidas = {},
  onSubmit,
  onCancelar,
  isLoading = false,
}: Props) {
  const [valores, setValores] = useState<Record<string, string>>({});
  const [arquivos, setArquivos] = useState<Record<string, File>>({});
  const [errors, setErrors] = useState<FormErrors>({});
  const [arrastando, setArrastando] = useState<string | null>(null);
  const inputsArquivo = useRef<Record<string, HTMLInputElement | null>>({});

  function atualizarValor(campoId: string, valor: string) {
    setValores((prev) => ({ ...prev, [campoId]: valor }));
    if (errors[campoId]) setErrors((prev) => ({ ...prev, [campoId]: undefined }));
  }

  function validarArquivo(campoId: string, file: File) {
    if (file.type !== "application/pdf") {
      setErrors((prev) => ({ ...prev, [campoId]: "O arquivo deve estar no formato PDF." }));
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      setErrors((prev) => ({ ...prev, [campoId]: "O arquivo deve ter no máximo 10 MB." }));
      return;
    }
    setArquivos((prev) => ({ ...prev, [campoId]: file }));
    setErrors((prev) => ({ ...prev, [campoId]: undefined }));
  }

  function removerArquivo(campoId: string) {
    setArquivos((prev) => {
      const copia = { ...prev };
      delete copia[campoId];
      return copia;
    });
    const input = inputsArquivo.current[campoId];
    if (input) input.value = "";
  }

  function formatarTamanho(bytes: number) {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  }

  function validar() {
    const erros: FormErrors = {};
    for (const campo of campos) {
      if (!campo.obrigatorio) continue;
      if (campo.tipo === "arquivo") {
        if (!arquivos[campo.id] && !urlsPreenchidas[campo.id]) erros[campo.id] = "Este campo é obrigatório.";
      } else {
        if (!valores[campo.id]?.trim()) erros[campo.id] = "Este campo é obrigatório.";
      }
    }
    setErrors(erros);
    return Object.keys(erros).length === 0;
  }

  function handleSubmit() {
    if (!validar()) return;
    const respostas: RespostaCampo[] = campos
      .filter((c) => c.tipo !== "arquivo")
      .filter((c) => valores[c.id]?.trim())
      .map((c) => ({ campo_id: c.id, valor_texto: valores[c.id] }));
    onSubmit(respostas, arquivos, urlsPreenchidas);
  }

  return (
    <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-[0_4px_20px_rgba(0,0,0,0.04)] overflow-hidden">

      <div className="bg-linear-to-r from-[#1E2E4F] to-[#2a4070] px-8 py-6">
        <h1 className="text-xl font-bold text-white">
          Candidatar-se ao projeto <span className="text-[#5bbcdc]">{tituloProjeto}</span>
        </h1>
        <p className="text-white/60 text-sm mt-1">
          Preencha as informações abaixo para enviar sua candidatura.
        </p>
      </div>

      <div className="p-8 space-y-8">

        <section>
          <h2 className="text-base font-bold text-[#1E2E4F] mb-4 flex items-center gap-2">
            <span className="w-1 h-5 bg-[#287999] rounded-full inline-block" />
            Informações pessoais
          </h2>
          <div className="grid grid-cols-2 gap-4">
            <Field>
              <FieldLabel className="text-xs font-semibold text-[#64748B] uppercase tracking-wide">Nome completo</FieldLabel>
              <Input value={dadosAluno.nomeCompleto} disabled className="bg-[#F8FAFC] border-[#E2E8F0] text-[#334155]" />
            </Field>
            <Field>
              <FieldLabel className="text-xs font-semibold text-[#64748B] uppercase tracking-wide">Curso</FieldLabel>
              <Input value={dadosAluno.curso} disabled className="bg-[#F8FAFC] border-[#E2E8F0] text-[#334155]" />
            </Field>
            <Field>
              <FieldLabel className="text-xs font-semibold text-[#64748B] uppercase tracking-wide">Matrícula</FieldLabel>
              <Input value={dadosAluno.matricula} disabled className="bg-[#F8FAFC] border-[#E2E8F0] text-[#334155]" />
            </Field>
          </div>
        </section>

        <section>
          <h2 className="text-base font-bold text-[#1E2E4F] mb-1 flex items-center gap-2">
            <span className="w-1 h-5 bg-[#287999] rounded-full inline-block" />
            Respostas do formulário
          </h2>
          <p className="text-sm text-amber-600 mb-5 ml-3">
            Responda com atenção. Suas respostas serão avaliadas pela equipe do projeto.
          </p>

          <div className="space-y-6">
            {campos.length === 0 && (
              <p className="text-sm text-[#64748B]">
                Nenhuma pergunta cadastrada para este processo seletivo ainda.
              </p>
            )}

            {campos.map((campo) => (
              <Field key={campo.id} data-invalid={!!errors[campo.id]}>
                <FieldLabel className="text-sm font-semibold text-[#334155]">
                  {campo.label}
                  {campo.obrigatorio && <span className="text-red-400 ml-1">*</span>}
                </FieldLabel>

                {campo.tipo === "arquivo" ? (
                  <div className={`border rounded-xl overflow-hidden ${errors[campo.id] ? "border-red-300" : "border-[#E2E8F0]"}`}>
                    {/* Currículo do perfil pré-preenchido */}
                    {urlsPreenchidas[campo.id] && !arquivos[campo.id] && (
                      <div className="mx-3 mt-3 flex items-center gap-3 bg-emerald-50 border border-emerald-200 rounded-lg px-4 py-3">
                        <FileText className="w-5 h-5 text-emerald-600 shrink-0" />
                        <div className="flex-1 min-w-0">
                          <span className="text-sm text-[#334155] font-medium">Currículo do perfil</span>
                          <p className="text-xs text-[#64748B]">Será enviado automaticamente. Anexe outro para substituir.</p>
                        </div>
                        <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
                      </div>
                    )}

                    <div
                      onClick={() => inputsArquivo.current[campo.id]?.click()}
                      onDragOver={(e: DragEvent<HTMLDivElement>) => { e.preventDefault(); setArrastando(campo.id); }}
                      onDragLeave={() => setArrastando(null)}
                      onDrop={(e: DragEvent<HTMLDivElement>) => {
                        e.preventDefault();
                        setArrastando(null);
                        const file = e.dataTransfer.files?.[0];
                        if (file) validarArquivo(campo.id, file);
                      }}
                      className={`m-3 border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center cursor-pointer transition-colors ${
                        arrastando === campo.id
                          ? "border-[#287999] bg-[#e8f3f7]"
                          : "border-[#E2E8F0] bg-[#F8FAFC] hover:border-[#287999] hover:bg-[#e8f3f7]"
                      }`}
                    >
                      <Upload className="w-5 h-5 text-[#287999] mb-2" />
                      <span className="text-sm text-[#334155] font-medium">
                        {urlsPreenchidas[campo.id] && !arquivos[campo.id] ? "Clique para substituir o arquivo" : "Clique para anexar ou arraste o arquivo aqui"}
                      </span>
                      <span className="text-xs text-[#64748B] mt-0.5">PDF até 10 MB</span>
                      <input
                        ref={(el) => { inputsArquivo.current[campo.id] = el; }}
                        type="file"
                        accept=".pdf,application/pdf"
                        className="hidden"
                        onChange={(e: ChangeEvent<HTMLInputElement>) => {
                          const file = e.target.files?.[0];
                          if (file) validarArquivo(campo.id, file);
                        }}
                      />
                    </div>
                    {arquivos[campo.id] && (
                      <div className="mx-3 mb-3 flex items-center gap-3 bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg px-4 py-3">
                        <FileText className="w-5 h-5 text-[#287999] shrink-0" />
                        <span className="text-sm text-[#334155] flex-1 truncate">{arquivos[campo.id].name}</span>
                        <span className="text-sm text-[#64748B] shrink-0">{formatarTamanho(arquivos[campo.id].size)}</span>
                        <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
                        <Button
                          variant="ghost"
                          size="icon"
                          type="button"
                          onClick={(e) => { e.stopPropagation(); removerArquivo(campo.id); }}
                          className="w-8 h-8 text-[#64748B] hover:text-red-500 hover:bg-transparent shrink-0"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    )}
                  </div>
                ) : (
                  <textarea
                    value={valores[campo.id] ?? ""}
                    onChange={(e) => atualizarValor(campo.id, e.target.value)}
                    placeholder="Digite sua resposta..."
                    rows={campo.tipo === "texto" ? 1 : 4}
                    className={`flex w-full resize-none rounded-lg border bg-[#F8FAFC] px-3 py-2.5 pb-7 text-sm text-[#334155] outline-none transition-colors placeholder:text-[#94a3b8] focus:ring-2 focus:ring-[#287999]/30 focus:border-[#287999] ${
                      errors[campo.id] ? "border-red-400" : "border-[#E2E8F0]"
                    }`}
                  />
                )}

                {errors[campo.id] && <FieldError>{errors[campo.id]}</FieldError>}
              </Field>
            ))}
          </div>
        </section>

        <div className="flex items-center justify-between pt-2 border-t border-[#E2E8F0]">
          <Button
            variant="outline"
            onClick={onCancelar}
            disabled={isLoading}
            className="border-[#E2E8F0] text-[#334155] hover:bg-[#F8FAFC] hover:border-[#1E2E4F] hover:text-[#1E2E4F]"
          >
            Cancelar
          </Button>
          <button
            onClick={handleSubmit}
            disabled={isLoading}
            className="px-8 py-2 bg-linear-to-r from-[#287999] to-[#1e5c75] text-white text-sm font-semibold rounded-lg shadow-[0_4px_12px_rgba(40,121,153,0.25)] hover:shadow-[0_6px_16px_rgba(40,121,153,0.35)] hover:-translate-y-0.5 transition-all disabled:opacity-50"
          >
            {isLoading ? "Enviando..." : "Enviar candidatura"}
          </button>
        </div>

      </div>
    </div>
  );
}