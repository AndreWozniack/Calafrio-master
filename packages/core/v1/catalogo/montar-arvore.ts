import type {
  ArvoreV1,
  CustoPAV1,
  GrauV1,
  HabilidadeCatalogoV1,
  MarcadorV1,
} from "../modelo-v1";

export interface CartaV1 {
  id: string;
  nome: string;
  custoPA: CustoPAV1;
  descricao: string;
  marcadores?: MarcadorV1[];
  permitePmExtra?: boolean;
}

export interface CartasArvoreV1 {
  grauZero: CartaV1;
  grauI: [CartaV1, CartaV1, CartaV1, CartaV1];
  grauII: [CartaV1, CartaV1, CartaV1, CartaV1, CartaV1];
  grauIII: [CartaV1, CartaV1];
}

// Posições de cima para baixo no PDF V8 (linhas tracejadas).
const II_REQUER_I = [[0], [0, 1], [1, 2], [2, 3], [3]] as const;
const III_REQUER_II = [[0, 1], [2, 3]] as const;

export function montarArvoreV1(
  arvore: ArvoreV1,
  c: CartasArvoreV1
): HabilidadeCatalogoV1[] {
  const h = (
    x: CartaV1,
    grau: GrauV1,
    requisitos: string[]
  ): HabilidadeCatalogoV1 => ({
    ...x,
    arvore,
    grau,
    requisitos,
    marcadores: x.marcadores ?? [],
  });

  return [
    h(c.grauZero, 0, []),
    ...c.grauI.map((x) => h(x, 1, [])),
    ...c.grauII.map((x, k) =>
      h(
        x,
        2,
        II_REQUER_I[k].map((i) => c.grauI[i].id)
      )
    ),
    ...c.grauIII.map((x, k) =>
      h(
        x,
        3,
        III_REQUER_II[k].map((i) => c.grauII[i].id)
      )
    ),
  ];
}
