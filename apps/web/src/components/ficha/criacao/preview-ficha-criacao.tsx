"use client";

import type { FichaCalafrio, FichaDerivadaCalafrio } from "@calafrio/core";
import { Coins, Heart, Shield, Sparkles, User, Zap } from "lucide-react";

interface PreviewFichaCriacaoProps {
  ficha: FichaCalafrio;
  derivada: FichaDerivadaCalafrio;
}

export function PreviewFichaCriacao({
  ficha,
  derivada,
}: PreviewFichaCriacaoProps) {
  const ocupacao =
    ficha.palavrasChave.find((pc) => pc.categoria === "ocupacao")?.nome ??
    "Sem ocupação";

  return (
    <div className="w-full lg:w-80 shrink-0 min-h-0 border-b lg:border-b-0 lg:border-r border-border bg-card/60 p-4 space-y-4 overflow-y-auto max-h-[30vh] lg:max-h-none font-sans">
      <div>
        <span className="calafrio-tag-sm">PREVIEW DO PLAYER</span>
        <h3 className="text-lg font-black text-foreground mt-1 truncate">
          {ficha.nome.trim() ? ficha.nome : "Nome do Player"}
        </h3>
        <p className="text-xs sm:text-sm text-foreground/75 truncate mt-0.5">
          {ocupacao} ·{" "}
          {ficha.jogador
            ? `Jogador: ${ficha.jogador}`
            : "Jogador não informado"}
        </p>
      </div>

      {/* Bloco de Atributos e Vitais */}
      <div className="grid grid-cols-2 gap-2 text-xs">
        <div className="p-2.5 rounded-lg bg-card border-2 border-border text-center shadow-xs">
          <span className="block text-xs text-foreground/70 font-bold uppercase tracking-wider">
            Aptidão (APT)
          </span>
          <span className="text-xl font-black text-foreground mt-0.5 block">
            {derivada.apt}
          </span>
        </div>
        <div className="p-2.5 rounded-lg bg-amber-500/10 border-2 border-amber-500/40 dark:border-amber-500/50 text-center shadow-xs">
          <span className="block text-xs text-amber-800 dark:text-amber-300 font-bold uppercase tracking-wider">
            Defesa (PD)
          </span>
          <span className="text-xl font-black text-amber-900 dark:text-amber-400 mt-0.5 block">
            {derivada.pd}
          </span>
        </div>
        <div className="p-2.5 rounded-lg bg-red-500/10 border-2 border-red-500/40 dark:border-red-500/50 text-center shadow-xs">
          <span className="block text-xs text-red-800 dark:text-red-300 font-bold uppercase tracking-wider">
            Vida (PV)
          </span>
          <span className="text-xl font-black text-red-700 dark:text-red-400 mt-0.5 block">
            {derivada.pvMax}
          </span>
        </div>
        <div className="p-2.5 rounded-lg bg-sky-500/10 border-2 border-sky-500/40 dark:border-cyan-500/50 text-center shadow-xs">
          <span className="block text-xs text-sky-800 dark:text-cyan-300 font-bold uppercase tracking-wider">
            Ânimum (PA)
          </span>
          <span className="text-xl font-black text-sky-700 dark:text-cyan-400 mt-0.5 block">
            {derivada.paMax}
          </span>
        </div>
      </div>

      {/* Palavras-chave */}
      <div className="space-y-1.5 text-xs">
        <div className="flex items-center justify-between text-foreground font-bold">
          <span>Palavras-chave:</span>
          <span className="text-foreground/80 font-black">
            {ficha.palavrasChave.length} / {derivada.limitePalavrasChave}
          </span>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {ficha.palavrasChave.map((pc) => (
            <span
              key={pc.id}
              className="text-xs px-2.5 py-1 rounded-md bg-muted text-foreground border border-border font-bold"
            >
              {pc.nome}
            </span>
          ))}
          {ficha.palavrasChave.length === 0 && (
            <span className="text-foreground/60 italic text-xs">
              Nenhuma palavra adicionada.
            </span>
          )}
        </div>
      </div>

      {/* Matriz 3x3 Mini */}
      <div className="space-y-1.5 text-xs">
        <div className="flex items-center justify-between text-foreground font-bold">
          <span>Matriz de Habilidades:</span>
          <span className="text-foreground/80 font-black">
            {ficha.matrizHabilidades.length} / 9
          </span>
        </div>
        <div className="grid grid-cols-3 gap-1.5 bg-muted/30 p-2 rounded-lg border-2 border-border">
          {Array.from({ length: 9 }).map((_, slot) => {
            const aloc = ficha.matrizHabilidades.find((m) => m.slot === slot);
            return (
              <div
                key={slot}
                className={`h-8 rounded-md text-xs font-bold flex items-center justify-center border transition-all ${
                  aloc
                    ? "bg-amber-400 text-neutral-950 border-amber-500 font-black shadow-xs"
                    : "bg-card text-foreground/50 border-border"
                }`}
              >
                #{slot + 1}
              </div>
            );
          })}
        </div>
      </div>

      {/* Carteira e Inventário */}
      <div className="pt-2.5 border-t border-border text-xs space-y-1.5">
        <div className="flex items-center justify-between">
          <span className="text-foreground font-bold flex items-center gap-1.5">
            <Coins className="size-3.5 text-amber-600 dark:text-amber-400" /> Carteira:
          </span>
          <span className="font-black text-amber-800 dark:text-amber-300 text-sm">
            {ficha.carteira.fundos} F$
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-foreground font-bold">Inventário:</span>
          <span className="font-bold text-foreground">{ficha.inventario.length} item(ns)</span>
        </div>
      </div>
    </div>
  );
}
