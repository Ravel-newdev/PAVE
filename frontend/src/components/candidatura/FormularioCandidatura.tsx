import { useState, useRef } from "react";
import type { DragEvent, ChangeEvent } from "react";
import { Upload, FileText, Trash2, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Field, FieldLabel, FieldError } from "@/components/ui/field";
import type { CampoFormulario, DadosAluno, RespostaCampo, FormErrors } from "@/types/candidatura";

const estiloTextarea =
  "flex w-full resize-none rounded-lg border bg-transparent px-3 py-2.5 pb-7 text-sm text-gray-700 font-sans outline-none transition-colors placeholder:font-sans placeholder:text-gray-400 focus-visible:ring-2";

interface Props {
  tituloProjeto: string;
  dadosAluno: DadosAluno;
  campos: CampoFormulario[];
  onSubmit: (respostas: RespostaCampo[], arquivos: Record<string, File>) => void;
  onCancelar: () => void;
  isLoading?: boolean;
}

export function FormularioCandidatura({
  tituloProjeto,
  dadosAluno,
  campos,
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
      if (!campo.obrigatoriedade) continue;
      if (campo.tipo === "arquivo") {
        if (!arquivos[campo.id]) erros[campo.id] = "Este campo é obrigatório.";
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
      .map((c) => ({ campo_id: c.id, valor_texto: valores[c.id] ?? "" }));
    onSubmit(respostas, arquivos);
  }

  return (
    <Card className="block">
      <CardContent className="p-8 space-y-8">

        <div>
          <h1
            className="text-2xl font-bold text-gray-900"
            style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
          >
            Candidatar-se ao projeto {tituloProjeto}
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Preencha as informações abaixo para enviar sua candidatura.
          </p>
        </div>

        <section>
          <h2
            className="text-base font-bold text-gray-800 mb-4"
            style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
          >
            Informações pessoais
          </h2>
          <div className="grid grid-cols-2 gap-4">
            <Field>
              <FieldLabel>Nome completo</FieldLabel>
              <Input value={dadosAluno.nomeCompleto} disabled className="font-sans border-gray-200" />
            </Field>
            <Field>
              <FieldLabel>Curso</FieldLabel>
              <Input value={dadosAluno.curso} disabled className="font-sans border-gray-200" />
            </Field>
            <Field>
              <FieldLabel>Matrícula</FieldLabel>
              <Input value={dadosAluno.matricula} disabled className="font-sans border-gray-200" />
            </Field>
          </div>
        </section>

        <section>
          <h2
            className="text-base font-bold text-gray-800 mb-0.5"
            style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
          >
            Respostas do formulário
          </h2>
          <p className="text-sm text-amber-700/70 mb-5">
            Responda com atenção. Suas respostas serão avaliadas pela equipe do projeto.
          </p>

          <div className="space-y-6">
            {campos.length === 0 && (
              <p className="text-sm text-gray-400 font-sans">
                Nenhuma pergunta cadastrada para este processo seletivo ainda.
              </p>
            )}

            {campos.map((campo) => (
              <Field key={campo.id} data-invalid={!!errors[campo.id]}>
                <FieldLabel>
                  {campo.label}
                  {campo.obrigatoriedade && <span className="text-red-400"> *</span>}
                </FieldLabel>

                {campo.tipo === "arquivo" ? (
                  <div className={`border rounded-xl overflow-hidden ${errors[campo.id] ? "border-red-300" : "border-gray-200"}`}>
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
                          ? "border-[#1B3F3F] bg-[#EEF5F4]"
                          : "border-gray-200 bg-gray-50 hover:border-gray-300 hover:bg-gray-100"
                      }`}
                    >
                      <Upload className="w-5 h-5 text-gray-400 mb-2" />
                      <span className="text-sm text-gray-600 font-medium font-sans">
                        Clique para anexar ou arraste o arquivo aqui
                      </span>
                      <span className="text-xs text-gray-400 mt-0.5 font-sans">PDF até 10 MB</span>
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
                      <div className="mx-3 mb-3 flex items-center gap-3 bg-white border border-gray-100 rounded-lg px-4 py-3">
                        <FileText className="w-5 h-5 text-green-600 shrink-0" />
                        <span className="text-sm text-gray-700 flex-1 truncate">{arquivos[campo.id].name}</span>
                        <span className="text-sm text-gray-400 shrink-0">{formatarTamanho(arquivos[campo.id].size)}</span>
                        <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0" />
                        <Button
                          variant="ghost"
                          size="icon"
                          type="button"
                          onClick={(e) => { e.stopPropagation(); removerArquivo(campo.id); }}
                          className="w-8 h-8 text-gray-400 hover:text-red-500 hover:bg-transparent shrink-0"
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
                    className={`${estiloTextarea} ${
                      errors[campo.id]
                        ? "border-red-400 focus-visible:ring-red-300"
                        : "border-gray-200 focus-visible:ring-gray-200"
                    }`}
                  />
                )}

                {errors[campo.id] && (
                  <FieldError>{errors[campo.id]}</FieldError>
                )}
              </Field>
            ))}
          </div>
        </section>

        <div className="flex items-center justify-between pt-2">
          <Button
            variant="outline"
            onClick={onCancelar}
            disabled={isLoading}
            className="font-sans border-gray-200 text-gray-600 hover:bg-gray-50"
          >
            Cancelar
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={isLoading}
            className="font-sans bg-[#1B3F3F] hover:bg-[#163333] text-white px-8"
          >
            {isLoading ? "Enviando..." : "Enviar candidatura"}
          </Button>
        </div>

      </CardContent>
    </Card>
  );
}