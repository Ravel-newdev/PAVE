import { Bell, ChevronDown, UserRound } from "lucide-react";

interface HeaderProps {
  nomeUsuario?: string;
  paginaAtiva?: string;
  notificacoesPendentes?: number;
  perfil?: "aluno" | "professor";
}

const menus = {
  aluno: ["Início", "Projetos", "Minhas Oportunidades", "Notificações"],
  professor: ["Início", "Projetos"],
};

export function Header({
  nomeUsuario = "Usuário",
  paginaAtiva = "",
  notificacoesPendentes = 0,
  perfil = "aluno",
}: HeaderProps) {
  return (
    <header className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-8 h-16 flex items-center justify-between">

        <div className="flex items-center gap-2.5 shrink-0">
          <img
            src="/logo-pave.png"
            alt="Logo PAVE"
            className="w-9 h-9 object-contain"
            style={{ filter: "invert(1)" }}
          />
          <div className="leading-tight">
            <p
              className="text-[15px] font-bold text-[#1B3F3F] tracking-tight leading-none"
              style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
            >
              PAVE
            </p>
            <p className="text-[10px] text-gray-400 font-medium leading-none mt-0.5">UFC</p>
          </div>
        </div>

        <nav className="flex items-center gap-8">
          {menus[perfil].map((item) => (
            <a
              key={item}
              href="#"
              className={`text-sm font-medium pb-0.5 transition-colors ${
                item === paginaAtiva
                  ? "text-[#1B3F3F] border-b-2 border-[#1B3F3F]"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              {item}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-4 shrink-0">
          <div className="relative cursor-pointer">
            <Bell className="w-5 h-5 text-gray-500" />
            {notificacoesPendentes > 0 && (
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-orange-400 rounded-full border-2 border-white" />
            )}
          </div>
          <div className="flex items-center gap-2 cursor-pointer">
            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-100">
              <UserRound className="w-5 h-5 text-gray-400" />
            </div>
            <span className="text-sm font-medium text-gray-700">{nomeUsuario}</span>
            <ChevronDown className="w-4 h-4 text-gray-400" />
          </div>
        </div>

      </div>
    </header>
  );
}