import { calcularFichaV1 } from "./calculo-v1";
import { HABILIDADES_1E, obterHabilidade1e } from "./catalogo";
import type { FichaCalafrioV1, HabilidadeMemorizadaV1 } from "./modelo-v1";
import { CUSTO_PM_POR_GRAU } from "./modelo-v1";

export function habilidadesValidasV1(
  habs: HabilidadeMemorizadaV1[]
): string[] {
  const memorizadas = new Set(habs.map((h) => h.id));
  const validas = new Set<string>();
  for (const grau of [1, 2, 3] as const) {
    for (const id of memorizadas) {
      const c = obterHabilidade1e(id);
      if (!c || c.grau !== grau) continue;
      if (grau === 1 || c.requisitos.some((r) => validas.has(r))) {
        validas.add(id);
      }
    }
  }
  return [...validas];
}

export function grauZeroMemorizadosV1(validas: string[]): string[] {
  const arvores = new Set(validas.map((id) => obterHabilidade1e(id)?.arvore));
  return HABILIDADES_1E.filter(
    (h) => h.grau === 0 && arvores.has(h.arvore)
  ).map((h) => h.id);
}

export function podeMemorizarV1(
  ficha: FichaCalafrioV1,
  id: string
): { ok: boolean; motivo?: string } {
  const c = obterHabilidade1e(id);
  if (!c) return { ok: false, motivo: "Habilidade desconhecida." };
  if (c.grau === 0) return { ok: false, motivo: "Grau 0 é automático." };
  if (ficha.habilidades.some((h) => h.id === id))
    return { ok: false, motivo: "Já memorizada." };
  const validas = new Set(habilidadesValidasV1(ficha.habilidades));
  if (c.grau > 1 && !c.requisitos.some((r) => validas.has(r)))
    return {
      ok: false,
      motivo: "Requisito de grau anterior ligado não memorizado.",
    };
  const d = calcularFichaV1(ficha);
  if (d.pmRestante < CUSTO_PM_POR_GRAU[c.grau])
    return { ok: false, motivo: "PM insuficiente." };
  return { ok: true };
}

export function esquecerHabilidadeV1(
  ficha: FichaCalafrioV1,
  id: string
): FichaCalafrioV1 {
  const resto = ficha.habilidades.filter((h) => h.id !== id);
  const validas = new Set(habilidadesValidasV1(resto));
  return {
    ...ficha,
    habilidades: resto.filter(
      (h) => validas.has(h.id) || !obterHabilidade1e(h.id)
    ),
  };
}
