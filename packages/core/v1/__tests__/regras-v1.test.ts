import { describe, expect, it } from "vitest";
import { criarFichaV1Vazia } from "../ficha-vazia-v1";
import type { FichaCalafrioV1 } from "../modelo-v1";
import {
  esquecerHabilidadeV1,
  habilidadesValidasV1,
  podeMemorizarV1,
} from "../regras-v1";

const comHabs = (ids: string[], mente = 5): FichaCalafrioV1 => ({
  ...criarFichaV1Vazia("t", "T"),
  nivel: 7,
  atributos: { corpo: 3, mente, alma: 10 - mente },
  habilidades: ids.map((id) => ({ id, aprimoramentos: [] })),
});
const ids = (f: FichaCalafrioV1) => f.habilidades.map((h) => h.id).sort();

describe("requisitos por ligação", () => {
  it("Grau II exige um Grau I ligado (Levitação ← Ímpeto)", () => {
    expect(habilidadesValidasV1(comHabs(["levitacao"]).habilidades)).not.toContain(
      "levitacao"
    );
    expect(
      habilidadesValidasV1(comHabs(["impeto", "levitacao"]).habilidades)
    ).toContain("levitacao");
    // Telecinese (I₄) não liga em Levitação (II₁)
    expect(
      habilidadesValidasV1(comHabs(["telecinese", "levitacao"]).habilidades)
    ).not.toContain("levitacao");
  });

  it("Grau III exige um Grau II ligado e válido (Modo divino ← Levitação/Manifestação castanha)", () => {
    expect(
      habilidadesValidasV1(comHabs(["levitacao", "modo-divino"]).habilidades)
    ).toEqual([]);
    expect(
      habilidadesValidasV1(
        comHabs(["impeto", "levitacao", "modo-divino"]).habilidades
      )
    ).toContain("modo-divino");
    // Ressonância (II₃) não liga em Modo divino (III₁)
    expect(
      habilidadesValidasV1(
        comHabs(["ectobalistica", "ressonancia", "modo-divino"]).habilidades
      )
    ).not.toContain("modo-divino");
  });

  it("podeMemorizarV1 checa requisito, duplicata, Grau 0 e PM", () => {
    expect(podeMemorizarV1(comHabs([]), "levitacao").ok).toBe(false);
    expect(podeMemorizarV1(comHabs(["impeto"]), "levitacao").ok).toBe(true);
    expect(podeMemorizarV1(comHabs(["impeto"]), "impeto").ok).toBe(false);
    expect(podeMemorizarV1(comHabs([]), "arsenal-psionico").ok).toBe(false);
    expect(podeMemorizarV1(comHabs(["impeto"], 1), "levitacao").ok).toBe(false); // 3 + 6 > 6
  });
});

describe("esquecerHabilidadeV1 (cascata)", () => {
  it("remove dependentes sem outro requisito", () => {
    const f = esquecerHabilidadeV1(
      comHabs(["impeto", "levitacao", "modo-divino"]),
      "impeto"
    );
    expect(ids(f)).toEqual([]);
  });

  it("mantém dependente com outro requisito do mesmo grau", () => {
    // Manifestação castanha (II₂) ← Ímpeto (I₁) ou Ectobalística (I₂)
    const f = esquecerHabilidadeV1(
      comHabs(["impeto", "ectobalistica", "manifestacao-castanha"]),
      "impeto"
    );
    expect(ids(f)).toEqual(["ectobalistica", "manifestacao-castanha"]);
  });
});
