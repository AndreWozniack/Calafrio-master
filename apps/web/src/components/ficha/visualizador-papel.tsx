"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import type { FichaViva, ModoVisualizacao, PaginaFicha } from "./fichas-tipos";
import { PaginaEcosAprimoramentos } from "./pagina-ecos-aprimoramentos";
import { PaginaFrenteFicha } from "./pagina-frente-ficha";
import { PaginaVersoMatriz } from "./pagina-verso-matriz";

interface VisualizadorPapelProps {
  f: FichaViva;
  modo: ModoVisualizacao;
  pagina: PaginaFicha;
  onMudarPagina: (pagina: PaginaFicha) => void;
  onAbrirRolagem: (nome?: string) => void;
}

const LIMITE_SWIPE_PX = 60;

function digitando(alvo: EventTarget | null) {
  return (
    alvo instanceof HTMLElement &&
    ["INPUT", "TEXTAREA", "SELECT"].includes(alvo.tagName)
  );
}

function SetaVirar({
  sentido,
  rotulo,
  onClick,
  visibilidade,
}: {
  sentido: "esquerda" | "direita";
  rotulo: string;
  onClick: () => void;
  visibilidade: string;
}) {
  const Icone = sentido === "direita" ? ChevronRight : ChevronLeft;
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={rotulo}
      title={rotulo}
      className={`group absolute top-1/2 -translate-y-1/2 z-30 flex size-12 sm:size-14 cursor-pointer items-center justify-center rounded-full border-2 border-black bg-[#fbfbf9]/95 text-black shadow-[2px_3px_0px_#000] backdrop-blur transition-all duration-300 ease-out hover:scale-110 hover:shadow-[3px_5px_0px_#000] active:scale-95 active:shadow-[1px_1px_0px_#000] ${visibilidade} ${
        sentido === "direita"
          ? "right-2 sm:-right-6 md:-right-7 lg:-right-8"
          : "left-2 sm:-left-6 md:-left-7 lg:-left-8"
      }`}
    >
      <Icone
        className={`size-7 sm:size-8 transition-transform duration-300 ease-out ${
          sentido === "direita"
            ? "group-hover:translate-x-1"
            : "group-hover:-translate-x-1"
        }`}
        strokeWidth={2.5}
      />
    </button>
  );
}

const ORDEM_PAGINAS: Record<PaginaFicha, number> = {
  frente: 1,
  verso: 2,
  ecos: 3,
};

export function VisualizadorPapel({
  f,
  modo,
  pagina,
  onMudarPagina,
  onAbrirRolagem,
}: VisualizadorPapelProps) {
  const [direcao, setDirecao] = useState<"avancar" | "voltar" | null>(null);
  const inicioToque = useRef<number | null>(null);

  const virar = (destino: PaginaFicha) => {
    if (destino === pagina) return;
    setDirecao(ORDEM_PAGINAS[destino] > ORDEM_PAGINAS[pagina] ? "avancar" : "voltar");
    onMudarPagina(destino);
  };

  useEffect(() => {
    const aoTeclar = (e: KeyboardEvent) => {
      if (digitando(e.target) || document.querySelector(".fixed.inset-0")) return;
      if (e.key === "ArrowRight") {
        if (pagina === "frente") virar("verso");
        else if (pagina === "verso") virar("ecos");
      }
      if (e.key === "ArrowLeft") {
        if (pagina === "ecos") virar("verso");
        else if (pagina === "verso") virar("frente");
      }
    };
    window.addEventListener("keydown", aoTeclar);
    return () => window.removeEventListener("keydown", aoTeclar);
  });

  const duas = modo === "duas";
  const controlesVisiveis = duas ? "lg:hidden" : "";
  const animacao =
    direcao === null ? "" : direcao === "avancar" ? "folheada-avancar" : "folheada-voltar";

  const mostrar = (alvo: PaginaFicha) => {
    if (pagina === alvo) return "block";
    if (!duas) return "hidden";
    if (pagina === "ecos") {
      return alvo === "verso" ? "hidden lg:block" : "hidden";
    }
    return alvo === (pagina === "frente" ? "verso" : "frente")
      ? "hidden lg:block"
      : "hidden";
  };

  return (
    <div
      className={`relative ${duas ? "w-full" : "mx-auto max-w-[880px]"}`}
      onTouchStart={(e) => {
        inicioToque.current = e.touches[0].clientX;
      }}
      onTouchEnd={(e) => {
        if (inicioToque.current === null || digitando(e.target)) return;
        const dx = e.changedTouches[0].clientX - inicioToque.current;
        inicioToque.current = null;
        if (dx < -LIMITE_SWIPE_PX) {
          if (pagina === "frente") virar("verso");
          else if (pagina === "verso") virar("ecos");
        }
        if (dx > LIMITE_SWIPE_PX) {
          if (pagina === "ecos") virar("verso");
          else if (pagina === "verso") virar("frente");
        }
      }}
    >
      {/* Abas físicas estilo fichário/dossiê (modo uma página) */}
      {!duas && (
        <div className="flex items-end gap-1.5 px-2 -mb-[2px] z-10 relative">
          <button
            type="button"
            onClick={() => virar("frente")}
            className={`cursor-pointer px-4 py-2 text-xs font-black uppercase tracking-wider rounded-t-md transition-all flex items-center gap-2 ${
              pagina === "frente"
                ? "bg-[#fbfbf9] text-black border-2 border-b-0 border-black shadow-[0_-2px_6px_rgba(0,0,0,0.06)] relative z-20 pb-2.5 font-heading"
                : "bg-[#e5e5e0] text-black/60 border border-b-0 border-black/30 hover:bg-[#eaeae5] hover:text-black font-heading"
            }`}
          >
            <span
              className={`size-2 rounded-full ${
                pagina === "frente" ? "bg-black" : "bg-black/40"
              }`}
            />
            1 · Identidade
          </button>
          <button
            type="button"
            onClick={() => virar("verso")}
            className={`cursor-pointer px-4 py-2 text-xs font-black uppercase tracking-wider rounded-t-md transition-all flex items-center gap-2 ${
              pagina === "verso"
                ? "bg-[#fbfbf9] text-black border-2 border-b-0 border-black shadow-[0_-2px_6px_rgba(0,0,0,0.06)] relative z-20 pb-2.5 font-heading"
                : "bg-[#e5e5e0] text-black/60 border border-b-0 border-black/30 hover:bg-[#eaeae5] hover:text-black font-heading"
            }`}
          >
            <span
              className={`size-2 rounded-full ${
                pagina === "verso" ? "bg-black" : "bg-black/40"
              }`}
            />
            2 · Matriz
          </button>
          <button
            type="button"
            onClick={() => virar("ecos")}
            className={`cursor-pointer px-4 py-2 text-xs font-black uppercase tracking-wider rounded-t-md transition-all flex items-center gap-2 ${
              pagina === "ecos"
                ? "bg-[#fbfbf9] text-black border-2 border-b-0 border-black shadow-[0_-2px_6px_rgba(0,0,0,0.06)] relative z-20 pb-2.5 font-heading"
                : "bg-[#e5e5e0] text-black/60 border border-b-0 border-black/30 hover:bg-[#eaeae5] hover:text-black font-heading"
            }`}
          >
            <span
              className={`size-2 rounded-full ${
                pagina === "ecos" ? "bg-black" : "bg-black/40"
              }`}
            />
            3 · Ecos & Aprimoramentos
          </button>
        </div>
      )}

      {/* Setas Laterais de Navegação */}
      {pagina === "frente" && (
        <SetaVirar
          sentido="direita"
          rotulo="Virar para a Matriz de Habilidades"
          onClick={() => virar("verso")}
          visibilidade={`flex ${controlesVisiveis}`}
        />
      )}
      {pagina === "verso" && (
        <>
          <SetaVirar
            sentido="esquerda"
            rotulo="Voltar para a Frente (Identidade)"
            onClick={() => virar("frente")}
            visibilidade={`flex ${controlesVisiveis}`}
          />
          <SetaVirar
            sentido="direita"
            rotulo="Avançar para Ecos & Aprimoramentos"
            onClick={() => virar("ecos")}
            visibilidade={`flex ${controlesVisiveis}`}
          />
        </>
      )}
      {pagina === "ecos" && (
        <SetaVirar
          sentido="esquerda"
          rotulo="Voltar para a Matriz de Habilidades"
          onClick={() => virar("verso")}
          visibilidade={`flex ${controlesVisiveis}`}
        />
      )}

      {/* Grade de Páginas */}
      <div className={`grid items-start gap-6 ${duas ? "lg:grid-cols-2" : ""}`}>
        {/* Página 1: Frente */}
        <div
          key={`frente-${pagina}`}
          className={`${mostrar("frente")} ${pagina === "frente" && !duas ? animacao : ""}`}
        >
          <PaginaFrenteFicha
            ficha={f.ficha}
            derivada={f.derivada}
            onDefinirNome={f.definirNome}
            onDefinirApt={f.definirApt}
            onDefinirRetrato={(url) =>
              f.dispatch({ tipo: "definirRetrato", url })
            }
            onDefinirPvAtual={f.definirPvAtual}
            onDefinirPaAtual={f.definirPaAtual}
            onAdicionarPalavraChave={f.adicionarPalavraChave}
            onRemoverPalavraChave={f.removerPalavraChave}
            onAdicionarItem={f.adicionarItem}
            onAlternarEquipado={(id) =>
              f.dispatch({ tipo: "alternarEquipadoItem", id })
            }
            onRemoverItem={f.removerItem}
            onAtualizarCarteira={f.definirCarteira}
            onAbrirRolagem={onAbrirRolagem}
          />
        </div>

        {/* Página 2: Verso (Matriz) */}
        <div
          key={`verso-${pagina}`}
          className={`${mostrar("verso")} ${pagina === "verso" && !duas ? animacao : ""}`}
        >
          <PaginaVersoMatriz
            ficha={f.ficha}
            derivada={f.derivada}
            catalogo={f.catalogo}
            onAlocarSlot={(slot, alocacao) =>
              f.alocarSlotMatriz(slot, alocacao.tipo, alocacao.id)
            }
            onLimparSlot={f.limparSlotMatriz}
            onAdicionarHabilidadeUnica={(unica) =>
              f.dispatch({ tipo: "adicionarHabilidadeUnica", unica })
            }
            onAtualizarHabilidadeUnica={(id, dados) =>
              f.dispatch({ tipo: "atualizarHabilidadeUnica", id, dados })
            }
            onRemoverHabilidadeUnica={(id) =>
              f.dispatch({ tipo: "removerHabilidadeUnica", id })
            }
            onAdicionarCustomizacaoEco={(customizacao) =>
              f.dispatch({ tipo: "adicionarCustomizacaoEco", customizacao })
            }
            onRemoverCustomizacaoEco={(id) =>
              f.dispatch({ tipo: "removerCustomizacaoEco", id })
            }
            focoAtivoId={f.estado.focoAtivoId}
            onAlternarFoco={f.alternarFoco}
            onDefinirAnotacoes={f.definirAnotacoes}
            onNavegarParaEcos={() => virar("ecos")}
          />
        </div>

        {/* Página 3: Ecos & Aprimoramentos */}
        <div
          key={`ecos-${pagina}`}
          className={`${mostrar("ecos")} ${pagina === "ecos" && !duas ? animacao : ""}`}
        >
          <PaginaEcosAprimoramentos
            ficha={f.ficha}
            derivada={f.derivada}
            catalogo={f.catalogo}
            onAdicionarHabilidadeUnica={(unica) =>
              f.dispatch({ tipo: "adicionarHabilidadeUnica", unica })
            }
            onAtualizarHabilidadeUnica={(id, dados) =>
              f.dispatch({ tipo: "atualizarHabilidadeUnica", id, dados })
            }
            onRemoverHabilidadeUnica={(id) =>
              f.dispatch({ tipo: "removerHabilidadeUnica", id })
            }
            onAdicionarCustomizacaoEco={(customizacao) =>
              f.dispatch({ tipo: "adicionarCustomizacaoEco", customizacao })
            }
            onRemoverCustomizacaoEco={(id) =>
              f.dispatch({ tipo: "removerCustomizacaoEco", id })
            }
            onDefinirAnotacoes={f.definirAnotacoes}
          />
        </div>
      </div>

      {/* Controles de Paginação Rodapé */}
      <div
        className={`mt-4 flex items-center justify-center gap-2.5 text-xs font-bold ${controlesVisiveis}`}
      >
        {(
          [
            ["frente", "1 · Frente (Identidade)"],
            ["verso", "2 · Verso (Matriz)"],
            ["ecos", "3 · Ecos & Aprimoramentos"],
          ] as const
        ).map(([alvo, rotulo]) => (
          <button
            key={alvo}
            type="button"
            onClick={() => virar(alvo)}
            className={`cursor-pointer rounded-full px-4 py-1.5 border border-black transition-all ${
              pagina === alvo
                ? "bg-black text-white shadow-[1px_1px_0px_#000]"
                : "bg-white text-black hover:bg-black/10"
            }`}
          >
            {rotulo}
          </button>
        ))}
      </div>
    </div>
  );
}
