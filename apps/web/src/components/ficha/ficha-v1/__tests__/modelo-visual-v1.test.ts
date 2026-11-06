import { calcularFichaV1, criarFichaV1Vazia } from "@calafrio/core";
import { describe, expect, it } from "vitest";
import { linhasHabilidadesV1, resumoVitaisV1 } from "../modelo-visual-v1";

describe("modelo-visual-v1", () => {
  it("linhasHabilidadesV1 inclui Grau 0 automático no topo da árvore", () => {
    const ficha = {
      ...criarFichaV1Vazia("t1", "Teste"),
      atributos: { corpo: 2, mente: 2, alma: 1 },
      habilidades: [
        { id: "impeto", aprimoramentos: [{ id: "a1", descricao: "Dobro" }] },
        { id: "levitacao", aprimoramentos: [] },
      ],
    };
    const derivada = calcularFichaV1(ficha);
    const linhas = linhasHabilidadesV1(ficha, derivada);

    // Deve ter Grau 0 (Arsenal psiônico) + Grau I (Ímpeto) + Grau II (Levitação)
    expect(linhas).toHaveLength(3);

    const g0 = linhas[0];
    expect(g0.id).toBe("arsenal-psionico");
    expect(g0.automatica).toBe(true);
    expect(g0.grauRomano).toBe("0");
    expect(g0.custoTexto).toBe("2 PA / uso");
    expect(g0.custoPM).toBe(0);

    const g1 = linhas[1];
    expect(g1.id).toBe("impeto");
    expect(g1.automatica).toBe(false);
    expect(g1.grauRomano).toBe("I");
    expect(g1.custoPM).toBe(3);
    expect(g1.aprimoramentos).toHaveLength(1);
    expect(g1.invalida).toBe(false);

    const g2 = linhas[2];
    expect(g2.id).toBe("levitacao");
    expect(g2.grauRomano).toBe("II");
    expect(g2.custoPM).toBe(6);
    expect(g2.invalida).toBe(false);
  });

  it("marca invalida: true se requisito não atendido", () => {
    const ficha = {
      ...criarFichaV1Vazia("t2", "Sem Requisito"),
      atributos: { corpo: 1, mente: 2, alma: 1 },
      habilidades: [{ id: "levitacao", aprimoramentos: [] }], // Levitação sem Ímpeto
    };
    const derivada = calcularFichaV1(ficha);
    const linhas = linhasHabilidadesV1(ficha, derivada);

    const lev = linhas.find((l) => l.id === "levitacao");
    expect(lev?.invalida).toBe(true);
  });

  it("resumoVitaisV1 formata textos 'atual / máx.'", () => {
    const ficha = {
      ...criarFichaV1Vazia("t3", "Vitais"),
      nivel: 2,
      atributos: { corpo: 2, mente: 2, alma: 1 },
      pvAtual: 8,
      paAtual: 6,
      habilidades: [{ id: "impeto", aprimoramentos: [] }], // 3 PM
    };
    const derivada = calcularFichaV1(ficha);
    const vitais = resumoVitaisV1(derivada, ficha);

    expect(vitais.pv).toBe("8 / 12");
    expect(vitais.pa).toBe("6 / 9");
    expect(vitais.pm).toBe("3 / 12");
    expect(vitais.pd).toBe(9);
    expect(vitais.ba).toBe("+2");
  });
});
