import type {
  CatalogoCalafrio,
  FichaCalafrio,
  FichaDerivadaCalafrio,
} from "@calafrio/core";
import { PDFDocument, type PDFForm, type PDFPage, rgb } from "pdf-lib";
import {
  type CoordenadaRetanguloPdf,
  COORDENADAS_FICHA_PAGINA_1,
  COORDENADAS_FICHA_PAGINA_2,
} from "./coordenadas-ficha-pdf";

export interface OpcoesExportacaoPdf {
  bufferTemplate?: ArrayBuffer | Uint8Array;
}

const CATEGORIAS_FIXAS = [
  { categoria: "ocupacao", rotulo: "Ocupação" },
  { categoria: "talento", rotulo: "Talento" },
  { categoria: "falha", rotulo: "Falha" },
] as const;

function distribuirLinhasPalavrasChave(
  palavras: FichaDerivadaCalafrio["palavrasChaveAtivas"],
) {
  const usadas = new Set<string>();
  const fixas = CATEGORIAS_FIXAS.map(({ categoria, rotulo }) => {
    const achada = palavras.find(
      (p) => p.categoria === categoria && !usadas.has(p.id),
    );
    if (achada) usadas.add(achada.id);
    return { palavra: achada, rotulo };
  });
  const livres = palavras.filter((p) => !usadas.has(p.id));
  const linhas: { palavra?: (typeof palavras)[number]; rotulo?: string }[] = [
    ...fixas,
    ...livres.map((palavra) => ({ palavra, rotulo: undefined })),
  ];
  while (linhas.length < 9) linhas.push({});
  return linhas;
}

function criarCampoTexto(
  form: PDFForm,
  pagina: PDFPage,
  nome: string,
  coords: CoordenadaRetanguloPdf,
  valor: string,
  multiline = false,
  fontSize = 9,
) {
  const campo = form.createTextField(nome);
  if (multiline) {
    campo.enableMultiline();
  }
  campo.addToPage(pagina, {
    x: coords.x,
    y: coords.y,
    width: coords.width,
    height: coords.height,
    borderWidth: 0,
    textColor: rgb(0.08, 0.08, 0.08),
  });
  campo.setFontSize(fontSize);
  campo.setText(valor);
  return campo;
}

async function carregarBufferTemplate(
  opcoes?: OpcoesExportacaoPdf,
): Promise<ArrayBuffer | Uint8Array> {
  if (opcoes?.bufferTemplate) {
    return opcoes.bufferTemplate;
  }

  // No navegador
  if (typeof window !== "undefined") {
    const resposta = await fetch(
      "/assets/calafrio/2e-V1_FichaPersonagem_Calafrio.pdf",
    );
    if (!resposta.ok) {
      throw new Error(
        `Erro ao carregar template PDF: status ${resposta.status}`,
      );
    }
    return await resposta.arrayBuffer();
  }

  // No Node / Ambiente de teste
  try {
    const fs = await import("node:fs");
    const path = await import("node:path");
    const caminho = path.resolve(
      process.cwd(),
      "public/assets/calafrio/2e-V1_FichaPersonagem_Calafrio.pdf",
    );
    return fs.readFileSync(caminho);
  } catch (err) {
    throw new Error(`Não foi possível carregar o template PDF no Node: ${err}`);
  }
}

/**
 * Gera um PDF A4 de 2 páginas 100% editável (AcroForm) preenchido com os dados da Ficha Viva do jogador.
 */
export async function gerarPdfFichaEditavel(
  ficha: FichaCalafrio,
  derivada: FichaDerivadaCalafrio,
  catalogo?: CatalogoCalafrio,
  opcoes?: OpcoesExportacaoPdf,
): Promise<Uint8Array> {
  const templateBytes = await carregarBufferTemplate(opcoes);
  const pdfDoc = await PDFDocument.load(templateBytes);
  const form = pdfDoc.getForm();

  const [pag1, pag2] = pdfDoc.getPages();
  if (!pag1 || !pag2) {
    throw new Error("O template PDF oficial deve conter pelo menos 2 páginas.");
  }

  // --- PÁGINA 1: Identidade, Vitais, Carteira, Palavras-chave, Inventário ---

  // Nome e Aptidão
  criarCampoTexto(
    form,
    pag1,
    "nome",
    COORDENADAS_FICHA_PAGINA_1.nome,
    ficha.nome || "Novo Investigador",
    false,
    14,
  );
  criarCampoTexto(
    form,
    pag1,
    "apt",
    COORDENADAS_FICHA_PAGINA_1.apt,
    String(ficha.aptBase ?? 1),
    false,
    14,
  );

  // Vitais
  criarCampoTexto(
    form,
    pag1,
    "pd",
    COORDENADAS_FICHA_PAGINA_1.pd,
    String(derivada.pd ?? 3),
    false,
    13,
  );
  criarCampoTexto(
    form,
    pag1,
    "pv_atual",
    COORDENADAS_FICHA_PAGINA_1.pv_atual,
    String(derivada.pvAtual ?? 6),
    false,
    13,
  );
  criarCampoTexto(
    form,
    pag1,
    "pv_max",
    COORDENADAS_FICHA_PAGINA_1.pv_max,
    String(derivada.pvMax ?? 6),
    false,
    13,
  );
  criarCampoTexto(
    form,
    pag1,
    "pa_atual",
    COORDENADAS_FICHA_PAGINA_1.pa_atual,
    String(derivada.paAtual ?? 6),
    false,
    13,
  );
  criarCampoTexto(
    form,
    pag1,
    "pa_max",
    COORDENADAS_FICHA_PAGINA_1.pa_max,
    String(derivada.paMax ?? 6),
    false,
    13,
  );
  criarCampoTexto(
    form,
    pag1,
    "velocidade",
    COORDENADAS_FICHA_PAGINA_1.velocidade,
    String(derivada.velocidade ?? 6),
    false,
    13,
  );
  criarCampoTexto(
    form,
    pag1,
    "ecos",
    COORDENADAS_FICHA_PAGINA_1.ecos,
    String(derivada.ecosMax ?? 1),
    false,
    13,
  );

  // Carteira
  criarCampoTexto(
    form,
    pag1,
    "fundos",
    COORDENADAS_FICHA_PAGINA_1.fundos,
    String(ficha.carteira?.fundos ?? 0),
    false,
    11,
  );
  criarCampoTexto(
    form,
    pag1,
    "espirions",
    COORDENADAS_FICHA_PAGINA_1.espirions,
    String(ficha.carteira?.espirions ?? 0),
    false,
    11,
  );

  // Retrato do Investigador (se houver e for data URL válida)
  if (ficha.retratoUrl && ficha.retratoUrl.startsWith("data:image/")) {
    try {
      const virgulaIndex = ficha.retratoUrl.indexOf(",");
      if (virgulaIndex !== -1) {
        const base64 = ficha.retratoUrl.slice(virgulaIndex + 1);
        const bytes = Uint8Array.from(atob(base64), (c) => c.charCodeAt(0));
        const imagem = ficha.retratoUrl.includes("image/png")
          ? await pdfDoc.embedPng(bytes)
          : await pdfDoc.embedJpg(bytes);

        const r = COORDENADAS_FICHA_PAGINA_1.retrato;
        pag1.drawImage(imagem, {
          x: r.x,
          y: r.y,
          width: r.width,
          height: r.height,
        });
      }
    } catch {
      // Ignora erro de parsing do retrato
    }
  }

  // Palavras-chave (9 linhas)
  const linhasPalavras = distribuirLinhasPalavrasChave(
    derivada.palavrasChaveAtivas,
  );
  for (let i = 0; i < 9; i++) {
    const coords = COORDENADAS_FICHA_PAGINA_1.palavras_chave[i];
    const item = linhasPalavras[i];
    const valor = item?.palavra?.nome ?? "";
    criarCampoTexto(
      form,
      pag1,
      `palavra_chave_${i + 1}`,
      coords,
      valor,
      false,
      10,
    );
  }

  // Inventário (formatado com [E] para equipado e [G] para guardado)
  const linhasInventario: string[] = [];
  if (ficha.inventario && ficha.inventario.length > 0) {
    for (const item of ficha.inventario) {
      const tag = item.equipado ? "[E]" : "[G]";
      const dano = item.dano
        ? ` (Dano: ${item.dano} ${item.espectroDano ?? ""})`
        : "";
      const desc = item.descricao ? ` - ${item.descricao}` : "";
      linhasInventario.push(`• ${tag} ${item.nome}${dano}${desc}`);
    }
  }
  criarCampoTexto(
    form,
    pag1,
    "inventario",
    COORDENADAS_FICHA_PAGINA_1.inventario,
    linhasInventario.join("\n"),
    true,
    9,
  );

  // --- PÁGINA 2: Matriz de 9 Slots de Habilidades e Anotações ---

  for (let slot = 0; slot < 9; slot++) {
    const coords = COORDENADAS_FICHA_PAGINA_2.slots_matriz[slot];
    const alocacao = ficha.matrizHabilidades.find((m) => m.slot === slot);

    let titulo = "";
    let descricao = "";

    if (alocacao) {
      if (alocacao.tipo === "unica") {
        const unica = ficha.habilidadesUnicas.find((u) => u.id === alocacao.id);
        if (unica) {
          titulo = unica.nome;
          const custo = `${unica.custo} ${unica.recurso.toUpperCase()}`;
          descricao = `[${unica.tipoAcao} | ${custo}]\n${unica.descricao}`;
        }
      } else if (alocacao.tipo === "paranormal" && catalogo) {
        const hab = catalogo.habilidadesParanormais.find(
          (h) => h.id === alocacao.id,
        );
        if (hab) {
          titulo = hab.nome;
          const custo = hab.custoPA === 0 ? "Passiva" : `${hab.custoPA} PA`;
          descricao = `[${hab.personalidade.toUpperCase()} | ${hab.dominio.toUpperCase()} | ${hab.tipoAcao} | ${custo}]\n${hab.descricao}`;
        }
      }
    }

    criarCampoTexto(
      form,
      pag2,
      `slot_matriz_${slot}_titulo`,
      coords.titulo,
      titulo,
      false,
      10,
    );
    criarCampoTexto(
      form,
      pag2,
      `slot_matriz_${slot}_descricao`,
      coords.descricao,
      descricao,
      true,
      8,
    );
  }

  // Anotações
  const partesAnotacoes: string[] = [];
  if (ficha.anotacoes && ficha.anotacoes.trim().length > 0) {
    partesAnotacoes.push(ficha.anotacoes.trim());
  }

  if (ficha.customizacoesEco && ficha.customizacoesEco.length > 0) {
    partesAnotacoes.push("\n--- ECOS E APERFEIÇOAMENTOS ---");
    for (const eco of ficha.customizacoesEco) {
      partesAnotacoes.push(`• ${eco.titulo}: ${eco.descricao}`);
    }
  }

  criarCampoTexto(
    form,
    pag2,
    "anotacoes",
    COORDENADAS_FICHA_PAGINA_2.anotacoes,
    partesAnotacoes.join("\n"),
    true,
    9,
  );

  return await pdfDoc.save();
}
