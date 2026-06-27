import { useRef, useState, type ChangeEvent, type DragEvent } from "react";
import { Upload, FileText, Trash2, CheckCircle2 } from "lucide-react";
import type { Control } from "react-hook-form";
import { useController } from "react-hook-form";
import type { ProfileFormData } from "@/types/perfilAluno";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { paveApi } from "@/services/PaveApiService";

interface Props {
  control: Control<ProfileFormData>;
}

export function CurriculoCard({ control }: Props) {
  const { field } = useController({ control, name: "curriculo_url" });
  const [arquivo, setArquivo] = useState<File | null>(null);
  const [arrastando, setArrastando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const curriculoUrl: string = field.value ?? "";

  function formatarTamanho(bytes: number) {
    if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  }

  async function processarArquivo(file: File) {
    if (file.type !== "application/pdf") {
      setErro("O arquivo deve estar no formato PDF.");
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      setErro("O arquivo deve ter no máximo 10 MB.");
      return;
    }
    setErro(null);
    setArquivo(file);
    setUploading(true);
    try {
      const { url } = await paveApi.uploadCurriculoDiscente(file);
      field.onChange(url);
    } catch {
      setErro("Erro ao enviar o arquivo. Tente novamente.");
      setArquivo(null);
    } finally {
      setUploading(false);
    }
  }

  function remover() {
    setArquivo(null);
    field.onChange("");
    if (inputRef.current) inputRef.current.value = "";
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Currículo</CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="border rounded-xl overflow-hidden border-[#E2E8F0]">
          {/* Arquivo já enviado (da sessão atual ou do perfil) */}
          {(arquivo || curriculoUrl) && !uploading && (
            <div className="mx-3 mt-3 flex items-center gap-3 bg-emerald-50 border border-emerald-200 rounded-lg px-4 py-3">
              <FileText className="w-5 h-5 text-emerald-600 shrink-0" />
              <div className="flex-1 min-w-0">
                <span className="text-sm text-[#334155] font-medium">
                  {arquivo ? arquivo.name : "Currículo salvo"}
                </span>
                {arquivo && (
                  <p className="text-xs text-[#64748B]">{formatarTamanho(arquivo.size)}</p>
                )}
              </div>
              <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
              <button
                type="button"
                onClick={remover}
                className="text-[#64748B] hover:text-red-500 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Zona de drop */}
          <div
            onClick={() => !uploading && inputRef.current?.click()}
            onDragOver={(e: DragEvent<HTMLDivElement>) => { e.preventDefault(); setArrastando(true); }}
            onDragLeave={() => setArrastando(false)}
            onDrop={(e: DragEvent<HTMLDivElement>) => {
              e.preventDefault();
              setArrastando(false);
              const file = e.dataTransfer.files?.[0];
              if (file) processarArquivo(file);
            }}
            className={`m-3 border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center cursor-pointer transition-colors ${
              uploading
                ? "border-[#E2E8F0] bg-[#F8FAFC] cursor-wait"
                : arrastando
                  ? "border-[#287999] bg-[#e8f3f7]"
                  : "border-[#E2E8F0] bg-[#F8FAFC] hover:border-[#287999] hover:bg-[#e8f3f7]"
            }`}
          >
            <Upload className="w-5 h-5 text-[#287999] mb-2" />
            <span className="text-sm text-[#334155] font-medium">
              {uploading
                ? "Enviando..."
                : arquivo || curriculoUrl
                  ? "Clique para substituir o currículo"
                  : "Clique para anexar ou arraste o arquivo aqui"}
            </span>
            <span className="text-xs text-[#64748B] mt-0.5">PDF até 10 MB</span>
            <input
              ref={inputRef}
              type="file"
              accept=".pdf,application/pdf"
              className="hidden"
              onChange={(e: ChangeEvent<HTMLInputElement>) => {
                const file = e.target.files?.[0];
                if (file) processarArquivo(file);
              }}
            />
          </div>
        </div>

        {erro && <p className="text-sm text-destructive">{erro}</p>}
      </CardContent>
    </Card>
  );
}
