import { useState } from "react";
import { Link, useNavigate, useSearch } from "@tanstack/react-router";
import { ArrowLeft, ArrowRight, CheckCircle2, Eye, EyeOff, Lock } from "lucide-react";
import { paveApi } from "../../services/PaveApiService";
import "./Login.css";

export default function RedefinirSenha() {
  const navigate = useNavigate();
  const search = useSearch({ from: "/redefinir-senha" }) as { token?: string };
  const token = search.token ?? "";

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPwd, setShowPwd] = useState(false);
  const [showConfirmPwd, setShowConfirmPwd] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit() {
    setError(null);

    if (!token) {
      setError("Token de redefinição ausente ou inválido.");
      return;
    }

    if (password.length < 6) {
      setError("A nova senha deve ter pelo menos 6 caracteres.");
      return;
    }

    if (password !== confirmPassword) {
      setError("As senhas digitadas não conferem.");
      return;
    }

    setIsSubmitting(true);
    try {
      await paveApi.redefinirSenha(token, password);
      setSuccess(true);
    } catch {
      setError("Não foi possível redefinir a senha. O link pode estar expirado ou já ter sido usado.");
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
              Escolha uma senha segura para continuar acessando a plataforma.
            </p>
          </div>
          <div className="login-pill">
            <span className="pill-dot" />
            Nova senha
          </div>
        </div>

        <div className="login-right">
          <div className="login-form-wrapper">
            <Link to="/login" className="back-login-link">
              <ArrowLeft size={16} />
              Voltar ao login
            </Link>

            <div className="form-header">
              <h1 className="form-title">Redefinir senha</h1>
              <p className="form-description">
                Digite e confirme sua nova senha para concluir a recuperação de acesso.
              </p>
            </div>

            {success ? (
              <div className="success-box">
                <CheckCircle2 size={28} />
                <div>
                  <strong>Senha alterada com sucesso</strong>
                  <p>Agora você já pode fazer login usando sua nova senha.</p>
                  <button type="button" className="success-action" onClick={() => navigate({ to: "/login" })}>
                    Ir para login
                  </button>
                </div>
              </div>
            ) : (
              <>
                {error && <p className="text-sm text-red-600 mb-4 text-center">{error}</p>}

                <div className="input-group">
                  <label className="input-label">Nova senha</label>
                  <div className="input-box">
                    <Lock size={18} className="input-icon" />
                    <input
                      type={showPwd ? "text" : "password"}
                      placeholder="Digite sua nova senha"
                      className="input-field"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                    <button type="button" onClick={() => setShowPwd((v) => !v)} className="toggle-pwd-btn" aria-label={showPwd ? "Esconder senha" : "Mostrar senha"}>
                      {showPwd ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                <div className="input-group">
                  <label className="input-label">Confirmar senha</label>
                  <div className="input-box">
                    <Lock size={18} className="input-icon" />
                    <input
                      type={showConfirmPwd ? "text" : "password"}
                      placeholder="Confirme sua nova senha"
                      className="input-field"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
                    />
                    <button type="button" onClick={() => setShowConfirmPwd((v) => !v)} className="toggle-pwd-btn" aria-label={showConfirmPwd ? "Esconder senha" : "Mostrar senha"}>
                      {showConfirmPwd ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                <button type="button" className="submit-btn" onClick={handleSubmit} disabled={isSubmitting}>
                  {isSubmitting ? "Salvando..." : "Salvar nova senha"}
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
