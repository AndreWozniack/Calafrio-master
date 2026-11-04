"use client";

import {
  type CriaturaCalafrio,
  calcularDanoContraCriatura,
  type EspectroDeDano,
} from "@calafrio/core";
import { TOKENS_ESPECTRO_DANO } from "@calafrio/tema";
import { useState } from "react";

interface FichaCriaturaAtivaProps {
  criatura: CriaturaCalafrio;
  onAtualizar: (dados: Partial<CriaturaCalafrio>) => void;
}

export function FichaCriaturaAtiva({
  criatura,
  onAtualizar,
}: FichaCriaturaAtivaProps) {
  const [danoSimulado, setDanoSimulado] = useState(5);
  const [espectroSimulado, setEspectroSimulado] =
    useState<EspectroDeDano>("rubro");

  const alternarResistencia = (espectro: EspectroDeDano) => {
    const atual = criatura.resistencias[espectro];
    let proximo: "resistente" | "vulneravel" | "imune" | undefined;
    if (!atual) proximo = "resistente";
    else if (atual === "resistente") proximo = "vulneravel";
    else if (atual === "vulneravel") proximo = "imune";
    else proximo = undefined;

    const novas = { ...criatura.resistencias };
    if (!proximo) delete novas[espectro];
    else novas[espectro] = proximo;

    onAtualizar({ resistencias: novas });
  };

  const danoFinalCalculado = calcularDanoContraCriatura(
    criatura,
    danoSimulado,
    espectroSimulado,
  );

  return (
    <div className="calafrio-card p-5 space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border pb-3">
        <div>
          <input
            type="text"
            value={criatura.nome}
            onChange={(e) => onAtualizar({ nome: e.target.value })}
            className="text-lg font-black bg-transparent border-b border-border/40 focus:border-amber-400 px-1 py-0.5"
          />
          <div className="text-xs text-muted-foreground mt-0.5">
            Categoria:{" "}
            <span className="uppercase font-bold text-amber-400">
              {criatura.categoria}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className="calafrio-tag">APT {criatura.apt}</span>
        </div>
      </div>

      {/* Estatísticas Editáveis */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
        <div className="p-3 bg-muted/40 rounded border border-border text-center">
          <span className="calafrio-tag-sm mb-1">DEFESA (PD)</span>
          <input
            type="number"
            value={criatura.pd}
            onChange={(e) => onAtualizar({ pd: Number(e.target.value) })}
            className="w-full text-center text-xl font-black bg-transparent mt-1"
          />
        </div>
        <div className="p-3 bg-muted/40 rounded border border-red-900/40 text-center">
          <span className="calafrio-tag-sm mb-1 bg-red-950 text-red-200">
            VIDA (PV)
          </span>
          <input
            type="number"
            value={criatura.pvMax}
            onChange={(e) => onAtualizar({ pvMax: Number(e.target.value) })}
            className="w-full text-center text-xl font-black text-red-400 bg-transparent mt-1"
          />
        </div>
        <div className="p-3 bg-muted/40 rounded border border-cyan-900/40 text-center">
          <span className="calafrio-tag-sm mb-1 bg-cyan-950 text-cyan-200">
            ÂNIMUM (PA)
          </span>
          <input
            type="number"
            value={criatura.paMax}
            onChange={(e) => onAtualizar({ paMax: Number(e.target.value) })}
            className="w-full text-center text-xl font-black text-cyan-400 bg-transparent mt-1"
          />
        </div>
        <div className="p-3 bg-muted/40 rounded border border-border text-center">
          <span className="calafrio-tag-sm mb-1">VELOCIDADE</span>
          <input
            type="number"
            value={criatura.velocidade}
            onChange={(e) =>
              onAtualizar({ velocidade: Number(e.target.value) })
            }
            className="w-full text-center text-xl font-black bg-transparent mt-1"
          />
        </div>
      </div>

      {/* Resistências / Vulnerabilidades / Imunidades por Espectro */}
      <div className="space-y-2">
        <span className="calafrio-tag-sm">
          RESISTÊNCIAS AOS ESPECTROS DE DANO
        </span>
        <p className="text-[11px] text-muted-foreground">
          Clique no espectro para alternar:{" "}
          <em>Neutro ➔ Resistente (metade) ➔ Vulnerável (dobro) ➔ Imune (0)</em>
          .
        </p>
        <div className="flex flex-wrap gap-2 pt-1">
          {(["fisico", "castanho", "rubro", "ceruleo", "alvo"] as const).map(
            (esp) => {
              const token = TOKENS_ESPECTRO_DANO[esp];
              const estado = criatura.resistencias[esp];
              return (
                <button
                  key={esp}
                  type="button"
                  onClick={() => alternarResistencia(esp)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-bold border cursor-pointer transition-colors ${
                    estado === "resistente"
                      ? "bg-blue-950/60 border-blue-500 text-blue-200"
                      : estado === "vulneravel"
                        ? "bg-red-950/60 border-red-500 text-red-200"
                        : estado === "imune"
                          ? "bg-amber-950/60 border-amber-400 text-amber-200"
                          : "bg-card border-border text-muted-foreground"
                  }`}
                >
                  <span>{token.emoji}</span>
                  <span>{token.rotulo}:</span>
                  <span className="uppercase text-[10px]">
                    {estado ? estado : "Neutro"}
                  </span>
                </button>
              );
            },
          )}
        </div>
      </div>

      {/* Simulador de Dano Rápido */}
      <div className="p-3 bg-muted/30 rounded border border-border space-y-2 text-xs">
        <span className="font-bold text-foreground">
          Simulador de Impacto / Dano Sofrido:
        </span>
        <div className="flex flex-wrap items-center gap-3">
          <label className="flex items-center gap-1">
            <span>Dano Bruto:</span>
            <input
              type="number"
              min={1}
              value={danoSimulado}
              onChange={(e) => setDanoSimulado(Number(e.target.value))}
              className="w-16 bg-card text-center p-1 rounded border border-border font-bold"
            />
          </label>
          <label className="flex items-center gap-1">
            <span>Espectro:</span>
            <select
              value={espectroSimulado}
              onChange={(e) => setEspectroSimulado(e.target.value as any)}
              className="bg-card p-1 rounded border border-border"
            >
              <option value="fisico">Físico</option>
              <option value="castanho">Castanho</option>
              <option value="rubro">Rubro</option>
              <option value="ceruleo">Cerúleo</option>
              <option value="alvo">Alvo</option>
            </select>
          </label>
          <span className="font-black text-amber-300">
            ➔ Dano Efetivo na Criatura: {danoFinalCalculado} PV
          </span>
        </div>
      </div>

      {/* Notas do Mestre */}
      <div>
        <label className="block text-xs font-bold text-muted-foreground mb-1">
          Notas Narrativas do Mestre:
        </label>
        <textarea
          value={criatura.notas ?? ""}
          onChange={(e) => onAtualizar({ notas: e.target.value })}
          rows={4}
          placeholder="Comportamento, táticas na neblina, vulnerabilidades narrativas..."
          className="w-full bg-muted/40 text-xs p-2 rounded border border-border"
        />
      </div>
    </div>
  );
}
