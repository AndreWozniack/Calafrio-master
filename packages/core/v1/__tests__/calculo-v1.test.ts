import { describe, expect, it } from "vitest";
import { calcularFichaV1 } from "../calculo-v1";
import { criarFichaV1Vazia } from "../ficha-vazia-v1";
import type { FichaCalafrioV1 } from "../modelo-v1";

const base = (over: Partial<FichaCalafrioV1> = {}): FichaCalafrioV1 => ({
  ...criarFichaV1Vazia("t", "Teste"),
  atributos: { corpo: 2, mente: 1, alma: 1 },
  ...over,
});
const codigos = (f: FichaCalafrioV1) =>
  calcularFichaV1(f).avisos.map((a) => a.codigo);

describe("calcularFichaV1 — derivados", () => {
  it("nível 1, 2/1/1", () => {
    const d = calcularFichaV1(base());
    expect(d).toMatchObject({
      pd: 9,
      pmMax: 6,
      paMax: 9,
      pvMax: 6,
      ba: 1,
      velocidade: 6,
      ecosMax: 1,
      limitePalavrasChave: 3,
      pontosAtributoEsperados: 4,
    });
    expect(d.avisos).toEqual([]);
  });

  it.each([1, 2, 3, 4, 5, 6, 7, 8, 9, 10])("nível %i", (nivel) => {
    const d = calcularFichaV1(
      base({ nivel, atributos: { corpo: nivel, mente: 2, alma: 2 } })
    );
    expect(d.pvMax).toBe(nivel * 6);
    expect(d.ba).toBe(nivel);
    expect(d.ecosMax).toBe(nivel);
    expect(d.limitePalavrasChave).toBe(2 + nivel);
    expect(d.pd).toBe(3 + nivel * 3);
    expect(d.pontosAtributoEsperados).toBe(3 + nivel);
  });

  it("atributos: pendente, excedido, < 1, nível inválido", () => {
    expect(
      codigos(base({ atributos: { corpo: 1, mente: 1, alma: 1 } }))
    ).toContain("PONTOS_ATRIBUTO_PENDENTES");
    expect(
      codigos(base({ atributos: { corpo: 3, mente: 1, alma: 1 } }))
    ).toContain("PONTOS_ATRIBUTO_INVALIDOS");
    expect(
      codigos(base({ atributos: { corpo: 4, mente: 0, alma: 0 } }))
    ).toContain("PONTOS_ATRIBUTO_INVALIDOS");
    expect(codigos(base({ nivel: 11 }))).toContain("NIVEL_INVALIDO");
    expect(codigos(base({ nivel: 0 }))).toContain("NIVEL_INVALIDO");
  });
});

describe("calcularFichaV1 — PM", () => {
  it("soma custo por grau e acusa estouro", () => {
    const d = calcularFichaV1(
      base({
        habilidades: [
          { id: "impeto", aprimoramentos: [] }, // I = 3
          { id: "levitacao", aprimoramentos: [] }, // II = 6
        ],
      })
    );
    expect(d.pmGasto).toBe(9);
    expect(d.pmRestante).toBe(-3);
    expect(d.avisos.map((a) => a.codigo)).toContain("LIMITE_PM_EXCEDIDO");
  });

  it("Grau 0 é derivado, grátis e não pode ser gravado", () => {
    const d = calcularFichaV1(
      base({ habilidades: [{ id: "impeto", aprimoramentos: [] }] })
    );
    expect(d.grauZeroMemorizados).toEqual(["arsenal-psionico"]);
    expect(d.pmGasto).toBe(3);
    expect(
      codigos(
        base({ habilidades: [{ id: "arsenal-psionico", aprimoramentos: [] }] })
      )
    ).toContain("GRAU_ZERO_EXPLICITO");
  });

  it("PM extra só no Familiar, múltiplo de 3", () => {
    const f = (pmExtra: number, id = "familiar") =>
      base({
        atributos: { corpo: 1, mente: 2, alma: 1 },
        habilidades: [{ id, aprimoramentos: [], pmExtra }],
      });
    expect(calcularFichaV1(f(6)).pmGasto).toBe(9);
    expect(codigos(f(6))).not.toContain("PM_EXTRA_INVALIDO");
    expect(codigos(f(4))).toContain("PM_EXTRA_INVALIDO");
    expect(codigos(f(3, "impeto"))).toContain("PM_EXTRA_INVALIDO");
  });

  it("habilidade desconhecida avisa e não soma", () => {
    const d = calcularFichaV1(
      base({ habilidades: [{ id: "nao-existe", aprimoramentos: [] }] })
    );
    expect(d.pmGasto).toBe(0);
    expect(d.avisos.map((a) => a.codigo)).toContain("HABILIDADE_DESCONHECIDA");
  });
});

describe("calcularFichaV1 — Ecos e palavras-chave", () => {
  const apr = (n: number) =>
    Array.from({ length: n }, (_, i) => ({ id: `a${i}`, descricao: "x" }));

  it("conta aprimoramentos e únicas (1 + aprimoramentos)", () => {
    const d = calcularFichaV1(
      base({
        nivel: 3,
        atributos: { corpo: 2, mente: 2, alma: 2 },
        habilidades: [{ id: "impeto", aprimoramentos: apr(1) }],
        habilidadesUnicas: [
          {
            id: "u1",
            nome: "U",
            descricao: "",
            passiva: false,
            aprimoramentos: apr(1),
          },
        ],
      })
    );
    expect(d.ecosGastos).toBe(3);
    expect(d.avisos).toEqual([]);
  });

  it("acusa EP acima do nível e mais de 2 aprimoramentos", () => {
    const f = base({ habilidades: [{ id: "impeto", aprimoramentos: apr(3) }] });
    expect(codigos(f)).toEqual(
      expect.arrayContaining(["LIMITE_ECOS_EXCEDIDO", "APRIMORAMENTOS_EXCEDIDOS"])
    );
  });

  it("palavras-chave ≤ 2 + nível", () => {
    const pcs = Array.from({ length: 4 }, (_, i) => ({
      id: `p${i}`,
      nome: `P${i}`,
      categoria: "livre" as const,
    }));
    expect(codigos(base({ palavrasChave: pcs }))).toContain(
      "PALAVRAS_CHAVE_EXCEDIDAS"
    );
  });
});
