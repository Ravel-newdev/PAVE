import { useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  User, Mail, Lock, GraduationCap, BookOpen, Eye, EyeOff,
  Search, Heart, Award, ChevronLeft,
} from "lucide-react";
import { RegisterValidationSchema, type RegisterFormData } from "./schema";
import { paveApi } from "../../services/PaveApiService";
import { ApiError } from "../../errors/ApiError";
import "../Login/Login.css";

type Papel = "discente" | "docente";

function maskMatricula(value: string): string {
  return value.replace(/\D/g, "").slice(0, 6);
}

const features = [
  { icon: <Search size={18} />, label: "Encontre\noportunidades" },
  { icon: <Heart size={18} />,  label: "Conecte-se e\nfaça a diferença" },
  { icon: <Award size={18} />,  label: "Desenvolva\nsuas habilidades" },
];

export default function Cadastro() {
  const navigate = useNavigate();
  const [papel, setPapel] = useState<Papel | null>(null);
  const [showSenha, setShowSenha] = useState(false);
  const [showConfirmar, setShowConfirmar] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const { register, handleSubmit, setValue, reset, formState: { errors, isSubmitting } } = useForm<RegisterFormData>({
    resolver: zodResolver(RegisterValidationSchema),
    mode: "onChange",
  });

  function selecionarPapel(p: Papel) {
    reset();
    setServerError(null);
    setPapel(p);
  }

  async function onSubmit(data: RegisterFormData) {
    if (!papel) return;
    setServerError(null);
    try {
      if (papel === "discente") {
        await paveApi.registrarDiscente({
          nome: data.nome,
          matricula: data.matricula,
          email: data.email,
          senha: data.senha,
          curso: data.curso || undefined,
        });
      } else {
        await paveApi.registrarDocente({
          nome: data.nome,
          matricula: data.matricula,
          email: data.email,
          senha: data.senha,
          departamento: data.departamento || undefined,
        });
      }
      navigate({ to: "/login" });
    } catch (error) {
      setServerError(error instanceof ApiError ? error.message : "Erro ao realizar cadastro.");
    }
  }

  return (
    <div className="login-page">
      <div className="login-card" style={{ maxWidth: papel ? 960 : 700 , transition: "max-width 0.3s ease" }}>

        <div className="login-left">
          <div className="login-blob login-blob-1" />
          <div className="login-blob login-blob-2" />
          <div className="login-brand">
            <div className="brand-title">PAVE</div>
            <p className="brand-subtitle">
              Conectando pessoas a oportunidades que{" "}
              <strong className="brand-highlight">transformam</strong> o mundo.
            </p>
          </div>
          <div className="login-features">
            {features.map((f, i) => (
              <div key={i} className="feature-item">
                <div className="feature-icon">{f.icon}</div>
                <span className="feature-label">{f.label}</span>
              </div>
            ))}
          </div>
          <div className="login-pill">
            <span className="pill-dot" />
            +200 projetos disponíveis
          </div>
        </div>

        <div className="login-right" style={{ alignItems: papel ? "flex-start" : "center", paddingTop: papel ? 40 : undefined, transition: "padding 0.3s ease" }}>
          <div className="login-form-wrapper" style={{ maxWidth: papel ? 520 : 400 }}>

            {!papel ? (
              <div key="selector">
                <div className="form-header">
                  <h1 className="form-title">Crie sua conta</h1>
                  <p className="form-description">Como você vai usar a plataforma?</p>
                </div>

                <div className="reg-tipo-cards">
                  <button type="button" className="reg-tipo-card" onClick={() => selecionarPapel("discente")}>
                    <div className="reg-tipo-icon"><GraduationCap size={24} /></div>
                    Sou Aluno
                  </button>
                  <button type="button" className="reg-tipo-card" onClick={() => selecionarPapel("docente")}>
                    <div className="reg-tipo-icon"><BookOpen size={24} /></div>
                    Sou Professor
                  </button>
                </div>

                <p className="register-text" style={{ marginTop: 28 }}>
                  Já tem uma conta?{" "}
                  <Link to="/login" className="text-link">Entrar</Link>
                </p>
              </div>
            ) : (
              <div key="form" className="reg-fade-in">
                <button type="button" className="reg-back-btn" onClick={() => setPapel(null)}>
                  <ChevronLeft size={15} /> Voltar
                </button>

                <div className="form-header">
                  <h1 className="form-title">
                    {papel === "discente" ? "Cadastro de Aluno" : "Cadastro de Professor"}
                  </h1>
                  <p className="form-description">Preencha os dados abaixo para se cadastrar.</p>
                </div>

                {serverError && (
                  <p style={{ fontSize: 13, color: "#dc2626", textAlign: "center", marginBottom: 16 }}>{serverError}</p>
                )}

                <form onSubmit={handleSubmit(onSubmit)}>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 20px" }}>

                    <div className="input-group">
                      <label className="input-label">Nome completo</label>
                      <div className="input-box">
                        <User size={18} className="input-icon" />
                        <input className="input-field" placeholder="Digite seu nome completo" {...register("nome")} />
                      </div>
                      {errors.nome && <p style={{ fontSize: 12, color: "#dc2626", marginTop: 4 }}>{errors.nome.message}</p>}
                    </div>

                    <div className="input-group">
                      <label className="input-label">Matrícula</label>
                      <div className="input-box">
                        <User size={18} className="input-icon" />
                        <input
                          className="input-field"
                          placeholder="000000"
                          {...register("matricula")}
                          onChange={(e) => setValue("matricula", maskMatricula(e.target.value), { shouldValidate: true })}
                        />
                      </div>
                      {errors.matricula && <p style={{ fontSize: 12, color: "#dc2626", marginTop: 4 }}>{errors.matricula.message}</p>}
                    </div>

                    <div className="input-group" style={{ gridColumn: "1 / -1" }}>
                      <label className="input-label">E-mail</label>
                      <div className="input-box">
                        <Mail size={18} className="input-icon" />
                        <input className="input-field" type="email" placeholder="seu.email@exemplo.com" {...register("email")} />
                      </div>
                      {errors.email && <p style={{ fontSize: 12, color: "#dc2626", marginTop: 4 }}>{errors.email.message}</p>}
                    </div>

                    {papel === "discente" ? (
                      <div className="input-group" style={{ gridColumn: "1 / -1" }}>
                        <label className="input-label">Curso <span style={{ fontWeight: 400, color: "#9ca3af" }}>(opcional)</span></label>
                        <div className="input-box">
                          <GraduationCap size={18} className="input-icon" />
                          <input className="input-field" placeholder="Ex: Ciência da Computação" {...register("curso")} />
                        </div>
                        {errors.curso && <p style={{ fontSize: 12, color: "#dc2626", marginTop: 4 }}>{errors.curso.message}</p>}
                      </div>
                    ) : (
                      <div className="input-group" style={{ gridColumn: "1 / -1" }}>
                        <label className="input-label">Departamento <span style={{ fontWeight: 400, color: "#9ca3af" }}>(opcional)</span></label>
                        <div className="input-box">
                          <BookOpen size={18} className="input-icon" />
                          <input className="input-field" placeholder="Ex: Departamento de Computação" {...register("departamento")} />
                        </div>
                        {errors.departamento && <p style={{ fontSize: 12, color: "#dc2626", marginTop: 4 }}>{errors.departamento.message}</p>}
                      </div>
                    )}

                    <div className="input-group">
                      <label className="input-label">Senha</label>
                      <div className="input-box">
                        <Lock size={18} className="input-icon" />
                        <input className="input-field" type={showSenha ? "text" : "password"} {...register("senha")} />
                        <button type="button" className="toggle-pwd-btn" onClick={() => setShowSenha((v) => !v)} aria-label={showSenha ? "Esconder" : "Mostrar"}>
                          {showSenha ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                      </div>
                      {errors.senha && <p style={{ fontSize: 12, color: "#dc2626", marginTop: 4 }}>{errors.senha.message}</p>}
                    </div>

                    <div className="input-group">
                      <label className="input-label">Confirme a senha</label>
                      <div className="input-box">
                        <Lock size={18} className="input-icon" />
                        <input className="input-field" type={showConfirmar ? "text" : "password"} {...register("confirmarSenha")} />
                        <button type="button" className="toggle-pwd-btn" onClick={() => setShowConfirmar((v) => !v)} aria-label={showConfirmar ? "Esconder" : "Mostrar"}>
                          {showConfirmar ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                      </div>
                      {errors.confirmarSenha && <p style={{ fontSize: 12, color: "#dc2626", marginTop: 4 }}>{errors.confirmarSenha.message}</p>}
                    </div>

                  </div>

                  <button type="submit" className="submit-btn" disabled={isSubmitting} style={{ marginTop: 8 }}>
                    {isSubmitting ? "Cadastrando..." : "Cadastrar"}
                  </button>
                </form>

                <p className="register-text" style={{ marginTop: 20 }}>
                  Já tem uma conta?{" "}
                  <Link to="/login" className="text-link">Entrar</Link>
                </p>
              </div>
            )}

          </div>
        </div>

      </div>
    </div>
  );
}
