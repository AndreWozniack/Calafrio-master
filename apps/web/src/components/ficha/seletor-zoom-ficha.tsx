"use client";

import { ZoomIn } from "lucide-react";
import {
  NIVEIS_ZOOM_FICHA,
  type NivelZoomFicha,
} from "./fichas-tipos";

interface SeletorZoomFichaProps {
  zoom: NivelZoomFicha;
  onMudarZoom: (zoom: NivelZoomFicha) => void;
  className?: string;
}

export function SeletorZoomFicha({
  zoom,
  onMudarZoom,
  className = "",
}: SeletorZoomFichaProps) {
  return (
    <div
      role="group"
      aria-label="Controle de Zoom da Ficha"
      className={`inline-flex items-center rounded-sm border border-black bg-white p-0.5 shadow-[1px_1px_0px_#000] ${className}`}
    >
      <span
        title="Nível de zoom da folha"
        className="flex items-center gap-1 px-2 text-xs font-bold text-neutral-600 select-none border-r border-black/20 mr-0.5"
      >
        <ZoomIn className="size-3.5 text-black" />
        <span className="hidden xl:inline">Zoom</span>
      </span>

      <div className="flex items-center gap-0.5">
        {NIVEIS_ZOOM_FICHA.map((nivel) => {
          const ativo = zoom === nivel.id;
          return (
            <button
              key={nivel.id}
              type="button"
              onClick={() => onMudarZoom(nivel.id)}
              aria-pressed={ativo}
              title={`Zoom ${nivel.rotulo}`}
              className={`flex cursor-pointer items-center justify-center rounded-xs px-2 py-1 text-[11px] font-bold tracking-tight transition-all select-none ${
                ativo
                  ? "bg-black text-white shadow-[0.5px_0.5px_0px_#000]"
                  : "text-black/70 hover:text-black hover:bg-black/5"
              }`}
            >
              {nivel.rotulo}
            </button>
          );
        })}
      </div>
    </div>
  );
}
