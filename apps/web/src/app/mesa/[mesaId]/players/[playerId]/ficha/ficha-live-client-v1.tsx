"use client";

import type { FichaCalafrioV1 } from "@calafrio/core";
import { useFichaCalafrioV1 } from "@calafrio/ficha-app";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { FichaV1 } from "@/components/ficha/ficha-v1";
import {
  CHAVE_STORAGE_ZOOM_FICHA,
  type NivelZoomFicha,
  obterConfigZoomFicha,
} from "@/components/ficha/fichas-tipos";
import {
  type PaginaFichaV1,
  VisualizadorPapelV1,
} from "@/components/ficha/papel-v1/visualizador-papel-v1";
import { SeletorZoomFicha } from "@/components/ficha/seletor-zoom-ficha";
import { salvarFichaPlayerAction } from "../../actions";

interface FichaLiveClientV1Props {
  mesaId: string;
  playerId: string;
  fichaInicial: FichaCalafrioV1;
}

const botaoClaro =
  "flex cursor-pointer items-center gap-1.5 rounded-sm border border-black bg-white px-3 py-2 text-xs font-bold text-black shadow-[1px_1px_0px_#000] transition-all hover:bg-black hover:text-white";

export function FichaLiveClientV1({
  mesaId,
  playerId,
  fichaInicial,
}: FichaLiveClientV1Props) {
  const f = useFichaCalafrioV1(fichaInicial, (nova) => {
    salvarFichaPlayerAction(playerId, nova);
  });
  const [pagina, setPagina] = useState<PaginaFichaV1>("frente");
  const [zoom, setZoom] = useState<NivelZoomFicha>("100");

  useEffect(() => {
    try {
      const salvo = localStorage.getItem(CHAVE_STORAGE_ZOOM_FICHA);
      if (salvo && ["90", "100", "115", "130"].includes(salvo)) {
        setZoom(salvo as NivelZoomFicha);
      }
    } catch {
      // Ignora erro de localStorage
    }
  }, []);

  const mudarZoom = (novo: NivelZoomFicha) => {
    setZoom(novo);
    try {
      localStorage.setItem(CHAVE_STORAGE_ZOOM_FICHA, novo);
    } catch {
      // Ignora erro de localStorage
    }
  };

  return (
    <div className="w-full">
      <div
        className="mx-auto hidden space-y-5 transition-[max-width] duration-200 ease-out sm:block"
        style={{
          maxWidth: `${obterConfigZoomFicha(zoom).larguraMaximaUmaPaginaPx}px`,
        }}
      >
        <div className="mb-5 flex w-full flex-wrap items-center justify-between gap-2 rounded-sm border-2 border-black bg-[#f7f7f5] p-2.5 shadow-[2px_2px_0px_#000]">
          <div className="flex flex-wrap items-center gap-2">
            <Link href={`/mesa/${mesaId}/players`} className={botaoClaro}>
              <ArrowLeft className="size-4" /> Players
            </Link>
            <SeletorZoomFicha zoom={zoom} onMudarZoom={mudarZoom} />
          </div>
          <span className="rounded-sm border border-black bg-black px-3 py-2 text-xs font-black uppercase tracking-wider text-white">
            Calafrio 1ª Edição
          </span>
        </div>

        <VisualizadorPapelV1
          f={f}
          pagina={pagina}
          onMudarPagina={setPagina}
          zoom={zoom}
        />
      </div>

      {/* No celular a folha fica pequena demais: mantém a ficha em cartões. */}
      <div className="px-4 pb-16 pt-4 sm:hidden">
        <Link
          href={`/mesa/${mesaId}/players`}
          className="mb-4 inline-flex items-center gap-1.5 text-xs font-bold text-muted-foreground"
        >
          <ArrowLeft className="size-4" /> Players
        </Link>
        <FichaV1 {...f} />
      </div>
    </div>
  );
}
