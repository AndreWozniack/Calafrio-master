import type { useFichaCalafrio } from "@calafrio/ficha-app";

export type FichaViva = ReturnType<typeof useFichaCalafrio>;
export type PaginaFicha = "frente" | "verso" | "ecos";
export type ModoVisualizacao = "duas" | "uma";

export type NivelZoomFicha = "90" | "100" | "115" | "130";

export interface ConfigZoomFicha {
  id: NivelZoomFicha;
  rotulo: string;
  larguraMaximaUmaPaginaPx: number;
  larguraMaximaFolhaPx: number;
}

export const CHAVE_STORAGE_ZOOM_FICHA = "calafrio:ficha:zoom:v1";

export const NIVEIS_ZOOM_FICHA: readonly ConfigZoomFicha[] = [
  {
    id: "90",
    rotulo: "90%",
    larguraMaximaUmaPaginaPx: 830,
    larguraMaximaFolhaPx: 792,
  },
  {
    id: "100",
    rotulo: "100%",
    larguraMaximaUmaPaginaPx: 920,
    larguraMaximaFolhaPx: 880,
  },
  {
    id: "115",
    rotulo: "115%",
    larguraMaximaUmaPaginaPx: 1060,
    larguraMaximaFolhaPx: 1012,
  },
  {
    id: "130",
    rotulo: "130%",
    larguraMaximaUmaPaginaPx: 1200,
    larguraMaximaFolhaPx: 1144,
  },
] as const;

export function obterConfigZoomFicha(
  nivel?: NivelZoomFicha | string | null,
): ConfigZoomFicha {
  return (
    NIVEIS_ZOOM_FICHA.find((n) => n.id === nivel) ?? NIVEIS_ZOOM_FICHA[1]
  );
}
