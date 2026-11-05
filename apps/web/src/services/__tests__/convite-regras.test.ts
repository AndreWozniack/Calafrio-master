import { describe, expect, it } from "vitest";
import {
  ehMembroDaMesa,
  ehMestreDaMesa,
  filtrarMesasDoUsuario,
  normalizarCodigoConvite,
  podeEditarPlayer,
} from "../convite-regras";

describe("normalizarCodigoConvite", () => {
  it("remove espaços e hífens e põe em maiúsculas", () => {
    expect(normalizarCodigoConvite(" ab c-d23 ")).toBe("ABCD23");
  });
  it("devolve vazio para entrada em branco", () => {
    expect(normalizarCodigoConvite("   ")).toBe("");
  });
});

describe("ehMestreDaMesa", () => {
  it("dono é mestre", () => {
    expect(ehMestreDaMesa({ userId: "u1" }, "u1")).toBe(true);
  });
  it("outro usuário não é mestre", () => {
    expect(ehMestreDaMesa({ userId: "u1" }, "u2")).toBe(false);
  });
  it("sem usuário não é mestre de mesa com dono", () => {
    expect(ehMestreDaMesa({ userId: "u1" }, undefined)).toBe(false);
  });
  it("mesa sem dono é de qualquer um", () => {
    expect(ehMestreDaMesa({ userId: null }, "u2")).toBe(true);
  });
});

describe("filtrarMesasDoUsuario", () => {
  const mesa = (id: string, userId: string) => ({
    id,
    userId,
    nome: id,
    codigoConvite: id,
    criadaEm: "",
  });
  const m1 = mesa("m1", "u1");
  const m2 = mesa("m2", "u9");
  const m3 = mesa("m3", "u9");
  const players = [{ mesaId: "m2", userId: "u1" }] as never;
  it("inclui mesas como mestre e como jogador", () => {
    expect(
      filtrarMesasDoUsuario({ mesas: [m1, m2, m3], players }, "u1"),
    ).toEqual([m1, m2]);
  });
  it("exclui mesas sem vínculo", () => {
    expect(
      filtrarMesasDoUsuario({ mesas: [m1, m2, m3], players }, "u7"),
    ).toEqual([]);
  });
});

describe("permissões de acesso à mesa", () => {
  const mesa = { userId: "mestre" };
  const meu = { userId: "u2" };
  const alheio = { userId: "u3" };
  const semDono = { userId: null };

  it("ehMembroDaMesa: mestre e jogador com player são membros", () => {
    expect(ehMembroDaMesa(mesa, [meu], "mestre")).toBe(true);
    expect(ehMembroDaMesa(mesa, [meu], "u2")).toBe(true);
  });
  it("ehMembroDaMesa: estranho e sem usuário não são membros", () => {
    expect(ehMembroDaMesa(mesa, [meu], "u9")).toBe(false);
    expect(ehMembroDaMesa(mesa, [meu], undefined)).toBe(false);
  });
  it("podeEditarPlayer: mestre edita qualquer player", () => {
    expect(podeEditarPlayer(mesa, alheio, "mestre")).toBe(true);
    expect(podeEditarPlayer(mesa, semDono, "mestre")).toBe(true);
  });
  it("podeEditarPlayer: jogador edita só o próprio player", () => {
    expect(podeEditarPlayer(mesa, meu, "u2")).toBe(true);
    expect(podeEditarPlayer(mesa, alheio, "u2")).toBe(false);
    expect(podeEditarPlayer(mesa, semDono, "u2")).toBe(false);
  });
  it("podeEditarPlayer: sem usuário nunca edita", () => {
    expect(podeEditarPlayer(mesa, meu, undefined)).toBe(false);
  });
});
