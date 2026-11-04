import {
  type FichaCalafrio,
  criarFichaCalafrioVazia,
} from "@calafrio/core";

export const FICHA_EXEMPLO_BRENDO: FichaCalafrio = {
  id: "brendo-grunevald",
  nome: "Brendo (Investigador)",
  jogador: "Brendo Grunevald",
  aptBase: 2,
  carteira: { fundos: 8, espirions: 2 },
  palavrasChave: [
    {
      id: "pc-1",
      nome: "Detetive do submundo",
      categoria: "ocupacao",
      semConsumirLimite: false,
      notas: "Conhece cada viela e tubo de Curitiba",
      efeitos: [],
    },
    {
      id: "pc-2",
      nome: "Reflexos rápidos",
      categoria: "talento",
      semConsumirLimite: false,
      notas: "Reage no primeiro sinal de anomalia",
      efeitos: [],
    },
    {
      id: "pc-3",
      nome: "Paranóico(a)",
      categoria: "falha",
      semConsumirLimite: false,
      notas: "Nunca dá as costas para uma porta",
      efeitos: [],
    },
    {
      id: "pc-4",
      nome: "Criador de bugigangas",
      categoria: "extra",
      semConsumirLimite: false,
      notas: "Modifica objetos do cotidiano",
      efeitos: [],
    },
  ],
  matrizHabilidades: [
    { slot: 0, tipo: "paranormal", id: "ressonancia" },
    { slot: 4, tipo: "paranormal", id: "configuracao-petrea" },
  ],
  habilidadesUnicas: [
    {
      id: "unica-guarda-chuva",
      nome: "Guarda-Chuva de Impacto",
      tipoAcao: "padrao",
      custo: 3,
      recurso: "pa",
      descricao:
        "O guarda-chuva se abre subitamente com lâminas retráteis, causando 6 de dano físico e empurrando o alvo em 3 metros.",
      personalidadeAlinhamento: "maneiro",
      ecosInvestidos: 1,
      efeitos: [],
    },
  ],
  customizacoesEco: [],
  inventario: [
    {
      id: "item-1",
      nome: "Guarda-chuva reforçado",
      categoria: "arma_misto",
      paranormal: true,
      equipado: true,
      precoFundos: 1,
      dano: 6,
      espectroDano: "fisico",
      descricao: "Acessório elegante adaptado com ânimum.",
      propriedades: ["(A) Pode ser usado como porrete ou disparador."],
      efeitos: [],
    },
    {
      id: "item-2",
      nome: "Isqueiro velho",
      categoria: "bugiganga",
      paranormal: false,
      equipado: false,
      efeitos: [],
    },
    {
      id: "item-3",
      nome: "Mapa turístico da cidade",
      categoria: "bugiganga",
      paranormal: false,
      equipado: false,
      efeitos: [],
    },
  ],
  efeitosCustomizados: [],
  anotacoes:
    "Primeiro encontro nas esquinas nebulosas de Curitiba. A criatura desceu do telhado de um tubo de ônibus.",
};

export function obterFichaInicial(): FichaCalafrio {
  return { ...FICHA_EXEMPLO_BRENDO };
}

export function obterNovaFichaEmBranco(nome = "Novo Neural"): FichaCalafrio {
  return criarFichaCalafrioVazia(`calafrio-${Date.now()}`, nome);
}
