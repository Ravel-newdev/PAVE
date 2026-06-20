import { useEffect, useMemo, useState } from "react";
import { SlidersHorizontal, LayoutGrid, List, ChevronLeft, ChevronRight } from "lucide-react";

import Navbar from "../../layout/components/Navbar/Navbar";
import { SelectDropdown } from "../../layout/components/CatalogoProjeto/SelectDropdown";
import { ProjetoCard }    from "../../layout/components/CatalogoProjeto/ProjetoCard";

import { projetos } from "../../../data/projetos";
import { Route } from "../../../routes/projetos.index";  
import "./CatalogoProjeto.css";

/*  Opções de filtro  */
const TIPOS       = ["Todos", "Extensão", "Voluntariado", "Bolsa"]                              as const;
const AREAS       = ["Todas", "Tecnologia e Educação", "Meio Ambiente", "Saúde"]                as const;
const TURNOS      = ["Todos", "Manhã", "Tarde", "Noite"]                                        as const;
const MODALIDADES = ["Todas", "Presencial", "Remoto", "Híbrido"]                               as const;
const ORDENS      = ["Mais recentes", "Mais vagas", "A–Z"]                                     as const;

const POR_PAGINA = 6;

/*  todos os projetos vêm de projetos.tsx  */
const TODOS = projetos;

/*  Página  */
export default function CatalogoProjeto() {
  const { q } = Route.useSearch();  

  const [busca,       setBusca]       = useState(q ?? ""); 
  const [tipo,        setTipo]        = useState<string>("Todos");
  const [area,        setArea]        = useState<string>("Todas");
  const [turno,       setTurno]       = useState<string>("Todos");
  const [modalidade,  setModalidade]  = useState<string>("Todas");
  const [ordem,       setOrdem]       = useState<string>("Mais recentes");
  const [visao,       setVisao]       = useState<"grid" | "lista">("grid");
  const [pagina,      setPagina]      = useState(1);

  useEffect(() => {
    setBusca(q ?? "");
    setPagina(1);
  }, [q]);

  const filtrados = useMemo(() => {
    const termo = busca.trim().toLowerCase(); 

    return TODOS.filter((p) => {
      const bateBusca =
        termo === "" ||
        p.titulo.toLowerCase().includes(termo) ||
        p.area.toLowerCase().includes(termo) ||
        p.professor.nome.toLowerCase().includes(termo); 

      const bateTipo     = tipo === "Todos"  || p.tipo.includes(tipo);
      const bateArea     = area === "Todas"  || p.area.toLowerCase().includes(area.toLowerCase());
      const bateModal    = modalidade === "Todas" || p.modalidade === modalidade;

      return bateBusca && bateTipo && bateArea && bateModal; 
    });
  }, [busca, tipo, area, modalidade]); 

  const totalPaginas = Math.ceil(filtrados.length / POR_PAGINA);
  const paginados    = filtrados.slice((pagina - 1) * POR_PAGINA, pagina * POR_PAGINA);

  const mudarFiltro = (setter: (v: string) => void) => (v: string) => {
    setter(v);
    setPagina(1);
  };

  return (
    <div className="cat-page">
      <Navbar />

      {/*  Hero  */}
      <header className="cat-hero">
        <div className="cat-hero-text">
          <h1>Catálogo de Projetos</h1>
          <p>Encontre oportunidades de voluntariado, extensão e bolsas para aprender, crescer e transformar vidas.</p>
        </div>

        <div className="cat-hero-illustration" aria-hidden="true">
          <svg viewBox="0 0 220 160" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="60" y="40" width="100" height="80" rx="8" fill="#E8EAF6" opacity=".6"/>
            <rect x="70" y="50" width="80" height="10" rx="4" fill="#9FA8DA" opacity=".5"/>
            <rect x="70" y="66" width="60" height="8" rx="4" fill="#C5CAE9" opacity=".4"/>
            <rect x="70" y="80" width="70" height="8" rx="4" fill="#C5CAE9" opacity=".4"/>
            <circle cx="170" cy="30" r="22" fill="#FFF8E1" opacity=".7"/>
            <path d="M170 22v8l5 3" stroke="#FFC107" strokeWidth="2" strokeLinecap="round"/>
            <circle cx="50" cy="110" r="16" fill="#E8F5EE" opacity=".7"/>
            <path d="M50 103v7l4 2" stroke="#4CAF50" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        </div>
      </header>

      {busca && (
        <div className="cat-busca-ativa">
          Resultados para "<strong>{busca}</strong>"
          <button type="button" onClick={() => setBusca("")}>Limpar busca</button>
        </div>
      )}

      {/*  Filtros  */}
      <section className="cat-filters-bar">
        <button className="cat-filtros-btn">
          <SlidersHorizontal size={15} /> Filtros
        </button>

        <SelectDropdown label="Tipo de oportunidade" options={TIPOS}       value={tipo}      onChange={mudarFiltro(setTipo)} />
        <SelectDropdown label="Área de conhecimento"  options={AREAS}       value={area}      onChange={mudarFiltro(setArea)} />
        <SelectDropdown label="Turno"                 options={TURNOS}      value={turno}     onChange={setTurno} />
        <SelectDropdown label="Modalidade"            options={MODALIDADES} value={modalidade}onChange={mudarFiltro(setModalidade)} />

        <div className="cat-filters-spacer" />

        <SelectDropdown label="Ordenar por" options={ORDENS} value={ordem} onChange={setOrdem} />
      </section>

      {/*  Resultado  */}
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
              onClick={() => { setBusca(""); setTipo("Todos"); setArea("Todas"); setModalidade("Todas"); setPagina(1); }}
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

        {/*  Paginação  */}
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