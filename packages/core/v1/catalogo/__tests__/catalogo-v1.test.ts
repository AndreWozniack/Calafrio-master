import { describe, expect, it } from "vitest";
import {
  HABILIDADES_1E,
  listarHabilidadesPorArvore1e,
  obterHabilidade1e,
} from "..";

const ARVORES = [
  "maneiras",
  "caoticas",
  "esquisitas",
  "agradaveis",
  "racionais",
] as const;

describe("Catálogo 1e", () => {
  it("60 habilidades, 12 por árvore (1/4/5/2), ids únicos", () => {
    expect(HABILIDADES_1E).toHaveLength(60);
    expect(new Set(HABILIDADES_1E.map((h) => h.id)).size).toBe(60);
    for (const a of ARVORES) {
      const g = listarHabilidadesPorArvore1e(a).map((h) => h.grau);
      expect([0, 1, 2, 3].map((x) => g.filter((y) => y === x).length)).toEqual([
        1, 4, 5, 2,
      ]);
    }
  });

  it("requisitos apontam para grau imediatamente anterior da mesma árvore", () => {
    for (const h of HABILIDADES_1E) {
      for (const r of h.requisitos) {
        const req = obterHabilidade1e(r);
        expect(req?.arvore).toBe(h.arvore);
        expect(req?.grau).toBe(h.grau - 1);
      }
      if (h.grau <= 1) expect(h.requisitos).toEqual([]);
    }
  });

  it("grafo de Maneiras exatamente como o PDF V8", () => {
    const req = (id: string) => obterHabilidade1e(id)?.requisitos;
    expect(req("levitacao")).toEqual(["impeto"]);
    expect(req("manifestacao-castanha")).toEqual(["impeto", "ectobalistica"]);
    expect(req("ressonancia")).toEqual(["ectobalistica", "campo-de-forca"]);
    expect(req("fluxo-anti-animatico")).toEqual([
      "campo-de-forca",
      "telecinese",
    ]);
    expect(req("absorcao-eterea")).toEqual(["telecinese"]);
    expect(req("modo-divino")).toEqual(["levitacao", "manifestacao-castanha"]);
    expect(req("conduite")).toEqual(["ressonancia", "fluxo-anti-animatico"]);
  });

  it("custos e marcadores de amostra", () => {
    expect(obterHabilidade1e("impeto")).toMatchObject({
      arvore: "maneiras",
      grau: 1,
      custoPA: 2,
    });
    expect(obterHabilidade1e("arsenal-psionico")).toMatchObject({
      grau: 0,
      custoPA: 2,
    });
    expect(obterHabilidade1e("conduite")?.custoPA).toBe("passivo");
    expect(obterHabilidade1e("inscricao")?.custoPA).toBe(0);
    expect(obterHabilidade1e("imolacao")?.custoPA).toBe(6);
    expect(obterHabilidade1e("perdicao")?.custoPA).toBe(12);
    expect(obterHabilidade1e("manifestacao-castanha")?.marcadores).toEqual([
      "cadeado",
      "interrogacao",
    ]);
    expect(obterHabilidade1e("familiar")).toMatchObject({
      custoPA: "passivo",
      permitePmExtra: true,
    });
    expect(
      HABILIDADES_1E.filter((h) => h.permitePmExtra).map((h) => h.id),
    ).toEqual(["familiar"]);
  });

  it("toda habilidade tem descrição", () => {
    for (const h of HABILIDADES_1E)
      expect(h.descricao.trim().length).toBeGreaterThan(20);
  });
});
