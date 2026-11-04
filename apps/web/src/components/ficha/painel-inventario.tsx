"use client";

import type { FichaCalafrio, ItemNaFichaCalafrio } from "@calafrio/core";
import { Pencil, Plus, Shield, Sparkles, Trash2 } from "lucide-react";
import { useState } from "react";
import { ModalItem } from "./modal-item";

interface PainelInventarioProps {
  ficha: FichaCalafrio;
  onAdicionarItem: (item: ItemNaFichaCalafrio) => void;
  onAlternarEquipado: (id: string) => void;
  onRemoverItem: (id: string) => void;
  onAtualizarItem?: (id: string, dados: Partial<ItemNaFichaCalafrio>) => void;
  onAtualizarCarteira: (fundos: number, espirions: number) => void;
}

export function PainelInventario({
  ficha,
  onAdicionarItem,
  onAlternarEquipado,
  onRemoverItem,
  onAtualizarItem,
  onAtualizarCarteira,
}: PainelInventarioProps) {
  const [modalAberto, setModalAberto] = useState(false);
  const [itemEmEdicao, setItemEmEdicao] = useState<ItemNaFichaCalafrio | null>(
    null,
  );

  const abrirNovo = () => {
    setItemEmEdicao(null);
    setModalAberto(true);
  };

  const abrirEdicao = (item: ItemNaFichaCalafrio) => {
    setItemEmEdicao(item);
    setModalAberto(true);
  };

  const lidarSalvar = (item: ItemNaFichaCalafrio) => {
    if (itemEmEdicao && onAtualizarItem) {
      onAtualizarItem(itemEmEdicao.id, item);
    } else {
      onAdicionarItem(item);
    }
    setModalAberto(false);
    setItemEmEdicao(null);
  };

  return (
    <div className="calafrio-card p-4 space-y-4">
      {/* Carteira */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-muted/40 rounded border border-border">
        <span className="calafrio-tag">CARTEIRA</span>
        <div className="flex items-center gap-4 text-xs font-bold">
          <label className="flex items-center gap-1.5">
            <span className="text-accent-ink">F$ (Fundos):</span>
            <input
              type="number"
              min={0}
              value={ficha.carteira.fundos}
              onChange={(e) =>
                onAtualizarCarteira(
                  Number(e.target.value),
                  ficha.carteira.espirions,
                )
              }
              className="w-16 bg-card text-foreground px-2 py-1 rounded border border-border text-center"
            />
          </label>
          <label className="flex items-center gap-1.5">
            <span className="text-info">E$P (Espírions):</span>
            <input
              type="number"
              min={0}
              value={ficha.carteira.espirions}
              onChange={(e) =>
                onAtualizarCarteira(
                  ficha.carteira.fundos,
                  Number(e.target.value),
                )
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
                ? "border-amber-500/50 bg-accent/20"
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
                title={
                  item.equipado
                    ? "Equipado (clique para guardar)"
                    : "Guardado (clique para equipar)"
                }
              >
                {item.equipado ? (
                  <Shield className="size-3.5" />
                ) : (
                  <Shield className="size-3.5 opacity-40" />
                )}
              </button>

              <div
                className="min-w-0 flex-1 cursor-pointer"
                onClick={() => abrirEdicao(item)}
                title="Clique para editar este item"
              >
                <div className="flex items-center gap-1.5 font-bold text-foreground">
                  {item.paranormal && (
                    <Sparkles className="size-3.5 text-accent-ink shrink-0" />
                  )}
                  <span className="truncate hover:underline">{item.nome}</span>
                  {item.dano && (
                    <span className="text-[10px] text-accent-ink font-semibold shrink-0">
                      [{item.dano} dano {item.espectroDano}]
                    </span>
                  )}
                  {item.usosMax !== undefined && (
                    <span className="text-[10px] text-muted-foreground shrink-0">
                      ({item.usosAtuais ?? item.usosMax}/{item.usosMax} usos)
                    </span>
                  )}
                </div>
                {item.descricao && (
                  <p className="text-[11px] text-muted-foreground line-clamp-1">
                    {item.descricao}
                  </p>
                )}
              </div>
            </div>

            <div className="flex items-center gap-1 shrink-0">
              <button
                type="button"
                onClick={() => abrirEdicao(item)}
                className="p-1 text-muted-foreground hover:text-foreground cursor-pointer"
                title="Editar item"
              >
                <Pencil className="size-3.5" />
              </button>
              <button
                type="button"
                onClick={() => onRemoverItem(item.id)}
                className="p-1 text-muted-foreground hover:text-red-400 cursor-pointer"
                title="Remover item"
              >
                <Trash2 className="size-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="pt-2 border-t border-border">
        <button
          type="button"
          onClick={abrirNovo}
          className="flex items-center gap-1 bg-foreground text-background font-bold text-xs px-3 py-1.5 rounded hover:opacity-90 cursor-pointer"
        >
          <Plus className="size-3.5" /> Novo item
        </button>
      </div>
      <ModalItem
        aberto={modalAberto}
        inicial={itemEmEdicao ?? undefined}
        onSalvar={lidarSalvar}
        onFechar={() => {
          setModalAberto(false);
          setItemEmEdicao(null);
        }}
      />
    </div>
  );
}
