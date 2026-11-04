import type { CriaturaCalafrio, FichaCalafrio } from "@calafrio/core";
import {
  CHAVE_STORAGE_ATIVO,
  CHAVE_STORAGE_BESTIARIO,
  CHAVE_STORAGE_PERSONAGENS,
} from "./armazenamento";

export interface StorageAdapterAsync {
  getItem(key: string): Promise<string | null>;
  setItem(key: string, value: string): Promise<void>;
  removeItem(key: string): Promise<void>;
}

async function lerListaAsync<T>(
  adapter: StorageAdapterAsync,
  chave: string,
): Promise<T[]> {
  try {
    const bruto = await adapter.getItem(chave);
    const parsed = bruto ? JSON.parse(bruto) : [];
    return Array.isArray(parsed) ? (parsed as T[]) : [];
  } catch {
    return [];
  }
}

export async function lerPersonagensAsync(
  adapter: StorageAdapterAsync,
): Promise<FichaCalafrio[]> {
  return lerListaAsync<FichaCalafrio>(adapter, CHAVE_STORAGE_PERSONAGENS);
}

export async function gravarPersonagensAsync(
  adapter: StorageAdapterAsync,
  lista: FichaCalafrio[],
): Promise<void> {
  try {
    await adapter.setItem(CHAVE_STORAGE_PERSONAGENS, JSON.stringify(lista));
  } catch {}
}

export async function lerPersonagemAtivoIdAsync(
  adapter: StorageAdapterAsync,
): Promise<string | null> {
  try {
    return await adapter.getItem(CHAVE_STORAGE_ATIVO);
  } catch {
    return null;
  }
}

export async function gravarPersonagemAtivoIdAsync(
  adapter: StorageAdapterAsync,
  id: string | null,
): Promise<void> {
  try {
    if (id) {
      await adapter.setItem(CHAVE_STORAGE_ATIVO, id);
    } else {
      await adapter.removeItem(CHAVE_STORAGE_ATIVO);
    }
  } catch {}
}

export async function lerCriaturasAsync(
  adapter: StorageAdapterAsync,
): Promise<CriaturaCalafrio[]> {
  return lerListaAsync<CriaturaCalafrio>(adapter, CHAVE_STORAGE_BESTIARIO);
}

export async function gravarCriaturasAsync(
  adapter: StorageAdapterAsync,
  lista: CriaturaCalafrio[],
): Promise<void> {
  try {
    await adapter.setItem(CHAVE_STORAGE_BESTIARIO, JSON.stringify(lista));
  } catch {}
}
