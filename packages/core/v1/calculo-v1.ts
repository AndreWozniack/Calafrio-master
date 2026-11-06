import { obterHabilidade1e } from "./catalogo";
import type { AvisoV1, FichaCalafrioV1, FichaDerivadaV1 } from "./modelo-v1";
import {
  CUSTO_PM_POR_GRAU,
  MAX_APRIMORAMENTOS_V1,
  NIVEL_MAX_V1,
  NIVEL_MIN_V1,
} from "./modelo-v1";
import { grauZeroMemorizadosV1, habilidadesValidasV1 } from "./regras-v1";

export function calcularFichaV1(f: FichaCalafrioV1): FichaDerivadaV1 {
  const avisos: AvisoV1[] = [];

  const nivelValido =
    Number.isInteger(f.nivel) &&
    f.nivel >= NIVEL_MIN_V1 &&
    f.nivel <= NIVEL_MAX_V1;

  if (!nivelValido) {
    avisos.push({
      codigo: "NIVEL_INVALIDO",
      mensagem: `Nível deve ser um número inteiro entre ${NIVEL_MIN_V1} e ${NIVEL_MAX_V1}.`,
    });
  }

  const pontosAtributoEsperados = 3 + f.nivel;
  const { corpo, mente, alma } = f.atributos;
  const somaAtributos = corpo + mente + alma;

  const atributosValidos =
    Number.isInteger(corpo) &&
    Number.isInteger(mente) &&
    Number.isInteger(alma) &&
    corpo >= 1 &&
    mente >= 1 &&
    alma >= 1;

  if (!atributosValidos || somaAtributos > pontosAtributoEsperados) {
    avisos.push({
      codigo: "PONTOS_ATRIBUTO_INVALIDOS",
      mensagem:
        "Atributos devem ser maiores ou iguais a 1 e o total não pode exceder 3 + Nível.",
    });
  } else if (somaAtributos < pontosAtributoEsperados) {
    avisos.push({
      codigo: "PONTOS_ATRIBUTO_PENDENTES",
      mensagem: "Existem pontos de atributo livres para distribuir.",
    });
  }

  const pd = 3 + corpo * 3;
  const pmMax = mente * 6;
  const paMax = alma * 9;
  const pvMax = f.nivel * 6;
  const ba = f.nivel;
  const velocidade = 6;
  const ecosMax = f.nivel;
  const limitePalavrasChave = 2 + f.nivel;

  const habilidadesValidas = habilidadesValidasV1(f.habilidades);
  const grauZeroMemorizados = grauZeroMemorizadosV1(habilidadesValidas);

  let pmGasto = 0;
  let ecosGastos = 0;

  for (const h of f.habilidades) {
    const c = obterHabilidade1e(h.id);
    if (!c) {
      avisos.push({
        codigo: "HABILIDADE_DESCONHECIDA",
        mensagem: `Habilidade com ID "${h.id}" não foi encontrada no catálogo.`,
        alvoId: h.id,
      });
    } else if (c.grau === 0) {
      avisos.push({
        codigo: "GRAU_ZERO_EXPLICITO",
        mensagem: `Habilidade "${c.nome}" é de Grau 0 e é concedida automaticamente; não deve ser gravada na ficha.`,
        alvoId: h.id,
      });
    } else {
      const custo = CUSTO_PM_POR_GRAU[c.grau];
      const pmExtra = h.pmExtra ?? 0;
      pmGasto += custo + pmExtra;

      if (h.pmExtra !== undefined) {
        if (!c.permitePmExtra || h.pmExtra < 0 || h.pmExtra % 3 !== 0) {
          avisos.push({
            codigo: "PM_EXTRA_INVALIDO",
            mensagem: `Habilidade "${c.nome}" recebeu alocação de PM extra inválida (${h.pmExtra}).`,
            alvoId: h.id,
          });
        }
      }

      if (!habilidadesValidas.includes(h.id)) {
        avisos.push({
          codigo: "REQUISITO_NAO_ATENDIDO",
          mensagem: `Habilidade "${c.nome}" não atende aos pré-requisitos de ligação de graus anteriores.`,
          alvoId: h.id,
        });
      }
    }

    ecosGastos += h.aprimoramentos.length;
    if (h.aprimoramentos.length > MAX_APRIMORAMENTOS_V1) {
      avisos.push({
        codigo: "APRIMORAMENTOS_EXCEDIDOS",
        mensagem: `Habilidade possui mais que o limite de ${MAX_APRIMORAMENTOS_V1} aprimoramentos.`,
        alvoId: h.id,
      });
    }
  }

  for (const u of f.habilidadesUnicas) {
    ecosGastos += 1 + u.aprimoramentos.length;
    if (u.aprimoramentos.length > MAX_APRIMORAMENTOS_V1) {
      avisos.push({
        codigo: "APRIMORAMENTOS_EXCEDIDOS",
        mensagem: `Habilidade Única "${u.nome}" possui mais que o limite de ${MAX_APRIMORAMENTOS_V1} aprimoramentos.`,
        alvoId: u.id,
      });
    }
  }

  const pmRestante = pmMax - pmGasto;
  if (pmRestante < 0) {
    avisos.push({
      codigo: "LIMITE_PM_EXCEDIDO",
      mensagem: `Total de PM gasto (${pmGasto}) excede o limite máximo de PM (${pmMax}).`,
    });
  }

  if (ecosGastos > ecosMax) {
    avisos.push({
      codigo: "LIMITE_ECOS_EXCEDIDO",
      mensagem: `Total de Ecos Psíquicos investidos (${ecosGastos}) excede o limite do nível (${ecosMax}).`,
    });
  }

  if (f.palavrasChave.length > limitePalavrasChave) {
    avisos.push({
      codigo: "PALAVRAS_CHAVE_EXCEDIDAS",
      mensagem: `Número de palavras-chave (${f.palavrasChave.length}) excede o limite (${limitePalavrasChave}).`,
    });
  }

  return {
    pd,
    pmMax,
    paMax,
    pvMax,
    ba,
    velocidade,
    ecosMax,
    limitePalavrasChave,
    pmGasto,
    pmRestante,
    ecosGastos,
    pontosAtributoEsperados,
    habilidadesValidas,
    grauZeroMemorizados,
    avisos,
  };
}
