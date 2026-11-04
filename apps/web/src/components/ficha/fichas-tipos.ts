import type { useFichaCalafrio } from "@calafrio/ficha-app";

export type FichaViva = ReturnType<typeof useFichaCalafrio>;
export type PaginaFicha = "frente" | "verso" | "ecos";
export type ModoVisualizacao = "duas" | "uma";
