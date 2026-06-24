import { createContext, useContext, useState, useEffect } from "react";
import type { ReactNode } from "react";

interface InscricoesContextType {
  inscricoes: Set<number>;
  inscrever: (id: number) => void;
  cancelarInscricao: (id: number) => void;
  isInscrito: (id: number) => boolean;
}

const InscricoesContext = createContext<InscricoesContextType | null>(null);

export function InscricoesProvider({ children }: { children: ReactNode }) {
  const [inscricoes, setInscricoes] = useState<Set<number>>(() => {
    const saved = localStorage.getItem("@pave:inscricoes");
    if (saved) {
      try {
        return new Set(JSON.parse(saved));
      } catch (e) {
        console.error("Erro ao carregar inscrições", e);
      }
    }
    return new Set();
  });

  // Salva no localStorage sempre que houver uma nova inscrição
  useEffect(() => {
    localStorage.setItem("@pave:inscricoes", JSON.stringify(Array.from(inscricoes)));
  }, [inscricoes]);

  const inscrever = (id: number) => {
    setInscricoes((prev) => {
      const next = new Set(prev);
      next.add(id);
      return next;
    });
  };

  const cancelarInscricao = (id: number) => {
    setInscricoes((prev) => {
      const next = new Set(prev);
      next.delete(id);
      return next;
    });
  };

  const isInscrito = (id: number) => inscricoes.has(id);

  return (
    <InscricoesContext.Provider value={{ inscricoes, inscrever, cancelarInscricao, isInscrito }}>
      {children}
    </InscricoesContext.Provider>
  );
}

export function useInscricoes() {
  const ctx = useContext(InscricoesContext);
  if (!ctx) throw new Error("useInscricoes deve ser usado dentro de um InscricoesProvider");
  return ctx;
}