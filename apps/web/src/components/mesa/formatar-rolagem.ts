import type { ResultadoContestacao, ResultadoTesteAcao } from "@calafrio/core";
import type { NovaRolagemMesa } from "@/services/rolagens-mesa";

type Contexto = { mesaId: string; autor: string; acao: string };
type RolagemSemContexto = Omit<NovaRolagemMesa, keyof Contexto>;

export function formatarTesteAcao(
  r: ResultadoTesteAcao,
  ctx: Contexto,
): NovaRolagemMesa {
  const desfecho: NovaRolagemMesa["desfecho"] =
    r.critico === "sucesso_critico"
      ? "critico"
      : r.critico === "falha_critica"
        ? "desastre"
        : r.sucesso
          ? "sucesso"
          : "falha";
  const veredito: Record<NovaRolagemMesa["desfecho"], string> = {
    critico: "20 natural — sucesso crítico",
    desastre: "1 natural — falha crítica",
    sucesso: `Sucesso vs ${r.dificuldade}`,
    falha: `Falha vs ${r.dificuldade}`,
  };
  const corpo: RolagemSemContexto = {
    tipo: "acao",
    total: r.total,
    detalhe: `d20 (${r.dados.join(", ")}) → ${r.dadoEscolhido} + APT ${r.apt}`,
    veredito: veredito[desfecho],
    desfecho,
  };
  return { ...ctx, ...corpo };
}

export function formatarContestacao(
  r: ResultadoContestacao,
  ctx: Contexto,
): NovaRolagemMesa {
  const venceu = r.vencedor === "atacante";
  const corpo: RolagemSemContexto = {
    tipo: "contestacao",
    total: r.totalAtacante,
    detalhe: `${r.totalAtacante} vs ${r.totalEfetivoVitima}${
      r.pisoPdAplicado ? ` (piso PD ${r.pdVitima})` : ""
    }`,
    veredito: venceu ? "Contestação vencida" : "Alvo resistiu",
    desfecho: venceu ? "sucesso" : "falha",
  };
  return { ...ctx, ...corpo };
}
