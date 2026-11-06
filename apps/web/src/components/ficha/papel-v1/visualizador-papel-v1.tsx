"use client";

import type { FichaVivaV1 } from "@calafrio/ficha-app";
import { useEffect } from "react";
import { type NivelZoomFicha, obterConfigZoomFicha } from "../fichas-tipos";
import { SetaVirar } from "../papel/controles-navegacao-papel";
import { FolhaFrenteV1 } from "./folha-frente-v1";
import { FolhaVersoV1 } from "./folha-verso-v1";

export type PaginaFichaV1 = "frente" | "verso";

const PAGINAS: readonly [PaginaFichaV1, string][] = [
  ["frente", "1 · Personagem"],
  ["verso", "2 · Habilidades & Ecos"],
];

function digitando(alvo: EventTarget | null) {
  return (
    alvo instanceof HTMLElement &&
    ["INPUT", "TEXTAREA", "SELECT"].includes(alvo.tagName)
  );
}

/** As duas folhas da Ficha V3 (1e), com abas de fichário e setas como na 2e. */
export function VisualizadorPapelV1({
  f,
  pagina,
  onMudarPagina,
  zoom = "100",
}: {
  f: FichaVivaV1;
  pagina: PaginaFichaV1;
  onMudarPagina: (pagina: PaginaFichaV1) => void;
  zoom?: NivelZoomFicha;
}) {
  useEffect(() => {
    const aoTeclar = (e: KeyboardEvent) => {
      if (digitando(e.target) || document.querySelector("[role=dialog]"))
        return;
      if (e.key === "ArrowRight") onMudarPagina("verso");
      if (e.key === "ArrowLeft") onMudarPagina("frente");
    };
    window.addEventListener("keydown", aoTeclar);
    return () => window.removeEventListener("keydown", aoTeclar);
  }, [onMudarPagina]);

  return (
    <div
      className="relative mx-auto w-full transition-[max-width] duration-200 ease-out"
      style={{
        maxWidth: `${obterConfigZoomFicha(zoom).larguraMaximaFolhaPx}px`,
      }}
    >
      <div className="relative z-30 -mb-[2px] flex items-end gap-1.5 px-2">
        {PAGINAS.map(([alvo, rotulo]) => {
          const ativa = pagina === alvo;
          return (
            <button
              key={alvo}
              type="button"
              onClick={() => onMudarPagina(alvo)}
              className={`font-heading flex cursor-pointer items-center gap-2 rounded-t-md px-4 py-2 text-xs font-black uppercase tracking-wider transition-all ${
                ativa
                  ? "relative z-20 border-2 border-b-0 border-black bg-[#fbfbf9] pb-2.5 text-black shadow-[0_-2px_6px_rgba(0,0,0,0.06)]"
                  : "border border-b-0 border-black/30 bg-[#e5e5e0] text-black/60 hover:bg-[#eaeae5] hover:text-black"
              }`}
            >
              <span
                className={`size-2 rounded-full ${ativa ? "bg-black" : "bg-black/40"}`}
              />
              {rotulo}
            </button>
          );
        })}
      </div>

      {pagina === "frente" ? (
        <SetaVirar
          sentido="direita"
          rotulo="Virar para Habilidades & Ecos"
          onClick={() => onMudarPagina("verso")}
        />
      ) : (
        <SetaVirar
          sentido="esquerda"
          rotulo="Voltar para o Personagem"
          onClick={() => onMudarPagina("frente")}
        />
      )}

      <div className="relative w-full overflow-hidden rounded-sm">
        <div
          key={pagina}
          className={`relative w-full ${
            pagina === "verso" ? "folha-camada-cima-entrar" : ""
          }`}
        >
          {pagina === "frente" ? (
            <FolhaFrenteV1 f={f} zoom={zoom} />
          ) : (
            <FolhaVersoV1 f={f} zoom={zoom} />
          )}
        </div>
      </div>
    </div>
  );
}
