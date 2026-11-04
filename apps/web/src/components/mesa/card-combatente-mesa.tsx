"use client";

import React from "react";

export interface CombatenteMesa {
  id: string;
  nome: string;
  tipo: "jogador" | "ameaca" | "lacaio";
  apt: number;
  pd: number;
  pvMax: number;
  pvAtual: number;
  paMax: number;
  paAtual: number;
  velocidade: number;
  acoesPadrao: number; // max 2
  acaoLivre: number; // max 1
  reflexo: number; // max 1
  quedas: number;
}

interface CardCombatenteMesaProps {
  combatente: CombatenteMesa;
  ehVezDeste: boolean;
  onGastarAcaoPadrao: (id: string) => void;
  onGastarAcaoLivre: (id: string) => void;
  onGastarReflexo: (id: string) => void;
}

export function CardCombatenteMesa({
  combatente: c,
  ehVezDeste,
  onGastarAcaoPadrao,
  onGastarAcaoLivre,
  onGastarReflexo,
}: CardCombatenteMesaProps) {
  const inconsciente = c.pvAtual === 0;

  return (
    <div
      className={`p-4 rounded-md border-2 flex flex-col justify-between space-y-3 transition-all ${
        ehVezDeste
          ? "border-amber-400 bg-amber-950/20 shadow-lg scale-[1.01]"
          : "border-border bg-card"
      }`}
    >
      <div>
        <div className="flex items-center justify-between mb-1">
          <span
            className={`text-[10px] font-black uppercase px-2 py-0.5 rounded ${
              c.tipo === "jogador"
                ? "bg-blue-500/20 text-blue-300 border border-blue-500/40"
                : "bg-red-500/20 text-red-300 border border-red-500/40"
            }`}
          >
            {c.tipo}
          </span>
          {ehVezDeste && (
            <span className="text-[10px] font-black px-2 py-0.5 rounded bg-amber-400 text-black animate-pulse">
              TURNO ATUAL
            </span>
          )}
        </div>

        <div className="font-black text-base text-foreground">{c.nome}</div>
        <div className="text-xs text-muted-foreground">
          APT {c.apt} · PD {c.pd} (Piso de defesa) · {c.velocidade}m VEL
        </div>

        {/* Vitais */}
        <div className="grid grid-cols-2 gap-2 mt-3 text-xs text-center font-bold">
          <div className="p-2 rounded bg-red-950/30 border border-red-800/40">
            <span className="text-red-300 block text-[10px] uppercase">Vida (PV)</span>
            <span className="text-lg font-black text-red-400">
              {c.pvAtual} / {c.pvMax}
            </span>
          </div>
          <div className="p-2 rounded bg-cyan-950/30 border border-cyan-800/40">
            <span className="text-cyan-300 block text-[10px] uppercase">ÂNIMUM (PA)</span>
            <span className="text-lg font-black text-cyan-400">
              {c.paAtual} / {c.paMax}
            </span>
          </div>
        </div>

        {/* Rastreador de Ações do Turno */}
        <div className="mt-3 pt-2 border-t border-border/60 space-y-1.5 text-xs">
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground font-semibold">Ações Padrão (2):</span>
            <div className="flex gap-1">
              {[1, 2].map((num) => (
                <button
                  key={num}
                  type="button"
                  onClick={() => onGastarAcaoPadrao(c.id)}
                  className={`size-6 rounded text-xs font-bold cursor-pointer ${
                    c.acoesPadrao >= num
                      ? "bg-amber-400 text-black"
                      : "bg-muted text-muted-foreground/40"
                  }`}
                  title="Gastar ação padrão"
                >
                  {num}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-muted-foreground font-semibold">Ação Livre (1):</span>
            <button
              type="button"
              onClick={() => onGastarAcaoLivre(c.id)}
              className={`px-2 py-0.5 rounded text-xs font-bold cursor-pointer ${
                c.acaoLivre > 0
                  ? "bg-green-400 text-black"
                  : "bg-muted text-muted-foreground/40"
              }`}
            >
              {c.acaoLivre > 0 ? "Disponível" : "Usada"}
            </button>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-muted-foreground font-semibold">Reflexo (1/rodada):</span>
            <button
              type="button"
              onClick={() => onGastarReflexo(c.id)}
              className={`px-2 py-0.5 rounded text-xs font-bold cursor-pointer ${
                c.reflexo > 0
                  ? "bg-purple-400 text-black"
                  : "bg-muted text-muted-foreground/40"
              }`}
            >
              {c.reflexo > 0 ? "Disponível" : "Gasto"}
            </button>
          </div>
        </div>

        {inconsciente && (
          <div className="mt-2 p-2 bg-red-950/80 border border-red-500 rounded text-center text-xs font-black text-red-200 animate-pulse">
            ⚠️ 0 PV: INCONSCIENTE! Morre em {Math.max(1, Math.floor(60 / 2 ** c.quedas))}s
          </div>
        )}
      </div>
    </div>
  );
}
