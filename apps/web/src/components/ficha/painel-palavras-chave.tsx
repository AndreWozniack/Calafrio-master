"use client";

import type {
  FichaCalafrio,
  FichaDerivadaCalafrio,
  PalavraChaveNaFicha,
} from "@calafrio/core";
import { Dices, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { ModalPalavraChave } from "./modal-palavra-chave";

interface PainelPalavrasChaveProps {
  ficha: FichaCalafrio;
  derivada: FichaDerivadaCalafrio;
  onAdicionar: (palavra: PalavraChaveNaFicha) => void;
  onRemover: (id: string) => void;
  onRolarTeste: (nomePalavra: string) => void;
}

export function PainelPalavrasChave({
  ficha,
  derivada,
  onAdicionar,
  onRemover,
  onRolarTeste,
}: PainelPalavrasChaveProps) {
  const [modalAberto, setModalAberto] = useState(false);

  return (
    <div className="calafrio-card p-4 space-y-3">
      <div className="flex items-center justify-between border-b border-border pb-2">
        <div className="flex items-center gap-2">
          <span className="calafrio-tag">PALAVRAS-CHAVE:</span>
          <span className="text-xs text-muted-foreground font-semibold">
            {derivada.palavrasChaveOcupadas} / {derivada.limitePalavrasChave} (2
            + APT)
          </span>
        </div>
      </div>

      <div className="space-y-2">
        {derivada.palavrasChaveAtivas.map((pc) => (
          <div
            key={pc.id}
            className={`flex items-center justify-between p-2 rounded border text-xs sm:text-sm ${
              pc.semConsumirLimite
                ? "border-amber-500/40 bg-amber-500/10 text-accent-ink"
                : "border-border bg-card/60"
            }`}
          >
            <div className="flex items-center gap-2 flex-1 min-w-0">
              <span className="text-[10px] font-black uppercase px-1.5 py-0.5 rounded bg-black/60 text-muted-foreground">
                {pc.categoria}
              </span>
              <span className="font-bold truncate text-foreground">
                {pc.nome}
              </span>
              {pc.concedidaPor && (
                <span className="text-[10px] text-accent-ink font-semibold truncate">
                  (concedida por {pc.concedidaPor})
                </span>
              )}
            </div>

            <div className="flex items-center gap-1.5 shrink-0">
              <button
                type="button"
                onClick={() => onRolarTeste(pc.nome)}
                className="flex items-center gap-1 px-2 py-1 bg-amber-400 hover:bg-amber-300 text-black text-xs font-bold rounded cursor-pointer transition-colors"
                title="Rolar d20 + APT com esta palavra-chave"
              >
                <Dices className="size-3.5" />
                <span className="hidden sm:inline">Rolar</span>
              </button>

              {!pc.semConsumirLimite && (
                <button
                  type="button"
                  onClick={() => onRemover(pc.id)}
                  className="p-1 text-muted-foreground hover:text-red-400 cursor-pointer"
                  title="Remover palavra-chave"
                >
                  <Trash2 className="size-3.5" />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="pt-2 border-t border-border/60">
        <button
          type="button"
          onClick={() => setModalAberto(true)}
          className="flex items-center gap-1 bg-foreground text-background font-bold text-xs px-3 py-1.5 rounded hover:opacity-90 cursor-pointer"
        >
          <Plus className="size-3.5" /> Nova palavra-chave
        </button>
      </div>
      <ModalPalavraChave
        aberto={modalAberto}
        onSalvar={onAdicionar}
        onFechar={() => setModalAberto(false)}
      />
    </div>
  );
}
