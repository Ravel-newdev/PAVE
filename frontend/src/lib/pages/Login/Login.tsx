import { useState } from "react";
import LoginImg from "@/assets/login2.jpeg";
import { MailIcon, LockIcon, EyeOffIcon } from "./components/Icons";

import "./Login.css"; 

const features = [
  { icon: "", label: "Encontre\noportunidades" },
  { icon: "", label: "Conecte-se e\nfaça a diferença" },
  { icon: "", label: "Desenvolva\nsuas habilidades" },
];

export default function Login() {
  const [showPwd, setShowPwd] = useState(false);
  const [remember, setRemember] = useState(true);

  return (
    <div className="login-page">
      <div className="login-card">

        {/* Lado esquerdo */}
        <div className="login-left">
          <img
            src={LoginImg}
            alt="Voluntários PAVE"
            className="login-image"
          />
          <div className="login-overlay" />

          <div className="login-brand-container">
            <div className="brand-title">
              <span>PAVE</span>
            </div>
            <p className="brand-subtitle">
              Conectando pessoas a oportunidades que<br />
              <strong className="brand-highlight">transformam</strong> o mundo.
            </p>
          </div>

          <div className="login-features">
            {features.map((f, i) => (
              <div key={i} className="feature-item">
                <span className="feature-icon">{f.icon}</span>
                <span className="feature-label">{f.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Lado direito */}
        <div className="login-right">
          <div className="login-form-wrapper">

            <div className="form-header">
              <h1 className="form-title">Bem-vindo(a)!</h1>
              <p className="form-description">Faça login para continuar</p>
            </div>

            <div className="input-group">
              <label className="input-label">E-mail</label>
              <div className="input-box">
                <MailIcon />
                <input
                  type="email"
                  placeholder="exemplo@email.com"
                  className="input-field"
                />
              </div>
            </div>

            <div className="input-group">
              <label className="input-label">Senha</label>
              <div className="input-box">
                <LockIcon />
                <input
                  type={showPwd ? "text" : "password"}
                  placeholder="Digite sua senha"
                  className="input-field"
                />
                <button
                  type="button"
                  onClick={() => setShowPwd(v => !v)}
                  className="toggle-pwd-btn"
                >
                  <EyeOffIcon />
                </button>
              </div>
            </div>

            <div className="form-actions">
              <label className="remember-label">
                <input
                  type="checkbox"
                  checked={remember}
                  onChange={e => setRemember(e.target.checked)}
                  className="remember-checkbox"
                />
                <span className="text-link">Lembrar de mim</span>
              </label>
              <button type="button" className="text-link">
                Esqueci minha senha
              </button>
            </div>

            <button type="button" className="submit-btn">
              Entrar
            </button>

            <p className="register-text">
              Não tem uma conta?{" "}
              <button type="button" className="text-link">
                Cadastre-se
              </button>
            </p>

          </div>
        </div>

      </div>
    </div>
  );
}