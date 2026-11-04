import type { ReactNode } from "react";
import { ALTURA_FOLHA, LARGURA_FOLHA } from "./unidades";

/** Folha A4 escalável: filhos posicionam-se com `unidades.ts` (cqw). */
export function FolhaPapel({ children }: { children: ReactNode }) {
  return (
    <div
      className="relative mx-auto w-full max-w-[880px] overflow-hidden bg-[#fbfbf9] text-black shadow-xl ring-1 ring-black/15"
      style={{
        containerType: "inline-size",
        aspectRatio: `${LARGURA_FOLHA} / ${ALTURA_FOLHA}`,
        fontFamily: "var(--font-alegreya), Georgia, serif",
      }}
    >
      {children}
    </div>
  );
}
