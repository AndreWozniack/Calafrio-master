import {
  type ArvoreV1,
  type CustoPAV1,
  calcularFichaV1,
  type FichaCalafrioV1,
  type GrauV1,
  HABILIDADES_1E,
  type MarcadorV1,
  podeMemorizarV1,
} from "@calafrio/core";

export function pontosLivresV1(ficha: FichaCalafrioV1): number {
  const totalEsperado = 3 + ficha.nivel;
  const gasto =
    ficha.atributos.corpo + ficha.atributos.mente + ficha.atributos.alma;
  return totalEsperado - gasto;
}

export interface OpcaoHabilidadeV1 {
  id: string;
  nome: string;
  grau: GrauV1;
  arvore: ArvoreV1;
  custoPA: CustoPAV1;
  descricao: string;
  marcadores: MarcadorV1[];
  disponivel: boolean;
  motivo?: string;
}

export function opcoesHabilidadesV1(
  ficha: FichaCalafrioV1,
): Record<ArvoreV1, OpcaoHabilidadeV1[]> {
  const resultado: Record<ArvoreV1, OpcaoHabilidadeV1[]> = {
    maneiras: [],
    caoticas: [],
    esquisitas: [],
    agradaveis: [],
    racionais: [],
  };

  for (const hab of HABILIDADES_1E) {
    if (hab.grau === 0) continue;
    const checagem = podeMemorizarV1(ficha, hab.id);
    resultado[hab.arvore].push({
      id: hab.id,
      nome: hab.nome,
      grau: hab.grau,
      arvore: hab.arvore,
      custoPA: hab.custoPA,
      descricao: hab.descricao,
      marcadores: hab.marcadores,
      disponivel: checagem.ok,
      motivo: checagem.motivo,
    });
  }

  return resultado;
}

export function podeAvancarV1(
  etapa: number,
  ficha: FichaCalafrioV1,
): { ok: boolean; motivo?: string } {
  const derivada = calcularFichaV1(ficha);

  switch (etapa) {
    case 0: {
      // Identidade
      if (!ficha.nome.trim()) {
        return { ok: false, motivo: "O personagem deve ter um nome." };
      }
      return { ok: true };
    }

    case 1: {
      // Atributos
      const livres = pontosLivresV1(ficha);
      if (livres !== 0) {
        return {
          ok: false,
          motivo:
            livres > 0
              ? `Você ainda tem ${livres} ponto(s) de atributo para distribuir.`
              : `Você distribuiu ${Math.abs(livres)} ponto(s) além do limite permitido.`,
        };
      }
      if (
        ficha.atributos.corpo < 1 ||
        ficha.atributos.mente < 1 ||
        ficha.atributos.alma < 1
      ) {
        return {
          ok: false,
          motivo: "Todos os atributos devem ser no mínimo 1.",
        };
      }
      return { ok: true };
    }

    case 2: {
      // Palavras-chave
      const temOcupacao = ficha.palavrasChave.some(
        (p) => p.categoria === "ocupacao",
      );
      const temPersonalidade = ficha.palavrasChave.some(
        (p) => p.categoria === "personalidade",
      );
      const temMiscelanea = ficha.palavrasChave.some(
        (p) => p.categoria === "miscelanea",
      );

      if (!temOcupacao || !temPersonalidade || !temMiscelanea) {
        return {
          ok: false,
          motivo:
            "É obrigatório definir ao menos 1 Ocupação, 1 Personalidade e 1 Miscelânea.",
        };
      }
      if (ficha.palavrasChave.length > derivada.limitePalavrasChave) {
        return {
          ok: false,
          motivo: `Limite de palavras-chave excedido (máximo ${derivada.limitePalavrasChave}).`,
        };
      }
      return { ok: true };
    }

    case 3: {
      // Habilidades
      if (derivada.pmRestante < 0) {
        return {
          ok: false,
          motivo: `Limite de Memória (PM) excedido em ${Math.abs(derivada.pmRestante)} ponto(s).`,
        };
      }
      const avisosGraves = derivada.avisos.filter(
        (a) =>
          a.codigo === "REQUISITO_NAO_ATENDIDO" ||
          a.codigo === "LIMITE_PM_EXCEDIDO",
      );
      if (avisosGraves.length > 0) {
        return { ok: false, motivo: avisosGraves[0].mensagem };
      }
      return { ok: true };
    }

    case 4: {
      // Equipamentos e Fundos
      if (ficha.carteira.fundos < 1 || ficha.carteira.fundos > 12) {
        return {
          ok: false,
          motivo: "Os fundos iniciais devem estar entre F$ 1 e F$ 12.",
        };
      }
      return { ok: true };
    }

    default:
      return { ok: true };
  }
}
