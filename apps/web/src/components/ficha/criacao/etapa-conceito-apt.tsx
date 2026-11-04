"use client";

import type { FichaCalafrio, FichaDerivadaCalafrio } from "@calafrio/core";

interface EtapaConceitoAptProps {
  ficha: FichaCalafrio;
  derivada: FichaDerivadaCalafrio;
  onDefinirNome: (nome: string) => void;
  onDefinirJogador: (jogador: string) => void;
  onDefinirApt: (apt: number) => void;
}

export function EtapaConceitoApt({
  ficha,
  derivada,
  onDefinirNome,
  onDefinirJogador,
  onDefinirApt,
}: EtapaConceitoAptProps) {
  return (
    <div className="space-y-6 font-sans">
      <div>
        <h4 className="text-lg font-black text-foreground uppercase tracking-wide">
          1. Identidade & Aptidão
        </h4>
        <p className="text-sm text-foreground/75 mt-1">
          Defina a identidade do seu player e o nível de Aptidão inicial.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-foreground font-bold text-sm mb-1.5">
            Nome do Personagem
          </label>
          <input
            type="text"
            value={ficha.nome}
            onChange={(e) => onDefinirNome(e.target.value)}
            placeholder="Nome do player"
            required
            className="w-full bg-card p-3 rounded-lg border-2 border-border focus:border-amber-400 outline-none font-bold text-base text-foreground shadow-xs placeholder:text-foreground/40"
          />
        </div>

        <div>
          <label className="block text-foreground font-bold text-sm mb-1.5">
            Nome do Jogador
          </label>
          <input
            type="text"
            value={ficha.jogador ?? ""}
            onChange={(e) => onDefinirJogador(e.target.value)}
            placeholder="Nome de quem controla este personagem"
            className="w-full bg-card p-3 rounded-lg border-2 border-border focus:border-amber-400 outline-none font-bold text-base text-foreground shadow-xs placeholder:text-foreground/40"
          />
        </div>
      </div>

      {/* Seletor de Aptidão */}
      <div className="space-y-3.5 pt-3 border-t border-border">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <label className="block text-foreground font-black text-sm uppercase tracking-wide">
            Aptidão Inicial (APT)
          </label>
          <span className="text-xs font-bold px-3 py-1 rounded-full bg-amber-100 text-amber-900 border border-amber-300 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-800 shadow-xs w-fit">
            Padrão inicial de campanha: APT 1
          </span>
        </div>

        <div className="grid grid-cols-6 gap-2 sm:gap-3">
          {[1, 2, 3, 4, 5, 6].map((num) => (
            <button
              key={num}
              type="button"
              onClick={() => onDefinirApt(num)}
              className={`py-3 sm:py-3.5 rounded-xl font-black text-lg sm:text-xl cursor-pointer transition-all border-2 ${
                ficha.aptBase === num
                  ? "bg-amber-400 text-neutral-950 border-amber-500 shadow-md scale-105"
                  : "bg-card text-foreground hover:text-foreground hover:bg-muted hover:border-foreground/40 border-border"
              }`}
            >
              {num}
            </button>
          ))}
        </div>

        {/* Resumo Direto dos Valores Calculados por APT */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-2">
          <div className="p-3 rounded-xl bg-amber-500/10 border-2 border-amber-500/40 dark:border-amber-500/50 text-center shadow-xs">
            <span className="text-xs text-amber-800 dark:text-amber-300 font-bold uppercase tracking-wider block mb-1">
              Defesa (PD)
            </span>
            <span className="text-2xl font-black text-amber-900 dark:text-amber-400">
              {3 * ficha.aptBase}
            </span>
          </div>
          <div className="p-3 rounded-xl bg-red-500/10 border-2 border-red-500/40 dark:border-red-500/50 text-center shadow-xs">
            <span className="text-xs text-red-800 dark:text-red-300 font-bold uppercase tracking-wider block mb-1">
              Vida (PV)
            </span>
            <span className="text-2xl font-black text-red-700 dark:text-red-400">
              {3 + 3 * ficha.aptBase}
            </span>
          </div>
          <div className="p-3 rounded-xl bg-sky-500/10 border-2 border-sky-500/40 dark:border-cyan-500/50 text-center shadow-xs">
            <span className="text-xs text-sky-800 dark:text-cyan-300 font-bold uppercase tracking-wider block mb-1">
              Ânimum (PA)
            </span>
            <span className="text-2xl font-black text-sky-700 dark:text-cyan-400">
              {3 + 3 * ficha.aptBase}
            </span>
          </div>
          <div className="p-3 rounded-xl bg-card border-2 border-border text-center shadow-xs">
            <span className="text-xs text-foreground/70 font-bold uppercase tracking-wider block mb-1">
              Slots de Palavras
            </span>
            <span className="text-2xl font-black text-foreground">
              {2 + ficha.aptBase}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
