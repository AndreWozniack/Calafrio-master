import { criarFichaCalafrioVazia } from "@calafrio/core";
import { beforeEach, describe, expect, it, vi } from "vitest";
import type { DadosStore } from "../armazenamento-store";

const h = vi.hoisted(() => ({
  store: null as unknown as DadosStore,
  gerar: vi.fn<() => string>(),
}));

vi.mock("@/db", () => ({ db: null, schema: {} }));
vi.mock("../armazenamento-store", async (orig) => ({
  ...(await orig<typeof import("../armazenamento-store")>()),
  carregarStore: async () => h.store,
  salvarStore: async (d: DadosStore) => {
    h.store = d;
  },
  gerarCodigoConvite: h.gerar,
}));

import { criarPlayer } from "../armazenamento-calafrio";
import {
  buscarMesaPorCodigoConvite,
  ErroConvite,
  entrarPorConvite,
  regerarCodigoConvite,
  sairDaMesaComoJogador,
} from "../armazenamento-convite";

beforeEach(() => {
  h.gerar.mockReset();
  h.store = {
    mesas: [
      {
        id: "mesa-1",
        userId: "mestre1",
        nome: "M1",
        codigoConvite: "CALA26",
        criadaEm: "",
      },
      {
        id: "mesa-2",
        userId: "mestre1",
        nome: "M2",
        codigoConvite: "OUTRA2",
        criadaEm: "",
      },
    ],
    players: [],
    rolagens: [],
    anotacoes: [],
  };
});

describe("buscarMesaPorCodigoConvite", () => {
  it("normaliza e encontra a mesa", async () => {
    expect((await buscarMesaPorCodigoConvite("cala-26"))?.id).toBe("mesa-1");
  });
  it("devolve null para código inexistente", async () => {
    expect(await buscarMesaPorCodigoConvite("ZZZZZZ")).toBeNull();
  });
});

describe("entrarPorConvite", () => {
  it("cria rascunho vinculado ao usuário", async () => {
    const r = await entrarPorConvite("u2", "CALA26");
    expect(r.mesaId).toBe("mesa-1");
    expect(h.store.players).toHaveLength(1);
    expect(h.store.players[0]).toMatchObject({
      id: r.playerId,
      userId: "u2",
      mesaId: "mesa-1",
      nome: "Investigador Pendente",
    });
  });
  it("é idempotente", async () => {
    const a = await entrarPorConvite("u2", "CALA26");
    const b = await entrarPorConvite("u2", "CALA26");
    expect(b.playerId).toBe(a.playerId);
    expect(h.store.players).toHaveLength(1);
  });
  it("rejeita mestre", async () => {
    await expect(entrarPorConvite("mestre1", "CALA26")).rejects.toMatchObject({
      codigo: "MESTRE",
    });
  });
  it("rejeita código inválido", async () => {
    const p = entrarPorConvite("u2", "ZZZZZZ");
    await expect(p).rejects.toBeInstanceOf(ErroConvite);
    await expect(p).rejects.toMatchObject({ codigo: "INVALIDO" });
  });
});

describe("regerarCodigoConvite", () => {
  it("tenta de novo em colisão e invalida o antigo", async () => {
    h.gerar.mockReturnValueOnce("CALA26").mockReturnValueOnce("NOVO22");
    expect(await regerarCodigoConvite("mesa-1", "mestre1")).toBe("NOVO22");
    expect(await buscarMesaPorCodigoConvite("CALA26")).toBeNull();
    expect((await buscarMesaPorCodigoConvite("NOVO22"))?.id).toBe("mesa-1");
  });
  it("nega a quem não é mestre", async () => {
    await expect(regerarCodigoConvite("mesa-1", "u2")).rejects.toMatchObject({
      codigo: "SEM_PERMISSAO",
    });
    expect(h.store.mesas[0].codigoConvite).toBe("CALA26");
  });
});

describe("sairDaMesaComoJogador", () => {
  it("remove só os players do usuário naquela mesa", async () => {
    const f = (id: string) => criarFichaCalafrioVazia(id, id);
    await criarPlayer("mesa-1", f("a"), "u2");
    await criarPlayer("mesa-2", f("b"), "u2");
    await criarPlayer("mesa-1", f("c"), "u3");
    await sairDaMesaComoJogador("u2", "mesa-1");
    expect(h.store.players.map((p) => p.id).sort()).toEqual(["b", "c"]);
  });
});

describe("criarPlayer", () => {
  it("grava userId quando informado", async () => {
    const p = await criarPlayer(
      "mesa-1",
      criarFichaCalafrioVazia("x", "X"),
      "u2",
    );
    expect(p.userId).toBe("u2");
  });
  it("deixa userId nulo quando omitido", async () => {
    const p = await criarPlayer("mesa-1", criarFichaCalafrioVazia("y", "Y"));
    expect(p.userId ?? null).toBeNull();
  });
});
