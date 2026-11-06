import { describe, expect, it } from "vitest";
import { normalizarSistemaVersao } from "../edicao";

describe("normalizarSistemaVersao", () => {
  it("aceita 1e e 2e", () => {
    expect(normalizarSistemaVersao("1e")).toBe("1e");
    expect(normalizarSistemaVersao("2e")).toBe("2e");
  });
  it("qualquer outro valor vira 2e", () => {
    for (const v of [undefined, null, "", "3e", 1, "1E"]) {
      expect(normalizarSistemaVersao(v)).toBe("2e");
    }
  });
});
