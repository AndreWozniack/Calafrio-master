"use client";

import type { FichaCalafrio, FichaDerivadaCalafrio } from "@calafrio/core";
import { Minus, Plus } from "lucide-react";

interface Props {
  ficha: FichaCalafrio;
  derivada: FichaDerivadaCalafrio;
  onDefinirApt: (apt: number) => void;
  onDefinirPvAtual: (valor: number) => void;
  onDefinirPaAtual: (valor: number) => void;
  onDefinirPvTemporario: (valor: number) => void;
  onDefinirPaTemporario: (valor: number) => void;
}

const botao =
  "px-1.5 h-7 min-w-7 text-[11px] font-bold rounded border border-border hover:bg-muted cursor-pointer";

interface GrupoProps {
  titulo: string;
  classeTag?: string;
  atual: number;
  max: number;
  temporario: number;
  onAtual: (v: number) => void;
  onTemporario: (v: number) => void;
}

function GrupoVital({
  titulo,
  classeTag = "",
  atual,
  max,
  temporario,
  onAtual,
  onTemporario,
}: GrupoProps) {
  return (
    <div className="p-3 bg-card border border-border rounded space-y-2">
      <span className={`calafrio-tag-sm ${classeTag}`}>{titulo}</span>
      <div className="flex items-center justify-center gap-1">
        <button
          type="button"
          className={botao}
          onClick={() => onAtual(atual - 5)}
        >
          -5
        </button>
        <button
          type="button"
          className={botao}
          onClick={() => onAtual(atual - 1)}
          aria-label={`Diminuir ${titulo}`}
        >
          <Minus className="size-3" />
        </button>
        <input
          type="number"
          value={atual}
          onChange={(e) => onAtual(Number(e.target.value))}
          aria-label={`${titulo} atual`}
          className="w-14 text-center text-xl font-black bg-muted/40 rounded border border-border"
        />
        <button
          type="button"
          className={botao}
          onClick={() => onAtual(atual + 1)}
          aria-label={`Aumentar ${titulo}`}
        >
          <Plus className="size-3" />
        </button>
        <button
          type="button"
          className={botao}
          onClick={() => onAtual(atual + 5)}
        >
          +5
        </button>
      </div>
      <div className="flex items-center justify-between text-[10px] text-muted-foreground">
        <span>máx {max}</span>
        <button
          type="button"
          className="underline cursor-pointer"
          onClick={() => onAtual(max + temporario)}
        >
          restaurar tudo
        </button>
        <label className="flex items-center gap-1">
          temp
          <input
            type="number"
            min={0}
            value={temporario}
            onChange={(e) => onTemporario(Number(e.target.value))}
            aria-label={`${titulo} temporário`}
            className="w-10 text-center bg-muted/40 rounded border border-border"
          />
        </label>
      </div>
    </div>
  );
}

export function PainelVitaisEditaveis({
  ficha,
  derivada,
  onDefinirApt,
  onDefinirPvAtual,
  onDefinirPaAtual,
  onDefinirPvTemporario,
  onDefinirPaTemporario,
}: Props) {
  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center justify-between p-3 bg-muted/40 rounded border border-border">
        <div className="flex items-center gap-2">
          <span className="calafrio-tag">APTIDÃO (APT):</span>
          <span className="text-xs text-muted-foreground">
            {ficha.aptBase > 6
              ? "acima do padrão do livro (1–6) — decisão do MdJ"
              : "nível do personagem (1–6 no livro; livre até 20)"}
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => onDefinirApt(ficha.aptBase - 1)}
            className={botao}
            aria-label="Diminuir APT"
          >
            <Minus className="size-3" />
          </button>
          <input
            type="number"
            min={1}
            max={20}
            value={ficha.aptBase}
            onChange={(e) => onDefinirApt(Number(e.target.value))}
            aria-label="APT"
            className="w-14 text-center text-2xl font-black text-accent-ink bg-muted/40 rounded border border-border"
          />
          <button
            type="button"
            onClick={() => onDefinirApt(ficha.aptBase + 1)}
            className={botao}
            aria-label="Subir de nível (APT)"
          >
            <Plus className="size-3" /> Subir nível
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
        <GrupoVital
          titulo="VIDA (PV)"
          atual={derivada.pvAtual}
          max={derivada.pvMax}
          temporario={ficha.vitais?.pvTemporario ?? 0}
          onAtual={onDefinirPvAtual}
          onTemporario={onDefinirPvTemporario}
        />
        <GrupoVital
          titulo="ÂNIMUM (PA)"
          atual={derivada.paAtual}
          max={derivada.paMax}
          temporario={ficha.vitais?.paTemporario ?? 0}
          onAtual={onDefinirPaAtual}
          onTemporario={onDefinirPaTemporario}
        />
        <div className="p-3 bg-card border border-border rounded text-center">
          <span className="calafrio-tag-sm">DEFESA (PD)</span>
          <div className="text-2xl font-black mt-1">{derivada.pd}</div>
        </div>
        <div className="p-3 bg-card border border-border rounded text-center">
          <span className="calafrio-tag-sm">VELOCIDADE</span>
          <div className="text-2xl font-black mt-1">{derivada.velocidade}m</div>
        </div>
      </div>
    </div>
  );
}
