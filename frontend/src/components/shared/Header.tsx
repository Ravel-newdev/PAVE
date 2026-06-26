import { Bell, ChevronDown, Search } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { useAuth } from "@/context/AuthContext";

interface HeaderProps {
  paginaAtiva?: string;
  notificacoesPendentes?: number;
}

const menus = {
  docente:  ["Início", "Projetos"],
  discente: ["Início", "Projetos", "Notificações"],
};

const rotas: Record<string, Record<string, string>> = {
  docente:  { "Início": "/professor" },
  discente: { "Início": "/aluno", "Notificações": "/aluno/notificacoes" },
};

function getIniciais(nome: string): string {
  const partes = nome.trim().split(" ");
  if (partes.length === 1) return partes[0][0].toUpperCase();
  return (partes[0][0] + partes[partes.length - 1][0]).toUpperCase();
}

export function Header({ paginaAtiva = "", notificacoesPendentes = 0 }: HeaderProps) {
  const { session } = useAuth();
  const tipo = session?.tipo ?? "discente";
  const nome = session?.email?.split("@")[0] ?? "Usuário";

  return (
    <header className="bg-[#1E2E4F] border-b border-[#2a3d63]">
      <div className="max-w-7xl mx-auto px-8 h-16 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-2.5 shrink-0">
            <img src="/logo-pave.png" alt="Logo PAVE" className="w-8 h-8 object-contain brightness-0 invert" />
            <span className="text-white font-bold text-base tracking-tight">PAVE</span>
          </div>

          <nav className="flex items-center gap-1">
            {menus[tipo].map((item) => {
              const rota = rotas[tipo][item];
              const classes = `flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                item === paginaAtiva
                  ? "text-white border-b-2 border-[#287999] rounded-none pb-[18px]"
                  : "text-white/60 hover:text-white hover:bg-white/10"
              }`;
              return rota
                ? <Link key={item} to={rota} className={classes}>{item}</Link>
                : <a key={item} href="#" className={classes}>{item}</a>;
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
              <span className="absolute -top-1.5 -right-1.5 min-w-4.5 h-4.5 bg-amber-400 rounded-full border-2 border-[#1E2E4F] flex items-center justify-center text-[10px] font-bold text-white px-1">
                {notificacoesPendentes}
              </span>
            )}
          </div>

          <div className="flex items-center gap-2 cursor-pointer">
            <div className="w-8 h-8 rounded-full bg-linear-to-r from-[#287999] to-[#1E2E4F] flex items-center justify-center text-white text-xs font-bold">
              {getIniciais(nome)}
            </div>
            <span className="text-sm text-white/80 font-medium">Olá, {nome.split(" ")[0]}</span>
            <ChevronDown className="w-4 h-4 text-white/50" />
          </div>
        </div>
      </div>
    </header>
  );
}
