import type { EspectroDeDano } from "@calafrio/tema";
import type { CatalogoCalafrio } from "../catalogo/tipos";
import type { EstadoDeJogoCalafrio, FichaCalafrio } from "./modelo";
import { montarFichaCalafrio } from "./montar-ficha";

export function aplicarDanoCalafrio(
  ficha: FichaCalafrio,
  catalogo: CatalogoCalafrio,
  estado: EstadoDeJogoCalafrio,
  opcoes: {
    danoBruto: number;
    espectro: EspectroDeDano;
    paParaMitigar?: number;
  },
): EstadoDeJogoCalafrio {
  const derivada = montarFichaCalafrio(ficha, catalogo, estado);
  const grau = derivada.resistencias[opcoes.espectro];

  let danoAjustado = Math.max(0, opcoes.danoBruto);
  if (grau === "imune") {
    danoAjustado = 0;
  } else if (grau === "resistente") {
    danoAjustado = Math.floor(danoAjustado / 2);
  } else if (grau === "vulneravel") {
    danoAjustado = danoAjustado * 2;
  }

  const paMitigado = derivada.pvUnificadoComPa
    ? 0
    : Math.min(
        Math.max(0, opcoes.paParaMitigar ?? 0),
        derivada.paAtual,
        danoAjustado,
      );

  const danoRestante = Math.max(0, danoAjustado - paMitigado);
  const absorvidoPorTemp = Math.min(estado.pvTemporario, danoRestante);
  const danoNoPv = danoRestante - absorvidoPorTemp;

  const novoDanoSofrido = Math.min(
    derivada.pvMax,
    estado.danoSofrido + danoNoPv,
  );
  const caiuAgora =
    derivada.pvAtual > 0 &&
    derivada.pvMax +
      (estado.pvTemporario - absorvidoPorTemp) -
      novoDanoSofrido <=
      0;

  return {
    ...estado,
    paGasto: estado.paGasto + paMitigado,
    pvTemporario: estado.pvTemporario - absorvidoPorTemp,
    danoSofrido: novoDanoSofrido,
    quedasSemTratamento: caiuAgora
      ? estado.quedasSemTratamento + 1
      : estado.quedasSemTratamento,
  };
}

export function aplicarAtividadeHabilidade(
  ficha: FichaCalafrio,
  catalogo: CatalogoCalafrio,
  estado: EstadoDeJogoCalafrio,
  opcoes: {
    custo: number;
    recurso: "pa" | "pv" | "nenhum";
    ativarFocoId?: string;
  },
): EstadoDeJogoCalafrio {
  const derivada = montarFichaCalafrio(ficha, catalogo, estado);
  const custo = Math.max(0, opcoes.custo);

  const cobrarEmPv =
    opcoes.recurso === "pv" ||
    (opcoes.recurso === "pa" && derivada.pvUnificadoComPa);

  return {
    ...estado,
    danoSofrido: cobrarEmPv
      ? Math.min(derivada.pvMax, estado.danoSofrido + custo)
      : estado.danoSofrido,
    paGasto:
      opcoes.recurso === "pa" && !derivada.pvUnificadoComPa
        ? Math.min(derivada.paMax, estado.paGasto + custo)
        : estado.paGasto,
    focoAtivoId: opcoes.ativarFocoId ?? estado.focoAtivoId,
  };
}

export function aplicarDescansoCalafrio(
  ficha: FichaCalafrio,
  catalogo: CatalogoCalafrio,
  estado: EstadoDeJogoCalafrio,
  opcoes: {
    tipo: "curto" | "longo";
    horas?: number;
    modo: "fixo" | "rolado";
    valoresRolados?: number[];
  },
): EstadoDeJogoCalafrio {
  const derivada = montarFichaCalafrio(ficha, catalogo, estado);
  const horas = Math.max(1, opcoes.horas ?? 1);

  if (opcoes.tipo === "curto") {
    const recPa =
      opcoes.modo === "fixo"
        ? 9 * horas
        : (opcoes.valoresRolados ?? [4]).reduce((a, b) => a + b, 0);

    if (derivada.pvUnificadoComPa) {
      return {
        ...estado,
        danoSofrido: Math.max(0, estado.danoSofrido - recPa),
      };
    }
    return {
      ...estado,
      paGasto: Math.max(0, estado.paGasto - recPa),
    };
  }

  // Descanso longo (8h: 4h sono + 4h lazer): regenera 6 PV (ou 1d6 PV no PDF de consulta) + todo o PA
  const recPv =
    opcoes.modo === "fixo" ? 6 : (opcoes.valoresRolados?.[0] ?? 6);

  return {
    ...estado,
    danoSofrido: Math.max(0, estado.danoSofrido - recPv),
    paGasto: 0,
    focoAtivoId: undefined,
  };
}
