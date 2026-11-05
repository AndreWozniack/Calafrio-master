"use client";

import type {
  CatalogoCalafrio,
  FichaCalafrio,
  ItemNaFichaCalafrio,
} from "@calafrio/core";
import { Dices, PackagePlus, Sparkles, Trash2 } from "lucide-react";
import { useState } from "react";
import { CatalogoItensBusca } from "./catalogo-itens-busca";
import { FormularioItemLivre } from "./formulario-item-livre";

interface EtapaItensEquipamentosProps {
  ficha: FichaCalafrio;
  catalogo: CatalogoCalafrio;
  onAtualizarCarteira: (fundos: number, espirions: number) => void;
  onAdicionarItem: (item: ItemNaFichaCalafrio) => void;
  onRemoverItem: (id: string) => void;
}

export function EtapaItensEquipamentos({
  ficha,
  catalogo,
  onAtualizarCarteira,
  onAdicionarItem,
  onRemoverItem,
}: EtapaItensEquipamentosProps) {
  const [modoAba, setModoAba] = useState<"livre" | "catalogo">("catalogo");

  const sortearFundos = () => {
    const d12 = Math.floor(Math.random() * 12) + 1;
    onAtualizarCarteira(d12, ficha.carteira.espirions);
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
          <FormularioItemLivre onAdicionarItem={onAdicionarItem} />
        ) : (
          <CatalogoItensBusca
            catalogo={catalogo}
            onAdicionarItem={onAdicionarItem}
          />
        )}
      </div>

      {/* Lista de Itens no Inventário */}
      <div className="space-y-3 pt-2">
        <div className="flex items-center justify-between">
          <span className="calafrio-tag-sm">ITENS NO INVENTÁRIO</span>
          <span className="text-xs font-bold text-foreground/70">
            Total: {ficha.inventario.length} item(ns)
          </span>
        </div>

        {ficha.inventario.length === 0 ? (
          <div className="p-6 rounded-xl border-2 border-dashed border-border text-center text-sm text-foreground/60 italic bg-card/40">
            Nenhum item equipado ou na mochila. Crie um item acima ou selecione
            da biblioteca.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {ficha.inventario.map((item) => (
              <div
                key={item.id}
                className="p-3.5 rounded-xl border-2 border-border bg-card flex items-start justify-between gap-3 shadow-xs"
              >
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-foreground text-sm truncate">
                      {item.nome}
                    </span>
                    {item.paranormal && (
                      <span className="text-[10px] px-1.5 py-0.5 rounded-sm bg-purple-950/40 text-purple-300 border border-purple-800/60 font-black uppercase flex items-center gap-1">
                        <Sparkles className="size-2.5" /> Eco
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2 mt-1 text-xs text-foreground/70 flex-wrap">
                    <span className="capitalize">{item.categoria}</span>
                    {item.dano !== undefined && (
                      <span>· Dano: {item.dano}</span>
                    )}
                    {item.precoFundos !== undefined && item.precoFundos > 0 && (
                      <span>· {item.precoFundos} F$</span>
                    )}
                    {item.alcance && <span>· {item.alcance}</span>}
                  </div>

                  {item.descricao && (
                    <p className="text-xs text-foreground/75 mt-1.5 line-clamp-2">
                      {item.descricao}
                    </p>
                  )}
                </div>

                <button
                  type="button"
                  onClick={() => onRemoverItem(item.id)}
                  className="p-1.5 text-foreground/50 hover:text-red-400 hover:bg-red-950/20 rounded-lg transition-colors cursor-pointer shrink-0"
                  title="Remover item"
                >
                  <Trash2 className="size-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
