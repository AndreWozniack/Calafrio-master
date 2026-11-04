"use client";

import {
  type CriaturaCalafrio,
  carregarCatalogoCalafrio,
  type FichaCalafrio,
  montarFichaCalafrio,
} from "@calafrio/core";
import { lerCriaturasSalvas, lerPersonagensSalvos } from "@calafrio/ficha-app";
import { Plus, RotateCw, Timer, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import {
  CardCombatenteMesa,
  type CombatenteMesa,
} from "./card-combatente-mesa";
import { PainelDanoELogMesa } from "./painel-dano-e-log-mesa";

const CHAVE_MESA = "calafrio:mesa:v1";

function combatenteDePersonagem(
  ficha: FichaCalafrio,
  catalogo: ReturnType<typeof carregarCatalogoCalafrio>,
): CombatenteMesa {
  const d = montarFichaCalafrio(ficha, catalogo);
  return {
    id: `pj-${ficha.id}`,
    nome: ficha.nome || "Sem nome",
    tipo: "jogador",
    apt: d.apt,
    pd: d.pd,
    pvMax: d.pvMax,
    pvAtual: d.pvMax,
    paMax: d.paMax,
    paAtual: d.paMax,
    velocidade: d.velocidade,
    acoesPadrao: 2,
    acaoLivre: 1,
    reflexo: 1,
    quedas: 0,
  };
}

function combatenteDeCriatura(
  c: CriaturaCalafrio,
  existentes: CombatenteMesa[],
): CombatenteMesa {
  const copias = existentes.filter((e) => e.id.startsWith(`cr-${c.id}-`));
  return {
    id: `cr-${c.id}-${Date.now()}-${copias.length}`,
    nome: copias.length ? `${c.nome} #${copias.length + 1}` : c.nome,
    tipo:
      c.categoria === "lacaio" || c.categoria === "familiar"
        ? "lacaio"
        : "ameaca",
    apt: c.apt,
    pd: c.pd,
    pvMax: c.pvMax,
    pvAtual: c.pvAtual ?? c.pvMax,
    paMax: c.paMax,
    paAtual: c.paAtual ?? c.paMax,
    velocidade: c.velocidade,
    acoesPadrao: 2,
    acaoLivre: 1,
    reflexo: 1,
    quedas: 0,
  };
}

export function VisaoMesaCombate() {
  const catalogo = useMemo(() => carregarCatalogoCalafrio(), []);
  const [rodada, setRodada] = useState(1);
  const [segundosCombate, setSegundosCombate] = useState(6);
  const [turnoIndice, setTurnoIndice] = useState(0);
  const [combatentes, setCombatentes] = useState<CombatenteMesa[]>([]);
  const [logCombate, setLogCombate] = useState<string[]>([]);
  const [personagens, setPersonagens] = useState<FichaCalafrio[]>([]);
  const [criaturas, setCriaturas] = useState<CriaturaCalafrio[]>([]);
  const [carregado, setCarregado] = useState(false);

  useEffect(() => {
    setPersonagens(lerPersonagensSalvos());
    setCriaturas(lerCriaturasSalvas());
    try {
      const bruto = localStorage.getItem(CHAVE_MESA);
      if (bruto) {
        const m = JSON.parse(bruto);
        setRodada(m.rodada ?? 1);
        setSegundosCombate(m.segundosCombate ?? 6);
        setTurnoIndice(m.turnoIndice ?? 0);
        setCombatentes(m.combatentes ?? []);
        setLogCombate(m.logCombate ?? []);
      }
    } catch {}
    setCarregado(true);
  }, []);

  useEffect(() => {
    if (!carregado) return;
    try {
      localStorage.setItem(
        CHAVE_MESA,
        JSON.stringify({
          rodada,
          segundosCombate,
          turnoIndice,
          combatentes,
          logCombate,
        }),
      );
    } catch {}
  }, [
    carregado,
    rodada,
    segundosCombate,
    turnoIndice,
    combatentes,
    logCombate,
  ]);

  const adicionarPersonagem = (ficha: FichaCalafrio) => {
    if (combatentes.some((c) => c.id === `pj-${ficha.id}`)) return;
    const novo = combatenteDePersonagem(ficha, catalogo);
    setCombatentes((prev) => [...prev, novo]);
    setLogCombate((l) => [`➕ ${novo.nome} entrou na mesa.`, ...l]);
  };

  const adicionarCriatura = (c: CriaturaCalafrio) => {
    const novo = combatenteDeCriatura(c, combatentes);
    setCombatentes((prev) => [...prev, novo]);
    setLogCombate((l) => [`➕ ${novo.nome} entrou na mesa.`, ...l]);
  };

  const removerCombatente = (id: string) => {
    const idx = combatentes.findIndex((c) => c.id === id);
    if (idx < 0) return;
    setCombatentes((prev) => prev.filter((c) => c.id !== id));
    if (idx < turnoIndice) setTurnoIndice((t) => t - 1);
  };

  const reiniciarCombate = () => {
    setRodada(1);
    setSegundosCombate(6);
    setTurnoIndice(0);
    setCombatentes([]);
    setLogCombate([]);
  };

  const combatenteDoTurno =
    combatentes.length > 0
      ? combatentes[turnoIndice % combatentes.length]
      : undefined;

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

  const lidarAplicarDano = (
    alvoId: string,
    danoQtd: number,
    paMitigar: number,
  ) => {
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
            <span className="text-xs text-accent-ink font-bold flex items-center gap-1">
              <Timer className="size-3.5" /> Rodada {rodada} ({segundosCombate}
              s)
            </span>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Turnos sequenciais no sentido horário. 2 Ações Padrão + 1 Ação Livre
            por turno; 1 Reflexo por rodada.
          </p>
        </div>

        <button
          type="button"
          onClick={avancarTurno}
          disabled={combatentes.length === 0}
          className="flex items-center gap-2 px-5 py-2.5 bg-amber-400 hover:bg-amber-300 text-black font-black text-sm rounded cursor-pointer shadow-md transition-all disabled:opacity-40"
        >
          <RotateCw className="size-4" /> Próximo Turno (Sentido Horário)
        </button>
      </div>

      <div className="calafrio-card p-4 space-y-3">
        <div className="flex items-center justify-between">
          <span className="calafrio-tag-sm">PARTICIPANTES</span>
          {combatentes.length > 0 && (
            <button
              type="button"
              onClick={reiniciarCombate}
              className="text-[11px] font-bold text-muted-foreground hover:text-foreground cursor-pointer"
            >
              Encerrar combate
            </button>
          )}
        </div>
        <div className="grid md:grid-cols-2 gap-4 text-xs">
          <div className="space-y-1.5">
            <div className="font-bold uppercase text-[10px] text-muted-foreground">
              Players ({personagens.length})
            </div>
            {personagens.length === 0 && (
              <p className="text-muted-foreground">
                Nenhum player criado. Crie em “Players”.
              </p>
            )}
            <div className="flex flex-wrap gap-1.5">
              {personagens.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  disabled={combatentes.some((c) => c.id === `pj-${p.id}`)}
                  onClick={() => adicionarPersonagem(p)}
                  className="flex items-center gap-1 px-2 py-1 border border-border rounded font-bold hover:bg-muted disabled:opacity-40 cursor-pointer"
                >
                  <Plus className="size-3" /> {p.nome || "Sem nome"}
                </button>
              ))}
            </div>
          </div>
          <div className="space-y-1.5">
            <div className="font-bold uppercase text-[10px] text-muted-foreground">
              Bestiário ({criaturas.length})
            </div>
            {criaturas.length === 0 && (
              <p className="text-muted-foreground">
                Nenhuma criatura. Crie em “Bestiário”.
              </p>
            )}
            <div className="flex flex-wrap gap-1.5">
              {criaturas.map((c) => (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => adicionarCriatura(c)}
                  className="flex items-center gap-1 px-2 py-1 border border-border rounded font-bold hover:bg-muted cursor-pointer"
                >
                  <Plus className="size-3" /> {c.nome}
                </button>
              ))}
            </div>
          </div>
        </div>
        {combatentes.length > 0 && (
          <div className="flex flex-wrap gap-1.5 pt-2 border-t border-border/40">
            {combatentes.map((c) => (
              <span
                key={c.id}
                className="inline-flex items-center gap-1 px-2 py-0.5 bg-muted rounded text-[11px] font-bold"
              >
                {c.nome}
                <button
                  type="button"
                  aria-label={`Remover ${c.nome}`}
                  onClick={() => removerCombatente(c.id)}
                  className="cursor-pointer text-muted-foreground hover:text-foreground"
                >
                  <X className="size-3" />
                </button>
              </span>
            ))}
          </div>
        )}
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
