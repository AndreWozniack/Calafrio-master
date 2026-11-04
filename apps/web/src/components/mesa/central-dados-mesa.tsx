"use client";

import { type ModoRolagemD20, rolarTesteAcao } from "@calafrio/core";
import { Dices, Trash2 } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import {
  limparRolagensAction,
  listarRolagensAction,
  registrarRolagemAction,
} from "@/app/mesa/[mesaId]/dados/actions";
import type { RolagemMesa } from "@/services/armazenamento-calafrio";
import { CardRolagemFeed } from "./card-rolagem-feed";
import { formatarTesteAcao } from "./formatar-rolagem";

const INTERVALO_ATUALIZACAO_MS = 4000;
const MODOS: ModoRolagemD20[] = ["normal", "vantagem", "desvantagem"];

export function CentralDadosMesa({
  mesaId,
  rolagensIniciais,
}: {
  mesaId: string;
  rolagensIniciais: RolagemMesa[];
}) {
  const [rolagens, setRolagens] = useState(rolagensIniciais);
  const [autor, setAutor] = useState("Mestre");
  const [acao, setAcao] = useState("Teste do Mestre");
  const [apt, setApt] = useState(2);
  const [dificuldade, setDificuldade] = useState(15);
  const [modo, setModo] = useState<ModoRolagemD20>("normal");

  const atualizar = useCallback(async () => {
    setRolagens(await listarRolagensAction(mesaId));
  }, [mesaId]);

  useEffect(() => {
    const timer = setInterval(atualizar, INTERVALO_ATUALIZACAO_MS);
    return () => clearInterval(timer);
  }, [atualizar]);

  const rolar = async () => {
    const resultado = rolarTesteAcao({
      apt,
      bonusExtra: 0,
      modo,
      dificuldade,
    });
    await registrarRolagemAction(
      formatarTesteAcao(resultado, { mesaId, autor, acao }),
    );
    await atualizar();
  };

  const limpar = async () => {
    await limparRolagensAction(mesaId);
    setRolagens([]);
  };

  return (
    <div className="grid items-start gap-6 lg:grid-cols-[19rem_minmax(0,1fr)]">
      <section className="calafrio-card space-y-3 p-4 text-xs">
        <span className="calafrio-tag-sm">ROLADOR RÁPIDO</span>
        <label className="block space-y-1">
          <span className="font-semibold text-muted-foreground">Quem rola</span>
          <input
            value={autor}
            onChange={(e) => setAutor(e.target.value)}
            className="w-full rounded border border-border bg-card p-1.5"
          />
        </label>
        <label className="block space-y-1">
          <span className="font-semibold text-muted-foreground">Ação</span>
          <input
            value={acao}
            onChange={(e) => setAcao(e.target.value)}
            className="w-full rounded border border-border bg-card p-1.5"
          />
        </label>
        <div className="grid grid-cols-2 gap-2">
          <label className="block space-y-1">
            <span className="font-semibold text-muted-foreground">APT</span>
            <input
              type="number"
              min={0}
              max={6}
              value={apt}
              onChange={(e) => setApt(Number(e.target.value))}
              className="w-full rounded border border-border bg-card p-1.5"
            />
          </label>
          <label className="block space-y-1">
            <span className="font-semibold text-muted-foreground">
              Dificuldade
            </span>
            <input
              type="number"
              min={1}
              value={dificuldade}
              onChange={(e) => setDificuldade(Number(e.target.value))}
              className="w-full rounded border border-border bg-card p-1.5"
            />
          </label>
        </div>
        <div className="flex gap-1">
          {MODOS.map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => setModo(m)}
              className={`flex-1 cursor-pointer rounded px-2 py-1 capitalize ${
                modo === m
                  ? "bg-amber-400 font-bold text-black"
                  : "bg-muted text-muted-foreground"
              }`}
            >
              {m}
            </button>
          ))}
        </div>
        <button
          type="button"
          onClick={rolar}
          className="flex w-full cursor-pointer items-center justify-center gap-2 rounded bg-amber-400 py-2.5 text-sm font-black text-black transition-colors hover:bg-amber-300"
        >
          <Dices className="size-4" /> Lançar d20
        </button>
      </section>

      <section className="space-y-3">
        <div className="flex items-center justify-between border-b border-border pb-2">
          <h2 className="text-lg font-black">
            Feed de Rolagens ({rolagens.length})
          </h2>
          {rolagens.length > 0 && (
            <button
              type="button"
              onClick={limpar}
              className="flex cursor-pointer items-center gap-1 text-xs font-bold text-muted-foreground hover:text-red-400"
            >
              <Trash2 className="size-3.5" /> Limpar
            </button>
          )}
        </div>
        <ul className="space-y-2">
          {rolagens.map((r) => (
            <CardRolagemFeed key={r.id} rolagem={r} />
          ))}
        </ul>
        {rolagens.length === 0 && (
          <p className="rounded-xl border-2 border-dashed border-border py-10 text-center text-xs text-muted-foreground">
            Nenhuma rolagem ainda. As rolagens dos players aparecem aqui.
          </p>
        )}
      </section>
    </div>
  );
}
