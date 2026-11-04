"use client";

import type {
  CatalogoCalafrio,
  CategoriaItemCalafrio,
  FichaCalafrio,
  ItemNaFichaCalafrio,
} from "@calafrio/core";
import type { EspectroDeDano } from "@calafrio/tema";
import {
  ChevronLeft,
  ChevronRight,
  Coins,
  Dices,
  PackagePlus,
  Plus,
  Search,
  Sparkles,
  Trash2,
} from "lucide-react";
import { useMemo, useState } from "react";

interface EtapaItensEquipamentosProps {
  ficha: FichaCalafrio;
  catalogo: CatalogoCalafrio;
  onAtualizarCarteira: (fundos: number, espirions: number) => void;
  onAdicionarItem: (item: ItemNaFichaCalafrio) => void;
  onRemoverItem: (id: string) => void;
}

const CATEGORIAS_ITEM: { valor: CategoriaItemCalafrio; rotulo: string }[] = [
  { valor: "ferramenta", rotulo: "Ferramenta / Objeto Geral" },
  { valor: "arma_curto", rotulo: "Arma (Curto Alcance)" },
  { valor: "arma_longo", rotulo: "Arma (Longo Alcance)" },
  { valor: "arma_misto", rotulo: "Arma (Alcance Misto)" },
  { valor: "consumivel", rotulo: "Consumível / Munição" },
  { valor: "vestimenta", rotulo: "Vestimenta / Proteção" },
  { valor: "bugiganga", rotulo: "Bugiganga" },
];

type FiltroCatalogo =
  | "todos"
  | "curto"
  | "longo"
  | "misto"
  | "consumivel"
  | "bugiganga";

const FILTROS_CATALOGO: { id: FiltroCatalogo; rotulo: string }[] = [
  { id: "todos", rotulo: "Tudo" },
  { id: "curto", rotulo: "Corpo a corpo" },
  { id: "longo", rotulo: "Longo alcance" },
  { id: "misto", rotulo: "Misto" },
  { id: "consumivel", rotulo: "Consumíveis" },
  { id: "bugiganga", rotulo: "Bugigangas (d100)" },
];

interface ItemCatalogoView {
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
  dadosArma?: (typeof ARMAS_MUNDANAS_EXEMPLO)[number];
  dadosBugiganga?: { numero: number; nome: string };
}

// Tipo auxiliar para inferência de arma
type TipoArmaCatalogo = CatalogoCalafrio["armasMundanas"][number];
const ARMAS_MUNDANAS_EXEMPLO: TipoArmaCatalogo[] = [];

const ITENS_POR_PAGINA = 8;

export function EtapaItensEquipamentos({
  ficha,
  catalogo,
  onAtualizarCarteira,
  onAdicionarItem,
  onRemoverItem,
}: EtapaItensEquipamentosProps) {
  // Estado para criação livre
  const [nomeLivre, setNomeLivre] = useState("");
  const [categoriaLivre, setCategoriaLivre] =
    useState<CategoriaItemCalafrio>("ferramenta");
  const [danoLivre, setDanoLivre] = useState<number | undefined>(undefined);
  const [alcanceLivre, setAlcanceLivre] = useState("");
  const [descricaoLivre, setDescricaoLivre] = useState("");
  const [espectroLivre, setEspectroLivre] = useState<EspectroDeDano>("fisico");
  const [precoFundosLivre, setPrecoFundosLivre] = useState<number>(0);

  // Tab entre criar livre ou catálogo
  const [modoAba, setModoAba] = useState<"livre" | "catalogo">("catalogo");

  // Filtro, busca e paginação do catálogo
  const [busca, setBusca] = useState("");
  const [filtro, setFiltro] = useState<FiltroCatalogo>("todos");
  const [pagina, setPagina] = useState(1);

  // Mapeia todas as entradas da biblioteca (armas mundanas + bugigangas da d100)
  const itensCatalogo = useMemo<ItemCatalogoView[]>(() => {
    const armas: ItemCatalogoView[] = catalogo.armasMundanas.map((arma) => {
      let filtroArma: Exclude<FiltroCatalogo, "todos">;
      if (arma.tipoAlcance === "Consumível") {
        filtroArma = "consumivel";
      } else if (arma.tipoAlcance.includes("Longo")) {
        filtroArma = "longo";
      } else if (arma.tipoAlcance.includes("misto")) {
        filtroArma = "misto";
      } else {
        filtroArma = "curto";
      }

      return {
        id: arma.id,
        tipo: "arma",
        nome: arma.categoria,
        filtro: filtroArma,
        tag: arma.tipoAlcance,
        precoFundos: arma.precoFundos,
        dano: arma.dano,
        espectroDano: arma.espectroDano,
        descricao: arma.exemplos ? `Exemplos: ${arma.exemplos}` : undefined,
        propriedades: [...arma.propriedades],
        dadosArma: arma,
      };
    });

    const bugigangas: ItemCatalogoView[] = catalogo.bugigangas.map((bg) => ({
      id: `bug-${bg.numero}`,
      tipo: "bugiganga",
      nome: bg.nome,
      filtro: "bugiganga",
      tag: `d100 · #${bg.numero}`,
      precoFundos: 0,
      descricao: `Bugiganga da tabela d100 (#${bg.numero})`,
      dadosBugiganga: bg,
    }));

    return [...armas, ...bugigangas];
  }, [catalogo.armasMundanas, catalogo.bugigangas]);

  const itensFiltrados = useMemo(() => {
    return itensCatalogo.filter((item) => {
      if (filtro !== "todos" && item.filtro !== filtro) return false;
      if (busca.trim()) {
        const termo = busca.toLowerCase();
        const textoCompleto = `${item.nome} ${item.tag} ${item.descricao ?? ""} ${item.propriedades?.join(" ") ?? ""}`.toLowerCase();
        return textoCompleto.includes(termo);
      }
      return true;
    });
  }, [itensCatalogo, filtro, busca]);

  const totalPaginas = Math.max(
    1,
    Math.ceil(itensFiltrados.length / ITENS_POR_PAGINA),
  );
  const paginaValida = Math.min(pagina, totalPaginas);
  const inicio = (paginaValida - 1) * ITENS_POR_PAGINA;
  const itensExibidos = itensFiltrados.slice(inicio, inicio + ITENS_POR_PAGINA);

  const gerarBotoesPagina = () => {
    const botoes: number[] = [];
    const maxBotoes = 5;
    let inicioBtn = Math.max(1, paginaValida - 2);
    let fimBtn = Math.min(totalPaginas, inicioBtn + maxBotoes - 1);
    if (fimBtn - inicioBtn + 1 < maxBotoes) {
      inicioBtn = Math.max(1, fimBtn - maxBotoes + 1);
    }
    for (let i = inicioBtn; i <= fimBtn; i++) {
      botoes.push(i);
    }
    return botoes;
  };

  const sortearFundos = () => {
    const valor = Math.floor(Math.random() * 12) + 1;
    onAtualizarCarteira(valor, ficha.carteira.espirions);
  };

  const sortearBugiganga = () => {
    if (!catalogo.bugigangas.length) return;
    const idx = Math.floor(Math.random() * catalogo.bugigangas.length);
    const bg = catalogo.bugigangas[idx];
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

  const adicionarArmaCatalogo = (
    arma: (typeof catalogo.armasMundanas)[number],
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

  const criarItemLivre = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nomeLivre.trim()) return;

    onAdicionarItem({
      id: `item-livre-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      nome: nomeLivre.trim(),
      categoria: categoriaLivre,
      paranormal: false,
      equipado: false,
      dano: danoLivre && danoLivre > 0 ? Number(danoLivre) : undefined,
      espectroDano: espectroLivre,
      alcance: alcanceLivre.trim() || undefined,
      precoFundos: precoFundosLivre > 0 ? Number(precoFundosLivre) : undefined,
      descricao: descricaoLivre.trim() || undefined,
      efeitos: [],
    });

    setNomeLivre("");
    setDanoLivre(undefined);
    setAlcanceLivre("");
    setDescricaoLivre("");
    setPrecoFundosLivre(0);
  };

  return (
    <div className="space-y-6 font-sans">
      <div>
        <h4 className="text-lg font-black text-foreground uppercase tracking-wide">
          4. Carteira & Inventário ({ficha.inventario.length} itens adicionados)
        </h4>
        <p className="text-sm text-foreground/75 mt-1">
          Defina o dinheiro inicial e equipe itens criados livremente ou do
          catálogo.
        </p>
      </div>

      {/* Carteira */}
      <div className="p-4 sm:p-5 rounded-xl border-2 border-border bg-card shadow-xs space-y-3">
        <span className="calafrio-tag-sm">CARTEIRA INICIAL</span>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-foreground font-bold text-sm mb-1.5">
              Fundos Mundanos (F$)
            </label>
            <div className="flex items-center gap-2.5">
              <input
                type="number"
                min={0}
                max={50}
                value={ficha.carteira.fundos}
                onChange={(e) =>
                  onAtualizarCarteira(
                    Math.max(0, Number(e.target.value)),
                    ficha.carteira.espirions,
                  )
                }
                placeholder="0"
                className="w-24 bg-muted/30 p-2.5 rounded-lg border-2 border-border text-base font-bold text-center outline-none focus:border-amber-400 text-foreground"
              />
              <button
                type="button"
                onClick={sortearFundos}
                className="flex items-center gap-1.5 px-3.5 py-2.5 bg-amber-400 hover:bg-amber-300 text-neutral-950 font-bold text-sm rounded-lg cursor-pointer transition-colors shadow-xs"
              >
                <Dices className="size-4" /> Sortear (1d12)
              </button>
            </div>
          </div>

          <div>
            <label className="block text-foreground font-bold text-sm mb-1.5">
              Espírions Paranormais (E$P)
            </label>
            <input
              type="number"
              min={0}
              value={ficha.carteira.espirions}
              onChange={(e) =>
                onAtualizarCarteira(
                  ficha.carteira.fundos,
                  Math.max(0, Number(e.target.value)),
                )
              }
              placeholder="0"
              className="w-24 bg-muted/30 p-2.5 rounded-lg border-2 border-border text-base font-bold text-center outline-none focus:border-amber-400 text-foreground"
            />
          </div>
        </div>
      </div>

      {/* Seleção de Modo: Criar Livre vs Catálogo */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 border-b border-border pb-2.5">
          <button
            type="button"
            onClick={() => setModoAba("livre")}
            className={`px-4 py-2 rounded-lg text-sm font-bold cursor-pointer transition-colors ${
              modoAba === "livre"
                ? "bg-amber-400 text-neutral-950 font-black shadow-xs"
                : "bg-muted text-foreground/70 hover:text-foreground hover:bg-muted/80"
            }`}
          >
            <PackagePlus className="size-4 inline mr-1.5" /> Criar Item Livre
          </button>
          <button
            type="button"
            onClick={() => setModoAba("catalogo")}
            className={`px-4 py-2 rounded-lg text-sm font-bold cursor-pointer transition-colors ${
              modoAba === "catalogo"
                ? "bg-amber-400 text-neutral-950 font-black shadow-xs"
                : "bg-muted text-foreground/70 hover:text-foreground hover:bg-muted/80"
            }`}
          >
            Biblioteca & Catálogo
          </button>
        </div>

        {modoAba === "livre" ? (
          /* Formulário de Criação Livre */
          <form
            onSubmit={criarItemLivre}
            className="p-4 sm:p-5 rounded-xl border-2 border-border bg-card shadow-xs space-y-3.5 text-sm"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label className="block text-foreground font-bold mb-1.5 text-sm">
                  Nome do Item
                </label>
                <input
                  type="text"
                  value={nomeLivre}
                  onChange={(e) => setNomeLivre(e.target.value)}
                  placeholder="Nome do item ou equipamento"
                  required
                  className="w-full bg-muted/30 p-2.5 rounded-lg border-2 border-border font-bold outline-none focus:border-amber-400 text-foreground text-sm"
                />
              </div>

              <div>
                <label className="block text-foreground font-bold mb-1.5 text-sm">
                  Categoria
                </label>
                <select
                  value={categoriaLivre}
                  onChange={(e) =>
                    setCategoriaLivre(e.target.value as CategoriaItemCalafrio)
                  }
                  className="w-full bg-muted/30 p-2.5 rounded-lg border-2 border-border font-bold outline-none cursor-pointer text-foreground text-sm"
                >
                  {CATEGORIAS_ITEM.map((cat) => (
                    <option key={cat.valor} value={cat.valor}>
                      {cat.rotulo}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-foreground font-bold mb-1.5 text-sm">
                  Dano (se for arma)
                </label>
                <input
                  type="number"
                  min={0}
                  value={danoLivre ?? ""}
                  onChange={(e) =>
                    setDanoLivre(
                      e.target.value ? Number(e.target.value) : undefined,
                    )
                  }
                  placeholder="Pontos de dano numérico"
                  className="w-full bg-muted/30 p-2.5 rounded-lg border-2 border-border font-bold outline-none focus:border-amber-400 text-foreground text-sm"
                />
              </div>

              <div>
                <label className="block text-foreground font-bold mb-1.5 text-sm">
                  Alcance ou Tipo
                </label>
                <input
                  type="text"
                  value={alcanceLivre}
                  onChange={(e) => setAlcanceLivre(e.target.value)}
                  placeholder="Alcance do ataque ou aplicação"
                  className="w-full bg-muted/30 p-2.5 rounded-lg border-2 border-border font-bold outline-none focus:border-amber-400 text-foreground text-sm"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-foreground font-bold mb-1.5 text-sm">
                  Descrição e Propriedades
                </label>
                <textarea
                  rows={2}
                  value={descricaoLivre}
                  onChange={(e) => setDescricaoLivre(e.target.value)}
                  placeholder="Descrição, efeitos especiais ou notas de uso"
                  className="w-full bg-muted/30 p-2.5 rounded-lg border-2 border-border font-medium outline-none focus:border-amber-400 text-foreground text-sm"
                />
              </div>
            </div>

            <button
              type="submit"
              className="flex items-center gap-2 px-5 py-2.5 bg-amber-400 hover:bg-amber-300 text-neutral-950 font-black text-sm rounded-lg cursor-pointer transition-colors shadow-xs"
            >
              <Plus className="size-4" /> Adicionar Item Livre ao Inventário
            </button>
          </form>
        ) : (
          /* Catálogo e Biblioteca de Itens */
          <div className="space-y-3.5">
            {/* Cabeçalho de Busca e Sorteador */}
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
                <Dices className="size-4 text-amber-600 dark:text-amber-400" /> Sortear Bugiganga (d100)
              </button>
            </div>

            {/* Filtros por Categoria */}
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

            {/* Lista Paginada de Itens */}
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

            {/* Controles de Paginação */}
            {totalPaginas > 1 && (
              <div className="flex flex-col sm:flex-row items-center justify-between gap-2 pt-2.5 border-t border-border text-xs sm:text-sm">
                <span className="text-xs text-foreground/80 font-medium">
                  Página <span className="font-bold text-foreground">{paginaValida}</span> de{" "}
                  <span className="font-bold text-foreground">{totalPaginas}</span>{" "}
                  ({itensFiltrados.length} itens)
                </span>

                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    disabled={paginaValida === 1}
                    onClick={() => setPagina((prev) => Math.max(1, prev - 1))}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-muted hover:bg-muted/80 disabled:opacity-30 disabled:pointer-events-none font-bold text-xs text-foreground cursor-pointer transition-colors border border-border/60"
                  >
                    <ChevronLeft className="size-4" /> Anterior
                  </button>

                  <div className="flex items-center gap-1">
                    {gerarBotoesPagina().map((num) => (
                      <button
                        key={num}
                        type="button"
                        onClick={() => setPagina(num)}
                        className={`min-w-8 h-8 flex items-center justify-center rounded-lg text-xs font-bold cursor-pointer transition-colors border ${
                          num === paginaValida
                            ? "bg-amber-400 text-neutral-950 font-black border-amber-500 shadow-xs"
                            : "bg-muted text-foreground/75 hover:text-foreground border-border/50"
                        }`}
                      >
                        {num}
                      </button>
                    ))}
                  </div>

                  <button
                    type="button"
                    disabled={paginaValida === totalPaginas}
                    onClick={() => setPagina((prev) => Math.min(totalPaginas, prev + 1))}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-muted hover:bg-muted/80 disabled:opacity-30 disabled:pointer-events-none font-bold text-xs text-foreground cursor-pointer transition-colors border border-border/60"
                  >
                    Próxima <ChevronRight className="size-4" />
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Lista de Itens no Inventário */}
      <div className="space-y-2">
        <span className="font-bold text-foreground text-sm block">
          Itens no Inventário ({ficha.inventario.length}):
        </span>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {ficha.inventario.map((item) => (
            <div
              key={item.id}
              className="p-3 rounded-xl border-2 border-border bg-card flex items-start justify-between gap-2.5 shadow-xs"
            >
              <div>
                <span className="font-bold text-foreground block text-sm">
                  {item.nome}
                </span>
                <span className="text-xs px-2 py-0.5 rounded bg-muted text-foreground/80 uppercase font-bold mt-1 inline-block border border-border/60">
                  {item.categoria.replace("_", " ")}
                  {item.dano ? ` · Dano ${item.dano}` : ""}
                  {item.alcance ? ` · ${item.alcance}` : ""}
                </span>
                {item.descricao && (
                  <p className="text-xs text-foreground/80 mt-1 line-clamp-1 leading-relaxed">
                    {item.descricao}
                  </p>
                )}
              </div>
              <button
                type="button"
                onClick={() => onRemoverItem(item.id)}
                className="p-2 text-foreground/60 hover:text-red-600 dark:hover:text-red-400 hover:bg-muted rounded-lg cursor-pointer transition-colors"
                title="Remover"
              >
                <Trash2 className="size-4" />
              </button>
            </div>
          ))}
          {ficha.inventario.length === 0 && (
            <p className="text-sm text-foreground/60 italic col-span-full py-6 text-center border-2 border-dashed border-border rounded-xl">
              Nenhum item adicionado ao inventário ainda.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
