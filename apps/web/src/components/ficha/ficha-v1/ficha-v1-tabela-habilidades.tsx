"use client";

import {
  esquecerHabilidadeV1,
  type FichaCalafrioV1,
  type FichaDerivadaV1,
  obterHabilidade1e,
} from "@calafrio/core";
import { HelpCircle, Lock, Plus, Sparkles, Trash2 } from "lucide-react";
import { useState } from "react";
import { FichaV1SeletorHabilidade } from "./ficha-v1-seletor-habilidade";
import {
  type LinhaHabilidadeV1Visual,
  linhasHabilidadesV1,
} from "./modelo-visual-v1";

interface FichaV1TabelaHabilidadesProps {
  ficha: FichaCalafrioV1;
  derivada: FichaDerivadaV1;
  memorizarHabilidade: (id: string) => void;
  esquecerHabilidade: (id: string) => void;
  aprimorarHabilidade: (id: string, descricao: string) => void;
  removerAprimoramentoHabilidade: (id: string, aprimoramentoId: string) => void;
  definirPmExtra: (id: string, pmExtra: number) => void;
}

export function FichaV1TabelaHabilidades({
  ficha,
  derivada,
  memorizarHabilidade,
  esquecerHabilidade,
  aprimorarHabilidade,
  removerAprimoramentoHabilidade,
  definirPmExtra,
}: FichaV1TabelaHabilidadesProps) {
  const [modalAberto, setModalAberto] = useState(false);
  const linhas = linhasHabilidadesV1(ficha, derivada);

  const tentarEsquecer = (linha: LinhaHabilidadeV1Visual) => {
    const apos = esquecerHabilidadeV1(ficha, linha.id);
    const perdidas = ficha.habilidades.length - apos.habilidades.length;
    if (perdidas > 1) {
      const confirma = confirm(
        `Esquecer "${linha.nome}" fará você esquecer ${perdidas - 1} outra(s) habilidade(s) que dependem dela. Deseja continuar?`,
      );
      if (!confirma) return;
    }
    esquecerHabilidade(linha.id);
  };

  return (
    <div className="calafrio-card p-5 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-black uppercase tracking-wider text-foreground flex items-center gap-2">
            <Sparkles className="size-4 text-purple-400" /> Habilidades
            Paranormais
          </h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            Grau 0 é automático. Graus I a III consomem PM e exigem requisitos.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setModalAberto(true)}
          className="text-xs font-bold text-amber-400 hover:text-amber-300 flex items-center gap-1 cursor-pointer bg-amber-500/10 hover:bg-amber-500/20 px-3 py-1.5 rounded-lg border border-amber-500/30 transition-colors"
        >
          <Plus className="size-3.5" /> Memorizar Nova Habilidade
        </button>
      </div>

      <div className="space-y-3">
        {linhas.map((linha) => {
          const catalogo = obterHabilidade1e(linha.id);
          const permitePmExtra = catalogo?.permitePmExtra;

          return (
            <div
              key={linha.id}
              className={`p-4 rounded-xl border text-xs space-y-2.5 transition-colors ${
                linha.automatica
                  ? "border-purple-500/30 bg-purple-950/10"
                  : linha.invalida
                    ? "border-red-500/40 bg-red-950/20"
                    : "border-border bg-muted/20"
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span
                      className={`font-mono font-black px-1.5 py-0.5 rounded text-[10px] ${
                        linha.automatica
                          ? "bg-purple-500/20 text-purple-300 border border-purple-500/30"
                          : "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                      }`}
                    >
                      Grau {linha.grauRomano}
                    </span>
                    <span className="font-bold text-sm text-foreground">
                      {linha.nome}
                    </span>
                    <span className="text-[10px] uppercase font-bold text-muted-foreground px-1.5 py-0.5 rounded bg-muted">
                      {linha.arvore}
                    </span>
                    <span className="text-muted-foreground font-mono text-[11px]">
                      {linha.custoTexto}
                    </span>
                    {!linha.automatica && (
                      <span className="text-purple-300 font-mono font-bold text-[11px]">
                        • {linha.custoPM} PM
                      </span>
                    )}
                    {linha.marcadores.includes("cadeado") && (
                      <span
                        className="text-amber-400 flex items-center gap-0.5"
                        title="Efeito contínuo"
                      >
                        <Lock className="size-3" />
                      </span>
                    )}
                    {linha.marcadores.includes("interrogacao") && (
                      <span
                        className="text-purple-400 flex items-center gap-0.5"
                        title="Efeito variável"
                      >
                        <HelpCircle className="size-3" />
                      </span>
                    )}
                  </div>
                  <p className="text-muted-foreground mt-1.5 leading-relaxed">
                    {linha.descricao}
                  </p>
                </div>

                {!linha.automatica && (
                  <button
                    type="button"
                    onClick={() => tentarEsquecer(linha)}
                    title="Esquecer habilidade"
                    className="text-muted-foreground hover:text-red-400 p-1 cursor-pointer shrink-0"
                  >
                    <Trash2 className="size-4" />
                  </button>
                )}
              </div>

              {/* Controles de PM Extra e Aprimoramento */}
              {!linha.automatica && (
                <div className="pt-2 border-t border-border/40 flex flex-wrap items-center justify-between gap-3 text-xs">
                  {/* Losangos de Aprimoramento */}
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-bold uppercase text-muted-foreground">
                      Aprimorar:
                    </span>
                    {[0, 1].map((idx) => {
                      const aprim = linha.aprimoramentos[idx];
                      const tem = !!aprim;
                      return (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => {
                            if (!tem) {
                              const desc = prompt(
                                "Descrição do aprimoramento (custa 1 EP):",
                              );
                              if (desc)
                                aprimorarHabilidade(linha.id, desc.trim());
                            } else {
                              const remove = confirm(
                                `Remover aprimoramento "${aprim.descricao}"?`,
                              );
                              if (remove)
                                removerAprimoramentoHabilidade(
                                  linha.id,
                                  aprim.id,
                                );
                            }
                          }}
                          className={`size-4 rotate-45 border transition-colors cursor-pointer ${
                            tem
                              ? "bg-amber-400 border-amber-400"
                              : "border-border hover:border-amber-400/50 bg-background"
                          }`}
                          title={
                            tem
                              ? `${aprim.descricao} (clique para remover)`
                              : "Clique para aprimorar (+1 EP)"
                          }
                        />
                      );
                    })}
                    {linha.aprimoramentos.length > 0 && (
                      <span className="text-[11px] text-amber-300 font-mono ml-1">
                        {linha.aprimoramentos
                          .map((a) => a.descricao)
                          .join(" • ")}
                      </span>
                    )}
                  </div>

                  {/* PM Extra se permitido */}
                  {permitePmExtra && (
                    <div className="flex items-center gap-1.5">
                      <span className="text-[11px] font-bold text-muted-foreground">
                        PM Extra:
                      </span>
                      <input
                        type="number"
                        min="0"
                        step="3"
                        value={linha.pmExtra ?? 0}
                        onChange={(e) =>
                          definirPmExtra(
                            linha.id,
                            Math.max(0, Number(e.target.value)),
                          )
                        }
                        className="w-14 bg-background border border-border rounded px-2 py-0.5 text-center font-bold text-purple-300"
                      />
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}

        {linhas.length === 0 && (
          <p className="text-xs text-muted-foreground italic text-center py-4">
            Nenhuma habilidade memorizada.
          </p>
        )}
      </div>

      {modalAberto && (
        <FichaV1SeletorHabilidade
          ficha={ficha}
          aoMemorizar={(id) => memorizarHabilidade(id)}
          aoFechar={() => setModalAberto(false)}
        />
      )}
    </div>
  );
}
