/**
 * Mapeamento e cálculo de coordenadas A4 entre o canvas web (662×936, topo-esquerda)
 * e o espaço vetorial de pontos do PDF (595.276×841.89 pt, base-esquerda).
 */

export interface CoordenadaRetanguloPdf {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface CoordenadaSlotMatrizPdf {
  slot: number;
  titulo: CoordenadaRetanguloPdf;
  descricao: CoordenadaRetanguloPdf;
}

export const LARGURA_CANVAS_WEB = 662;
export const ALTURA_CANVAS_WEB = 936;
export const LARGURA_PAGINA_PDF = 595.276;
export const ALTURA_PAGINA_PDF = 841.89;

const ESCALA_X = LARGURA_PAGINA_PDF / LARGURA_CANVAS_WEB;
const ESCALA_Y = ALTURA_PAGINA_PDF / ALTURA_CANVAS_WEB;

/**
 * Converte retângulos definidos no canvas web de 662x936 para coordenadas PDF (72 DPI).
 * No PDF, a origem (0, 0) fica no canto inferior-esquerdo da página.
 */
export function canvasParaPdf(
  x: number,
  y: number,
  w: number,
  h: number,
): CoordenadaRetanguloPdf {
  return {
    x: Number((x * ESCALA_X).toFixed(2)),
    y: Number((ALTURA_PAGINA_PDF - (y + h) * ESCALA_Y).toFixed(2)),
    width: Number((w * ESCALA_X).toFixed(2)),
    height: Number((h * ESCALA_Y).toFixed(2)),
  };
}

// Coordenadas dos 9 slots de palavras-chave na página 1 (x: 458, w: 187, h: 26)
const PALAVRAS_CHAVE_PAGINA_1: CoordenadaRetanguloPdf[] = Array.from(
  { length: 9 },
  (_, i) => canvasParaPdf(458, 67 + i * 29.2, 187, 24),
);

// Coordenadas dos 9 slots da matriz na página 2
const MATRIZ_COLUNAS_X = [22, 236, 444];
const MATRIZ_LINHAS_Y = [78, 267, 457];
const MATRIZ_LARGURA = 195;
const MATRIZ_ALTURA = 172;

const SLOTS_MATRIZ_PAGINA_2: CoordenadaSlotMatrizPdf[] = Array.from(
  { length: 9 },
  (_, slot) => {
    const col = slot % 3;
    const lin = Math.floor(slot / 3);
    const x = MATRIZ_COLUNAS_X[col];
    const y = MATRIZ_LINHAS_Y[lin];

    return {
      slot,
      titulo: canvasParaPdf(x + 4, y + 4, MATRIZ_LARGURA - 8, 20),
      descricao: canvasParaPdf(x + 4, y + 28, MATRIZ_LARGURA - 8, MATRIZ_ALTURA - 32),
    };
  },
);

export const COORDENADAS_FICHA_PAGINA_1 = {
  // Identidade & Retrato
  nome: canvasParaPdf(158, 28, 272, 33),
  retrato: canvasParaPdf(58, 28, 98, 132),

  // Vitais
  // APT (y=78, w=154, h=35)
  apt: canvasParaPdf(266, 78, 154, 35),
  // Defesa PD (y=121.4)
  pd: canvasParaPdf(266, 121.4, 154, 35),
  // Vida PV Atual / Max (y=164.8, campo de 154 dividido em 2 metades)
  pv_atual: canvasParaPdf(266, 164.8, 72, 35),
  pv_max: canvasParaPdf(348, 164.8, 72, 35),
  // Ânimum PA Atual / Max (y=208.2)
  pa_atual: canvasParaPdf(266, 208.2, 72, 35),
  pa_max: canvasParaPdf(348, 208.2, 72, 35),
  // Velocidade (y=251.6)
  velocidade: canvasParaPdf(266, 251.6, 154, 35),
  // Ecos (y=295)
  ecos: canvasParaPdf(266, 295, 154, 35),

  // Carteira
  fundos: canvasParaPdf(40, 229, 112, 32),
  espirions: canvasParaPdf(40, 272, 112, 32),

  // Palavras-chave (9 linhas)
  palavras_chave: PALAVRAS_CHAVE_PAGINA_1,

  // Inventário (caixa completa inferior)
  inventario: canvasParaPdf(26, 384, 610, 494),
};

export const COORDENADAS_FICHA_PAGINA_2 = {
  // 9 Slots de Habilidades Paranormais
  slots_matriz: SLOTS_MATRIZ_PAGINA_2,

  // Anotações
  anotacoes: canvasParaPdf(24, 678, 614, 200),
};
