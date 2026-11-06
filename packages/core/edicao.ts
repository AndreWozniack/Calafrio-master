export type SistemaVersao = "1e" | "2e";
export const SISTEMA_VERSAO_PADRAO: SistemaVersao = "2e";

export function normalizarSistemaVersao(valor: unknown): SistemaVersao {
  return valor === "1e" || valor === "2e" ? valor : SISTEMA_VERSAO_PADRAO;
}
