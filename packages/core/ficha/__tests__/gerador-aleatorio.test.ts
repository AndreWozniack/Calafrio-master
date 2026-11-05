import { describe, expect, it } from "vitest";
import { carregarCatalogoCalafrio } from "../../catalogo";
import { gerarFichaAleatoria } from "../gerador-aleatorio";
import { montarFichaCalafrio } from "../montar-ficha";

describe("gerarFichaAleatoria", () => {
  const catalogo = carregarCatalogoCalafrio();

  it("deve gerar uma ficha válida pelas regras da 2ª Edição com APT 1 padrão", () => {
    const ficha = gerarFichaAleatoria(catalogo);
    expect(ficha.id).toBeTruthy();
    expect(ficha.nome).toBeTruthy();
    expect(ficha.aptBase).toBe(1);
    expect(ficha.palavrasChave.length).toBe(3); // 1 ocupação + 2 genéricas (2 + APT = 3)
    expect(ficha.matrizHabilidades.length).toBe(1); // APT = 1 habilidade memorizada
    expect(ficha.inventario.length).toBeGreaterThanOrEqual(2); // arma + bugiganga

    const derivada = montarFichaCalafrio(ficha, catalogo);
    expect(derivada.avisosDeRegra).toEqual([]);
    expect(derivada.dominioAtual).toMatch(/^(positivo|negativo)$/);
    expect(derivada.pvMax).toBe(6); // 3 + 3 * 1
    expect(derivada.paMax).toBe(6); // 3 + 3 * 1
    expect(derivada.pd).toBe(3); // 3 * 1
    expect(derivada.velocidade).toBe(6);
  });

  it("deve respeitar opções personalizadas de APT e domínio", () => {
    const ficha = gerarFichaAleatoria(catalogo, {
      apt: 2,
      dominio: "positivo",
    });
    expect(ficha.aptBase).toBe(2);
    expect(ficha.palavrasChave.length).toBe(4); // 2 + APT = 4
    expect(ficha.matrizHabilidades.length).toBe(2); // APT = 2

    const derivada = montarFichaCalafrio(ficha, catalogo);
    expect(derivada.avisosDeRegra).toEqual([]);
    expect(derivada.dominioAtual).toBe("positivo");
    expect(derivada.pvMax).toBe(9); // 3 + 3 * 2
    expect(derivada.paMax).toBe(9); // 3 + 3 * 2
    expect(derivada.pd).toBe(6); // 3 * 2
  });

  it("deve ser determinístico quando uma randomFn personalizada for fornecida", () => {
    // PRNG pseudo-aleatório simples (Mulberry32)
    const criarPrng = (seed: number) => {
      let s = seed;
      return () => {
        s |= 0;
        s = (s + 0x6d2b79f5) | 0;
        let t = Math.imul(s ^ (s >>> 15), 1 | s);
        t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
        return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
      };
    };

    const ficha1 = gerarFichaAleatoria(catalogo, { randomFn: criarPrng(42) });
    const ficha2 = gerarFichaAleatoria(catalogo, { randomFn: criarPrng(42) });

    expect(ficha1.nome).toBe(ficha2.nome);
    expect(ficha1.palavrasChave.map((p) => p.nome)).toEqual(
      ficha2.palavrasChave.map((p) => p.nome),
    );
    expect(ficha1.matrizHabilidades).toEqual(ficha2.matrizHabilidades);
    expect(ficha1.inventario.map((i) => i.nome)).toEqual(
      ficha2.inventario.map((i) => i.nome),
    );
  });

  it("deve gerar fichas válidas para APT 1 a 6 em ambos os domínios", () => {
    for (let apt = 1; apt <= 6; apt++) {
      for (const dominio of ["positivo", "negativo"] as const) {
        for (const personalidadeFoco of [undefined, "maneiro"] as const) {
          const ficha = gerarFichaAleatoria(catalogo, {
            apt,
            dominio,
            personalidadeFoco,
          });
          expect(ficha.matrizHabilidades.length).toBe(apt);
          expect(new Set(ficha.matrizHabilidades.map((m) => m.slot)).size).toBe(
            apt,
          );
          expect(ficha.palavrasChave.length).toBe(2 + apt);
          expect(montarFichaCalafrio(ficha, catalogo).avisosDeRegra).toEqual(
            [],
          );
        }
      }
    }
  });

  it("não deve equipar consumíveis como arma inicial", () => {
    for (let i = 0; i < 200; i++) {
      const ficha = gerarFichaAleatoria(catalogo, { randomFn: () => 0.5 });
      expect(ficha.inventario.some((it) => it.categoria === "consumivel")).toBe(
        false,
      );
    }
  });

  it("deve gerar 50 fichas consecutivas sem qualquer aviso de regra", () => {
    for (let i = 0; i < 50; i++) {
      const ficha = gerarFichaAleatoria(catalogo);
      const derivada = montarFichaCalafrio(ficha, catalogo);
      expect(derivada.avisosDeRegra).toEqual([]);
    }
  });
});
