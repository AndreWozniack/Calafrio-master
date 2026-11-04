/** A ficha impressa (A4) foi medida em um canvas de 662×936; tudo escala via `cqw` da folha. */
export const LARGURA_FOLHA = 662;
export const ALTURA_FOLHA = 936;

export const u = (px: number) =>
  `${((px * 100) / LARGURA_FOLHA).toFixed(4)}cqw`;

export interface Retangulo {
  x: number;
  y: number;
  w: number;
  h: number;
}

export function estiloRetangulo({ x, y, w, h }: Retangulo) {
  return {
    position: "absolute",
    left: u(x),
    top: u(y),
    width: u(w),
    height: u(h),
  } as const;
}
