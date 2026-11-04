"use client";

import type {
  CatalogoCalafrio,
  CategoriaItemCalafrio,
  FichaCalafrio,
  ItemNaFichaCalafrio,
} from "@calafrio/core";
import type { EspectroDeDano } from "@calafrio/tema";
import { Coins, Dices, PackagePlus, Plus, Sparkles, Trash2 } from "lucide-react";
import { useState } from "react";

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
  const [modoAba, setModoAba] = useState<"livre" | "catalogo">("livre");

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

  const adicionarArmaCatalogo = (arma: (typeof catalogo.armasMundanas)[number]) => {
    onAdicionarItem({
      id: `item-arma-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      nome: arma.categoria,
      categoria: arma.tipoAlcance.includes("Longo")
        ? "arma_longo"
        : arma.tipoAlcance.includes("misto")
          ? "arma_misto"
          : "arma_curto",
      paranormal: false,
      equipado: true,
      precoFundos: arma.precoFundos,
      dano: arma.dano,
      espectroDano: arma.espectroDano,
      alcance: arma.tipoAlcance,
      propriedades: [...arma.propriedades],
      descricao: arma.exemplos ? `Exemplos do tipo: ${arma.exemplos}` : undefined,
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
    <div className="space-y-6">
      <div>
        <h4 className="text-base font-black text-foreground uppercase tracking-wide">
          4. Carteira & Inventário ({ficha.inventario.length} itens adicionados)
        </h4>
        <p className="text-xs text-muted-foreground mt-0.5">
          Defina o dinheiro inicial e equipe itens criados livremente ou do catálogo.
        </p>
      </div>

      {/* Carteira */}
      <div className="p-4 rounded-xl border border-border bg-muted/40 space-y-3">
        <span className="calafrio-tag-sm">CARTEIRA INICIAL</span>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div>
            <label className="block text-foreground font-bold mb-1">
              Fundos Mundanos (F$)
            </label>
            <div className="flex items-center gap-2">
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
                placeholder="Fundos mundanos"
                className="w-24 bg-card p-2 rounded-lg border border-border text-sm font-bold text-center outline-none focus:border-amber-400"
              />
              <button
                type="button"
                onClick={sortearFundos}
                className="flex items-center gap-1.5 px-3 py-2 bg-amber-400 hover:bg-amber-300 text-black font-bold text-xs rounded-lg cursor-pointer transition-colors"
              >
                <Dices className="size-3.5" /> Sortear (1d12)
              </button>
            </div>
          </div>

          <div>
            <label className="block text-foreground font-bold mb-1">
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
              placeholder="Moeda paranormal inicial"
              className="w-24 bg-card p-2 rounded-lg border border-border text-sm font-bold text-center outline-none focus:border-amber-400"
            />
          </div>
        </div>
      </div>

      {/* Seleção de Modo: Criar Livre vs Catálogo */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 border-b border-border pb-2">
          <button
            type="button"
            onClick={() => setModoAba("livre")}
            className={`px-3 py-1.5 rounded-lg text-xs font-black cursor-pointer transition-colors ${
              modoAba === "livre"
                ? "bg-amber-400 text-black"
                : "bg-muted text-muted-foreground hover:text-foreground"
            }`}
          >
            <PackagePlus className="size-3.5 inline mr-1" /> Criar Item Livre
          </button>
          <button
            type="button"
            onClick={() => setModoAba("catalogo")}
            className={`px-3 py-1.5 rounded-lg text-xs font-black cursor-pointer transition-colors ${
              modoAba === "catalogo"
                ? "bg-amber-400 text-black"
                : "bg-muted text-muted-foreground hover:text-foreground"
            }`}
          >
            Catálogo & Tabelas
          </button>
        </div>

        {modoAba === "livre" ? (
          /* Formulário de Criação Livre */
          <form
            onSubmit={criarItemLivre}
            className="p-4 rounded-xl border border-border bg-card/60 space-y-3 text-xs"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-foreground font-bold mb-1">
                  Nome do Item
                </label>
                <input
                  type="text"
                  value={nomeLivre}
                  onChange={(e) => setNomeLivre(e.target.value)}
                  placeholder="Nome do item ou equipamento"
                  required
                  className="w-full bg-muted/60 p-2 rounded-lg border border-border font-bold outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="block text-foreground font-bold mb-1">
                  Categoria
                </label>
                <select
                  value={categoriaLivre}
                  onChange={(e) =>
                    setCategoriaLivre(e.target.value as CategoriaItemCalafrio)
                  }
                  className="w-full bg-muted/60 p-2 rounded-lg border border-border font-bold outline-none cursor-pointer"
                >
                  {CATEGORIAS_ITEM.map((cat) => (
                    <option key={cat.valor} value={cat.valor}>
                      {cat.rotulo}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-foreground font-bold mb-1">
                  Dano (se for arma)
                </label>
                <input
                  type="number"
                  min={0}
                  value={danoLivre ?? ""}
                  onChange={(e) =>
                    setDanoLivre(e.target.value ? Number(e.target.value) : undefined)
                  }
                  placeholder="Pontos de dano numérico"
                  className="w-full bg-muted/60 p-2 rounded-lg border border-border font-bold outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="block text-foreground font-bold mb-1">
                  Alcance ou Tipo
                </label>
                <input
                  type="text"
                  value={alcanceLivre}
                  onChange={(e) => setAlcanceLivre(e.target.value)}
                  placeholder="Alcance do ataque ou aplicação"
                  className="w-full bg-muted/60 p-2 rounded-lg border border-border font-bold outline-none focus:border-amber-400"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-foreground font-bold mb-1">
                  Descrição e Propriedades
                </label>
                <textarea
                  rows={2}
                  value={descricaoLivre}
                  onChange={(e) => setDescricaoLivre(e.target.value)}
                  placeholder="Descrição, efeitos especiais ou notas de uso"
                  className="w-full bg-muted/60 p-2 rounded-lg border border-border font-medium outline-none focus:border-amber-400"
                />
              </div>
            </div>

            <button
              type="submit"
              className="flex items-center gap-1.5 px-4 py-2 bg-amber-400 hover:bg-amber-300 text-black font-black rounded-lg cursor-pointer transition-colors"
            >
              <Plus className="size-4" /> Adicionar Item Livre ao Inventário
            </button>
          </form>
        ) : (
          /* Catálogo de Armas e Bugigangas */
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="calafrio-tag-sm">ARMAS MUNDANAS DO CATÁLOGO</span>
              <button
                type="button"
                onClick={sortearBugiganga}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-muted hover:bg-border text-foreground font-bold text-xs rounded-lg cursor-pointer transition-colors"
              >
                <Dices className="size-3.5 text-amber-400" /> Sortear Bugiganga (d100)
              </button>
            </div>

            <div className="max-h-[260px] overflow-y-auto space-y-2 pr-1 text-xs">
              {catalogo.armasMundanas.map((arma) => (
                <div
                  key={arma.id}
                  className="p-2.5 rounded-lg border border-border bg-card flex items-center justify-between gap-2"
                >
                  <div>
                    <span className="font-bold text-foreground block">
                      {arma.categoria}
                    </span>
                    <span className="text-[11px] text-muted-foreground">
                      Dano: {arma.dano} ({arma.espectroDano}) · {arma.tipoAlcance} · {arma.precoFundos} F$
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => adicionarArmaCatalogo(arma)}
                    className="shrink-0 px-2.5 py-1 bg-muted hover:bg-amber-400 hover:text-black font-bold text-xs rounded-lg cursor-pointer transition-colors"
                  >
                    + Adicionar
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Lista de Itens no Inventário */}
      <div className="space-y-2 text-xs">
        <span className="font-bold text-foreground block">
          Itens no Inventário ({ficha.inventario.length}):
        </span>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {ficha.inventario.map((item) => (
            <div
              key={item.id}
              className="p-2.5 rounded-lg border border-border bg-card flex items-start justify-between gap-2"
            >
              <div>
                <span className="font-bold text-foreground block">{item.nome}</span>
                <span className="text-[10px] text-muted-foreground uppercase font-semibold">
                  {item.categoria.replace("_", " ")}
                  {item.dano ? ` · Dano ${item.dano}` : ""}
                  {item.alcance ? ` · ${item.alcance}` : ""}
                </span>
                {item.descricao && (
                  <p className="text-[11px] text-muted-foreground mt-0.5 line-clamp-1">
                    {item.descricao}
                  </p>
                )}
              </div>
              <button
                type="button"
                onClick={() => onRemoverItem(item.id)}
                className="p-1 text-muted-foreground hover:text-red-400 cursor-pointer"
                title="Remover"
              >
                <Trash2 className="size-3.5" />
              </button>
            </div>
          ))}
          {ficha.inventario.length === 0 && (
            <p className="text-xs text-muted-foreground italic col-span-full py-4 text-center">
              Nenhum item adicionado ao inventário ainda.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
