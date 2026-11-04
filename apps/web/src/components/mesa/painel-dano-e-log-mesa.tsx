"use client";

import React, { useState } from "react";
import type { CombatenteMesa } from "./card-combatente-mesa";

interface PainelDanoELogMesaProps {
  combatentes: CombatenteMesa[];
  logCombate: string[];
  onAplicarDano: (alvoId: string, danoQtd: number, paMitigar: number) => void;
}

export function PainelDanoELogMesa({
  combatentes,
  logCombate,
  onAplicarDano,
}: PainelDanoELogMesaProps) {
  const [alvoId, setAlvoId] = useState<string>("");
  const [danoQtd, setDanoQtd] = useState(3);
  const [paMitigar, setPaMitigar] = useState(0);

  const lidarAplicarDano = (e: React.FormEvent) => {
    e.preventDefault();
    if (!alvoId) return;
    onAplicarDano(alvoId, danoQtd, paMitigar);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <form onSubmit={lidarAplicarDano} className="calafrio-card p-4 space-y-3">
        <span className="calafrio-tag">APLICAR IMPACTO / DANO</span>
        <div className="space-y-2 text-xs">
          <div>
            <label className="block text-muted-foreground mb-1">Combatente Alvo:</label>
            <select
              value={alvoId}
              onChange={(e) => setAlvoId(e.target.value)}
              className="w-full bg-muted p-2 rounded border border-border"
            >
              <option value="">Selecione o alvo...</option>
              {combatentes.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.nome} ({c.pvAtual} PV)
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-muted-foreground mb-1">Dano Sofrido:</label>
              <input
                type="number"
                min={1}
                value={danoQtd}
                onChange={(e) => setDanoQtd(Number(e.target.value))}
                className="w-full bg-muted p-2 rounded border border-border font-bold text-center"
              />
            </div>
            <div>
              <label className="block text-muted-foreground mb-1">Mitigar com PA (1:1):</label>
              <input
                type="number"
                min={0}
                value={paMitigar}
                onChange={(e) => setPaMitigar(Number(e.target.value))}
                className="w-full bg-muted p-2 rounded border border-border font-bold text-center text-cyan-400"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={!alvoId}
            className="w-full py-2.5 bg-red-600 hover:bg-red-500 disabled:opacity-40 text-white font-black rounded cursor-pointer transition-colors"
          >
            Aplicar Dano no Alvo
          </button>
        </div>
      </form>

      {/* Log de Eventos da Mesa */}
      <div className="calafrio-card p-4 space-y-2">
        <span className="calafrio-tag-sm">REGISTRO DA MESA</span>
        <div className="max-h-52 overflow-y-auto space-y-1.5 text-xs text-muted-foreground font-mono pr-1">
          {logCombate.map((log, i) => (
            <div key={i} className="py-1 border-b border-border/30">
              {log}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
