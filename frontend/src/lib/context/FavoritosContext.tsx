import { createContext, useContext, useState, useEffect } from "react";
import type { ReactNode } from "react";

interface FavoritosContextType {
  salvos: Set<number>;
  toggleSalvo: (id: number) => void;
  isSalvo: (id: number) => boolean;
}

const FavoritosContext = createContext<FavoritosContextType | null>(null);

export function FavoritosProvider({ children }: { children: ReactNode }) {
  const [salvos, setSalvos] = useState<Set<number>>(() => {
    const saved = localStorage.getItem("@pave:favoritos");
    if (saved) {
      try {
        return new Set(JSON.parse(saved));
      } catch (e) {
        console.error("Erro ao carregar favoritos", e);
      }
    }
    return new Set();
  });

  // Salva no localStorage sempre que o Set de salvos for alterado
  useEffect(() => {
    localStorage.setItem("@pave:favoritos", JSON.stringify(Array.from(salvos)));
  }, [salvos]);

  const toggleSalvo = (id: number) =>
    setSalvos((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });

  const isSalvo = (id: number) => salvos.has(id);

  return (
    <FavoritosContext.Provider value={{ salvos, toggleSalvo, isSalvo }}>
      {children}
    </FavoritosContext.Provider>
  );
}

export function useFavoritos() {
  const ctx = useContext(FavoritosContext);
  if (!ctx) throw new Error("useFavoritos must be used inside FavoritosProvider");
  return ctx;
}