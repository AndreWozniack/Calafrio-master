"use client";

import type { FichaCalafrioV1, FichaDerivadaV1 } from "@calafrio/core";
import { Minus, Plus, Shield, Sparkles, Zap } from "lucide-react";
import { pontosLivresV1 } from "./regras-assistente-v1";

interface Etapa2AtributosV1Props {
  ficha: FichaCalafrioV1;
  derivada: FichaDerivadaV1;
  onDefinirAtributo: (
    atributo: "corpo" | "mente" | "alma",
    valor: number,
  ) => void;
}

export function Etapa2AtributosV1({
  ficha,
  derivada,
  onDefinirAtributo,
}: Etapa2AtributosV1Props) {
  const livres = pontosLivresV1(ficha);

  const mudar = (attr: "corpo" | "mente" | "alma", delta: number) => {
    const atual = ficha.atributos[attr];
    const novo = Math.max(1, atual + delta);
    onDefinirAtributo(attr, novo);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h4 className="text-base font-black text-foreground">
            Tríade de Atributos (Corpo, Mente, Alma)
          </h4>
          <p className="text-xs text-muted-foreground mt-0.5">
            Distribua os pontos da criação. Todos os atributos iniciam em no
            mínimo 1.
          </p>
        </div>
        <div
          className={`px-3 py-1 rounded-xl text-xs font-black border ${
            livres === 0
              ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
              : livres > 0
                ? "bg-amber-500/10 text-amber-400 border-amber-500/20"
                : "bg-red-500/10 text-red-400 border-red-500/20"
          }`}
        >
          {livres === 0
            ? "Pontos distribuídos!"
            : livres > 0
              ? `${livres} ponto(s) livres`
              : `${Math.abs(livres)} ponto(s) excedidos`}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {/* Corpo */}
        <div className="p-4 rounded-xl border border-border bg-muted/20 flex flex-col justify-between space-y-3">
          <div>
            <div className="flex items-center justify-between">
              <span className="font-black text-sm text-foreground">Corpo</span>
              <Shield className="size-4 text-amber-400" />
            </div>
            <p className="text-[11px] text-muted-foreground mt-1 leading-snug">
              Força e resistência física.
            </p>
          </div>
          <div className="flex items-center justify-between pt-2 border-t border-border/40">
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => mudar("corpo", -1)}
                disabled={ficha.atributos.corpo <= 1}
                className="size-7 rounded-lg border border-border bg-background flex items-center justify-center text-foreground hover:bg-muted disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
              >
                <Minus className="size-3.5" />
              </button>
              <span className="w-8 text-center font-black text-lg text-foreground">
                {ficha.atributos.corpo}
              </span>
              <button
                type="button"
                onClick={() => mudar("corpo", 1)}
                disabled={livres <= 0}
                className="size-7 rounded-lg border border-border bg-background flex items-center justify-center text-foreground hover:bg-muted disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
              >
                <Plus className="size-3.5" />
              </button>
            </div>
            <span className="text-xs font-bold text-amber-400">
              PD: {derivada.pd}
            </span>
          </div>
        </div>

        {/* Mente */}
        <div className="p-4 rounded-xl border border-border bg-muted/20 flex flex-col justify-between space-y-3">
          <div>
            <div className="flex items-center justify-between">
              <span className="font-black text-sm text-foreground">Mente</span>
              <Sparkles className="size-4 text-purple-400" />
            </div>
            <p className="text-[11px] text-muted-foreground mt-1 leading-snug">
              Intelecto e memória paranormal.
            </p>
          </div>
          <div className="flex items-center justify-between pt-2 border-t border-border/40">
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => mudar("mente", -1)}
                disabled={ficha.atributos.mente <= 1}
                className="size-7 rounded-lg border border-border bg-background flex items-center justify-center text-foreground hover:bg-muted disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
              >
                <Minus className="size-3.5" />
              </button>
              <span className="w-8 text-center font-black text-lg text-foreground">
                {ficha.atributos.mente}
              </span>
              <button
                type="button"
                onClick={() => mudar("mente", 1)}
                disabled={livres <= 0}
                className="size-7 rounded-lg border border-border bg-background flex items-center justify-center text-foreground hover:bg-muted disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
              >
                <Plus className="size-3.5" />
              </button>
            </div>
            <span className="text-xs font-bold text-purple-400">
              PM: {derivada.pmMax}
            </span>
          </div>
        </div>

        {/* Alma */}
        <div className="p-4 rounded-xl border border-border bg-muted/20 flex flex-col justify-between space-y-3">
          <div>
            <div className="flex items-center justify-between">
              <span className="font-black text-sm text-foreground">Alma</span>
              <Zap className="size-4 text-cyan-400" />
            </div>
            <p className="text-[11px] text-muted-foreground mt-1 leading-snug">
              Conexão paranormal e energia (PA).
            </p>
          </div>
          <div className="flex items-center justify-between pt-2 border-t border-border/40">
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => mudar("alma", -1)}
                disabled={ficha.atributos.alma <= 1}
                className="size-7 rounded-lg border border-border bg-background flex items-center justify-center text-foreground hover:bg-muted disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
              >
                <Minus className="size-3.5" />
              </button>
              <span className="w-8 text-center font-black text-lg text-foreground">
                {ficha.atributos.alma}
              </span>
              <button
                type="button"
                onClick={() => mudar("alma", 1)}
                disabled={livres <= 0}
                className="size-7 rounded-lg border border-border bg-background flex items-center justify-center text-foreground hover:bg-muted disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
              >
                <Plus className="size-3.5" />
              </button>
            </div>
            <span className="text-xs font-bold text-cyan-400">
              PA: {derivada.paMax}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
