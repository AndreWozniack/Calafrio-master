import type { ArvoreV1, HabilidadeCatalogoV1 } from "../modelo-v1";
import { HABILIDADES_AGRADAVEIS } from "./agradaveis";
import { HABILIDADES_CAOTICAS } from "./caoticas";
import { HABILIDADES_ESQUISITAS } from "./esquisitas";
import { HABILIDADES_MANEIRAS } from "./maneiras";
import { HABILIDADES_RACIONAIS } from "./racionais";

export const HABILIDADES_1E: HabilidadeCatalogoV1[] = [
  ...HABILIDADES_MANEIRAS,
  ...HABILIDADES_CAOTICAS,
  ...HABILIDADES_ESQUISITAS,
  ...HABILIDADES_AGRADAVEIS,
  ...HABILIDADES_RACIONAIS,
];

const MAPA_HABILIDADES_1E = new Map<string, HabilidadeCatalogoV1>(
  HABILIDADES_1E.map((h) => [h.id, h])
);

export function obterHabilidade1e(
  id: string
): HabilidadeCatalogoV1 | undefined {
  return MAPA_HABILIDADES_1E.get(id);
}

export function listarHabilidadesPorArvore1e(
  arvore: ArvoreV1
): HabilidadeCatalogoV1[] {
  return HABILIDADES_1E.filter((h) => h.arvore === arvore);
}
