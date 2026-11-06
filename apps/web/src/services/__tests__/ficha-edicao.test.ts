import { criarFichaCalafrioVazia, criarFichaV1Vazia } from "@calafrio/core";
import { describe, expect, it } from "vitest";
import { resumirPlayer, resumirVitais } from "../ficha-edicao";

describe("resumirVitais", () => {
  it("2e mantém a fórmula atual", () => {
    const f = { ...criarFichaCalafrioVazia("a", "A"), aptBase: 2 };
    expect(resumirVitais(f)).toEqual({
      aptBase: 2,
      pvMax: 9,
      paMax: 9,
      pd: 6,
    });
  });
  it("1e usa calcularFichaV1", () => {
    const f = {
      ...criarFichaV1Vazia("b", "B"),
      atributos: { corpo: 2, mente: 1, alma: 1 },
    };
    expect(resumirVitais(f)).toEqual({
      aptBase: 1,
      pvMax: 6,
      paMax: 9,
      pd: 9,
    });
  });
});

describe("resumirPlayer", () => {
  it("1e: ocupação e contagem sem quebrar", () => {
    const f = {
      ...criarFichaV1Vazia("b", "B"),
      palavrasChave: [
        { id: "p", nome: "Médica", categoria: "ocupacao" as const },
      ],
      habilidades: [{ id: "impeto", aprimoramentos: [] }],
    };
    expect(resumirPlayer(f)).toEqual({
      ocupacao: "Médica",
      totalHabilidades: 1,
    });
  });
});
