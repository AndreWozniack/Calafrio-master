import { describe, expect, it } from "vitest";
import { carregarCatalogoCalafrio } from "../index";

describe("Catálogo Oficial Calafrio 2e", () => {
  const catalogo = carregarCatalogoCalafrio();

  it("contém todas as 60 habilidades paranormais (6 positivas e 6 negativas em cada uma das 5 árvores)", () => {
    expect(catalogo.habilidadesParanormais).toHaveLength(60);
    for (const p of [
      "maneiro",
      "caotico",
      "esquisito",
      "racional",
      "agradavel",
    ] as const) {
      const daPersonalidade = catalogo.habilidadesParanormais.filter(
        (h) => h.personalidade === p,
      );
      expect(daPersonalidade).toHaveLength(12);
      expect(
        daPersonalidade.filter((h) => h.dominio === "positivo"),
      ).toHaveLength(6);
      expect(
        daPersonalidade.filter((h) => h.dominio === "negativo"),
      ).toHaveLength(6);
    }
  });

  it("marca Pirocinese como permiteCustoEmPV e mapeia tabelas de suporte (Familiares, Lacaios, Djanhos)", () => {
    const pirocinese = catalogo.habilidadesParanormais.find(
      (h) => h.id === "pirocinese",
    );
    expect(pirocinese?.permiteCustoEmPV).toBe(true);
    expect(catalogo.familiares).toHaveLength(6);
    expect(catalogo.lacaios).toHaveLength(6);
    expect(catalogo.djanhos).toHaveLength(6);
  });

  it("contém 100 palavras-chave genéricas, 100 ocupações, 100 bugigangas e 13 categorias de armas mundanas", () => {
    expect(catalogo.palavrasChaveGenericas).toHaveLength(100);
    expect(catalogo.ocupacoes).toHaveLength(100);
    expect(catalogo.bugigangas).toHaveLength(100);
    expect(catalogo.armasMundanas).toHaveLength(13);
    expect(catalogo.glossario.length).toBeGreaterThanOrEqual(16);
  });
});
