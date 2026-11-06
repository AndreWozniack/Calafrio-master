import type { FichaCalafrio } from "./ficha/modelo";
import type { FichaCalafrioV1 } from "./v1/modelo-v1";

export type SistemaVersao = "1e" | "2e";
export const SISTEMA_VERSAO_PADRAO: SistemaVersao = "2e";

export function normalizarSistemaVersao(valor: unknown): SistemaVersao {
  return valor === "1e" || valor === "2e" ? valor : SISTEMA_VERSAO_PADRAO;
}

export type FichaPersonagem = FichaCalafrio | FichaCalafrioV1;

export function ehFichaV1(f: FichaPersonagem): f is FichaCalafrioV1 {
  return (f as { edicao?: unknown }).edicao === "1e";
}

export function edicaoDaFicha(f: FichaPersonagem): SistemaVersao {
  return ehFichaV1(f) ? "1e" : "2e";
}
