import { describe, expect, it } from "vitest";
import {
  calcularDanoContraCriatura,
  motorBestiarioUnificado,
} from "../motor-bestiario";

describe("MotorBestiario", () => {
  it("gera estatísticas base por APT e aplica resistências (metade floor), vulnerabilidades (dobro) e imunidades (0)", () => {
    const base = motorBestiarioUnificado.gerarPadraoPorApt(3);
    expect(base.pd).toBe(9);
    expect(base.pvMax).toBe(12);
    expect(base.paMax).toBe(12);
    expect(base.velocidade).toBe(6);

    const criatura = {
      ...base,
      id: "c1",
      nome: "Esqueletético",
      resistencias: {
        rubro: "resistente" as const,
        ceruleo: "vulneravel" as const,
        fisico: "imune" as const,
      },
    };

    expect(calcularDanoContraCriatura(criatura, 5, "rubro")).toBe(2);
    expect(calcularDanoContraCriatura(criatura, 5, "ceruleo")).toBe(10);
    expect(calcularDanoContraCriatura(criatura, 5, "fisico")).toBe(0);
  });
});
