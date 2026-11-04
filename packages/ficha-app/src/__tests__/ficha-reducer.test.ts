import { describe, expect, it } from "vitest";
import { criarFichaCalafrioVazia } from "@calafrio/core";
import { fichaCalafrioReducer } from "../ficha-reducer";

describe("fichaCalafrioReducer", () => {
  it("atualiza APT, aloca habilidades na matriz 3x3 substituindo ocupante anterior do mesmo slot e gerencia palavras-chave com efeitos", () => {
    let ficha = criarFichaCalafrioVazia("f1", "Helena");
    ficha = fichaCalafrioReducer(ficha, { tipo: "definirApt", apt: 3 });
    expect(ficha.aptBase).toBe(3);

    ficha = fichaCalafrioReducer(ficha, {
      tipo: "alocarSlotMatriz",
      slot: 4,
      alocacao: { slot: 4, tipo: "paranormal", id: "telepatia" },
    });
    expect(ficha.matrizHabilidades).toEqual([
      { slot: 4, tipo: "paranormal", id: "telepatia" },
    ]);

    ficha = fichaCalafrioReducer(ficha, {
      tipo: "adicionarPalavraChave",
      palavra: {
        id: "pc-1",
        nome: "Paramédico(a)",
        categoria: "ocupacao",
        semConsumirLimite: false,
        efeitos: [
          {
            tipo: "concederPalavraChave",
            nome: "Primeiros Socorros",
            semConsumirLimite: true,
          },
        ],
      },
    });
    expect(ficha.palavrasChave).toHaveLength(1);
  });
});
