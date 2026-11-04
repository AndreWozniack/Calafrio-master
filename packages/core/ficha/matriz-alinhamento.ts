import type { PersonalidadeCalafrio } from "@calafrio/tema";
import type { CatalogoCalafrio } from "../catalogo/tipos";
import type {
  AlinhamentoAtivo,
  AlocacaoSlotMatriz,
  HabilidadeUnicaCalafrio,
} from "./modelo";

const LINHAS_HORIZONTAIS: readonly [number, number, number][] = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
];

const LINHAS_VERTICAIS: readonly [number, number, number][] = [
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
];

const LINHAS_DIAGONAIS: readonly [number, number, number][] = [
  [0, 4, 8],
  [2, 4, 6],
];

const QUADRILATEROS_2X2: readonly [number, number, number, number][] = [
  [0, 1, 3, 4],
  [1, 2, 4, 5],
  [3, 4, 6, 7],
  [4, 5, 7, 8],
];

export function obterPersonalidadeDoSlot(
  slot: number,
  matriz: readonly AlocacaoSlotMatriz[],
  habilidadesUnicas: readonly HabilidadeUnicaCalafrio[],
  catalogo: CatalogoCalafrio,
): PersonalidadeCalafrio | null {
  const alocacao = matriz.find((m) => m.slot === slot);
  if (!alocacao) return null;

  if (alocacao.tipo === "paranormal") {
    const hab = catalogo.habilidadesParanormais.find(
      (h) => h.id === alocacao.id,
    );
    return hab?.personalidade ?? null;
  }

  const unica = habilidadesUnicas.find((u) => u.id === alocacao.id);
  return unica?.personalidadeAlinhamento ?? null;
}

export function calcularAlinhamentosMatriz(
  matriz: readonly AlocacaoSlotMatriz[],
  habilidadesUnicas: readonly HabilidadeUnicaCalafrio[],
  catalogo: CatalogoCalafrio,
): AlinhamentoAtivo[] {
  const ativos: AlinhamentoAtivo[] = [];

  const checarPadrao = (
    slots: readonly number[],
    padrao: AlinhamentoAtivo["padrao"],
    alvo: AlinhamentoAtivo["alvo"],
    valor: number,
    bonusTexto: string,
  ) => {
    const personalidades = slots.map((s) =>
      obterPersonalidadeDoSlot(s, matriz, habilidadesUnicas, catalogo),
    );
    const primeira = personalidades[0];
    if (!primeira) return;
    if (personalidades.every((p) => p === primeira)) {
      ativos.push({
        padrao,
        slots: [...slots],
        personalidade: primeira,
        bonusTexto,
        alvo,
        valor,
      });
    }
  };

  for (const h of LINHAS_HORIZONTAIS) {
    checarPadrao(h, "horizontal", "paMax", 3, "+3 PA totais");
  }
  for (const v of LINHAS_VERTICAIS) {
    checarPadrao(v, "vertical", "pd", 3, "+3 PD totais");
  }
  for (const d of LINHAS_DIAGONAIS) {
    checarPadrao(d, "diagonal", "pvMax", 6, "+6 PV totais");
  }
  for (const q of QUADRILATEROS_2X2) {
    checarPadrao(q, "quadrilatero", "velocidade", 3, "+3 Velocidade total");
  }

  return ativos;
}
