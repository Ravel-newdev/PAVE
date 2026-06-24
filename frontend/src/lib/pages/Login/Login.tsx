import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { Mail, Lock, Eye, EyeOff, Search, Heart, Award, ArrowRight } from "lucide-react";
import "./Login.css";

const features = [
  { icon: <Search size={18} />,  label: "Encontre\noportunidades"        },
  { icon: <Heart size={18} />,   label: "Conecte-se e\nfaça a diferença" },
  { icon: <Award size={18} />,   label: "Desenvolva\nsuas habilidades"   },
];

export default function Login() {
  const [showPwd, setShowPwd] = useState(false);
  const [remember, setRemember] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <div className="login-page">
      <div className="login-card">

        {/* ── Lado esquerdo ── */}
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

        {/* ── Lado direito ── */}
        <div className="login-right">
          <div className="login-form-wrapper">

            <div className="form-header">
              <h1 className="form-title">Bem-vindo(a)!</h1>
              <p className="form-description">Faça login para continuar na plataforma.</p>
            </div>

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
                />
              </div>
            </div>

            <div className="input-group">
              <label className="input-label">Senha</label>
              <div className="input-box">
                <Lock size={18} className="input-icon" />
                <input
                  type={showPwd ? "text" : "password"}
                  placeholder="Digite sua senha"
                  className="input-field"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => setShowPwd((v) => !v)}
                  className="toggle-pwd-btn"
                  aria-label={showPwd ? "Esconder senha" : "Mostrar senha"}
                >
                  {showPwd ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div className="form-actions">
              <label className="remember-label">
                <input
                  type="checkbox"
                  checked={remember}
                  onChange={(e) => setRemember(e.target.checked)}
                  className="remember-checkbox"
                />
                <span>Lembrar de mim</span>
              </label>
              <button type="button" className="text-link">
                Esqueci minha senha
              </button>
            </div>

            <button type="button" className="submit-btn">
              Entrar
              <ArrowRight size={17} />
            </button>

            <div className="form-divider"><span>ou</span></div>

            <p className="register-text">
              Não tem uma conta?{" "}
              <Link to="/cadastro" className="text-link">
                Cadastre-se
              </Link>
            </p>

          </div>
        </div>

      </div>
    </div>
  );
}