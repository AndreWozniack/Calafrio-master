import { beforeEach, describe, expect, it, vi } from "vitest";
import type { DadosStore } from "../armazenamento-store";

const h = vi.hoisted(() => ({ store: null as unknown as DadosStore }));
vi.mock("@/db", () => ({ db: null, schema: {} }));
vi.mock("../armazenamento-store", async (orig) => ({
  ...(await orig<typeof import("../armazenamento-store")>()),
  carregarStore: async () => h.store,
  salvarStore: async (d: DadosStore) => {
    h.store = d;
  },
}));

import { criarMesa, obterMesa } from "../armazenamento-calafrio";
import { normalizarMesa } from "../armazenamento-store";

beforeEach(() => {
  h.store = { mesas: [], players: [], rolagens: [], anotacoes: [] };
});

describe("sistemaVersao da mesa", () => {
  it("padrão 2e", async () => {
    const m = await criarMesa("A");
    expect(m.sistemaVersao).toBe("2e");
    expect((await obterMesa(m.id))?.sistemaVersao).toBe("2e");
  });
  it("1e explícita", async () => {
    const m = await criarMesa("B", undefined, "1e");
    expect((await obterMesa(m.id))?.sistemaVersao).toBe("1e");
  });
  it("mesa antiga do JSON sem campo vira 2e", () => {
    expect(
      normalizarMesa({
        id: "x",
        nome: "x",
        codigoConvite: "X",
        criadaEm: "",
      }).sistemaVersao
    ).toBe("2e");
  });
});
