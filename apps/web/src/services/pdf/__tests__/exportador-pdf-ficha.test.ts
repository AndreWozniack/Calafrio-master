import fs from "node:fs";
import path from "node:path";
import {
  carregarCatalogoCalafrio,
  criarFichaCalafrioVazia,
  montarFichaCalafrio,
} from "@calafrio/core";
import { PDFDocument } from "pdf-lib";
import { describe, expect, it } from "vitest";
import { gerarPdfFichaEditavel } from "../exportador-pdf-ficha";

describe("Exportador de Ficha para PDF Editável (AcroForm)", () => {
  const caminhoTemplate = path.resolve(
    process.cwd(),
    "public/assets/calafrio/2e-V1_FichaPersonagem_Calafrio.pdf",
  );
  const bufferTemplate = fs.readFileSync(caminhoTemplate);
  const catalogo = carregarCatalogoCalafrio();

  it("gera um PDF válido de 2 páginas com formulário AcroForm 100% preenchido e editável", async () => {
    const ficha = criarFichaCalafrioVazia("ficha-1", "Dante Valente");
    ficha.aptBase = 3;
    ficha.palavrasChave = [
      { id: "pc-1", nome: "Detetive Particular", categoria: "ocupacao", efeitos: [] },
      { id: "pc-2", nome: "Olhar Clínico", categoria: "talento", efeitos: [] },
      { id: "pc-3", nome: "Insônia Crônica", categoria: "falha", efeitos: [] },
      { id: "pc-4", nome: "Gazuas e Trincos", categoria: "livre", efeitos: [] },
    ];
    ficha.inventario = [
      {
        id: "item-1",
        nome: "Revólver .38",
        equipado: true,
        dano: 4,
        espectroDano: "perfuracao",
        descricao: "Tambor de 6 tiros.",
        efeitos: [],
      },
      {
        id: "item-2",
        nome: "Lanterna Tática",
        equipado: false,
        descricao: "Feixe de luz concentrado.",
        efeitos: [],
      },
    ];
    ficha.carteira = { fundos: 450, espirions: 3 };
    ficha.matrizHabilidades = [
      { slot: 0, tipo: "paranormal", id: "frenesi" },
      { slot: 4, tipo: "paranormal", id: "configuracao-petrea" },
    ];
    ficha.anotacoes = "Caso 42: Pistas encontradas no porão do casarão.";

    const derivada = montarFichaCalafrio(ficha, catalogo);

    const pdfBytes = await gerarPdfFichaEditavel(ficha, derivada, catalogo, {
      bufferTemplate,
    });

    // 1. Verificação de cabeçalho PDF
    expect(pdfBytes).toBeInstanceOf(Uint8Array);
    const cabecalho = Buffer.from(pdfBytes.slice(0, 5)).toString("utf-8");
    expect(cabecalho).toBe("%PDF-");

    // 2. Carregar documento resultante via pdf-lib
    const pdfDoc = await PDFDocument.load(pdfBytes);
    expect(pdfDoc.getPageCount()).toBe(2);

    // 3. Inspecionar campos de formulário AcroForm
    const form = pdfDoc.getForm();
    const campos = form.getFields();
    expect(campos.length).toBeGreaterThan(15);

    // Identidade e Vitais
    expect(form.getTextField("nome").getText()).toBe("Dante Valente");
    expect(form.getTextField("apt").getText()).toBe("3");
    expect(form.getTextField("pv_atual").getText()).toBe(String(derivada.pvAtual));
    expect(form.getTextField("pv_max").getText()).toBe(String(derivada.pvMax));
    expect(form.getTextField("pa_atual").getText()).toBe(String(derivada.paAtual));
    expect(form.getTextField("pa_max").getText()).toBe(String(derivada.paMax));
    expect(form.getTextField("pd").getText()).toBe(String(derivada.pd));
    expect(form.getTextField("ecos").getText()).toBe(String(derivada.ecosMax));

    // Carteira
    expect(form.getTextField("fundos").getText()).toBe("450");
    expect(form.getTextField("espirions").getText()).toBe("3");

    // Palavras-chave nas linhas corretas
    expect(form.getTextField("palavra_chave_1").getText()).toBe("Detetive Particular");
    expect(form.getTextField("palavra_chave_2").getText()).toBe("Olhar Clínico");
    expect(form.getTextField("palavra_chave_3").getText()).toBe("Insônia Crônica");
    expect(form.getTextField("palavra_chave_4").getText()).toBe("Gazuas e Trincos");

    // Inventário
    const textoInventario = form.getTextField("inventario").getText() ?? "";
    expect(textoInventario).toContain("Revólver .38");
    expect(textoInventario).toContain("[E]");
    expect(textoInventario).toContain("Lanterna Tática");

    // Slots da Matriz na Página 2
    expect(form.getTextField("slot_matriz_0_titulo").getText()).toBe("Frenesi");
    expect(form.getTextField("slot_matriz_4_titulo").getText()).toBe("Configuração Pétrea");

    // Anotações
    const textoAnotacoes = form.getTextField("anotacoes").getText() ?? "";
    expect(textoAnotacoes).toContain("Caso 42: Pistas encontradas no porão");

    // 4. Garantir que os campos são editáveis (não read-only)
    expect(form.getTextField("nome").isReadOnly()).toBe(false);
    expect(form.getTextField("inventario").isReadOnly()).toBe(false);
    expect(form.getTextField("anotacoes").isReadOnly()).toBe(false);
  });

  it("lida corretamente com carteira zerada, slots vazios e caracteres especiais", async () => {
    const ficha = criarFichaCalafrioVazia("ficha-2", "João das Mercês & Espíritos");
    ficha.carteira = { fundos: 0, espirions: 0 };
    ficha.matrizHabilidades = []; // nenhum slot preenchido
    ficha.anotacoes = "";

    const derivada = montarFichaCalafrio(ficha, catalogo);

    const pdfBytes = await gerarPdfFichaEditavel(ficha, derivada, catalogo, {
      bufferTemplate,
    });

    const pdfDoc = await PDFDocument.load(pdfBytes);
    const form = pdfDoc.getForm();

    expect(form.getTextField("nome").getText()).toBe("João das Mercês & Espíritos");
    expect(form.getTextField("fundos").getText()).toBe("0");
    expect(form.getTextField("espirions").getText()).toBe("0");

    // Slots vazios devem ter campos editáveis existentes com texto vazio
    for (let slot = 0; slot < 9; slot++) {
      const campoTitulo = form.getTextField(`slot_matriz_${slot}_titulo`);
      expect(campoTitulo).toBeDefined();
      expect(campoTitulo.getText() ?? "").toBe("");
      expect(campoTitulo.isReadOnly()).toBe(false);
    }
  });
});
