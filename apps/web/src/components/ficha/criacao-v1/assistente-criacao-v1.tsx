"use client";

import type {
  FichaCalafrioV1,
  FichaDerivadaV1,
  ItemV1,
  PalavraChaveV1,
} from "@calafrio/core";
import { Check, ChevronLeft, ChevronRight, Sparkles, X } from "lucide-react";
import { useEffect, useState, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import { Etapa1IdentidadeV1 } from "./etapa-1-identidade-v1";
import { Etapa2AtributosV1 } from "./etapa-2-atributos-v1";
import { Etapa3PalavrasChaveV1 } from "./etapa-3-palavras-chave-v1";
import { Etapa4HabilidadesV1 } from "./etapa-4-habilidades-v1";
import { Etapa5ItensFundosV1 } from "./etapa-5-itens-fundos-v1";
import { podeAvancarV1 } from "./regras-assistente-v1";

interface AssistenteCriacaoV1Props {
  aberto: boolean;
  ficha: FichaCalafrioV1;
  derivada: FichaDerivadaV1;
  onDefinirNome: (nome: string) => void;
  onDefinirJogador: (jogador: string) => void;
  onDefinirQuemSouEu: (texto: string) => void;
  onDefinirAtributo: (
    atributo: "corpo" | "mente" | "alma",
    valor: number,
  ) => void;
  onAdicionarPalavraChave: (p: PalavraChaveV1) => void;
  onRemoverPalavraChave: (id: string) => void;
  onMemorizarHabilidade: (id: string) => void;
  onEsquecerHabilidade: (id: string) => void;
  onDefinirCarteira: (fundos: number, espirions: number) => void;
  onAdicionarItem: (item: ItemV1) => void;
  onRemoverItem: (id: string) => void;
  onFechar: () => void;
  onCancelar?: () => void;
  onConcluir?: () => void;
}

const ETAPAS = [
  { id: 0, rotulo: "1. Identidade" },
  { id: 1, rotulo: "2. Atributos" },
  { id: 2, rotulo: "3. Palavras-Chave" },
  { id: 3, rotulo: "4. Habilidades" },
  { id: 4, rotulo: "5. Fundos & Itens" },
] as const;

const aoMontar = () => () => {};
const noCliente = () => true;
const noServidor = () => false;

export function AssistenteCriacaoV1({
  aberto,
  ficha,
  derivada,
  onDefinirNome,
  onDefinirJogador,
  onDefinirQuemSouEu,
  onDefinirAtributo,
  onAdicionarPalavraChave,
  onRemoverPalavraChave,
  onMemorizarHabilidade,
  onEsquecerHabilidade,
  onDefinirCarteira,
  onAdicionarItem,
  onRemoverItem,
  onFechar,
  onCancelar,
  onConcluir,
}: AssistenteCriacaoV1Props) {
  const [etapa, setEtapa] = useState<number>(0);
  const montado = useSyncExternalStore(aoMontar, noCliente, noServidor);

  useEffect(() => {
    if (!aberto) return;
    const aoTeclar = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        (onCancelar ?? onFechar)();
      }
    };
    const overflowAnterior = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", aoTeclar);
    return () => {
      document.body.style.overflow = overflowAnterior;
      window.removeEventListener("keydown", aoTeclar);
    };
  }, [aberto, onCancelar, onFechar]);

  if (!aberto || !montado) return null;

  const validacao = podeAvancarV1(etapa, ficha);

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Criação de Personagem 1ª Edição"
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-5"
    >
      <div className="bg-card border border-border rounded-2xl w-full max-w-3xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Cabeçalho do Modal */}
        <div className="p-4 border-b border-border flex items-center justify-between bg-muted/20">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <Sparkles className="size-4" />
            </span>
            <div>
              <h3 className="font-black text-sm uppercase tracking-wider text-foreground">
                Criação de Investigador • Calafrio 1e
              </h3>
              <p className="text-[11px] text-muted-foreground">
                Passo a passo para moldar sua ficha clássica
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onCancelar ?? onFechar}
            className="text-muted-foreground hover:text-foreground p-1 rounded-lg transition-colors cursor-pointer"
          >
            <X className="size-5" />
          </button>
        </div>

        {/* Stepper / Indicador de Etapas */}
        <div className="flex border-b border-border bg-muted/10 overflow-x-auto p-2 gap-1.5">
          {ETAPAS.map((et) => {
            const ativa = etapa === et.id;
            const concluida = etapa > et.id;
            return (
              <button
                key={et.id}
                type="button"
                onClick={() => {
                  if (et.id < etapa) setEtapa(et.id);
                }}
                disabled={et.id > etapa}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1.5 ${
                  ativa
                    ? "bg-amber-500 text-black shadow-xs font-black"
                    : concluida
                      ? "bg-muted text-foreground hover:bg-muted/80 cursor-pointer"
                      : "text-muted-foreground/50 opacity-60 cursor-not-allowed"
                }`}
              >
                {concluida && <Check className="size-3.5 text-emerald-400" />}
                {et.rotulo}
              </button>
            );
          })}
        </div>

        {/* Conteúdo da Etapa */}
        <div className="p-5 overflow-y-auto flex-1">
          {etapa === 0 && (
            <Etapa1IdentidadeV1
              ficha={ficha}
              onDefinirNome={onDefinirNome}
              onDefinirJogador={onDefinirJogador}
              onDefinirQuemSouEu={onDefinirQuemSouEu}
            />
          )}
          {etapa === 1 && (
            <Etapa2AtributosV1
              ficha={ficha}
              derivada={derivada}
              onDefinirAtributo={onDefinirAtributo}
            />
          )}
          {etapa === 2 && (
            <Etapa3PalavrasChaveV1
              ficha={ficha}
              derivada={derivada}
              onAdicionarPalavraChave={onAdicionarPalavraChave}
              onRemoverPalavraChave={onRemoverPalavraChave}
            />
          )}
          {etapa === 3 && (
            <Etapa4HabilidadesV1
              ficha={ficha}
              derivada={derivada}
              onMemorizarHabilidade={onMemorizarHabilidade}
              onEsquecerHabilidade={onEsquecerHabilidade}
            />
          )}
          {etapa === 4 && (
            <Etapa5ItensFundosV1
              ficha={ficha}
              onDefinirCarteira={onDefinirCarteira}
              onAdicionarItem={onAdicionarItem}
              onRemoverItem={onRemoverItem}
            />
          )}
        </div>

        {/* Rodapé com Navegação */}
        <div className="p-4 border-t border-border bg-muted/20 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-xs text-red-400">
            {!validacao.ok && validacao.motivo}
          </div>

          <div className="flex items-center gap-2 self-end">
            {etapa > 0 && (
              <button
                type="button"
                onClick={() => setEtapa((e) => e - 1)}
                className="px-3.5 py-2 rounded-xl border border-border text-xs font-bold text-muted-foreground hover:text-foreground hover:bg-muted flex items-center gap-1 cursor-pointer transition-colors"
              >
                <ChevronLeft className="size-4" /> Voltar
              </button>
            )}

            {etapa < 4 ? (
              <button
                type="button"
                onClick={() => setEtapa((e) => e + 1)}
                disabled={!validacao.ok}
                className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 disabled:opacity-40 text-black text-xs font-bold flex items-center gap-1 cursor-pointer transition-colors shadow-xs"
              >
                Avançar <ChevronRight className="size-4" />
              </button>
            ) : (
              <button
                type="button"
                onClick={onConcluir}
                disabled={!validacao.ok}
                className="px-5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 disabled:opacity-40 text-black text-xs font-black flex items-center gap-1.5 cursor-pointer transition-colors shadow-xs"
              >
                <Check className="size-4" /> Concluir Criação
              </button>
            )}
          </div>
        </div>
      </div>
    </div>,
    document.body,
  );
}
