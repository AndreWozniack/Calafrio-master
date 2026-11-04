"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import type { PaginaFicha } from "../fichas-tipos";

export function SetaVirar({
  sentido,
  rotulo,
  onClick,
  visibilidade = "",
}: {
  sentido: "esquerda" | "direita";
  rotulo: string;
  onClick: () => void;
  visibilidade?: string;
}) {
  const Icone = sentido === "direita" ? ChevronRight : ChevronLeft;
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={rotulo}
      title={rotulo}
      className={`group absolute top-1/2 -translate-y-1/2 z-40 flex size-12 sm:size-14 cursor-pointer items-center justify-center rounded-full border-2 border-black bg-[#fbfbf9]/95 text-black shadow-[2px_3px_0px_#000] backdrop-blur transition-all duration-300 ease-out hover:scale-110 hover:shadow-[3px_5px_0px_#000] active:scale-95 active:shadow-[1px_1px_0px_#000] ${visibilidade} ${
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

export function AbasFicharioDossie({
  pagina,
  onVirar,
}: {
  pagina: PaginaFicha;
  onVirar: (alvo: PaginaFicha) => void;
}) {
  return (
    <div className="flex items-end gap-1.5 px-2 -mb-[2px] z-30 relative">
      {(
        [
          ["frente", "1 · Identidade"],
          ["verso", "2 · Matriz"],
          ["ecos", "3 · Ecos & Aprimoramentos"],
        ] as const
      ).map(([alvo, rotulo]) => {
        const ativa = pagina === alvo;
        return (
          <button
            key={alvo}
            type="button"
            onClick={() => onVirar(alvo)}
            className={`cursor-pointer px-4 py-2 text-xs font-black uppercase tracking-wider rounded-t-md transition-all flex items-center gap-2 font-heading ${
              ativa
                ? "bg-[#fbfbf9] text-black border-2 border-b-0 border-black shadow-[0_-2px_6px_rgba(0,0,0,0.06)] relative z-20 pb-2.5"
                : "bg-[#e5e5e0] text-black/60 border border-b-0 border-black/30 hover:bg-[#eaeae5] hover:text-black"
            }`}
          >
            <span
              className={`size-2 rounded-full ${
                ativa ? "bg-black" : "bg-black/40"
              }`}
            />
            {rotulo}
          </button>
        );
      })}
    </div>
  );
}
