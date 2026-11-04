export type ModoRolagemD20 = "normal" | "vantagem" | "desvantagem";

export interface ResultadoTesteAcao {
  dados: number[];
  dadoEscolhido: number;
  apt: number;
  bonusExtra: number;
  total: number;
  dificuldade: number;
  sucesso: boolean;
  critico: "sucesso_critico" | "falha_critica" | "nenhum";
}

export interface ResultadoContestacao {
  dadosAtacante: number[];
  dadoEscolhidoAtacante: number;
  aptAtacante: number;
  bonusAtacante: number;
  totalAtacante: number;
  criticoAtacante: "sucesso_critico" | "falha_critica" | "nenhum";

  dadosVitima: number[];
  dadoEscolhidoVitima: number;
  aptVitima: number;
  bonusVitima: number;
  totalBrutoVitima: number;
  pdVitima: number;
  pisoPdAplicado: boolean;
  totalEfetivoVitima: number;
  criticoVitima: "sucesso_critico" | "falha_critica" | "nenhum";

  vencedor: "atacante" | "vitima";
}

function rolarD20(): number {
  return Math.floor(Math.random() * 20) + 1;
}

export function rolarTesteAcao(opcoes: {
  apt: number;
  bonusExtra?: number;
  modo: ModoRolagemD20;
  dificuldade: number;
  dadosInjetados?: [number, number?];
}): ResultadoTesteAcao {
  const bonus = opcoes.bonusExtra ?? 0;
  let dados: number[];
  if (opcoes.dadosInjetados) {
    dados = opcoes.dadosInjetados.filter((d): d is number => d !== undefined);
  } else {
    dados = opcoes.modo === "normal" ? [rolarD20()] : [rolarD20(), rolarD20()];
  }

  let dadoEscolhido = dados[0];
  if (opcoes.modo === "vantagem" && dados.length > 1) {
    dadoEscolhido = Math.max(dados[0], dados[1]);
  } else if (opcoes.modo === "desvantagem" && dados.length > 1) {
    dadoEscolhido = Math.min(dados[0], dados[1]);
  }

  const critico: ResultadoTesteAcao["critico"] =
    dadoEscolhido === 20
      ? "sucesso_critico"
      : dadoEscolhido === 1
        ? "falha_critica"
        : "nenhum";

  const total = dadoEscolhido + opcoes.apt + bonus;
  const sucesso =
    critico === "sucesso_critico"
      ? true
      : critico === "falha_critica"
        ? false
        : total >= opcoes.dificuldade;

  return {
    dados,
    dadoEscolhido,
    apt: opcoes.apt,
    bonusExtra: bonus,
    total,
    dificuldade: opcoes.dificuldade,
    sucesso,
    critico,
  };
}

export function rolarContestacao(opcoes: {
  aptAtacante: number;
  bonusAtacante?: number;
  modoAtacante: ModoRolagemD20;
  aptVitima: number;
  pdVitima: number;
  bonusVitima?: number;
  modoVitima: ModoRolagemD20;
  dadosAtacante?: [number, number?];
  dadosVitima?: [number, number?];
}): ResultadoContestacao {
  const bonusAtacante = opcoes.bonusAtacante ?? 0;
  const bonusVitima = opcoes.bonusVitima ?? 0;

  // Atacante
  const dadosAtacante =
    opcoes.dadosAtacante?.filter((d): d is number => d !== undefined) ??
    (opcoes.modoAtacante === "normal"
      ? [rolarD20()]
      : [rolarD20(), rolarD20()]);

  let dadoAtacante = dadosAtacante[0];
  if (opcoes.modoAtacante === "vantagem" && dadosAtacante.length > 1) {
    dadoAtacante = Math.max(dadosAtacante[0], dadosAtacante[1]);
  } else if (
    opcoes.modoAtacante === "desvantagem" &&
    dadosAtacante.length > 1
  ) {
    dadoAtacante = Math.min(dadosAtacante[0], dadosAtacante[1]);
  }

  const criticoAtacante: ResultadoContestacao["criticoAtacante"] =
    dadoAtacante === 20
      ? "sucesso_critico"
      : dadoAtacante === 1
        ? "falha_critica"
        : "nenhum";

  const totalAtacante = dadoAtacante + opcoes.aptAtacante + bonusAtacante;

  // Vítima
  const dadosVitima =
    opcoes.dadosVitima?.filter((d): d is number => d !== undefined) ??
    (opcoes.modoVitima === "normal" ? [rolarD20()] : [rolarD20(), rolarD20()]);

  let dadoVitima = dadosVitima[0];
  if (opcoes.modoVitima === "vantagem" && dadosVitima.length > 1) {
    dadoVitima = Math.max(dadosVitima[0], dadosVitima[1]);
  } else if (opcoes.modoVitima === "desvantagem" && dadosVitima.length > 1) {
    dadoVitima = Math.min(dadosVitima[0], dadosVitima[1]);
  }

  const criticoVitima: ResultadoContestacao["criticoVitima"] =
    dadoVitima === 20
      ? "sucesso_critico"
      : dadoVitima === 1
        ? "falha_critica"
        : "nenhum";

  const totalBrutoVitima = dadoVitima + opcoes.aptVitima + bonusVitima;

  // Em contestações hostis das quais for vítima, os PD correspondem ao resultado mínimo
  // Exceto se tirou 1 natural (pior falha possível)
  let pisoPdAplicado = false;
  let totalEfetivoVitima = totalBrutoVitima;
  if (criticoVitima !== "falha_critica" && totalBrutoVitima < opcoes.pdVitima) {
    totalEfetivoVitima = opcoes.pdVitima;
    pisoPdAplicado = true;
  }

  let vencedor: "atacante" | "vitima";
  if (criticoAtacante === "sucesso_critico") {
    vencedor = "atacante";
  } else if (criticoAtacante === "falha_critica") {
    vencedor = "vitima";
  } else if (criticoVitima === "sucesso_critico") {
    vencedor = "vitima";
  } else if (criticoVitima === "falha_critica") {
    vencedor = "atacante";
  } else {
    // Maior resultado obtém sucesso; se empate, vítima se defende
    vencedor = totalAtacante > totalEfetivoVitima ? "atacante" : "vitima";
  }

  return {
    dadosAtacante,
    dadoEscolhidoAtacante: dadoAtacante,
    aptAtacante: opcoes.aptAtacante,
    bonusAtacante,
    totalAtacante,
    criticoAtacante,
    dadosVitima,
    dadoEscolhidoVitima: dadoVitima,
    aptVitima: opcoes.aptVitima,
    bonusVitima,
    totalBrutoVitima,
    pdVitima: opcoes.pdVitima,
    pisoPdAplicado,
    totalEfetivoVitima,
    criticoVitima,
    vencedor,
  };
}
