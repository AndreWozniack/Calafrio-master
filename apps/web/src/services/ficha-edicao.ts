import {
  calcularFichaV1,
  ehFichaV1,
  type FichaPersonagem,
} from "@calafrio/core";

export function resumirVitais(ficha: FichaPersonagem): {
  aptBase: number;
  pvMax: number;
  paMax: number;
  pd: number;
} {
  if (ehFichaV1(ficha)) {
    const d = calcularFichaV1(ficha);
    return {
      aptBase: d.ba,
      pvMax: d.pvMax,
      paMax: d.paMax,
      pd: d.pd,
    };
  }
  const apt = ficha.aptBase || 1;
  return {
    aptBase: apt,
    pvMax: 3 + 3 * apt,
    paMax: 3 + 3 * apt,
    pd: 3 * apt,
  };
}

export function resumirPlayer(ficha: FichaPersonagem): {
  ocupacao: string;
  totalHabilidades: number;
} {
  if (ehFichaV1(ficha)) {
    const ocupacao =
      ficha.palavrasChave.find((pc) => pc.categoria === "ocupacao")?.nome ??
      "Player";
    return {
      ocupacao,
      totalHabilidades: ficha.habilidades.length,
    };
  }
  const ocupacao =
    ficha.palavrasChave.find((pc) => pc.categoria === "ocupacao")?.nome ??
    "Player";
  return {
    ocupacao,
    totalHabilidades: ficha.matrizHabilidades.length,
  };
}
