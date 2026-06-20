import { useState } from "react";
import { Link } from "@tanstack/react-router";
import LoginImg from "../../../assets/login2.jpeg";
import { FiMail, FiLock, FiEyeOff, FiEye } from "react-icons/fi";

import { Button, Input, FieldLabel } from "../../layout/components/CadastroProjeto/FormElements"; 

const features = [
  { icon: "", label: "Encontre\noportunidades" },
  { icon: "", label: "Conecte-se e\nfaça a diferença" },
  { icon: "", label: "Desenvolva\nsuas habilidades" },
];

export default function Login() {
  const [showPwd, setShowPwd] = useState(false);
  const [remember, setRemember] = useState(true);

  const iconStyle = { fontSize: "18px", color: "#b0b8c1" };

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
              <FieldLabel className="input-label">E-mail</FieldLabel>
              <div className="input-box">
                {/* Substituído pelo react-icons */}
                <FiMail style={iconStyle} />
                <Input
                  type="email"
                  placeholder="exemplo@email.com"
                  className="input-field"
                />
              </div>
            </div>

            <div className="input-group">
              <FieldLabel className="input-label">Senha</FieldLabel>
              <div className="input-box">
                {/* Substituído pelo react-icons */}
                <FiLock style={iconStyle} />
                <Input
                  type={showPwd ? "text" : "password"}
                  placeholder="Digite sua senha"
                  className="input-field"
                />
                <Button
                  type="button"
                  onClick={() => setShowPwd(v => !v)}
                  className="toggle-pwd-btn"
                >
                  {/* Alterna o ícone de acordo com o estado da senha */}
                  {showPwd ? <FiEye style={iconStyle} /> : <FiEyeOff style={iconStyle} />}
                </Button>
              </div>
            </div>

            <div className="form-actions">
              <FieldLabel className="remember-label">
                <Input
                  type="checkbox"
                  checked={remember}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setRemember(e.target.checked)}
                  className="remember-checkbox"
                />
                <span className="text-link">Lembrar de mim</span>
              </FieldLabel>
              <Button type="button" className="text-link">
                Esqueci minha senha
              </Button>
            </div>

            <Button type="button" className="submit-btn">
              Entrar
            </Button>

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