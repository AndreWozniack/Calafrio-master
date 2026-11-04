import type { useFichaCalafrio } from "@calafrio/ficha-app";

export type FichaViva = ReturnType<typeof useFichaCalafrio>;
export type PaginaFicha = "frente" | "verso";
export type ModoVisualizacao = "duas" | "uma";
