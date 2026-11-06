export type ArvoreV1 =
  | "maneiras"
  | "caoticas"
  | "esquisitas"
  | "agradaveis"
  | "racionais";

export type GrauV1 = 0 | 1 | 2 | 3;

export interface AtributosV1 {
  corpo: number;
  mente: number;
  alma: number;
}

export interface AprimoramentoV1 {
  id: string;
  descricao: string;
}

export interface HabilidadeMemorizadaV1 {
  id: string;
  aprimoramentos: AprimoramentoV1[];
  pmExtra?: number;
}

export interface HabilidadeUnicaV1 {
  id: string;
  nome: string;
  descricao: string;
  passiva: boolean;
  aprimoramentos: AprimoramentoV1[];
}

export type CategoriaPalavraChaveV1 =
  | "ocupacao"
  | "personalidade"
  | "miscelanea"
  | "livre";

export interface PalavraChaveV1 {
  id: string;
  nome: string;
  categoria: CategoriaPalavraChaveV1;
}

export interface ItemV1 {
  id: string;
  nome: string;
  quantidade: number;
  notas?: string;
}

export interface FichaCalafrioV1 {
  edicao: "1e";
  id: string;
  nome: string;
  jogador?: string;
  nivel: number;
  atributos: AtributosV1;
  pvAtual: number;
  paAtual: number;
  carteira: { fundos: number; espirions: number };
  palavrasChave: PalavraChaveV1[];
  habilidades: HabilidadeMemorizadaV1[]; // sem Grau 0 (derivado)
  habilidadesUnicas: HabilidadeUnicaV1[];
  inventario: ItemV1[];
  quemSouEu: string;
  anotacoes: string;
  ilustracaoUrl?: string;
}

export type CustoPAV1 = number | "passivo";
export type MarcadorV1 = "cadeado" | "interrogacao";

export interface HabilidadeCatalogoV1 {
  id: string;
  nome: string;
  arvore: ArvoreV1;
  grau: GrauV1;
  custoPA: CustoPAV1;
  requisitos: string[];
  descricao: string;
  marcadores: MarcadorV1[];
  permitePmExtra?: boolean;
}

export const CUSTO_PM_POR_GRAU: Record<GrauV1, number> = {
  0: 0,
  1: 3,
  2: 6,
  3: 12,
};

export const MAX_APRIMORAMENTOS_V1 = 2;
export const CUSTO_PA_HABILIDADE_UNICA_V1 = 3;
export const NIVEL_MIN_V1 = 1;
export const NIVEL_MAX_V1 = 10;

export type CodigoAvisoV1 =
  | "NIVEL_INVALIDO"
  | "PONTOS_ATRIBUTO_PENDENTES"
  | "PONTOS_ATRIBUTO_INVALIDOS"
  | "LIMITE_PM_EXCEDIDO"
  | "LIMITE_ECOS_EXCEDIDO"
  | "APRIMORAMENTOS_EXCEDIDOS"
  | "REQUISITO_NAO_ATENDIDO"
  | "HABILIDADE_DESCONHECIDA"
  | "GRAU_ZERO_EXPLICITO"
  | "PM_EXTRA_INVALIDO"
  | "PALAVRAS_CHAVE_EXCEDIDAS";

export interface AvisoV1 {
  codigo: CodigoAvisoV1;
  mensagem: string;
  alvoId?: string;
}

export interface FichaDerivadaV1 {
  pd: number;
  pmMax: number;
  paMax: number;
  pvMax: number;
  ba: number;
  velocidade: number;
  ecosMax: number;
  limitePalavrasChave: number;
  pmGasto: number;
  pmRestante: number;
  ecosGastos: number;
  pontosAtributoEsperados: number;
  habilidadesValidas: string[];
  grauZeroMemorizados: string[];
  avisos: AvisoV1[];
}
