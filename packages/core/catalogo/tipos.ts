import type {
  DominioEmocional,
  EspectroDeDano,
  PersonalidadeCalafrio,
} from "@calafrio/tema";

export type TipoAcaoCalafrio =
  | "padrao"
  | "livre"
  | "reflexo"
  | "livre_ou_reflexo"
  | "preparada"
  | "passiva";

export type ModoFoco = "nao" | "sim" | "condicional";

export interface HabilidadeParanormalCatalogo {
  id: string;
  nome: string;
  personalidade: PersonalidadeCalafrio;
  dominio: DominioEmocional;
  tipoAcao: TipoAcaoCalafrio;
  tempoPreparacao?: string;
  custoPA: number;
  permiteCustoEmPV?: boolean;
  requerFoco: ModoFoco;
  requerTabelaSuporte?: "familiares" | "lacaios" | "djanhos";
  espectroDano?: EspectroDeDano;
  alcance?: string;
  duracao?: string;
  descricao: string;
}

export interface EntradaTabelaD100 {
  numero: number;
  nome: string;
}

export interface ArmaMundanaCatalogo {
  id: string;
  categoria: string;
  tipoAlcance:
    | "Alcance misto"
    | "Alcance corpo-a-corpo"
    | "Consumível"
    | "Longo-alcance";
  precoFundos: number;
  exemplos: string;
  dano: number;
  espectroDano: EspectroDeDano;
  propriedades: string[];
}

export interface FamiliarCatalogo {
  dado: number;
  nome: string;
  descricao: string;
  propriedades: string;
}

export interface LacaioCatalogo {
  dado: number;
  nome: string;
  descricao: string;
  pv: number;
  pd: number;
  aptBonus: number;
  velocidade: number;
  propriedades: string;
}

export interface DjanhoCatalogo {
  dado: number;
  nome: string;
  propriedades: string;
}

export interface TermoGlossario {
  termo: string;
  definicao: string;
}

export interface CatalogoCalafrio {
  readonly habilidadesParanormais: readonly HabilidadeParanormalCatalogo[];
  readonly palavrasChaveGenericas: readonly EntradaTabelaD100[];
  readonly ocupacoes: readonly EntradaTabelaD100[];
  readonly bugigangas: readonly EntradaTabelaD100[];
  readonly armasMundanas: readonly ArmaMundanaCatalogo[];
  readonly familiares: readonly FamiliarCatalogo[];
  readonly lacaios: readonly LacaioCatalogo[];
  readonly djanhos: readonly DjanhoCatalogo[];
  readonly glossario: readonly TermoGlossario[];
}
