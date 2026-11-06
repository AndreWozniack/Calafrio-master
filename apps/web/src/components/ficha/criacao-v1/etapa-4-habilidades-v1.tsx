"use client";

import {
  ARVORES_1E,
  type ArvoreV1,
  type FichaCalafrioV1,
  type FichaDerivadaV1,
} from "@calafrio/core";
import { HelpCircle, Lock, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import {
  formatarCustoPA,
  formatarGrauRomano,
} from "../ficha-v1/modelo-visual-v1";
import { opcoesHabilidadesV1 } from "./regras-assistente-v1";

interface Etapa4HabilidadesV1Props {
  ficha: FichaCalafrioV1;
  derivada: FichaDerivadaV1;
  onMemorizarHabilidade: (id: string) => void;
  onEsquecerHabilidade: (id: string) => void;
}

const NOMES_ARVORES: Record<ArvoreV1, string> = {
  maneiras: "Maneiras",
  caoticas: "Caóticas",
  esquisitas: "Esquisitas",
  agradaveis: "Agradáveis",
  racionais: "Racionais",
};

export function Etapa4HabilidadesV1({
  ficha,
  derivada,
  onMemorizarHabilidade,
  onEsquecerHabilidade,
}: Etapa4HabilidadesV1Props) {
  const [arvoreAtiva, setArvoreAtiva] = useState<ArvoreV1>("maneiras");
  const opcoesPorArvore = opcoesHabilidadesV1(ficha);
  const opcoesAtuais = opcoesPorArvore[arvoreAtiva] ?? [];

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h4 className="text-base font-black text-foreground">
            Habilidades Paranormais
          </h4>
          <p className="text-xs text-muted-foreground mt-0.5">
            Gaste seus Pontos de Memória (PM) derivados de Mente. Grau 0 é
            automático!
          </p>
        </div>
        <div className="flex items-center gap-3 bg-muted/30 px-3 py-1.5 rounded-xl border border-border text-xs">
          <span className="font-bold text-muted-foreground">
            PM: {derivada.pmGasto} / {derivada.pmMax}
          </span>
          <span
            className={`font-black ${
              derivada.pmRestante < 0 ? "text-red-400" : "text-purple-400"
            }`}
          >
            ({derivada.pmRestante} restantes)
          </span>
        </div>
      </div>

      {/* Abas das Árvores */}
      <div className="flex border-b border-border overflow-x-auto bg-muted/20 p-1.5 gap-1.5 rounded-xl">
        {ARVORES_1E.map((arv) => (
          <button
            key={arv}
            type="button"
            onClick={() => setArvoreAtiva(arv)}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer whitespace-nowrap ${
              arvoreAtiva === arv
                ? "bg-amber-500 text-black shadow-xs"
                : "text-muted-foreground hover:text-foreground hover:bg-muted"
            }`}
          >
            {NOMES_ARVORES[arv]}
          </button>
        ))}
      </div>

      {/* Lista de Habilidades */}
      <div className="space-y-2.5 max-h-64 overflow-y-auto pr-1">
        {opcoesAtuais.map((hab) => {
          const jaMemorizada = ficha.habilidades.some((h) => h.id === hab.id);

          return (
            <div
              key={hab.id}
              className={`p-3 rounded-xl border text-xs transition-colors ${
                jaMemorizada
                  ? "border-amber-500/40 bg-amber-950/20"
                  : hab.disponivel
                    ? "border-border bg-muted/20 hover:border-amber-400/30"
                    : "border-border/40 bg-muted/5 opacity-60"
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-mono font-black text-amber-400 px-1.5 py-0.5 rounded bg-amber-500/10 border border-amber-500/20 text-[10px]">
                      Grau {formatarGrauRomano(hab.grau)}
                    </span>
                    <span className="font-bold text-sm text-foreground">
                      {hab.nome}
                    </span>
                    <span className="text-muted-foreground font-mono text-[11px]">
                      {formatarCustoPA(hab.custoPA)}
                    </span>
                    {hab.marcadores.includes("cadeado") && (
                      <span className="text-amber-400" title="Efeito contínuo">
                        <Lock className="size-3" />
                      </span>
                    )}
                    {hab.marcadores.includes("interrogacao") && (
                      <span className="text-purple-400" title="Efeito variável">
                        <HelpCircle className="size-3" />
                      </span>
                    )}
                  </div>
                  <p className="text-muted-foreground mt-1 leading-relaxed">
                    {hab.descricao}
                  </p>
                </div>

                <div className="shrink-0 flex items-center">
                  {jaMemorizada ? (
                    <button
                      type="button"
                      onClick={() => onEsquecerHabilidade(hab.id)}
                      className="px-2.5 py-1 text-xs text-red-400 hover:text-red-300 hover:bg-red-950/30 rounded-lg flex items-center gap-1 cursor-pointer transition-colors"
                    >
                      <Trash2 className="size-3.5" /> Esquecer
                    </button>
                  ) : hab.disponivel ? (
                    <button
                      type="button"
                      onClick={() => onMemorizarHabilidade(hab.id)}
                      className="px-3 py-1 bg-amber-500 hover:bg-amber-400 text-black font-bold rounded-lg cursor-pointer flex items-center gap-1 shadow-xs transition-colors"
                    >
                      <Plus className="size-3.5" /> Memorizar
                    </button>
                  ) : (
                    <span className="text-[10px] text-muted-foreground max-w-28 text-right">
                      {hab.motivo}
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
