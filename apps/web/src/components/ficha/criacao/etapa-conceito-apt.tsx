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
    <div className="space-y-6">
      <div>
        <h4 className="text-base font-black text-foreground uppercase tracking-wide">
          1. Identidade & Aptidão
        </h4>
        <p className="text-xs text-muted-foreground mt-0.5">
          Defina a identidade do seu player e o nível de Aptidão inicial.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
        <div>
          <label className="block text-foreground font-bold mb-1.5">
            Nome do Personagem
          </label>
          <input
            type="text"
            value={ficha.nome}
            onChange={(e) => onDefinirNome(e.target.value)}
            placeholder="Nome do player"
            required
            className="w-full bg-muted/60 p-2.5 rounded-lg border border-border focus:border-amber-400 outline-none font-bold text-sm"
          />
        </div>

        <div>
          <label className="block text-foreground font-bold mb-1.5">
            Nome do Jogador
          </label>
          <input
            type="text"
            value={ficha.jogador ?? ""}
            onChange={(e) => onDefinirJogador(e.target.value)}
            placeholder="Nome de quem controla este personagem"
            className="w-full bg-muted/60 p-2.5 rounded-lg border border-border focus:border-amber-400 outline-none font-bold text-sm"
          />
        </div>
      </div>

      {/* Seletor de Aptidão */}
      <div className="space-y-3 pt-2 border-t border-border/60">
        <div className="flex items-center justify-between">
          <label className="block text-foreground font-bold text-xs uppercase tracking-wide">
            Aptidão Inicial (APT)
          </label>
          <span className="text-xs text-amber-400 font-bold">
            Padrão inicial de campanha: APT 1
          </span>
        </div>

        <div className="grid grid-cols-6 gap-2">
          {[1, 2, 3, 4, 5, 6].map((num) => (
            <button
              key={num}
              type="button"
              onClick={() => onDefinirApt(num)}
              className={`py-3 rounded-lg font-black text-base cursor-pointer transition-all border ${
                ficha.aptBase === num
                  ? "bg-amber-400 text-black border-amber-500 shadow-md scale-105"
                  : "bg-muted/50 text-muted-foreground hover:text-foreground hover:bg-muted border-border"
              }`}
            >
              {num}
            </button>
          ))}
        </div>

        {/* Resumo Direto dos Valores Calculados por APT */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2">
          <div className="p-2.5 rounded-lg bg-muted/40 border border-border text-center">
            <span className="text-[10px] text-muted-foreground font-bold uppercase block">
              Defesa (PD)
            </span>
            <span className="text-lg font-black text-amber-400">
              {3 * ficha.aptBase}
            </span>
          </div>
          <div className="p-2.5 rounded-lg bg-red-950/20 border border-red-800/40 text-center">
            <span className="text-[10px] text-red-300 font-bold uppercase block">
              Vida (PV)
            </span>
            <span className="text-lg font-black text-red-400">
              {3 + 3 * ficha.aptBase}
            </span>
          </div>
          <div className="p-2.5 rounded-lg bg-cyan-950/20 border border-cyan-800/40 text-center">
            <span className="text-[10px] text-cyan-300 font-bold uppercase block">
              Ânimum (PA)
            </span>
            <span className="text-lg font-black text-cyan-400">
              {3 + 3 * ficha.aptBase}
            </span>
          </div>
          <div className="p-2.5 rounded-lg bg-muted/40 border border-border text-center">
            <span className="text-[10px] text-muted-foreground font-bold uppercase block">
              Slots de Palavras
            </span>
            <span className="text-lg font-black text-foreground">
              {2 + ficha.aptBase}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
