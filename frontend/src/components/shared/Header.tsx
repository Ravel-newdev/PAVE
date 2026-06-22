import { Bell, ChevronDown, Search } from "lucide-react";
import { Link } from "@tanstack/react-router";

interface HeaderProps {
  nomeUsuario?: string;
  paginaAtiva?: string;
  notificacoesPendentes?: number;
  perfil?: "aluno" | "professor";
}

// Rotas por perfil — itens sem rota conhecida ficam com "#"
const rotas: Record<string, Record<string, string>> = {
  aluno: {
    "Notificações": "/notificacoes",
  },
  professor: {
    "Início": "/dashboard-professor",
  },
};

const menus = {
  aluno: ["Início", "Projetos", "Minhas Oportunidades", "Notificações"],
  professor: ["Início", "Projetos"],
};

function getIniciais(nome: string) {
  const partes = nome.trim().split(" ");
  if (partes.length === 1) return partes[0][0].toUpperCase();
  return (partes[0][0] + partes[partes.length - 1][0]).toUpperCase();
}

export function Header({
  nomeUsuario = "Usuário",
  paginaAtiva = "",
  notificacoesPendentes = 0,
  perfil = "aluno",
}: HeaderProps) {
  return (
    <header className="bg-[#1E2E4F] border-b border-[#2a3d63]">
      <div className="max-w-7xl mx-auto px-8 h-16 flex items-center justify-between">

        <div className="flex items-center gap-8">
          <div className="flex items-center gap-2.5 shrink-0">
            <img
              src="/logo-pave.png"
              alt="Logo PAVE"
              className="w-8 h-8 object-contain brightness-0 invert"
            />
            <span className="text-white font-bold text-base tracking-tight">PAVE</span>
          </div>

          <nav className="flex items-center gap-1">
            {menus[perfil].map((item) => {
              const rota = rotas[perfil][item];
              const classes = `flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                item === paginaAtiva
                  ? "text-white border-b-2 border-[#287999] rounded-none pb-[18px]"
                  : "text-white/60 hover:text-white hover:bg-white/10"
              }`;
              return rota ? (
                <Link key={item} to={rota} className={classes}>{item}</Link>
              ) : (
                <a key={item} href="#" className={classes}>{item}</a>
              );
            })}
          </nav>
        </div>

        <div className="flex items-center gap-4 shrink-0">
          <div className="flex items-center gap-2 bg-white/10 rounded-lg px-3 py-1.5">
            <Search className="w-4 h-4 text-white/50" />
            <span className="text-white/40 text-sm">Buscar projetos...</span>
          </div>

          <div className="relative cursor-pointer">
            <Bell className="w-5 h-5 text-white/70" />
            {notificacoesPendentes > 0 && (
              <span className="absolute -top-1.5 -right-1.5 min-w-[18px] h-[18px] bg-amber-400 rounded-full border-2 border-[#1E2E4F] flex items-center justify-center text-[10px] font-bold text-white px-1">
                {notificacoesPendentes}
              </span>
            )}
          </div>

          <div className="flex items-center gap-2 cursor-pointer">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#287999] to-[#1E2E4F] flex items-center justify-center text-white text-xs font-bold">
              {getIniciais(nomeUsuario)}
            </div>
            <span className="text-sm text-white/80 font-medium">Olá, {nomeUsuario.split(" ")[0]}</span>
            <ChevronDown className="w-4 h-4 text-white/50" />
          </div>
        </div>

      </div>
    </header>
  );
}