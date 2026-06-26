import { useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { User, Mail, Lock, GraduationCap, Phone, Eye, EyeOff } from "lucide-react";
import { Button } from "../../layout/components/ui/button";
import { Input } from "../../layout/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../../layout/components/ui/card";
import { Field, FieldLabel } from "../../layout/components/ui/field";
import { RegisterValidationSchema, type RegisterFormData } from "./schema";
import { paveApi } from "../../services/PaveApiService";
import { ApiError } from "../../errors/ApiError";

function maskTelefone(value: string): string {
  const digits = value.replace(/\D/g, "").slice(0, 11);
  if (digits.length <= 10) {
    return digits
      .replace(/^(\d{2})(\d)/, "($1) $2")
      .replace(/(\d{4})(\d)/, "$1-$2");
  }
  return digits
    .replace(/^(\d{2})(\d)/, "($1) $2")
    .replace(/(\d{5})(\d)/, "$1-$2");
}

function maskMatricula(value: string): string {
  return value.replace(/\D/g, "").slice(0, 6);
}

const Cadastro = () => {
  const navigate = useNavigate();
  const [showSenha, setShowSenha] = useState(false);
  const [showConfirmar, setShowConfirmar] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const { register, handleSubmit, setValue, formState: { errors, isSubmitting } } = useForm<RegisterFormData>({
    resolver: zodResolver(RegisterValidationSchema),
    mode: "onChange",
  });

  async function onSubmit(data: RegisterFormData) {
    setServerError(null);
    try {
      await paveApi.registrarDiscente({
        nome: data.nome,
        matricula: data.matricula,
        email: data.email,
        senha: data.senha,
        curso: data.curso,
        telefone: data.telefone || undefined,
      });
      navigate({ to: "/login" });
    } catch (error) {
      setServerError(error instanceof ApiError ? error.message : "Erro ao realizar cadastro.");
    }
  }

  return (
    <div className="min-h-screen flex">
      <div className="hidden lg:flex lg:w-1/2 flex-col justify-between bg-slate-50 p-12 bg-[url('/login2.jpeg')] bg-cover bg-center bg-no-repeat">
        <div>
          <img src="/logo.png" alt="PAVE" className="h-16" />
          <h1 className="mt-16 text-5xl font-bold text-slate-800">
            Faça parte de projetos <br />
            <span className="text-cyan-600">que transformam <br />vidas</span> e comunidades.
          </h1>
          <p className="mt-6 text-2xl text-slate-500">
            Conecte-se, encontre oportunidades <br /> e gere impacto positivo na sociedade.
          </p>
        </div>
      </div>

      <div className="flex flex-1 items-center justify-center bg-white px-6 py-10 lg:px-12">
        <Card className="w-full h-full border-0 ring-0 shadow-xl">
          <CardHeader className="mx-auto w-full max-w-5xl pb-8 text-center">
            <CardTitle className="text-4xl font-bold text-blue-950">Crie sua Conta</CardTitle>
            <CardDescription className="text-base">Preencha os dados abaixo para se cadastrar</CardDescription>
          </CardHeader>

          <CardContent>
            {serverError && (
              <p className="mb-4 text-center text-sm text-red-600">{serverError}</p>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 gap-x-8 gap-y-6 md:grid-cols-2">
              <Field>
                <FieldLabel htmlFor="form-nome" className="mb-2 text-2xl font-bold text-slate-700">Nome completo</FieldLabel>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                  <Input id="form-nome" placeholder="Digite seu nome completo" className="pl-10 h-15 font-semibold font-sans" {...register("nome")} />
                </div>
                {errors.nome && <p className="text-sm text-red-500 mt-1">{errors.nome.message}</p>}
              </Field>

              <Field>
                <FieldLabel htmlFor="form-matricula" className="mb-2 text-2xl font-bold text-slate-700">Matrícula</FieldLabel>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                  <Input
                    id="form-matricula"
                    placeholder="000000"
                    className="pl-10 h-15 font-semibold font-sans"
                    {...register("matricula")}
                    onChange={(e) => setValue("matricula", maskMatricula(e.target.value), { shouldValidate: true })}
                  />
                </div>
                {errors.matricula && <p className="text-sm text-red-500 mt-1">{errors.matricula.message}</p>}
              </Field>

              <Field>
                <FieldLabel htmlFor="form-email" className="mb-2 text-2xl font-bold text-slate-700">E-mail institucional</FieldLabel>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                  <Input id="form-email" type="email" placeholder="seu.email@instituicao.edu.br" className="pl-10 h-15 font-semibold font-sans" {...register("email")} />
                </div>
                {errors.email && <p className="text-sm text-red-500 mt-1">{errors.email.message}</p>}
              </Field>

              <Field>
                <FieldLabel htmlFor="form-curso" className="mb-2 text-2xl font-bold text-slate-700">Curso</FieldLabel>
                <div className="relative">
                  <GraduationCap className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                  <Input id="form-curso" placeholder="Ex: Ciência da Computação" className="pl-10 h-15 font-semibold font-sans" {...register("curso")} />
                </div>
                {errors.curso && <p className="text-sm text-red-500 mt-1">{errors.curso.message}</p>}
              </Field>

              <Field>
                <FieldLabel htmlFor="form-telefone" className="mb-2 text-2xl font-bold text-slate-700">
                  Telefone <span className="text-slate-400 font-normal text-lg">(opcional)</span>
                </FieldLabel>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                  <Input
                    id="form-telefone"
                    placeholder="(00) 00000-0000"
                    className="pl-10 h-15 font-semibold font-sans"
                    {...register("telefone")}
                    onChange={(e) => setValue("telefone", maskTelefone(e.target.value), { shouldValidate: true })}
                  />
                </div>
                {errors.telefone && <p className="text-sm text-red-500 mt-1">{errors.telefone.message}</p>}
              </Field>

              <Field>
                <FieldLabel htmlFor="form-senha" className="mb-2 text-2xl font-bold text-slate-700">Senha</FieldLabel>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                  <Input id="form-senha" type={showSenha ? "text" : "password"} className="pl-10 h-15 font-semibold font-sans" {...register("senha")} />
                  <button type="button" onClick={() => setShowSenha((v) => !v)} className="absolute right-3 top-1/2 -translate-y-1/2">
                    {showSenha ? <EyeOff className="h-5 w-5 text-gray-500" /> : <Eye className="h-5 w-5 text-gray-500" />}
                  </button>
                </div>
                {errors.senha && <p className="text-sm text-red-500 mt-1">{errors.senha.message}</p>}
              </Field>

              <Field>
                <FieldLabel htmlFor="form-confirmar" className="mb-2 text-2xl font-bold text-slate-700">Confirme a senha</FieldLabel>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                  <Input id="form-confirmar" type={showConfirmar ? "text" : "password"} className="pl-10 h-15 font-semibold font-sans" {...register("confirmarSenha")} />
                  <button type="button" onClick={() => setShowConfirmar((v) => !v)} className="absolute right-3 top-1/2 -translate-y-1/2">
                    {showConfirmar ? <EyeOff className="h-5 w-5 text-gray-500" /> : <Eye className="h-5 w-5 text-gray-500" />}
                  </button>
                </div>
                {errors.confirmarSenha && <p className="text-sm text-red-500 mt-1">{errors.confirmarSenha.message}</p>}
              </Field>

              <div className="md:col-span-2 pt-2">
                <Button type="submit" disabled={isSubmitting} className="h-12 w-full text-white text-2xl font-semibold bg-cyan-900">
                  {isSubmitting ? "Cadastrando..." : "Cadastrar"}
                </Button>
              </div>
            </form>

            <p className="mt-6 text-2xl text-slate-500 text-center">
              Já tem uma conta?{"\u00A0"}
              <Link to="/login" className="text-blue-600">Entrar</Link>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Cadastro;
