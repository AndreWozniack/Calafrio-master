"use client";

import React, { useState } from "react";
import type { FichaCalafrio, ItemNaFichaCalafrio } from "@calafrio/core";
import { Plus, Trash2, Shield, Swords, Sparkles } from "lucide-react";

interface PainelInventarioProps {
  ficha: FichaCalafrio;
  onAdicionarItem: (item: ItemNaFichaCalafrio) => void;
  onAlternarEquipado: (id: string) => void;
  onRemoverItem: (id: string) => void;
  onAtualizarCarteira: (fundos: number, espirions: number) => void;
}

export function PainelInventario({
  ficha,
  onAdicionarItem,
  onAlternarEquipado,
  onRemoverItem,
  onAtualizarCarteira,
}: PainelInventarioProps) {
  const [nome, setNome] = useState("");
  const [categoria, setCategoria] = useState<ItemNaFichaCalafrio["categoria"]>("arma_curto");
  const [paranormal, setParanormal] = useState(false);
  const [dano, setDano] = useState<number | undefined>(undefined);

  const lidarAdicionar = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nome.trim()) return;
    onAdicionarItem({
      id: `item-${Date.now()}`,
      nome: nome.trim(),
      categoria,
      paranormal,
      equipado: true,
      dano,
      espectroDano: paranormal ? "rubro" : "fisico",
      efeitos: [],
    });
    setNome("");
    setDano(undefined);
  };

  return (
    <div className="calafrio-card p-4 space-y-4">
      {/* Carteira */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-muted/40 rounded border border-border">
        <span className="calafrio-tag">CARTEIRA</span>
        <div className="flex items-center gap-4 text-xs font-bold">
          <label className="flex items-center gap-1.5">
            <span className="text-amber-400">F$ (Fundos):</span>
            <input
              type="number"
              min={0}
              value={ficha.carteira.fundos}
              onChange={(e) =>
                onAtualizarCarteira(Number(e.target.value), ficha.carteira.espirions)
              }
              className="w-16 bg-card text-foreground px-2 py-1 rounded border border-border text-center"
            />
          </label>
          <label className="flex items-center gap-1.5">
            <span className="text-cyan-400">E$P (Espírions):</span>
            <input
              type="number"
              min={0}
              value={ficha.carteira.espirions}
              onChange={(e) =>
                onAtualizarCarteira(ficha.carteira.fundos, Number(e.target.value))
              }
              className="w-16 bg-card text-foreground px-2 py-1 rounded border border-border text-center"
            />
          </label>
        </div>
      </div>

      {/* Lista de Itens */}
      <div className="space-y-2">
        <div className="flex items-center justify-between border-b border-border pb-1">
          <span className="calafrio-tag-sm">INVENTÁRIO</span>
          <span className="text-xs text-muted-foreground">
            {ficha.inventario.length} itens
          </span>
        </div>

        {ficha.inventario.map((item) => (
          <div
            key={item.id}
            className={`flex items-center justify-between p-2.5 rounded border text-xs ${
              item.paranormal
                ? "border-amber-500/50 bg-amber-950/20"
                : "border-border bg-card"
            }`}
          >
            <div className="flex items-center gap-2.5 flex-1 min-w-0">
              <button
                type="button"
                onClick={() => onAlternarEquipado(item.id)}
                className={`p-1 rounded cursor-pointer ${
                  item.equipado
                    ? "bg-amber-400 text-black font-bold"
                    : "bg-muted text-muted-foreground"
                }`}
                title={item.equipado ? "Equipado (clique para guardar)" : "Guardado (clique para equipar)"}
              >
                {item.equipado ? <Shield className="size-3.5" /> : <Shield className="size-3.5 opacity-40" />}
              </button>

              <div className="min-w-0">
                <div className="flex items-center gap-1.5 font-bold text-foreground">
                  {item.paranormal && (
                    <Sparkles className="size-3.5 text-amber-400 shrink-0" />
                  )}
                  <span className="truncate">{item.nome}</span>
                  {item.dano && (
                    <span className="text-[10px] text-amber-400 font-semibold shrink-0">
                      [{item.dano} dano {item.espectroDano}]
                    </span>
                  )}
                </div>
                {item.descricao && (
                  <p className="text-[11px] text-muted-foreground line-clamp-1">{item.descricao}</p>
                )}
              </div>
            </div>

            <button
              type="button"
              onClick={() => onRemoverItem(item.id)}
              className="p-1 text-muted-foreground hover:text-red-400 cursor-pointer"
            >
              <Trash2 className="size-3.5" />
            </button>
          </div>
        ))}
      </div>

      {/* Adicionar Item Rápido */}
      <form onSubmit={lidarAdicionar} className="flex flex-wrap items-center gap-2 pt-2 border-t border-border">
        <input
          type="text"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          placeholder="Nome do item/arma..."
          className="flex-1 min-w-[140px] bg-muted/60 text-xs px-2.5 py-1.5 rounded border border-border"
        />
        <select
          value={categoria}
          onChange={(e) => setCategoria(e.target.value as any)}
          className="bg-muted text-xs p-1.5 rounded border border-border"
        >
          <option value="arma_curto">Arma Curto Alcance</option>
          <option value="arma_longo">Arma Longo Alcance</option>
          <option value="arma_misto">Arma Misto</option>
          <option value="vestimenta">Vestimenta</option>
          <option value="consumivel">Consumível</option>
          <option value="ferramenta">Ferramenta</option>
          <option value="bugiganga">Bugiganga</option>
        </select>
        <label className="flex items-center gap-1 text-xs text-muted-foreground cursor-pointer">
          <input
            type="checkbox"
            checked={paranormal}
            onChange={(e) => setParanormal(e.target.checked)}
          />
          <span>Parartefato</span>
        </label>
        <button
          type="submit"
          className="flex items-center gap-1 bg-foreground text-background font-bold text-xs px-3 py-1.5 rounded hover:opacity-90 cursor-pointer"
        >
          <Plus className="size-3.5" /> Adicionar
        </button>
      </form>
    </div>
  );
}
