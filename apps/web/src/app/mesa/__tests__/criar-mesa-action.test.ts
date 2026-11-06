import { beforeEach, describe, expect, it, vi } from "vitest";

const h = vi.hoisted(() => ({
  criarMesa: vi.fn(async () => ({ id: "mesa-x" })),
  redirect: vi.fn((url: string) => {
    throw new Error(`NEXT_REDIRECT ${url}`);
  }),
}));
vi.mock("@/auth", () => ({
  auth: vi.fn(async () => ({ user: { id: "user-1" } })),
}));
vi.mock("next/cache", () => ({ revalidatePath: vi.fn() }));
vi.mock("next/navigation", () => ({ redirect: h.redirect }));
vi.mock("@/services/armazenamento-calafrio", () => ({
  criarMesa: h.criarMesa,
  excluirMesa: vi.fn(),
  obterMesa: vi.fn(),
}));
vi.mock("@/services/armazenamento-convite", () => ({
  sairDaMesaComoJogador: vi.fn(),
}));

import { criarMesaAction } from "../actions";

const form = (campos: Record<string, string>) => {
  const fd = new FormData();
  for (const [k, v] of Object.entries(campos)) fd.append(k, v);
  return fd;
};

beforeEach(() => h.criarMesa.mockClear());

describe("criarMesaAction", () => {
  it.each([
    [{ nome: "A", sistemaVersao: "1e" }, "1e"],
    [{ nome: "B", sistemaVersao: "2e" }, "2e"],
    [{ nome: "C" }, "2e"],
    [{ nome: "D", sistemaVersao: "3e" }, "2e"],
  ])("%o → %s", async (campos, esperado) => {
    await expect(criarMesaAction(form(campos))).rejects.toThrow(
      "NEXT_REDIRECT /mesa/mesa-x"
    );
    expect(h.criarMesa).toHaveBeenCalledWith(campos.nome, "user-1", esperado);
  });
});
