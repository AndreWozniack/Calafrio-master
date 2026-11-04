"use client";

import React, { useState } from "react";
import { RotateCw, Timer } from "lucide-react";
import {
  CardCombatenteMesa,
  type CombatenteMesa,
} from "./card-combatente-mesa";
import { PainelDanoELogMesa } from "./painel-dano-e-log-mesa";

export function VisaoMesaCombate() {
  const [rodada, setRodada] = useState(1);
  const [segundosCombate, setSegundosCombate] = useState(6);
  const [turnoIndice, setTurnoIndice] = useState(0);

  const [combatentes, setCombatentes] = useState<CombatenteMesa[]>([
    {
      id: "p1",
      nome: "Brendo (Investigador)",
      tipo: "jogador",
      apt: 2,
      pd: 6,
      pvMax: 9,
      pvAtual: 9,
      paMax: 9,
      paAtual: 9,
      velocidade: 6,
      acoesPadrao: 2,
      acaoLivre: 1,
      reflexo: 1,
      quedas: 0,
    },
    {
      id: "p2",
      nome: "Iara (Neural)",
      tipo: "jogador",
      apt: 1,
      pd: 3,
      pvMax: 6,
      pvAtual: 6,
      paMax: 6,
      paAtual: 6,
      velocidade: 6,
      acoesPadrao: 2,
      acaoLivre: 1,
      reflexo: 1,
      quedas: 0,
    },
    {
      id: "a1",
      nome: "Criatura da Madrugada (Ameaça)",
      tipo: "ameaca",
      apt: 3,
      pd: 9,
      pvMax: 15,
      pvAtual: 15,
      paMax: 12,
      paAtual: 12,
      velocidade: 9,
      acoesPadrao: 2,
      acaoLivre: 1,
      reflexo: 1,
      quedas: 0,
    },
  ]);

  const [logCombate, setLogCombate] = useState<string[]>([
    "Combate iniciado nas esquinas nebulosas de Curitiba. Ordem em roda (sentido horário).",
  ]);

  const combatenteDoTurno = combatentes[turnoIndice % combatentes.length];

  const avancarTurno = () => {
    if (combatentes.length === 0) return;
    const proximoIndice = (turnoIndice + 1) % combatentes.length;
    setTurnoIndice(proximoIndice);

    if (proximoIndice === 0) {
      setRodada((r) => r + 1);
      setSegundosCombate((s) => s + 6);
      setCombatentes((prev) =>
        prev.map((c) => ({
          ...c,
          acoesPadrao: 2,
          acaoLivre: 1,
          reflexo: 1,
        })),
      );
      setLogCombate((l) => [
        `⏱️ Rodada ${rodada + 1} iniciada (${segundosCombate + 6}s de combate decorridos). Ações e Reflexos restaurados.`,
        ...l,
      ]);
    } else {
      setCombatentes((prev) =>
        prev.map((c, i) =>
          i === proximoIndice ? { ...c, acoesPadrao: 2, acaoLivre: 1 } : c,
        ),
      );
    }
  };

  const gastarAcaoPadrao = (id: string) => {
    setCombatentes((prev) =>
      prev.map((c) =>
        c.id === id ? { ...c, acoesPadrao: Math.max(0, c.acoesPadrao - 1) } : c,
      ),
    );
  };

  const gastarAcaoLivre = (id: string) => {
    setCombatentes((prev) =>
      prev.map((c) =>
        c.id === id ? { ...c, acaoLivre: Math.max(0, c.acaoLivre - 1) } : c,
      ),
    );
  };

  const gastarReflexo = (id: string) => {
    setCombatentes((prev) =>
      prev.map((c) =>
        c.id === id ? { ...c, reflexo: Math.max(0, c.reflexo - 1) } : c,
      ),
    );
  };

  const lidarAplicarDano = (alvoId: string, danoQtd: number, paMitigar: number) => {
    const alvo = combatentes.find((c) => c.id === alvoId);
    if (!alvo) return;

    const mitigado = Math.min(alvo.paAtual, paMitigar, danoQtd);
    const danoNoPv = Math.max(0, danoQtd - mitigado);
    const novoPv = Math.max(0, alvo.pvAtual - danoNoPv);
    const novoPa = Math.max(0, alvo.paAtual - mitigado);
    const caiu = alvo.pvAtual > 0 && novoPv === 0;

    setCombatentes((prev) =>
      prev.map((c) =>
        c.id === alvo.id
          ? {
              ...c,
              pvAtual: novoPv,
              paAtual: novoPa,
              quedas: caiu ? c.quedas + 1 : c.quedas,
            }
          : c,
      ),
    );

    let msg = `💥 ${alvo.nome} recebeu ${danoQtd} de dano`;
    if (mitigado > 0) msg += ` (mitigou ${mitigado} com PA)`;
    msg += ` ➔ PV restante: ${novoPv}/${alvo.pvMax}`;
    if (caiu) msg += ` ⚠️ CAIU INCONSCIENTE!`;

    setLogCombate((l) => [msg, ...l]);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 bg-card border border-border rounded-md shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <span className="calafrio-tag">MESA DE COMBATE EM TEMPO REAL</span>
            <span className="text-xs text-amber-400 font-bold flex items-center gap-1">
              <Timer className="size-3.5" /> Rodada {rodada} ({segundosCombate}s)
            </span>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Turnos sequenciais no sentido horário. 2 Ações Padrão + 1 Ação Livre por turno; 1 Reflexo por rodada.
          </p>
        </div>

        <button
          type="button"
          onClick={avancarTurno}
          className="flex items-center gap-2 px-5 py-2.5 bg-amber-400 hover:bg-amber-300 text-black font-black text-sm rounded cursor-pointer shadow-md transition-all"
        >
          <RotateCw className="size-4" /> Próximo Turno (Sentido Horário)
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {combatentes.map((c) => (
          <CardCombatenteMesa
            key={c.id}
            combatente={c}
            ehVezDeste={combatenteDoTurno?.id === c.id}
            onGastarAcaoPadrao={gastarAcaoPadrao}
            onGastarAcaoLivre={gastarAcaoLivre}
            onGastarReflexo={gastarReflexo}
          />
        ))}
      </div>

      <PainelDanoELogMesa
        combatentes={combatentes}
        logCombate={logCombate}
        onAplicarDano={lidarAplicarDano}
      />
    </div>
  );
}
