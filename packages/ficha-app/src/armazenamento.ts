import type { CriaturaCalafrio, FichaCalafrio } from "@calafrio/core";

export const CHAVE_STORAGE_PERSONAGENS = "calafrio:personagens:v2";
export const CHAVE_STORAGE_ATIVO = "calafrio:personagem-ativo-id:v2";
export const CHAVE_STORAGE_BESTIARIO = "calafrio:bestiario:v1";

function lerLista<T>(chave: string): T[] {
  if (typeof window === "undefined") return [];
  try {
    const bruto = localStorage.getItem(chave);
    const parsed = bruto ? JSON.parse(bruto) : [];
    return Array.isArray(parsed) ? (parsed as T[]) : [];
  } catch {
    return [];
  }
}

export function lerPersonagensSalvos(): FichaCalafrio[] {
  return lerLista<FichaCalafrio>(CHAVE_STORAGE_PERSONAGENS);
}

export function lerCriaturasSalvas(): CriaturaCalafrio[] {
  return lerLista<CriaturaCalafrio>(CHAVE_STORAGE_BESTIARIO);
}

export function gravarLista(chave: string, lista: unknown[]): void {
  try {
    localStorage.setItem(chave, JSON.stringify(lista));
  } catch {}
}
