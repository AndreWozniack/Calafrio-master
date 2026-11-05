import { describe, expect, it } from "vitest";
import {
  gravarPersonagemAtivoIdAsync,
  gravarPersonagensAsync,
  lerPersonagemAtivoIdAsync,
  lerPersonagensAsync,
  type StorageAdapterAsync,
} from "../armazenamento-async";
import { criarNovoPersonagemPadrao } from "../gerenciador-personagens-core";

function criarMockAdapter(): StorageAdapterAsync {
  const store = new Map<string, string>();
  return {
    getItem: async (key: string) => store.get(key) ?? null,
    setItem: async (key: string, value: string) => {
      store.set(key, value);
    },
    removeItem: async (key: string) => {
      store.delete(key);
    },
  };
}

describe("Armazenamento Assíncrono (Mobile/AsyncStorage Adapter)", () => {
  it("retorna lista vazia quando nada está salvo", async () => {
    const adapter = criarMockAdapter();
    const personagens = await lerPersonagensAsync(adapter);
    expect(personagens).toEqual([]);
  });

  it("grava e lê múltiplos personagens assincronamente", async () => {
    const adapter = criarMockAdapter();
    const p1 = criarNovoPersonagemPadrao("Agente Smith");
    const p2 = criarNovoPersonagemPadrao("Detetive Miller");

    await gravarPersonagensAsync(adapter, [p1, p2]);
    const lidos = await lerPersonagensAsync(adapter);

    expect(lidos).toHaveLength(2);
    expect(lidos[0].id).toBe(p1.id);
    expect(lidos[1].nome).toBe("Detetive Miller");
  });

  it("grava, lê e remove o id do personagem ativo", async () => {
    const adapter = criarMockAdapter();
    expect(await lerPersonagemAtivoIdAsync(adapter)).toBeNull();

    await gravarPersonagemAtivoIdAsync(adapter, "char-123");
    expect(await lerPersonagemAtivoIdAsync(adapter)).toBe("char-123");

    await gravarPersonagemAtivoIdAsync(adapter, null);
    expect(await lerPersonagemAtivoIdAsync(adapter)).toBeNull();
  });
});
