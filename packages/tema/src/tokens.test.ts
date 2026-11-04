import { describe, expect, it } from "vitest";
import { TOKENS_ESPECTRO_DANO, TOKENS_PERSONALIDADE } from "./tokens";

describe("@calafrio/tema tokens", () => {
  it("define exatamente as 5 personalidades com cores para domínio positivo e negativo", () => {
    expect(Object.keys(TOKENS_PERSONALIDADE)).toEqual([
      "maneiro",
      "caotico",
      "esquisito",
      "racional",
      "agradavel",
    ]);
    for (const token of Object.values(TOKENS_PERSONALIDADE)) {
      expect(token.corPositiva).toMatch(/^#[0-9A-Fa-f]{6}$/);
      expect(token.corNegativa).toMatch(/^#[0-9A-Fa-f]{6}$/);
    }
  });

  it("define os espectros de dano do Calafrio 2e", () => {
    expect(Object.keys(TOKENS_ESPECTRO_DANO)).toEqual([
      "fisico",
      "castanho",
      "rubro",
      "ceruleo",
      "alvo",
      "variavel",
    ]);
  });
});
