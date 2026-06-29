import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowLeft, ArrowRight, CheckCircle2, Mail } from "lucide-react";
import { paveApi } from "../../services/PaveApiService";
import "./Login.css";

export default function EsqueciSenha() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit() {
    setError(null);

    if (!email.trim()) {
      setError("Informe seu e-mail para continuar.");
      return;
    }

    setIsSubmitting(true);
    try {
      await paveApi.recuperarSenha(email.trim());
      setSuccess(true);
    } catch {
      setError("Não foi possível enviar o e-mail de recuperação. Tente novamente.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="login-page">
      <div className="login-card recovery-card">
        <div className="login-left">
          <div className="login-blob login-blob-1" />
          <div className="login-blob login-blob-2" />
          <div className="login-brand">
            <div className="brand-title">PAVE</div>
            <p className="brand-subtitle">
              Segurança para continuar acessando oportunidades que{" "}
              <strong className="brand-highlight">transformam</strong> o mundo.
            </p>
          </div>
          <div className="login-pill">
            <span className="pill-dot" />
            Recuperação de acesso
          </div>
        </div>

        <div className="login-right">
          <div className="login-form-wrapper">
            <Link to="/login" className="back-login-link">
              <ArrowLeft size={16} />
              Voltar ao login
            </Link>

            <div className="form-header">
              <h1 className="form-title">Esqueceu sua senha?</h1>
              <p className="form-description">
                Informe seu e-mail cadastrado para receber o link de redefinição de senha.
              </p>
            </div>

            {success ? (
              <div className="success-box">
                <CheckCircle2 size={28} />
                <div>
                  <strong>Verifique seu e-mail</strong>
                  <p>
                    Se o endereço estiver cadastrado, enviaremos as instruções para trocar sua senha.
                  </p>
                </div>
              </div>
            ) : (
              <>
                {error && <p className="text-sm text-red-600 mb-4 text-center">{error}</p>}

                <div className="input-group">
                  <label className="input-label">E-mail</label>
                  <div className="input-box">
                    <Mail size={18} className="input-icon" />
                    <input
                      type="email"
                      placeholder="exemplo@email.com"
                      className="input-field"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
                    />
                  </div>
                </div>

                <button type="button" className="submit-btn" onClick={handleSubmit} disabled={isSubmitting}>
                  {isSubmitting ? "Enviando..." : "Enviar link de recuperação"}
                  <ArrowRight size={17} />
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
