import { criarFichaV1Vazia } from "@calafrio/core";
import { describe, expect, it } from "vitest";
import {
  opcoesHabilidadesV1,
  podeAvancarV1,
  pontosLivresV1,
} from "../regras-assistente-v1";

describe("regras-assistente-v1", () => {
  describe("pontosLivresV1", () => {
    it("nível 1 com 1/1/1 tem 1 ponto livre", () => {
      const f = criarFichaV1Vazia("1", "Teste");
      expect(pontosLivresV1(f)).toBe(1);
    });

    it("distribuído 2/1/1 tem 0 pontos livres", () => {
      const f = {
        ...criarFichaV1Vazia("1", "Teste"),
        atributos: { corpo: 2, mente: 1, alma: 1 },
      };
      expect(pontosLivresV1(f)).toBe(0);
    });

    it("passou do limite tem pontos livres negativos", () => {
      const f = {
        ...criarFichaV1Vazia("1", "Teste"),
        atributos: { corpo: 3, mente: 2, alma: 1 },
      };
      expect(pontosLivresV1(f)).toBe(-2);
    });
  });

  describe("opcoesHabilidadesV1", () => {
    it("agrupa por árvore e marca disponibilidade", () => {
      const f = criarFichaV1Vazia("1", "Teste");
      const opcoes = opcoesHabilidadesV1(f);
      expect(opcoes.maneiras).toBeDefined();
      expect(opcoes.maneiras.length).toBeGreaterThan(0);

      // Grau 1 de Maneiras deve estar disponível (requer 3 PM, mente 1 dá 6 PM)
      const impeto = opcoes.maneiras.find((o) => o.id === "impeto");
      expect(impeto?.disponivel).toBe(true);

      // Grau 2 requer Grau 1 anterior, deve estar indisponível
      const levitacao = opcoes.maneiras.find((o) => o.id === "levitacao");
      expect(levitacao?.disponivel).toBe(false);
    });
  });

  describe("podeAvancarV1", () => {
    it("etapa 0 (identidade) exige nome", () => {
      const f = criarFichaV1Vazia("1", "");
      expect(podeAvancarV1(0, f).ok).toBe(false);
      expect(podeAvancarV1(0, { ...f, nome: "Detetive John" }).ok).toBe(true);
    });

    it("etapa 1 (atributos) exige 0 pontos livres e atributos >= 1", () => {
      const f = criarFichaV1Vazia("1", "Detetive");
      expect(podeAvancarV1(1, f).ok).toBe(false);
      expect(
        podeAvancarV1(1, {
          ...f,
          atributos: { corpo: 2, mente: 1, alma: 1 },
        }).ok,
      ).toBe(true);
    });

    it("etapa 2 (palavras-chave) exige ocupação, personalidade e miscelânea", () => {
      const f = {
        ...criarFichaV1Vazia("1", "Detetive"),
        atributos: { corpo: 2, mente: 1, alma: 1 },
      };
      expect(podeAvancarV1(2, f).ok).toBe(false);

      const comChaves = {
        ...f,
        palavrasChave: [
          { id: "1", nome: "Policial", categoria: "ocupacao" as const },
          { id: "2", nome: "Teimoso", categoria: "personalidade" as const },
          { id: "3", nome: "Insônia", categoria: "miscelanea" as const },
        ],
      };
      expect(podeAvancarV1(2, comChaves).ok).toBe(true);
    });

    it("etapa 3 (habilidades) exige pmRestante >= 0", () => {
      const f = {
        ...criarFichaV1Vazia("1", "Detetive"),
        atributos: { corpo: 2, mente: 1, alma: 1 }, // 6 PM
        habilidades: [{ id: "impeto", aprimoramentos: [] }], // 3 PM
      };
      expect(podeAvancarV1(3, f).ok).toBe(true);
    });

    it("etapa 4 (equipamentos e fundos) exige fundos 1..12", () => {
      const f = criarFichaV1Vazia("1", "Detetive");
      expect(
        podeAvancarV1(4, {
          ...f,
          carteira: { fundos: 6, espirions: 0 },
        }).ok,
      ).toBe(true);
      expect(
        podeAvancarV1(4, {
          ...f,
          carteira: { fundos: 0, espirions: 0 },
        }).ok,
      ).toBe(false);
      expect(
        podeAvancarV1(4, {
          ...f,
          carteira: { fundos: 15, espirions: 0 },
        }).ok,
      ).toBe(false);
    });
  });
});
