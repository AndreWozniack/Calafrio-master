"use client";

import React, { useState } from "react";
import type { FichaCalafrio, FichaDerivadaCalafrio, PalavraChaveNaFicha } from "@calafrio/core";
import { Plus, Trash2, Dices, Sparkles } from "lucide-react";

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
  const [nomeNovo, setNomeNovo] = useState("");
  const [categoriaNova, setCategoriaNova] = useState<"ocupacao" | "talento" | "falha" | "extra">("extra");

  const lidarAdicionar = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nomeNovo.trim()) return;
    onAdicionar({
      id: `pc-${Date.now()}`,
      nome: nomeNovo.trim(),
      categoria: categoriaNova,
      semConsumirLimite: false,
      efeitos: [],
    });
    setNomeNovo("");
  };

  return (
    <div className="calafrio-card p-4 space-y-3">
      <div className="flex items-center justify-between border-b border-border pb-2">
        <div className="flex items-center gap-2">
          <span className="calafrio-tag">PALAVRAS-CHAVE:</span>
          <span className="text-xs text-muted-foreground font-semibold">
            {derivada.palavrasChaveOcupadas} / {derivada.limitePalavrasChave} (2 + APT)
          </span>
        </div>
      </div>

      <div className="space-y-2">
        {derivada.palavrasChaveAtivas.map((pc) => (
          <div
            key={pc.id}
            className={`flex items-center justify-between p-2 rounded border text-xs sm:text-sm ${
              pc.semConsumirLimite
                ? "border-amber-500/40 bg-amber-500/10 text-amber-200"
                : "border-border bg-card/60"
            }`}
          >
            <div className="flex items-center gap-2 flex-1 min-w-0">
              <span className="text-[10px] font-black uppercase px-1.5 py-0.5 rounded bg-black/60 text-muted-foreground">
                {pc.categoria}
              </span>
              <span className="font-bold truncate text-foreground">{pc.nome}</span>
              {pc.concedidaPor && (
                <span className="text-[10px] text-amber-400 font-semibold truncate">
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

      <form onSubmit={lidarAdicionar} className="flex flex-wrap items-center gap-2 pt-2 border-t border-border/60">
        <select
          value={categoriaNova}
          onChange={(e) => setCategoriaNova(e.target.value as any)}
          className="bg-muted text-xs p-1.5 rounded border border-border"
        >
          <option value="ocupacao">Ocupação</option>
          <option value="talento">Talento</option>
          <option value="falha">Falha</option>
          <option value="extra">Extra</option>
        </select>
        <input
          type="text"
          value={nomeNovo}
          onChange={(e) => setNomeNovo(e.target.value)}
          placeholder="Nova palavra-chave..."
          className="flex-1 min-w-[140px] bg-muted/60 text-xs px-2.5 py-1.5 rounded border border-border"
        />
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
