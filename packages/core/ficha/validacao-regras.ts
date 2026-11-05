import type { AvisoDeRegraCalafrio, FichaDerivadaCalafrio } from "./modelo";

export interface ParametrosValidacaoRegra {
  dominioAtual: FichaDerivadaCalafrio["dominioAtual"];
  permitirDominioMisto: boolean;
  habilidadesMemorizadasCount: number;
  limiteHabilidadesMemorizadas: number;
  palavrasChaveOcupadas: number;
  limitePalavrasChave: number;
  ecosUsados: number;
  ecosMax: number;
}

export function validarAvisosDeRegra(
  params: ParametrosValidacaoRegra,
): AvisoDeRegraCalafrio[] {
  const avisos: AvisoDeRegraCalafrio[] = [];

  if (params.dominioAtual === "misto" && !params.permitirDominioMisto) {
    avisos.push({
      codigo: "DOMINIO_MISTO",
      mensagem:
        "Habilidades dos Domínios Positivo e Negativo não podem ser memorizadas simultaneamente (exceto com liberação do MdJ / Eco).",
    });
  }

  if (
    params.habilidadesMemorizadasCount > params.limiteHabilidadesMemorizadas
  ) {
    avisos.push({
      codigo: "LIMITE_HABILIDADES_EXCEDIDO",
      mensagem: `Você alocou ${params.habilidadesMemorizadasCount} habilidades na matriz, mas seu limite atual é ${params.limiteHabilidadesMemorizadas} (= APT).`,
    });
  }

  if (params.palavrasChaveOcupadas > params.limitePalavrasChave) {
    avisos.push({
      codigo: "LIMITE_PALAVRAS_CHAVE_EXCEDIDO",
      mensagem: `Você possui ${params.palavrasChaveOcupadas} palavras-chave base, mas seu limite atual é ${params.limitePalavrasChave} (2 + APT).`,
    });
  }

  if (params.ecosUsados > params.ecosMax) {
    avisos.push({
      codigo: "LIMITE_ECOS_EXCEDIDO",
      mensagem: `Você utilizou ${params.ecosUsados} Ecos, mas possui apenas ${params.ecosMax} disponíveis.`,
    });
  }

  return avisos;
}
