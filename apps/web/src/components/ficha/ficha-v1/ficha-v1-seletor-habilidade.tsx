"use client";

import {
  ARVORES_1E,
  type ArvoreV1,
  type FichaCalafrioV1,
  HABILIDADES_1E,
  podeMemorizarV1,
} from "@calafrio/core";
import { HelpCircle, Lock, Plus, X } from "lucide-react";
import { useState } from "react";
import { formatarCustoPA, formatarGrauRomano } from "./modelo-visual-v1";

interface FichaV1SeletorHabilidadeProps {
  ficha: FichaCalafrioV1;
  aoMemorizar: (id: string) => void;
  aoFechar: () => void;
}

const NOMES_ARVORES: Record<ArvoreV1, string> = {
  maneiras: "Maneiras",
  caoticas: "Caóticas",
  esquisitas: "Esquisitas",
  agradaveis: "Agradáveis",
  racionais: "Racionais",
};

export function FichaV1SeletorHabilidade({
  ficha,
  aoMemorizar,
  aoFechar,
}: FichaV1SeletorHabilidadeProps) {
  const [arvoreAtiva, setArvoreAtiva] = useState<ArvoreV1>("maneiras");

  const habilidadesDaArvore = HABILIDADES_1E.filter(
    (h) => h.arvore === arvoreAtiva && h.grau > 0,
  );

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-card border border-border rounded-2xl w-full max-w-2xl max-h-[85vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Topo do Modal */}
        <div className="p-4 border-b border-border flex items-center justify-between">
          <div>
            <h3 className="font-black text-sm uppercase tracking-wider text-foreground">
              Memorizar Habilidade Paranormal
            </h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              Escolha uma habilidade respeitando a árvore e o limite de PM.
            </p>
          </div>
          <button
            type="button"
            onClick={aoFechar}
            className="text-muted-foreground hover:text-foreground p-1 rounded-lg"
          >
            <X className="size-5" />
          </button>
        </div>

        {/* Abas das Árvores */}
        <div className="flex border-b border-border overflow-x-auto bg-muted/30 p-2 gap-1.5">
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
        <div className="p-4 space-y-3 overflow-y-auto flex-1">
          {habilidadesDaArvore.map((hab) => {
            const checagem = podeMemorizarV1(ficha, hab.id);
            const jaMemorizada = ficha.habilidades.some((h) => h.id === hab.id);

            return (
              <div
                key={hab.id}
                className={`p-3.5 rounded-xl border text-xs transition-all ${
                  jaMemorizada
                    ? "border-muted bg-muted/20 opacity-60"
                    : checagem.ok
                      ? "border-border hover:border-amber-400/40 bg-muted/10"
                      : "border-border/60 bg-muted/5 opacity-70"
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
                        <span
                          className="text-amber-400 flex items-center gap-0.5"
                          title="Efeito contínuo"
                        >
                          <Lock className="size-3" />
                        </span>
                      )}
                      {hab.marcadores.includes("interrogacao") && (
                        <span
                          className="text-purple-400 flex items-center gap-0.5"
                          title="Efeito variável"
                        >
                          <HelpCircle className="size-3" />
                        </span>
                      )}
                    </div>
                    <p className="text-muted-foreground mt-1.5 leading-relaxed">
                      {hab.descricao}
                    </p>
                  </div>

                  <div className="shrink-0 flex flex-col items-end gap-1.5">
                    {jaMemorizada ? (
                      <span className="text-[11px] font-bold text-emerald-400">
                        Memorizada
                      </span>
                    ) : checagem.ok ? (
                      <button
                        type="button"
                        onClick={() => {
                          aoMemorizar(hab.id);
                          aoFechar();
                        }}
                        className="px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-black font-bold rounded-lg cursor-pointer flex items-center gap-1 shadow-xs"
                      >
                        <Plus className="size-3.5" /> Memorizar
                      </button>
                    ) : (
                      <span className="text-[10px] text-red-400 text-right max-w-32 leading-tight">
                        {checagem.motivo}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
