import { describe, expect, it } from "vitest";
import {
  ehMestreDaMesa,
  filtrarMesasDoUsuario,
  normalizarCodigoConvite,
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
