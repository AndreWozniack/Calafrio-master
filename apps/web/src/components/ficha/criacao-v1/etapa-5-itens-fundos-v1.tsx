"use client";

import type { FichaCalafrioV1, ItemV1 } from "@calafrio/core";
import { Coins, Plus, Trash2 } from "lucide-react";
import { useState } from "react";

interface Etapa5ItensFundosV1Props {
  ficha: FichaCalafrioV1;
  onDefinirCarteira: (fundos: number, espirions: number) => void;
  onAdicionarItem: (item: ItemV1) => void;
  onRemoverItem: (id: string) => void;
}

export function Etapa5ItensFundosV1({
  ficha,
  onDefinirCarteira,
  onAdicionarItem,
  onRemoverItem,
}: Etapa5ItensFundosV1Props) {
  const [nomeItem, setNomeItem] = useState("");
  const [qtd, setQtd] = useState(1);

  const adicionar = () => {
    if (!nomeItem.trim()) return;
    onAdicionarItem({
      id: `it-${Date.now()}`,
      nome: nomeItem.trim(),
      quantidade: qtd,
    });
    setNomeItem("");
    setQtd(1);
  };

  return (
    <div className="space-y-4">
      <div>
        <h4 className="text-base font-black text-foreground">
          Fundos & Equipamento Inicial
        </h4>
        <p className="text-xs text-muted-foreground mt-0.5">
          Escolha os Fundos (F$) iniciais do seu investigador (entre 1 e 12,
          padrão 6) e liste os pertences iniciais.
        </p>
      </div>

      {/* Fundos Iniciais */}
      <div className="p-4 rounded-xl border border-amber-500/30 bg-amber-950/10 space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
            <Coins className="size-4" /> Fundos Iniciais (F$)
          </span>
          <span className="text-lg font-black text-amber-300">
            F$ {ficha.carteira.fundos}
          </span>
        </div>
        <input
          type="range"
          min="1"
          max="12"
          value={ficha.carteira.fundos}
          onChange={(e) =>
            onDefinirCarteira(Number(e.target.value), ficha.carteira.espirions)
          }
          className="w-full accent-amber-500 cursor-pointer"
        />
        <div className="flex justify-between text-[10px] text-muted-foreground font-mono">
          <span>F$ 1 (Pobre)</span>
          <span>F$ 6 (Médio)</span>
          <span>F$ 12 (Abastado)</span>
        </div>
      </div>

      {/* Adicionar Equipamentos */}
      <div className="space-y-3">
        <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground block">
          Inventário Inicial
        </label>
        <div className="flex gap-2">
          <input
            type="text"
            value={nomeItem}
            onChange={(e) => setNomeItem(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                adicionar();
              }
            }}
            placeholder="Ex: Lanterna, Caderno de anotações, Revólver..."
            className="flex-1 bg-muted/40 border border-border rounded-xl px-3 py-2 text-xs font-bold text-foreground focus:border-amber-400 outline-none"
          />
          <input
            type="number"
            min="1"
            value={qtd}
            onChange={(e) => setQtd(Math.max(1, Number(e.target.value)))}
            className="w-14 bg-muted/40 border border-border rounded-xl px-2 py-2 text-center text-xs font-bold text-foreground focus:border-amber-400 outline-none"
          />
          <button
            type="button"
            onClick={adicionar}
            disabled={!nomeItem.trim()}
            className="px-3.5 py-2 bg-amber-500 hover:bg-amber-400 disabled:opacity-40 text-black text-xs font-bold rounded-xl cursor-pointer flex items-center gap-1 transition-colors"
          >
            <Plus className="size-3.5" /> Adicionar
          </button>
        </div>

        {/* Lista de Itens */}
        <div className="space-y-1.5 max-h-36 overflow-y-auto">
          {ficha.inventario.map((it) => (
            <div
              key={it.id}
              className="flex items-center justify-between p-2 rounded-lg bg-muted/20 border border-border text-xs"
            >
              <span className="font-bold text-foreground">{it.nome}</span>
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground font-mono">
                  x{it.quantidade}
                </span>
                <button
                  type="button"
                  onClick={() => onRemoverItem(it.id)}
                  className="text-muted-foreground hover:text-red-400 p-1 cursor-pointer"
                >
                  <Trash2 className="size-3.5" />
                </button>
              </div>
            </div>
          ))}
          {ficha.inventario.length === 0 && (
            <p className="text-xs text-muted-foreground italic text-center py-2">
              Nenhum item adicionado ainda.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
