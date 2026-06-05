import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  User,
  Mail,
  Lock,
  Calendar,
  GraduationCap,
  University,
  Eye,
  EyeOff,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Field, FieldLabel } from "@/components/ui/field";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RegisterValidationSchema } from './schema';
import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { useForm } from 'react-hook-form';

const Cadastro = () => {
  const RegisterForm = useForm({
    resolver: zodResolver(RegisterValidationSchema),
    mode: 'onChange',
    defaultValues: {
      name: '',
      address: '',
      cpf: '',
      dateBirth: '',
      course: '',
      period: '',
      password: '',
      confirmPassword: ''
    }
  })
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  return (
    <>
      <div className="min-h-screen flex">
        {/* Lado esquerdo */}
        <div
          className="
        hidden 
        lg:flex 
        lg:w-1/2 
        flex-col 
        justify-between 
        bg-slate-50 
        p-12 
        bg-[url('/login2.jpeg')]
        bg-cover
        bg-center
        bg-no-repeat
        "
        >
          <div>
            <img src="/logo.png" alt="PAVE" className="h-16" />

            <h1 className="mt-16 text-5xl font-bold text-slate-800">
              Faça parte de projetos <br />
              <span className="text-cyan-600">
                {" "}
                que transformam <br />vidas
              </span>{" "}
              e comunidades.
            </h1>

            <p className="mt-6 text-2xl text-slate-500">
              Conecte-se, encontre oportunidades <br /> e gere impacto positivo
              na sociedade.
            </p>
          </div>
        </div>
        {/* Lado direito */}
        <div className="flex flex-1 items-center justify-center bg-white px-6 py-10 lg:px-12">
          <Card className="w-full h-full border-0 ring-0 shadow-xl">
            <CardHeader className="mx-auto w-full max-w-5xl pb-8 text-center">
              <CardTitle className="text-4xl font-bold text-blue-950">
                Crie sua Conta
              </CardTitle>

              <CardDescription className="text-base">
                Preencha os dados abaixo para se cadastrar
              </CardDescription>
            </CardHeader>

            <CardContent>
              {/*onSubmit={form.handleSubmit(onSubmit)}*/}
              <form className="grid grid-cols-1 gap-x-8 gap-y-6 md:grid-cols-2">
                <Field>
                  <FieldLabel htmlFor="form-name" className="mb-2 text-2xl font-bold text-slate-700">
                    Nome completo
                  </FieldLabel>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                    <Input
                      placeholder="Digite seu nome completo"
                      id="form-name"
                      required
                      className="
                      pl-10
                      h-15
                      font-semibold
                      font-sans
                      "
                      //   {...form.register("nome")}
                    />
                  </div>
                </Field>

                <Field>
                  <FieldLabel htmlFor="form-email" className="mb-2 text-2xl font-bold text-slate-700">
                    E-mail institucional
                  </FieldLabel>

                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                    <Input
                      id="form-email"
                      type="email"
                      placeholder="seu.email@instituicao.edu.br"
                      required
                      className="
                      pl-10
                      h-15
                      font-semibold
                      font-sans
                      "
                      //   {...form.register("email")}
                    />
                  </div>
                </Field>

                <Field>
                  <FieldLabel htmlFor="form-cpf" className="mb-2 text-2xl font-bold text-slate-700">
                    CPF
                  </FieldLabel>

                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                    <Input
                      id="form-cpf"
                      placeholder="000.000.000-00"
                      required
                      className="
                    pl-10
                    h-15
                    font-semibold
                    font-sans"
                    />
                  </div>
                  {/*{...form.register("cpf")}*/}
                </Field>

                <Field>
                  <FieldLabel htmlFor="form-data" className="mb-2 text-2xl font-bold text-slate-700">
                    Data de nascimento
                  </FieldLabel>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                    <Input
                      id="form-data"
                      required
                      type="date"
                      className="
                    pl-10
                    h-15
                    font-semibold
                    font-sans
                    "
                    />
                  </div>
                </Field>

                <Field>
                  <FieldLabel htmlFor="form-course" className="mb-2 text-2xl font-bold text-slate-700">
                    Curso
                  </FieldLabel>
                  <div className="relative">
                    <GraduationCap
                      className="
                    pointer-events-none
                    absolute
                    left-3 
                    top-1/2 
                    -translate-y-1/2 
                    h-4 
                    w-4 
                    text-gray-500"
                    />
                    <Select required>
                      <SelectTrigger
                        id="form-course"
                        className="
                        pl-10
                        p-8
                        h-15
                        w-full
                        font-semibold
                        font-sans"
                      >
                        <SelectValue placeholder="Selecione o curso" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="cc">
                          Ciência da Computação
                        </SelectItem>
                        <SelectItem value="si">
                          Sistemas de Informação
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </Field>

                <Field>
                  <FieldLabel htmlFor="form-period" className="mb-2 text-2xl font-bold text-slate-700">
                    Período
                  </FieldLabel>
                  <div className="relative">
                    <University className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                    <Select required>
                      <SelectTrigger
                        id="form-period"
                        className="
                        pl-10
                        p-8
                        h-15
                        w-full
                        font-semibold
                        font-sans"
                      >
                        <SelectValue placeholder="Selecione o curso" />
                      </SelectTrigger>

                      <SelectContent>
                        <SelectItem value="s1">1° semestre</SelectItem>
                        <SelectItem value="s2">2° semestre</SelectItem>
                        <SelectItem value="s3">3° semestre</SelectItem>
                        <SelectItem value="s4">4° semestre</SelectItem>
                        <SelectItem value="s5">5° semestre</SelectItem>
                        <SelectItem value="s6">6° semestre</SelectItem>
                        <SelectItem value="s7">7° semestre</SelectItem>
                        <SelectItem value="s8">8° semestre</SelectItem>
                        <SelectItem value="s9">9° semestre</SelectItem>
                        <SelectItem value="s10">10° semestre</SelectItem>
                        <SelectItem value="s11">11° semestre</SelectItem>
                        <SelectItem value="s12">12° semestre</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </Field>

                <Field>
                  <FieldLabel htmlFor="form-password" className="mb-2 text-2xl font-bold text-slate-700">
                    Senha
                  </FieldLabel>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                    <Input
                      id="form-password"
                      required
                      type={showPassword ? "text" : "password"}
                      className="
                    pl-10
                    h-15
                    font-semibold
                    font-sans
                    "
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2"
                    >
                      {showPassword ? (
                        <EyeOff className="h-5 w-5 text-gray-500" />
                      ) : (
                        <Eye className="h-5 w-5 text-gray-500" />
                      )}
                    </button>
                  </div>
                </Field>

                <Field>
                  <FieldLabel htmlFor="form-confirmPass" className="mb-2 text-2xl font-bold text-slate-700">
                    Confirme senha
                  </FieldLabel>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                    <Input
                      id="form-confirmPass"
                      required
                      type={showConfirmPassword ? "text" : "password"}
                      className="
                    pl-10
                    h-15
                    font-semibold
                    font-sans
                    "
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2"
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="h-5 w-5 text-gray-500" />
                      ) : (
                        <Eye className="h-5 w-5 text-gray-500" />
                      )} 
                    </button>
                  </div>
                </Field>

                <div className="md:col-span-2 pt-2">
                  <Button
                    type="submit"
                    className="h-12 w-full text-white text-2xl font-semibold bg-cyan-900"
                  >
                    Cadastrar
                  </Button>
                </div>
              </form>
              <p className="mt-6 text-2xl text-slate-500 text-center">
                Já tem uma conta?{"\u00A0"}
                <Link to="/login" className="text-blue-600">
                  Entrar
                </Link>
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
};

export default Cadastro;
