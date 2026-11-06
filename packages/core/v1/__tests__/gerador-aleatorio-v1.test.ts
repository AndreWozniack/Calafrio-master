import { describe, expect, it } from "vitest";
import { calcularFichaV1 } from "../calculo-v1";
import { gerarFichaV1Aleatoria } from "../gerador-aleatorio-v1";

describe("gerador-aleatorio-v1", () => {
  it("gera ficha 1e válida no nível 1", () => {
    const ficha = gerarFichaV1Aleatoria();
    expect(ficha.edicao).toBe("1e");
    expect(ficha.nivel).toBe(1);
    expect(ficha.nome).toBeTruthy();

    // Atributos somam 3 + 1 = 4
    const somaAtributos =
      ficha.atributos.corpo + ficha.atributos.mente + ficha.atributos.alma;
    expect(somaAtributos).toBe(4);
    expect(ficha.atributos.corpo).toBeGreaterThanOrEqual(1);
    expect(ficha.atributos.mente).toBeGreaterThanOrEqual(1);
    expect(ficha.atributos.alma).toBeGreaterThanOrEqual(1);

    // Carteira entre 1 e 12
    expect(ficha.carteira.fundos).toBeGreaterThanOrEqual(1);
    expect(ficha.carteira.fundos).toBeLessThanOrEqual(12);
    expect(ficha.carteira.espirions).toBe(0);

    // Palavras-chave têm ocupação, personalidade e miscelânea
    expect(ficha.palavrasChave.some((p) => p.categoria === "ocupacao")).toBe(
      true,
    );
    expect(
      ficha.palavrasChave.some((p) => p.categoria === "personalidade"),
    ).toBe(true);
    expect(ficha.palavrasChave.some((p) => p.categoria === "miscelanea")).toBe(
      true,
    );

    // Grau 0 nunca está gravado nas habilidades memorizadas
    expect(ficha.habilidades.some((h) => h.id.endsWith("0"))).toBe(false);

    // Cálculo derivado não tem avisos graves
    const derivada = calcularFichaV1(ficha);
    expect(derivada.pmRestante).toBeGreaterThanOrEqual(0);
    expect(derivada.avisos).toHaveLength(0);
    expect(derivada.pvMax).toBe(6);
    expect(derivada.paMax).toBe(9 * ficha.atributos.alma);
    expect(derivada.pd).toBe(3 + 3 * ficha.atributos.corpo);
  });

  it("respeita arvoreFoco se informada", () => {
    const ficha = gerarFichaV1Aleatoria({ arvoreFoco: "caoticas" });
    const derivada = calcularFichaV1(ficha);
    expect(derivada.avisos).toHaveLength(0);

    for (const h of ficha.habilidades) {
      // Habilidades memorizadas devem pertencer a caóticas
      expect([
        "frenesi",
        "bombardeio",
        "sobrecarga",
        "estratagema",
        "lampejo",
        "imolacao",
        "manifestacao-rubra",
        "presenca-torturante",
        "carnificina",
        "intangibilidade",
        "desintegracao",
        "aparato-obliterador",
      ]).toContain(h.id);
    }
  });

  it("suporta níveis mais altos", () => {
    const ficha = gerarFichaV1Aleatoria({ nivel: 3 });
    expect(ficha.nivel).toBe(3);
    const soma =
      ficha.atributos.corpo + ficha.atributos.mente + ficha.atributos.alma;
    expect(soma).toBe(6); // 3 + 3 = 6
    const derivada = calcularFichaV1(ficha);
    expect(derivada.pvMax).toBe(18); // 6 * 3
    expect(derivada.pmRestante).toBeGreaterThanOrEqual(0);
    expect(derivada.avisos).toHaveLength(0);
  });

  it("produz resultado determinístico com randomFn", () => {
    let s = 42;
    const lcg = () => {
      s = (s * 1664525 + 1013904223) % 4294967296;
      return s / 4294967296;
    };
    let s2 = 42;
    const lcg2 = () => {
      s2 = (s2 * 1664525 + 1013904223) % 4294967296;
      return s2 / 4294967296;
    };

    const f1 = gerarFichaV1Aleatoria({ randomFn: lcg });
    const f2 = gerarFichaV1Aleatoria({ randomFn: lcg2 });

    expect(f1.nome).toBe(f2.nome);
    expect(f1.atributos).toEqual(f2.atributos);
    expect(f1.habilidades).toEqual(f2.habilidades);
  });
});
