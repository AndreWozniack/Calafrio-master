"use client";

import { BookOpen, Trash2, User } from "lucide-react";
import Link from "next/link";
import type { PlayerCalafrio } from "@/services/armazenamento-calafrio";
import { resumirPlayer } from "@/services/ficha-edicao";

interface PlayerRowProps {
  player: PlayerCalafrio;
  mesaId: string;
  podeGerenciar: boolean;
  onExcluir: (mesaId: string, playerId: string) => Promise<void>;
}

export function PlayerRow({
  player: p,
  mesaId,
  podeGerenciar,
  onExcluir,
}: PlayerRowProps) {
  const { ocupacao, totalHabilidades } = resumirPlayer(p.ficha);

  return (
    <div className="calafrio-card p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
      <div className="space-y-1.5 flex-1 min-w-[200px]">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="font-black text-base text-foreground flex items-center gap-1.5">
            <User className="size-4 text-accent-ink" /> {p.nome}
          </span>
          <span className="text-xs font-bold uppercase tracking-wide px-2 py-0.5 rounded-md bg-amber-500/15 text-amber-800 dark:text-amber-300 border border-amber-500/30">
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
            APT {p.aptBase}
          </span>
          <span className="h-6 px-2.5 rounded-md flex items-center justify-center text-xs font-black bg-red-50 text-red-700 border-red-200 dark:bg-red-950/40 dark:text-red-400 dark:border-red-800/50">
            PV {p.pvMax}
          </span>
          <span className="h-6 px-2.5 rounded-md flex items-center justify-center text-xs font-black bg-cyan-50 text-cyan-800 border-cyan-200 dark:bg-cyan-950/40 dark:text-cyan-400 dark:border-cyan-800/50">
            PA {p.paMax}
          </span>
          <span className="h-6 px-2 rounded-md flex items-center justify-center text-xs font-black bg-muted/60 text-muted-foreground border border-border">
            PD {p.pd}
          </span>
          <span className="text-xs text-muted-foreground ml-1">
            · {p.carteira.fundos} F$ · {totalHabilidades} hab.
          </span>
        </div>
      </div>

      {/* Ações da Ficha */}
      {podeGerenciar && (
        <div className="flex items-center gap-2 w-full sm:w-auto justify-end pt-2 sm:pt-0 border-t sm:border-t-0 border-border/40">
          <form
            action={async () => {
              if (
                confirm(`Excluir ${p.nome}? Essa ação não pode ser desfeita.`)
              ) {
                await onExcluir(mesaId, p.id);
              }
            }}
          >
            <button
              type="submit"
              className="p-2 rounded-lg border border-border hover:bg-red-50 dark:hover:bg-red-950/40 text-muted-foreground hover:text-red-600 dark:hover:text-red-400 cursor-pointer transition-colors"
              title="Excluir Player"
            >
              <Trash2 className="size-4" />
            </button>
          </form>

          <Link
            href={`/mesa/${mesaId}/players/${p.id}/ficha`}
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-amber-400 hover:bg-amber-300 text-black font-black text-xs cursor-pointer shadow-sm transition-all"
          >
            <BookOpen className="size-3.5" /> Ficha Completa
          </Link>
        </div>
      )}
    </div>
  );
}
