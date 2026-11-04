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
    <div className="w-full lg:w-80 shrink-0 border-b lg:border-b-0 lg:border-r border-border bg-card/60 p-4 space-y-4 overflow-y-auto max-h-[30vh] lg:max-h-none">
      <div>
        <span className="calafrio-tag-sm">PREVIEW DO INVESTIGADOR</span>
        <h3 className="text-base font-black text-foreground mt-1 truncate">
          {ficha.nome.trim() ? ficha.nome : "Nome do Investigador"}
        </h3>
        <p className="text-xs text-muted-foreground truncate">
          {ocupacao} ·{" "}
          {ficha.jogador
            ? `Jogador: ${ficha.jogador}`
            : "Jogador não informado"}
        </p>
      </div>

      {/* Bloco de Atributos e Vitais */}
      <div className="grid grid-cols-2 gap-2 text-xs">
        <div className="p-2 rounded bg-muted/60 border border-border text-center">
          <span className="block text-[10px] text-muted-foreground font-bold uppercase">
            Aptidão (APT)
          </span>
          <span className="text-base font-black text-foreground">
            {derivada.apt}
          </span>
        </div>
        <div className="p-2 rounded bg-muted/60 border border-border text-center">
          <span className="block text-[10px] text-muted-foreground font-bold uppercase">
            Defesa (PD)
          </span>
          <span className="text-base font-black text-amber-400">
            {derivada.pd}
          </span>
        </div>
        <div className="p-2 rounded bg-red-950/30 border border-red-800/40 text-center">
          <span className="block text-[10px] text-red-300 font-bold uppercase">
            Vida (PV)
          </span>
          <span className="text-base font-black text-red-400">
            {derivada.pvMax}
          </span>
        </div>
        <div className="p-2 rounded bg-cyan-950/30 border border-cyan-800/40 text-center">
          <span className="block text-[10px] text-cyan-300 font-bold uppercase">
            Ânimum (PA)
          </span>
          <span className="text-base font-black text-cyan-400">
            {derivada.paMax}
          </span>
        </div>
      </div>

      {/* Palavras-chave */}
      <div className="space-y-1.5 text-xs">
        <div className="flex items-center justify-between text-muted-foreground font-bold">
          <span>Palavras-chave:</span>
          <span>
            {ficha.palavrasChave.length} / {derivada.limitePalavrasChave}
          </span>
        </div>
        <div className="flex flex-wrap gap-1">
          {ficha.palavrasChave.map((pc) => (
            <span
              key={pc.id}
              className="text-[11px] px-2 py-0.5 rounded bg-muted text-foreground border border-border font-medium"
            >
              {pc.nome}
            </span>
          ))}
          {ficha.palavrasChave.length === 0 && (
            <span className="text-muted-foreground/60 italic text-[11px]">
              Nenhuma palavra adicionada.
            </span>
          )}
        </div>
      </div>

      {/* Matriz 3x3 Mini */}
      <div className="space-y-1.5 text-xs">
        <div className="flex items-center justify-between text-muted-foreground font-bold">
          <span>Matriz de Habilidades:</span>
          <span>{ficha.matrizHabilidades.length} / 9</span>
        </div>
        <div className="grid grid-cols-3 gap-1 bg-muted/30 p-1.5 rounded border border-border">
          {Array.from({ length: 9 }).map((_, slot) => {
            const aloc = ficha.matrizHabilidades.find((m) => m.slot === slot);
            return (
              <div
                key={slot}
                className={`h-7 rounded text-[10px] font-bold flex items-center justify-center border ${
                  aloc
                    ? "bg-amber-400 text-black border-amber-500"
                    : "bg-muted/40 text-muted-foreground/40 border-border/40"
                }`}
              >
                #{slot + 1}
              </div>
            );
          })}
        </div>
      </div>

      {/* Carteira e Inventário */}
      <div className="pt-2 border-t border-border/60 text-xs space-y-1">
        <div className="flex items-center justify-between">
          <span className="text-muted-foreground font-bold flex items-center gap-1">
            <Coins className="size-3 text-amber-400" /> Carteira:
          </span>
          <span className="font-black text-amber-300">
            {ficha.carteira.fundos} F$
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-muted-foreground font-bold">Inventário:</span>
          <span>{ficha.inventario.length} item(ns)</span>
        </div>
      </div>
    </div>
  );
}
