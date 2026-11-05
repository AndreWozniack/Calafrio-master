"use client";

import type { CatalogoCalafrio, ItemNaFichaCalafrio } from "@calafrio/core";
import type { EspectroDeDano } from "@calafrio/tema";
import { ChevronLeft, ChevronRight, Dices, Plus, Search } from "lucide-react";
import { useMemo, useState } from "react";

export type FiltroCatalogo =
  | "todos"
  | "curto"
  | "longo"
  | "misto"
  | "consumivel"
  | "bugiganga";

export const FILTROS_CATALOGO: { id: FiltroCatalogo; rotulo: string }[] = [
  { id: "todos", rotulo: "Tudo" },
  { id: "curto", rotulo: "Corpo a corpo" },
  { id: "longo", rotulo: "Longo alcance" },
  { id: "misto", rotulo: "Misto" },
  { id: "consumivel", rotulo: "Consumíveis" },
  { id: "bugiganga", rotulo: "Bugigangas (d100)" },
];

export interface ItemCatalogoView {
  id: string;
  tipo: "arma" | "bugiganga";
  nome: string;
  filtro: Exclude<FiltroCatalogo, "todos">;
  tag: string;
  precoFundos?: number;
  dano?: number;
  espectroDano?: EspectroDeDano;
  descricao?: string;
  propriedades?: string[];
  dadosArma?: CatalogoCalafrio["armasMundanas"][number];
  dadosBugiganga?: { numero: number; nome: string };
}

const ITENS_POR_PAGINA = 8;

export function CatalogoItensBusca({
  catalogo,
  onAdicionarItem,
}: {
  catalogo: CatalogoCalafrio;
  onAdicionarItem: (item: ItemNaFichaCalafrio) => void;
}) {
  const [busca, setBusca] = useState("");
  const [filtro, setFiltro] = useState<FiltroCatalogo>("todos");
  const [pagina, setPagina] = useState(1);

  const sortearBugiganga = () => {
    const d100 = Math.floor(Math.random() * 100) + 1;
    const bg =
      catalogo.bugigangas.find((b) => b.numero === d100) ??
      catalogo.bugigangas[0];
    if (!bg) return;

    onAdicionarItem({
      id: `item-bg-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      nome: bg.nome,
      categoria: "bugiganga",
      paranormal: false,
      equipado: false,
      precoFundos: 0,
      descricao: `Bugiganga sorteada na tabela d100 (#${bg.numero})`,
      efeitos: [],
    });
  };

  const adicionarArmaCatalogo = (
    arma: CatalogoCalafrio["armasMundanas"][number],
  ) => {
    const isConsumivel = arma.tipoAlcance === "Consumível";
    onAdicionarItem({
      id: `item-arma-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      nome: arma.categoria,
      categoria: isConsumivel
        ? "consumivel"
        : arma.tipoAlcance.includes("Longo")
          ? "arma_longo"
          : arma.tipoAlcance.includes("misto")
            ? "arma_misto"
            : "arma_curto",
      paranormal: false,
      equipado: !isConsumivel,
      precoFundos: arma.precoFundos,
      dano: arma.dano,
      espectroDano: arma.espectroDano,
      alcance: arma.tipoAlcance,
      propriedades: [...arma.propriedades],
      descricao: arma.exemplos
        ? `Exemplos do tipo: ${arma.exemplos}`
        : undefined,
      efeitos: [],
    });
  };

  const adicionarBugigangaCatalogo = (bg: { numero: number; nome: string }) => {
    onAdicionarItem({
      id: `item-bg-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      nome: bg.nome,
      categoria: "bugiganga",
      paranormal: false,
      equipado: false,
      precoFundos: 0,
      descricao: `Bugiganga da tabela d100 (#${bg.numero})`,
      efeitos: [],
    });
  };

  const itensCatalogo: ItemCatalogoView[] = useMemo(() => {
    const res: ItemCatalogoView[] = [];

    for (const arma of catalogo.armasMundanas) {
      let f: Exclude<FiltroCatalogo, "todos"> = "curto";
      if (arma.tipoAlcance === "Consumível") f = "consumivel";
      else if (arma.tipoAlcance.includes("Longo")) f = "longo";
      else if (arma.tipoAlcance.includes("misto")) f = "misto";

      res.push({
        id: `arma-${arma.categoria}`,
        tipo: "arma",
        nome: arma.categoria,
        filtro: f,
        tag: arma.tipoAlcance,
        precoFundos: arma.precoFundos,
        dano: arma.dano,
        espectroDano: arma.espectroDano,
        descricao: arma.exemplos ? `Ex: ${arma.exemplos}` : undefined,
        propriedades: arma.propriedades,
        dadosArma: arma,
      });
    }

    for (const bg of catalogo.bugigangas) {
      res.push({
        id: `bg-${bg.numero}`,
        tipo: "bugiganga",
        nome: bg.nome,
        filtro: "bugiganga",
        tag: `d100 #${bg.numero}`,
        precoFundos: 0,
        descricao: "Bugiganga comum de investigação ou cotidiano.",
        dadosBugiganga: bg,
      });
    }

    return res;
  }, [catalogo]);

  const itensFiltrados = useMemo(() => {
    let lista = itensCatalogo;

    if (filtro !== "todos") {
      lista = lista.filter((i) => i.filtro === filtro);
    }

    if (busca.trim()) {
      const termo = busca.toLowerCase();
      lista = lista.filter(
        (i) =>
          i.nome.toLowerCase().includes(termo) ||
          i.descricao?.toLowerCase().includes(termo) ||
          i.tag.toLowerCase().includes(termo) ||
          i.propriedades?.some((p) => p.toLowerCase().includes(termo)),
      );
    }

    return lista;
  }, [itensCatalogo, filtro, busca]);

  const totalPaginas = Math.ceil(itensFiltrados.length / ITENS_POR_PAGINA) || 1;
  const paginaValida = Math.min(Math.max(1, pagina), totalPaginas);

  const itensExibidos = useMemo(() => {
    const inicio = (paginaValida - 1) * ITENS_POR_PAGINA;
    return itensFiltrados.slice(inicio, inicio + ITENS_POR_PAGINA);
  }, [itensFiltrados, paginaValida]);

  return (
    <div className="space-y-3.5">
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-foreground/60" />
          <input
            type="text"
            value={busca}
            onChange={(e) => {
              setBusca(e.target.value);
              setPagina(1);
            }}
            placeholder="Buscar arma, dano, consumível ou bugiganga..."
            className="w-full bg-card pl-9 pr-3 py-2.5 rounded-lg border-2 border-border text-sm outline-none focus:border-amber-400 font-bold text-foreground shadow-xs placeholder:text-foreground/40"
          />
        </div>
        <button
          type="button"
          onClick={sortearBugiganga}
          className="flex items-center justify-center gap-2 px-3.5 py-2.5 bg-muted/60 hover:bg-muted text-foreground font-bold text-sm rounded-lg border-2 border-border cursor-pointer transition-colors shrink-0 shadow-xs"
        >
          <Dices className="size-4 text-amber-600 dark:text-amber-400" />{" "}
          Sortear Bugiganga (d100)
        </button>
      </div>

      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs sm:text-sm">
        {FILTROS_CATALOGO.map((f) => {
          const ativo = filtro === f.id;
          const contagem =
            f.id === "todos"
              ? itensCatalogo.length
              : itensCatalogo.filter((i) => i.filtro === f.id).length;

          return (
            <button
              key={f.id}
              type="button"
              onClick={() => {
                setFiltro(f.id);
                setPagina(1);
              }}
              className={`px-3 py-1.5 rounded-lg text-xs sm:text-sm font-bold shrink-0 cursor-pointer transition-colors ${
                ativo
                  ? "bg-amber-400 text-neutral-950 font-black shadow-xs"
                  : "bg-muted text-foreground/75 hover:text-foreground hover:bg-muted/80 border border-border/50"
              }`}
            >
              {f.rotulo} ({contagem})
            </button>
          );
        })}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
        {itensExibidos.map((item) => (
          <div
            key={item.id}
            className="p-3.5 rounded-xl border-2 border-border bg-card flex flex-col justify-between gap-2.5 hover:border-border/90 transition-all shadow-xs"
          >
            <div className="space-y-1">
              <div className="flex items-start justify-between gap-2">
                <span className="font-bold text-foreground text-sm leading-snug">
                  {item.nome}
                </span>
                <span className="text-xs px-2 py-0.5 rounded-md bg-muted text-foreground/85 font-bold uppercase shrink-0 border border-border/60">
                  {item.tag}
                </span>
              </div>

              <div className="flex items-center gap-2.5 text-xs text-foreground/80 flex-wrap">
                {item.dano !== undefined && (
                  <span className="font-semibold text-foreground/90">
                    Dano: {item.dano} ({item.espectroDano})
                  </span>
                )}
                {item.precoFundos !== undefined && (
                  <span className="font-black text-amber-800 dark:text-amber-400">
                    {item.precoFundos > 0 ? `${item.precoFundos} F$` : "Grátis"}
                  </span>
                )}
              </div>

              {item.descricao && (
                <p className="text-xs text-foreground/80 line-clamp-2 leading-relaxed">
                  {item.descricao}
                </p>
              )}
              {item.propriedades && item.propriedades.length > 0 && (
                <p className="text-xs text-foreground/60 line-clamp-1 italic">
                  {item.propriedades.join(" ")}
                </p>
              )}
            </div>

            <div className="pt-2 border-t border-border flex justify-end">
              <button
                type="button"
                onClick={() => {
                  if (item.tipo === "arma" && item.dadosArma) {
                    adicionarArmaCatalogo(item.dadosArma);
                  } else if (item.tipo === "bugiganga" && item.dadosBugiganga) {
                    adicionarBugigangaCatalogo(item.dadosBugiganga);
                  }
                }}
                className="px-3 py-1.5 bg-muted hover:bg-amber-400 hover:text-neutral-950 text-foreground font-bold text-xs rounded-lg cursor-pointer transition-colors flex items-center gap-1.5 border border-border shadow-xs"
              >
                <Plus className="size-3.5" /> Adicionar
              </button>
            </div>
          </div>
        ))}

        {itensExibidos.length === 0 && (
          <div className="col-span-full py-8 text-center text-sm text-foreground/60 italic border-2 border-dashed border-border rounded-xl">
            Nenhum item encontrado no catálogo com esses filtros.
          </div>
        )}
      </div>

      {totalPaginas > 1 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-2 pt-2.5 border-t border-border text-xs sm:text-sm">
          <span className="text-xs text-foreground/80 font-medium">
            Página{" "}
            <span className="font-bold text-foreground">{paginaValida}</span> de{" "}
            <span className="font-bold text-foreground">{totalPaginas}</span>
            <span className="text-foreground/50 ml-1.5">
              ({itensFiltrados.length} itens)
            </span>
          </span>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              disabled={paginaValida <= 1}
              onClick={() => setPagina((p) => Math.max(1, p - 1))}
              className="p-1.5 rounded-lg border border-border hover:bg-muted disabled:opacity-30 disabled:pointer-events-none cursor-pointer text-foreground"
              aria-label="Página anterior"
            >
              <ChevronLeft className="size-4" />
            </button>
            <button
              type="button"
              disabled={paginaValida >= totalPaginas}
              onClick={() => setPagina((p) => Math.min(totalPaginas, p + 1))}
              className="p-1.5 rounded-lg border border-border hover:bg-muted disabled:opacity-30 disabled:pointer-events-none cursor-pointer text-foreground"
              aria-label="Próxima página"
            >
              <ChevronRight className="size-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
