import {
  carregarCatalogoCalafrio,
  criarEstadoDeJogoInicial,
  criarFichaCalafrioVazia,
  montarFichaCalafrio,
} from "@calafrio/core";
import { describe, expect, it } from "vitest";
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

  it("permite subir a APT além de 6 (liberdade do MdJ) e nunca abaixo de 1", () => {
    let ficha = criarFichaCalafrioVazia("f2", "Livre");
    ficha = fichaCalafrioReducer(ficha, { tipo: "definirApt", apt: 9 });
    expect(ficha.aptBase).toBe(9);
    ficha = fichaCalafrioReducer(ficha, { tipo: "definirApt", apt: 0 });
    expect(ficha.aptBase).toBe(1);
  });

  it("persiste vitais na ficha sem aceitar valores negativos", () => {
    let ficha = criarFichaCalafrioVazia("f3", "Vitais");
    ficha = fichaCalafrioReducer(ficha, {
      tipo: "definirVitais",
      vitais: { danoSofrido: 4, pvTemporario: -2 },
    });
    expect(ficha.vitais).toEqual({
      danoSofrido: 4,
      paGasto: 0,
      pvTemporario: 0,
      paTemporario: 0,
    });
  });

  it("ajuste manual altera o máximo derivado e some quando zerado", () => {
    const catalogo = carregarCatalogoCalafrio();
    let ficha = criarFichaCalafrioVazia("f4", "Ajuste");
    const base = montarFichaCalafrio(
      ficha,
      catalogo,
      criarEstadoDeJogoInicial(),
    );
    ficha = fichaCalafrioReducer(ficha, {
      tipo: "definirAjusteManual",
      alvo: "pvMax",
      valor: 5,
    });
    const com = montarFichaCalafrio(
      ficha,
      catalogo,
      criarEstadoDeJogoInicial(),
    );
    expect(com.pvMax).toBe(base.pvMax + 5);
    ficha = fichaCalafrioReducer(ficha, {
      tipo: "definirAjusteManual",
      alvo: "pvMax",
      valor: 0,
    });
    expect(ficha.efeitosCustomizados).toHaveLength(0);
  });

  it("regra manual libera domínio misto e pode ser desligada", () => {
    const catalogo = carregarCatalogoCalafrio();
    let ficha = criarFichaCalafrioVazia("f5", "Regra");
    ficha = fichaCalafrioReducer(ficha, {
      tipo: "definirRegraManual",
      regra: "permitirDominioMisto",
      ativa: true,
      descricao: "MdJ liberou",
    });
    expect(
      montarFichaCalafrio(ficha, catalogo, criarEstadoDeJogoInicial())
        .permitirDominioMisto,
    ).toBe(true);
    ficha = fichaCalafrioReducer(ficha, {
      tipo: "definirRegraManual",
      regra: "permitirDominioMisto",
      ativa: false,
      descricao: "",
    });
    expect(ficha.efeitosCustomizados).toHaveLength(0);
  });
});
