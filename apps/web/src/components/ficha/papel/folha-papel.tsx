import type { ReactNode } from "react";
import {
  type NivelZoomFicha,
  obterConfigZoomFicha,
} from "../fichas-tipos";
import { ALTURA_FOLHA, LARGURA_FOLHA } from "./unidades";

/** Folha A4 escalável: filhos posicionam-se com `unidades.ts` (cqw). */
export function FolhaPapel({
  children,
  zoom = "100",
}: {
  children: ReactNode;
  zoom?: NivelZoomFicha;
}) {
  const config = obterConfigZoomFicha(zoom);

  return (
    <div
      data-papel
      className="relative mx-auto w-full overflow-hidden bg-[#fbfbf9] text-black shadow-xl ring-1 ring-black/15 transition-[max-width] duration-200 ease-out [&_input]:font-bold [&_textarea]:font-semibold"
      style={{
        maxWidth: `${config.larguraMaximaFolhaPx}px`,
        containerType: "inline-size",
        aspectRatio: `${LARGURA_FOLHA} / ${ALTURA_FOLHA}`,
        fontFamily: "var(--font-alegreya), Georgia, serif",
        fontWeight: 600,
        backgroundImage: "url(/assets/fundo-papel.svg)",
        backgroundSize: "24cqw",
      }}
    >
      {children}
    </div>
  );
}
