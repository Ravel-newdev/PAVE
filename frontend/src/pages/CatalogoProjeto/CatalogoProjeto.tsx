import { useEffect, useMemo, useState } from "react";
import { useSearch } from "@tanstack/react-router";
import { SlidersHorizontal, LayoutGrid, List, ChevronLeft, ChevronRight } from "lucide-react";

import Navbar from "../../layout/components/Navbar/Navbar";
import { SelectDropdown } from "../../layout/components/CatalogoProjeto/SelectDropdown";
import { ProjetoCard }    from "../../layout/components/CatalogoProjeto/ProjetoCard";

import { paveApi } from "../../services/PaveApiService";
import type { Projeto } from "../../types/projeto";
import "./CatalogoProjeto.css";

const normalizar = (s: string) =>
  s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();

const ORDENS = ["Mais recentes", "Mais antigos", "A–Z"] as const;
const POR_PAGINA = 6;

export default function CatalogoProjeto() {
  const { q } = useSearch({ strict: false }) as { q?: string };

  const [projetos,   setProjetos]   = useState<Projeto[]>([]);
  const [busca,      setBusca]      = useState(q ?? "");
  const [tipo,       setTipo]       = useState("Todos");
  const [area,       setArea]       = useState("Todas");
  const [ordem,      setOrdem]      = useState("Mais recentes");
  const [visao,      setVisao]      = useState<"grid" | "lista">("grid");
  const [pagina,     setPagina]     = useState(1);

  useEffect(() => {
    paveApi.listarProjetos("ativo").then(setProjetos).catch(() => {});
  }, []);

  useEffect(() => {
    setBusca(q ?? "");
    setPagina(1);
  }, [q]);

  const opcoesArea = useMemo(() => {
    const deps = projetos
      .map((p) => p.centro_dep)
      .filter((d): d is string => !!d && d.trim() !== "");
    return ["Todas", ...Array.from(new Set(deps)).sort()];
  }, [projetos]);

  const opcoesTipo = useMemo(() => {
    const tags = projetos.flatMap((p) => p.tags.map((t) => t.nome));
    return ["Todos", ...Array.from(new Set(tags)).sort()];
  }, [projetos]);

  const filtrados = useMemo(() => {
    const termo = normalizar(busca.trim());

    let resultado = projetos.filter((p) => {
      const bateBusca =
        termo === "" ||
        normalizar(p.titulo).includes(termo) ||
        normalizar(p.centro_dep ?? "").includes(termo) ||
        normalizar(p.descricao ?? "").includes(termo) ||
        normalizar(p.autor_nome).includes(termo);

      const bateTipo = tipo === "Todos" || p.tags.some((t) => t.nome === tipo);
      const bateArea = area === "Todas" || p.centro_dep === area;

      return bateBusca && bateTipo && bateArea;
    });

    if (ordem === "Mais recentes") {
      resultado = [...resultado].sort((a, b) => b.criado_em.localeCompare(a.criado_em));
    } else if (ordem === "Mais antigos") {
      resultado = [...resultado].sort((a, b) => a.criado_em.localeCompare(b.criado_em));
    } else if (ordem === "A–Z") {
      resultado = [...resultado].sort((a, b) => a.titulo.localeCompare(b.titulo, "pt-BR"));
    }

    return resultado;
  }, [projetos, busca, tipo, area, ordem]);

  const totalPaginas = Math.ceil(filtrados.length / POR_PAGINA);
  const paginados    = filtrados.slice((pagina - 1) * POR_PAGINA, pagina * POR_PAGINA);

  const mudarFiltro = (setter: (v: string) => void) => (v: string) => {
    setter(v);
    setPagina(1);
  };

  return (
    <div className="cat-page">
      <Navbar />

      <header className="cat-hero">
        <div className="cat-hero-text">
          <h1>Catálogo de Projetos</h1>
          <p>Encontre oportunidades de voluntariado, extensão e bolsas para aprender, crescer e transformar vidas.</p>
        </div>
      </header>

      {busca && (
        <div className="cat-busca-ativa">
          Resultados para "<strong>{busca}</strong>"
          <button type="button" onClick={() => setBusca("")}>Limpar busca</button>
        </div>
      )}

      <section className="cat-filters-bar">
        <button className="cat-filtros-btn">
          <SlidersHorizontal size={15} /> Filtros
        </button>

        <SelectDropdown label="Tipo de oportunidade" options={opcoesTipo} value={tipo} onChange={mudarFiltro(setTipo)} />
        <SelectDropdown label="Departamento"         options={opcoesArea} value={area} onChange={mudarFiltro(setArea)} />

        <div className="cat-filters-spacer" />

        <SelectDropdown label="Ordenar por" options={ORDENS} value={ordem} onChange={mudarFiltro(setOrdem)} />
      </section>

      <section className="cat-resultado">
        <div className="cat-resultado-header">
          <span className="cat-contagem">
            {filtrados.length} projeto{filtrados.length !== 1 ? "s" : ""} encontrado{filtrados.length !== 1 ? "s" : ""}
          </span>
          <div className="cat-view-toggle">
            <span className="cat-view-label">Visualização:</span>
            <button className={`cat-view-btn ${visao === "grid"  ? "ativo" : ""}`} onClick={() => setVisao("grid")}  aria-label="Grade"><LayoutGrid size={18} /></button>
            <button className={`cat-view-btn ${visao === "lista" ? "ativo" : ""}`} onClick={() => setVisao("lista")} aria-label="Lista"><List size={18} /></button>
          </div>
        </div>

        {paginados.length === 0 ? (
          <div className="cat-vazio">
            <p>Nenhum projeto encontrado com esses filtros.</p>
            <button
              type="button"
              className="cat-limpar"
              onClick={() => { setBusca(""); setTipo("Todos"); setArea("Todas"); setPagina(1); }}
            >
              Limpar filtros
            </button>
          </div>
        ) : (
          <div className={`cat-grid ${visao === "lista" ? "cat-grid-lista" : ""}`}>
            {paginados.map((p, idx) => (
              <ProjetoCard key={p.id} projeto={p} index={idx} />
            ))}
          </div>
        )}

        {totalPaginas > 1 && (
          <div className="cat-paginacao">
            <button className="cat-page-btn" onClick={() => setPagina((n) => Math.max(1, n - 1))} disabled={pagina === 1} aria-label="Anterior">
              <ChevronLeft size={16} />
            </button>

            {Array.from({ length: totalPaginas }, (_, i) => i + 1)
              .filter((n) => n === 1 || n === totalPaginas || Math.abs(n - pagina) <= 1)
              .reduce<(number | "…")[]>((acc, n, i, arr) => {
                if (i > 0 && (n as number) - (arr[i - 1] as number) > 1) acc.push("…");
                acc.push(n);
                return acc;
              }, [])
              .map((item, i) =>
                item === "…" ? (
                  <span key={`ell-${i}`} className="cat-page-ellipsis">…</span>
                ) : (
                  <button key={item} className={`cat-page-btn ${pagina === item ? "ativo" : ""}`} onClick={() => setPagina(item as number)}>
                    {item}
                  </button>
                )
              )}

            <button className="cat-page-btn" onClick={() => setPagina((n) => Math.min(totalPaginas, n + 1))} disabled={pagina === totalPaginas} aria-label="Próxima">
              <ChevronRight size={16} />
            </button>
          </div>
        )}
      </section>
    </div>
  );
}