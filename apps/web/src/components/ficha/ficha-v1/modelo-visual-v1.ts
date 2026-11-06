import {
  type AprimoramentoV1,
  type ArvoreV1,
  CUSTO_PM_POR_GRAU,
  type CustoPAV1,
  type FichaCalafrioV1,
  type FichaDerivadaV1,
  type GrauV1,
  type MarcadorV1,
  obterHabilidade1e,
} from "@calafrio/core";

export interface LinhaHabilidadeV1Visual {
  id: string;
  nome: string;
  arvore: ArvoreV1;
  grau: GrauV1;
  grauRomano: "0" | "I" | "II" | "III";
  custoPA: CustoPAV1;
  custoTexto: string;
  custoPM: number;
  pmExtra?: number;
  descricao: string;
  marcadores: MarcadorV1[];
  aprimoramentos: AprimoramentoV1[];
  automatica: boolean;
  invalida: boolean;
}

export function formatarGrauRomano(grau: GrauV1): "0" | "I" | "II" | "III" {
  switch (grau) {
    case 0:
      return "0";
    case 1:
      return "I";
    case 2:
      return "II";
    case 3:
      return "III";
  }
}

export function formatarCustoPA(custoPA: CustoPAV1): string {
  if (custoPA === "passivo") return "Passivo";
  return `${custoPA} PA / uso`;
}

const ORDEM_ARVORES: Record<ArvoreV1, number> = {
  maneiras: 1,
  caoticas: 2,
  esquisitas: 3,
  agradaveis: 4,
  racionais: 5,
};

export function linhasHabilidadesV1(
  ficha: FichaCalafrioV1,
  derivada: FichaDerivadaV1,
): LinhaHabilidadeV1Visual[] {
  const linhas: LinhaHabilidadeV1Visual[] = [];

  // 1. Grau 0 derivado
  for (const id of derivada.grauZeroMemorizados) {
    const c = obterHabilidade1e(id);
    if (!c) continue;
    linhas.push({
      id: c.id,
      nome: c.nome,
      arvore: c.arvore,
      grau: 0,
      grauRomano: "0",
      custoPA: c.custoPA,
      custoTexto: formatarCustoPA(c.custoPA),
      custoPM: 0,
      descricao: c.descricao,
      marcadores: c.marcadores,
      aprimoramentos: [],
      automatica: true,
      invalida: false,
    });
  }

  // 2. Habilidades memorizadas
  for (const h of ficha.habilidades) {
    const c = obterHabilidade1e(h.id);
    if (!c) continue;
    linhas.push({
      id: c.id,
      nome: c.nome,
      arvore: c.arvore,
      grau: c.grau,
      grauRomano: formatarGrauRomano(c.grau),
      custoPA: c.custoPA,
      custoTexto: formatarCustoPA(c.custoPA),
      custoPM: CUSTO_PM_POR_GRAU[c.grau],
      pmExtra: h.pmExtra,
      descricao: c.descricao,
      marcadores: c.marcadores,
      aprimoramentos: h.aprimoramentos,
      automatica: false,
      invalida: !derivada.habilidadesValidas.includes(h.id),
    });
  }

  // Ordenar por árvore e depois por grau
  linhas.sort((a, b) => {
    const ordemA = ORDEM_ARVORES[a.arvore] ?? 99;
    const ordemB = ORDEM_ARVORES[b.arvore] ?? 99;
    if (ordemA !== ordemB) return ordemA - ordemB;
    if (a.grau !== b.grau) return a.grau - b.grau;
    return a.nome.localeCompare(b.nome);
  });

  return linhas;
}

export function resumoVitaisV1(
  derivada: FichaDerivadaV1,
  ficha: FichaCalafrioV1,
) {
  return {
    pv: `${ficha.pvAtual} / ${derivada.pvMax}`,
    pa: `${ficha.paAtual} / ${derivada.paMax}`,
    pm: `${derivada.pmGasto} / ${derivada.pmMax}`,
    pd: derivada.pd,
    ba: `+${derivada.ba}`,
    velocidade: derivada.velocidade,
    ecos: `${derivada.ecosGastos} / ${derivada.ecosMax}`,
  };
}
