import { describe, expect, it } from "vitest";
import { rolarContestacao, rolarTesteAcao } from "../rolagem-calafrio";

describe("Rolagem Calafrio 2e", () => {
  it("respeita o piso de PD da vítima em contestações hostis, além de 20 crítico e 1 falha crítica", () => {
    // Atacante tira 10 (8 + 2 APT), vítima tira 3 no dado (3 + 4 APT = 7), mas tem 12 PD -> piso 12 garante vitória da vítima
    const res = rolarContestacao({
      aptAtacante: 2,
      modoAtacante: "normal",
      aptVitima: 4,
      pdVitima: 12,
      modoVitima: "normal",
      dadosAtacante: [8],
      dadosVitima: [3],
    });
    expect(res.totalEfetivoVitima).toBe(12);
    expect(res.vencedor).toBe("vitima");

    // Atacante tira 20 natural -> sucesso crítico automático
    const crit = rolarContestacao({
      aptAtacante: 1,
      modoAtacante: "normal",
      aptVitima: 6,
      pdVitima: 18,
      modoVitima: "normal",
      dadosAtacante: [20],
      dadosVitima: [15],
    });
    expect(crit.vencedor).toBe("atacante");
    expect(crit.criticoAtacante).toBe("sucesso_critico");
  });

  it("avalia testes de ação com vantagem e desvantagem contra a tabela de dificuldades (10, 13, 15, 17, 20)", () => {
    const vant = rolarTesteAcao({
      apt: 3,
      modo: "vantagem",
      dificuldade: 15,
      dadosInjetados: [4, 13],
    });
    expect(vant.dadoEscolhido).toBe(13);
    expect(vant.total).toBe(16);
    expect(vant.sucesso).toBe(true);
  });
});
