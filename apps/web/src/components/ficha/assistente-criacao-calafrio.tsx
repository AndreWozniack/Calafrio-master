"use client";

import type {
  CatalogoCalafrio,
  FichaCalafrio,
  FichaDerivadaCalafrio,
  ItemNaFichaCalafrio,
  PalavraChaveNaFicha,
} from "@calafrio/core";
import { Check, ChevronLeft, ChevronRight, X } from "lucide-react";
import { useEffect, useState, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import { EtapaConceitoApt } from "./criacao/etapa-conceito-apt";
import { EtapaItensEquipamentos } from "./criacao/etapa-itens-equipamentos";
import { EtapaMatrizHabilidades } from "./criacao/etapa-matriz-habilidades";
import { EtapaPalavrasChave } from "./criacao/etapa-palavras-chave";
import { PreviewFichaCriacao } from "./criacao/preview-ficha-criacao";

interface AssistenteCriacaoCalafrioProps {
  aberto: boolean;
  ficha: FichaCalafrio;
  derivada: FichaDerivadaCalafrio;
  catalogo: CatalogoCalafrio;
  onDefinirNome: (nome: string) => void;
  onDefinirJogador?: (jogador: string) => void;
  onDefinirApt: (apt: number) => void;
  onAdicionarPalavraChave: (palavra: PalavraChaveNaFicha) => void;
  onRemoverPalavraChave: (id: string) => void;
  onAlocarSlot: (
    slot: number,
    tipo: "paranormal" | "unica",
    id: string,
  ) => void;
  onLimparSlot: (slot: number) => void;
  onAtualizarCarteira: (fundos: number, espirions: number) => void;
  onAdicionarItem: (item: ItemNaFichaCalafrio) => void;
  onRemoverItem: (id: string) => void;
  onFechar: () => void;
  onCancelar?: () => void;
  onConcluir?: () => void;
}

const aoMontar = () => () => {};
const noCliente = () => true;
const noServidor = () => false;

const ETAPAS = [
  { id: 1, rotulo: "1. Identidade & APT" },
  { id: 2, rotulo: "2. Palavras-Chave" },
  { id: 3, rotulo: "3. Habilidades" },
  { id: 4, rotulo: "4. Carteira & Itens" },
] as const;

export function AssistenteCriacaoCalafrio({
  aberto,
  ficha,
  derivada,
  catalogo,
  onDefinirNome,
  onDefinirJogador,
  onDefinirApt,
  onAdicionarPalavraChave,
  onRemoverPalavraChave,
  onAlocarSlot,
  onLimparSlot,
  onAtualizarCarteira,
  onAdicionarItem,
  onRemoverItem,
  onFechar,
  onCancelar,
  onConcluir,
}: AssistenteCriacaoCalafrioProps) {
  const [etapa, setEtapa] = useState<1 | 2 | 3 | 4>(1);

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

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Criação de Player"
      onClick={onCancelar ?? onFechar}
      className="fixed inset-0 z-50 bg-black/85 flex items-center justify-center p-3 sm:p-6 backdrop-blur-sm"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-6xl h-[90vh] max-h-[920px] bg-card rounded-2xl border-2 border-amber-400/80 shadow-2xl flex flex-col overflow-hidden"
      >
        {/* Cabeçalho Superior Fixo */}
        <div className="flex items-center justify-between px-6 py-3.5 border-b border-border bg-muted/40 shrink-0">
          <div className="flex items-center gap-3">
            <span className="calafrio-tag">CRIAÇÃO DE PLAYER</span>
            <span className="text-xs text-muted-foreground font-semibold">
              Calafrio 2ª Edição
            </span>
          </div>
          <button
            type="button"
            onClick={onCancelar ?? onFechar}
            className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground font-bold cursor-pointer transition-colors"
          >
            <X className="size-4" /> Cancelar
          </button>
        </div>

        {/* Corpo Principal Dividido em 2 Colunas */}
        <div className="flex-1 min-h-0 flex flex-col lg:flex-row overflow-hidden">
          {/* Coluna Esquerda: Preview da Ficha */}
          <PreviewFichaCriacao ficha={ficha} derivada={derivada} />

          {/* Coluna Direita: Conteúdo da Etapa Atual */}
          <div className="flex-1 min-h-0 flex flex-col overflow-hidden bg-background">
            {/* Navegador de Passos (Tabs) */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-1 p-3 border-b border-border/80 bg-muted/20 shrink-0">
              {ETAPAS.map((item) => {
                const isAtivo = etapa === item.id;
                const isPassado = etapa > item.id;

                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setEtapa(item.id)}
                    className={`py-2 px-2.5 rounded-lg text-xs font-black transition-all cursor-pointer text-center truncate ${
                      isAtivo
                        ? "bg-amber-400 text-black shadow-sm"
                        : isPassado
                          ? "bg-muted text-foreground hover:bg-muted/80"
                          : "bg-transparent text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {item.rotulo}
                  </button>
                );
              })}
            </div>

            {/* Conteúdo com rolagem própria */}
            <div className="flex-1 min-h-0 overflow-y-auto p-4 sm:p-6 space-y-6">
              {etapa === 1 && (
                <EtapaConceitoApt
                  ficha={ficha}
                  derivada={derivada}
                  onDefinirNome={onDefinirNome}
                  onDefinirJogador={onDefinirJogador ?? (() => {})}
                  onDefinirApt={onDefinirApt}
                />
              )}

              {etapa === 2 && (
                <EtapaPalavrasChave
                  ficha={ficha}
                  derivada={derivada}
                  catalogo={catalogo}
                  onAdicionarPalavraChave={onAdicionarPalavraChave}
                  onRemoverPalavraChave={onRemoverPalavraChave}
                />
              )}

              {etapa === 3 && (
                <EtapaMatrizHabilidades
                  ficha={ficha}
                  derivada={derivada}
                  catalogo={catalogo}
                  onAlocarSlot={onAlocarSlot}
                  onLimparSlot={onLimparSlot}
                />
              )}

              {etapa === 4 && (
                <EtapaItensEquipamentos
                  ficha={ficha}
                  catalogo={catalogo}
                  onAtualizarCarteira={onAtualizarCarteira}
                  onAdicionarItem={onAdicionarItem}
                  onRemoverItem={onRemoverItem}
                />
              )}
            </div>

            {/* Rodapé Fixo de Navegação */}
            <div className="flex items-center justify-between px-6 py-4 border-t border-border bg-card/60 shrink-0">
              <button
                type="button"
                disabled={etapa === 1}
                onClick={() => setEtapa((prev) => Math.max(1, prev - 1) as any)}
                className="flex items-center gap-1.5 px-4 py-2 bg-muted hover:bg-border disabled:opacity-30 disabled:pointer-events-none rounded-lg font-bold text-xs cursor-pointer transition-colors"
              >
                <ChevronLeft className="size-4" /> Anterior
              </button>

              <div className="text-xs text-muted-foreground font-semibold">
                Etapa {etapa} de 4
              </div>

              {etapa < 4 ? (
                <button
                  type="button"
                  onClick={() =>
                    setEtapa((prev) => Math.min(4, prev + 1) as any)
                  }
                  className="flex items-center gap-1.5 px-5 py-2 bg-amber-400 hover:bg-amber-300 text-black font-black text-xs rounded-lg cursor-pointer transition-colors shadow-sm"
                >
                  Próximo <ChevronRight className="size-4" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={onConcluir ?? onFechar}
                  className="flex items-center gap-1.5 px-6 py-2 bg-emerald-500 hover:bg-emerald-400 text-black font-black text-xs rounded-lg cursor-pointer transition-colors shadow-md"
                >
                  <Check className="size-4" /> Concluir Criação
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>,
    document.body,
  );
}
