import { describe, expect, it } from "vitest";
import {
  COORDENADAS_FICHA_PAGINA_1,
  COORDENADAS_FICHA_PAGINA_2,
  canvasParaPdf,
} from "../coordenadas-ficha-pdf";

describe("Coordenadas e Conversão de Canvas A4 para PDF Points", () => {
  it("converte retângulo de canvas (origem superior-esquerda) para PDF (origem inferior-esquerda)", () => {
    // Canvas total 662x936 deve preencher a página A4 inteira em pontos (595.28 x 841.89)
    const folhaInteira = canvasParaPdf(0, 0, 662, 936);
    expect(folhaInteira.x).toBeCloseTo(0, 1);
    expect(folhaInteira.y).toBeCloseTo(0, 1);
    expect(folhaInteira.width).toBeCloseTo(595.28, 1);
    expect(folhaInteira.height).toBeCloseTo(841.89, 1);

    // Retângulo no topo do canvas deve ter Y alto no PDF
    const topo = canvasParaPdf(10, 10, 100, 40);
    expect(topo.x).toBeGreaterThan(0);
    expect(topo.y).toBeGreaterThan(700); // próximo do topo da folha
    expect(topo.width).toBeGreaterThan(0);
    expect(topo.height).toBeGreaterThan(0);
  });

  it("define todas as coordenadas necessárias para a Página 1 (Frente)", () => {
    expect(COORDENADAS_FICHA_PAGINA_1.nome).toBeDefined();
    expect(COORDENADAS_FICHA_PAGINA_1.apt).toBeDefined();
    expect(COORDENADAS_FICHA_PAGINA_1.pv_atual).toBeDefined();
    expect(COORDENADAS_FICHA_PAGINA_1.pv_max).toBeDefined();
    expect(COORDENADAS_FICHA_PAGINA_1.pa_atual).toBeDefined();
    expect(COORDENADAS_FICHA_PAGINA_1.pa_max).toBeDefined();
    expect(COORDENADAS_FICHA_PAGINA_1.pd).toBeDefined();
    expect(COORDENADAS_FICHA_PAGINA_1.ecos).toBeDefined();
    expect(COORDENADAS_FICHA_PAGINA_1.fundos).toBeDefined();
    expect(COORDENADAS_FICHA_PAGINA_1.espirions).toBeDefined();
    expect(COORDENADAS_FICHA_PAGINA_1.inventario).toBeDefined();
    expect(COORDENADAS_FICHA_PAGINA_1.retrato).toBeDefined();

    const palavras = COORDENADAS_FICHA_PAGINA_1.palavras_chave;
    expect(Array.isArray(palavras)).toBe(true);
    expect(palavras.length).toBe(9);
  });

  it("define todas as coordenadas necessárias para a Página 2 (Verso / Matriz e Anotações)", () => {
    const slots = COORDENADAS_FICHA_PAGINA_2.slots_matriz;
    expect(Array.isArray(slots)).toBe(true);
    expect(slots.length).toBe(9);

    for (const slot of slots) {
      expect(slot.titulo).toBeDefined();
      expect(slot.descricao).toBeDefined();
      expect(slot.titulo.width).toBeGreaterThan(0);
      expect(slot.descricao.height).toBeGreaterThan(0);
    }

    expect(COORDENADAS_FICHA_PAGINA_2.anotacoes).toBeDefined();
    expect(COORDENADAS_FICHA_PAGINA_2.anotacoes.height).toBeGreaterThan(0);
  });
});
