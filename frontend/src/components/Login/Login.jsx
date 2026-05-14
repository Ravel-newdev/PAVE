import { useState } from "react";
import backgroundImage from "../../assets/login.jpeg";
import logo from "../../assets/logo.png";
import LoginImg from "../../assets/login2.jpeg"

const MailIcon = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#b0b8c1" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
    <polyline points="22,6 12,13 2,6"/>
  </svg>
);

const LockIcon = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#b0b8c1" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
    <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
  </svg>
);

const EyeOffIcon = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#b0b8c1" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
    <circle cx="12" cy="12" r="3"/>
  </svg>
);

const features = [
  { icon: "", label: "Encontre\noportunidades" },
  { icon: "", label: "Conecte-se e\nfaça a diferença" },
  { icon: "", label: "Desenvolva\nsuas habilidades" },
];

export default function Login() {
  const [showPwd, setShowPwd] = useState(false);
  const [remember, setRemember] = useState(true);

  return (
    <div className="min-h-screen bg-[#e8edf2] flex items-center justify-center p-6">
      <div className="w-full max-w-4xl bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row">

        {/*  lado esqurdo  */}
        <div className="w-full md:w-[45%] relative flex flex-col h-[260px] md:h-auto" style={{ minHeight: 580 }}>
          <img
            src={LoginImg}
            alt="Voluntários PAVE"
            className="absolute inset-0 w-full h-full object-cover object-bottom"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-green-200/40 via-transparent to-green-900/30" />

          <div className="absolute top-6 left-0 right-0 z-10 flex flex-col items-center text-center px-5 gap-2">
            <div className="flex items-center gap-2">
              <span className="text-[#1a2e44] text-3xl font-extrabold tracking-tight">PAVE</span>
            </div>
            <p className="hidden md:block text-[#1a2e44] text-sm font-semibold leading-relaxed">
              Conectando pessoas a oportunidades que<br />
              <strong className="text-[#287999]">transformam</strong> o mundo.
            </p>
          </div>

          <div className="absolute bottom-0 left-0 right-0 z-10 grid grid-cols-3 bg-white/80 backdrop-blur-md px-3 py-3">
            {features.map((f, i) => (
              <div key={i} className="flex flex-col items-center gap-1 text-center px-1">
                <span className="text-xl">{f.icon}</span>
                <span className="text-[10px] font-bold text-[#1a2e44] leading-tight whitespace-pre-line">{f.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* lado direito */}
        <div className="w-full md:w-[55%] flex items-center justify-center px-10 py-12 md:px-14">
          <div className="w-full max-w-sm">

            <div className="text-center mb-8">
              <h1 className="text-[28px] font-extrabold text-[#1a2e44]">Bem-vindo(a)!</h1>
              <p className="text-gray-400 text-sm mt-1">Faça login para continuar</p>
            </div>

            <div className="mb-5">
              <label className="block text-sm font-semibold text-[#1a2e44] mb-2">E-mail</label>
              <div className="flex items-center border border-gray-200 rounded-lg px-4 h-[52px] gap-3 bg-white focus-within:border-green-500 focus-within:ring-1 focus-within:ring-green-400 transition">
                <MailIcon />
                <input
                  type="email"
                  placeholder="exemplo@email.com"
                  className="flex-1 h-full outline-none text-[14px] text-gray-600 placeholder-gray-300 bg-transparent"
                />
              </div>
            </div>

            <div className="mb-5">
              <label className="block text-sm font-semibold text-[#1a2e44] mb-2">Senha</label>
              <div className="flex items-center border border-gray-200 rounded-lg px-4 h-[52px] gap-3 bg-white focus-within:border-green-500 focus-within:ring-1 focus-within:ring-green-400 transition">
                <LockIcon />
                <input
                  type={showPwd ? "text" : "password"}
                  placeholder="Digite sua senha"
                  className="flex-1 h-full outline-none text-[14px] text-gray-600 placeholder-gray-300 bg-transparent"
                />
                <button
                  type="button"
                  onClick={() => setShowPwd(v => !v)}
                  className="text-gray-300 hover:text-gray-500 transition flex-shrink-0"
                >
                  <EyeOffIcon />
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between mb-6">
              <label className="flex items-center gap-3 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={remember}
                  onChange={e => setRemember(e.target.checked)}
                  className="w-4 h-4 accent-[#287999] cursor-pointer rounded"
                />
                <span className="text-[13px] text-[#287999]">Lembrar de mim</span>
              </label>
                <button type="button" className="text-[13px] text-[#287999] font-semibold hover:opacity-80 transition">
                   Esqueci minha senha
              </button>
            </div>

            <button
              type="button"
              className="w-full mt-14 bg-[#1E2E4F] hover:bg-[#152139] active:scale-[0.99] text-white font-semibold text-[15px] rounded-lg h-[52px] transition-colors duration-200 mb-12"
            >
              Entrar
            </button>

        

            <p className="text-center text-[13px] text-gray-400 mt-10">
              Não tem uma conta?{" "}
              <button type="button" className="text-[13px] text-[#287999] font-semibold hover:opacity-80 transition">
                Cadastre-se
              </button>
            </p>

          </div>
        </div>

      </div>
    </div>
  );
}