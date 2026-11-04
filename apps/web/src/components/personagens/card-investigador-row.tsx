"use client";

import type { FichaCalafrio } from "@calafrio/core";
import { BookOpen, Copy, Trash2, User } from "lucide-react";
import React from "react";

interface CardInvestigadorRowProps {
  personagem: FichaCalafrio;
  onAbrir: (id: string) => void;
  onDuplicar: (id: string) => void;
  onExcluir: (id: string) => void;
}

export function CardInvestigadorRow({
  personagem: p,
  onAbrir,
  onDuplicar,
  onExcluir,
}: CardInvestigadorRowProps) {
  const apt = p.aptBase || 1;
  const pvMax = 3 + 3 * apt;
  const paMax = 3 + 3 * apt;
  const pd = 3 * apt;

  const ocupacao =
    p.palavrasChave.find((pc) => pc.categoria === "ocupacao")?.nome ??
    "Player";

  return (
    <div className="p-4 rounded-xl border border-border/80 bg-card/70 hover:bg-card hover:border-amber-400/40 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm">
      <div className="space-y-1.5 flex-1 min-w-[200px]">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="font-black text-base text-foreground flex items-center gap-1.5">
            <User className="size-4 text-accent-ink" /> {p.nome}
          </span>
          <span className="text-xs font-bold uppercase tracking-wide px-2 py-0.5 rounded-md bg-amber-500/15 text-accent-ink border border-amber-500/30">
            {ocupacao}
          </span>
          {p.jogador && (
            <span className="text-xs text-muted-foreground">
              · Jogador:{" "}
              <span className="text-foreground/80 font-medium">
                {p.jogador}
              </span>
            </span>
          )}
        </div>

        {/* Vitais destacados em badges */}
        <div className="flex items-center gap-2 pt-1">
          <span className="h-6 px-2 rounded-md flex items-center justify-center text-xs font-black bg-muted text-foreground border border-border">
            APT {apt}
          </span>
          <span className="h-6 px-2.5 rounded-md flex items-center justify-center text-xs font-black bg-red-950/40 text-red-400 border border-red-800/50">
            PV {pvMax}
          </span>
          <span className="h-6 px-2.5 rounded-md flex items-center justify-center text-xs font-black bg-info/10 text-info border border-info/40">
            PA {paMax}
          </span>
          <span className="h-6 px-2 rounded-md flex items-center justify-center text-xs font-black bg-muted/60 text-muted-foreground border border-border">
            PD {pd}
          </span>
          <span className="text-xs text-muted-foreground ml-1">
            · {p.carteira.fundos} F$ · {p.matrizHabilidades.length} hab.
          </span>
        </div>
      </div>

      {/* Ações da Ficha */}
      <div className="flex items-center gap-2 w-full sm:w-auto justify-end pt-2 sm:pt-0 border-t sm:border-t-0 border-border/40">
        <button
          type="button"
          onClick={() => onDuplicar(p.id)}
          className="p-2 rounded-lg border border-border hover:bg-muted text-muted-foreground hover:text-foreground cursor-pointer transition-colors"
          title="Duplicar Player"
        >
          <Copy className="size-4" />
        </button>

        <button
          type="button"
          onClick={() => {
            if (
              confirm(
                `Excluir a ficha de "${p.nome}"? Essa ação não pode ser desfeita.`,
              )
            ) {
              onExcluir(p.id);
            }
          }}
          className="p-2 rounded-lg border border-border hover:bg-red-950/40 text-muted-foreground hover:text-red-400 cursor-pointer transition-colors"
          title="Excluir Player"
        >
          <Trash2 className="size-4" />
        </button>

        <button
          type="button"
          onClick={() => onAbrir(p.id)}
          className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-amber-400 hover:bg-amber-300 text-black font-black text-xs cursor-pointer shadow-sm transition-all"
        >
          <BookOpen className="size-3.5" /> Abrir Ficha
        </button>
      </div>
    </div>
  );
}
