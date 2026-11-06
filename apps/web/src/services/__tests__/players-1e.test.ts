import { beforeEach, describe, expect, it, vi } from "vitest";
import type { DadosStore } from "../armazenamento-store";
import { criarFichaV1Vazia } from "@calafrio/core";

const h = vi.hoisted(() => ({ store: null as unknown as DadosStore }));
vi.mock("@/db", () => ({ db: null, schema: {} }));
vi.mock("../armazenamento-store", async (orig) => ({
  ...(await orig<typeof import("../armazenamento-store")>()),
  carregarStore: async () => h.store,
  salvarStore: async (d: DadosStore) => {
    h.store = d;
  },
}));

import {
  criarPlayer,
  salvarFichaPlayer,
  obterPlayer,
} from "../armazenamento-calafrio";

beforeEach(() => {
  h.store = {
    mesas: [
      {
        id: "mesa-1e",
        nome: "Mesa 1e",
        codigoConvite: "C1E123",
        sistemaVersao: "1e",
        criadaEm: "",
      },
    ],
    players: [],
    rolagens: [],
    anotacoes: [],
  };
});

describe("players com ficha 1e", () => {
  it("criarPlayer com ficha 1e grava vitais derivados de 1e", async () => {
    const ficha = {
      ...criarFichaV1Vazia("p1e", "Investigador 1e"),
      atributos: { corpo: 2, mente: 1, alma: 1 },
    };
    const player = await criarPlayer("mesa-1e", ficha);
    expect((player.ficha as { edicao?: string }).edicao).toBe("1e");
    expect(player.pd).toBe(9); // 3 + 2 * 3
    expect(player.pvMax).toBe(6); // 1 * 6
    expect(player.paMax).toBe(9); // 1 * 9
    expect(player.aptBase).toBe(1); // BA = 1
  });

  it("salvarFichaPlayer recalcula vitais ao mudar atributos na 1e", async () => {
    const ficha = {
      ...criarFichaV1Vazia("p1e-2", "Investigador Up"),
      atributos: { corpo: 1, mente: 1, alma: 2 },
    };
    const criado = await criarPlayer("mesa-1e", ficha);
    expect(criado.pd).toBe(6);

    const fichaAtualizada = {
      ...ficha,
      atributos: { corpo: 3, mente: 1, alma: 1 }, // PD agora é 3 + 3*3 = 12
    };
    const salvo = await salvarFichaPlayer(criado.id, fichaAtualizada);
    expect(salvo?.pd).toBe(12);
  });
});
