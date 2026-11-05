import { describe, expect, it } from "vitest";
import { formatarNomeArquivoPdf } from "../disparar-download-pdf";

describe("Utilitário de Download e Nome de Arquivo PDF", () => {
  it("formata nome padrão quando o nome do personagem está vazio", () => {
    expect(formatarNomeArquivoPdf("")).toBe(
      "Ficha_Investigador_Calafrio2e.pdf",
    );
    expect(formatarNomeArquivoPdf(undefined)).toBe(
      "Ficha_Investigador_Calafrio2e.pdf",
    );
    expect(formatarNomeArquivoPdf("   ")).toBe(
      "Ficha_Investigador_Calafrio2e.pdf",
    );
  });

  it("formata nome do personagem com underscores e sufixo Calafrio2e", () => {
    expect(formatarNomeArquivoPdf("Arthur Pendelton")).toBe(
      "Ficha_Arthur_Pendelton_Calafrio2e.pdf",
    );
  });

  it("sanitiza caracteres inválidos e pontuações para nomes de arquivos seguros", () => {
    expect(formatarNomeArquivoPdf("Arthur / & O'Connor?")).toBe(
      "Ficha_Arthur_OConnor_Calafrio2e.pdf",
    );
    expect(formatarNomeArquivoPdf("Dante_Valente #1")).toBe(
      "Ficha_Dante_Valente_1_Calafrio2e.pdf",
    );
  });
});
