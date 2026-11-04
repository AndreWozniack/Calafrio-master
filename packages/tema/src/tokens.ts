export type PersonalidadeCalafrio =
  | "maneiro"
  | "caotico"
  | "esquisito"
  | "racional"
  | "agradavel";

export type DominioEmocional = "positivo" | "negativo";

export type EspectroDeDano =
  | "fisico"
  | "castanho"
  | "rubro"
  | "ceruleo"
  | "alvo"
  | "variavel";

export interface TokenPersonalidade {
  id: PersonalidadeCalafrio;
  nome: string;
  plural: string;
  emoji: string;
  resumo: string;
  corPositiva: string;
  corNegativa: string;
  corBorda: string;
  corTextoClaro: string;
}

export const TOKENS_PERSONALIDADE: Record<
  PersonalidadeCalafrio,
  TokenPersonalidade
> = {
  maneiro: {
    id: "maneiro",
    nome: "Maneiro",
    plural: "Maneiros",
    emoji: "🕶️",
    resumo:
      "Equilíbrio entre combate, utilidade e suporte; fluxo de ânimum próximo ao corpo.",
    corPositiva: "#85A844",
    corNegativa: "#435725",
    corBorda: "#9CC254",
    corTextoClaro: "#ECF5D8",
  },
  caotico: {
    id: "caotico",
    nome: "Caótico",
    plural: "Caóticos",
    emoji: "💣",
    resumo:
      "Alto potencial destrutivo e queima intensa de ânimum especializada para combate.",
    corPositiva: "#D66863",
    corNegativa: "#681D1A",
    corBorda: "#E8827D",
    corTextoClaro: "#FCE4E3",
  },
  esquisito: {
    id: "esquisito",
    nome: "Esquisito",
    plural: "Esquisitos",
    emoji: "👻",
    resumo:
      "Confronto indireto, interação com o mundo dos espíritos, familiares, lacaios e djanhos.",
    corPositiva: "#B676B1",
    corNegativa: "#48284A",
    corBorda: "#CC8EC7",
    corTextoClaro: "#F5E6F4",
  },
  racional: {
    id: "racional",
    nome: "Racional",
    plural: "Racionais",
    emoji: "📚",
    resumo:
      "Técnicas avançadas de utilidade, controle de informação e alcance autónomo de ânimum.",
    corPositiva: "#68A2B9",
    corNegativa: "#1C446B",
    corBorda: "#82BBD1",
    corTextoClaro: "#E1F1F7",
  },
  agradavel: {
    id: "agradavel",
    nome: "Agradável",
    plural: "Agradáveis",
    emoji: "💐",
    resumo:
      "Empatia, suporte tático, manipulação de percepção, gravidade, escala e destino.",
    corPositiva: "#E090B5",
    corNegativa: "#9B1C4C",
    corBorda: "#F0A8CA",
    corTextoClaro: "#FCE8F1",
  },
};

export interface TokenEspectroDano {
  id: EspectroDeDano;
  rotulo: string;
  emoji: string;
  corHex: string;
  elementos: string;
}

export const TOKENS_ESPECTRO_DANO: Record<EspectroDeDano, TokenEspectroDano> = {
  fisico: {
    id: "fisico",
    rotulo: "Físico / Mundano",
    emoji: "🗡️",
    corHex: "#9CA3AF",
    elementos: "Impacto, corte, perfuração e armas mundanas",
  },
  castanho: {
    id: "castanho",
    rotulo: "Castanho",
    emoji: "🪨",
    corHex: "#A16207",
    elementos: "Estabilidade e solidez: terra, metal, magma, poeira e impacto",
  },
  rubro: {
    id: "rubro",
    rotulo: "Rubro",
    emoji: "🔥",
    corHex: "#DC2626",
    elementos: "Energia e volatilidade: fogo, eletricidade, luz e explosões",
  },
  ceruleo: {
    id: "ceruleo",
    rotulo: "Cerúleo",
    emoji: "💧",
    corHex: "#0284C7",
    elementos: "Fluxo e mudança: água, gelo, neve e corrosão",
  },
  alvo: {
    id: "alvo",
    rotulo: "Alvo",
    emoji: "💨",
    corHex: "#E2E8F0",
    elementos: "Movimento e sutileza: ar, som, pressão, fumaça e éter",
  },
  variavel: {
    id: "variavel",
    rotulo: "Variável",
    emoji: "☄️",
    corHex: "#F59E0B",
    elementos: "Varia conforme o contexto de uso entre qualquer espectro",
  },
};

export const CORES_BASE_CALAFRIO = {
  papelFundo: "#F4F4F2",
  papelCartao: "#FFFFFF",
  tintaPreta: "#111113",
  noiteCuritiba: "#0E0E11",
  cartaoEscuro: "#16161B",
  amareloCalafrio: "#F5C542",
} as const;
