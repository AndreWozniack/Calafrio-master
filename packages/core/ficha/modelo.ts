import type { EspectroDeDano, PersonalidadeCalafrio } from "@calafrio/tema";
import type { TipoAcaoCalafrio } from "../catalogo/tipos";
import type {
  CategoriaPalavraChave,
  EfeitoCalafrio,
  ModificadorResolvido,
} from "./efeitos";

export type IndiceSlotMatriz = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;

export interface AlocacaoSlotMatriz {
  slot: IndiceSlotMatriz | number;
  tipo: "paranormal" | "unica";
  id: string;
}

export interface PalavraChaveNaFicha {
  id: string;
  nome: string;
  categoria: CategoriaPalavraChave;
  semConsumirLimite: boolean;
  notas?: string;
  efeitos: EfeitoCalafrio[];
}

export type RecursoDeAtivacao =
  | "pa"
  | "pv"
  | "nenhum"
  | "consumivel"
  | "condicao";

export interface HabilidadeUnicaCalafrio {
  id: string;
  nome: string;
  tipoAcao: TipoAcaoCalafrio;
  tempoPreparacao?: string;
  custo: number;
  recurso: RecursoDeAtivacao;
  requerFoco?: boolean;
  espectroDano?: EspectroDeDano;
  alcance?: string;
  duracao?: string;
  descricao: string;
  /** Quando preenchido (acordo com o MdJ), conta para o alinhamento dessa personalidade na matriz 3x3 */
  personalidadeAlinhamento?: PersonalidadeCalafrio;
  /** Quantos Ecos foram investidos nesta Habilidade Única (1 para criar + extras para aprimorar) */
  ecosInvestidos?: number;
  efeitos: EfeitoCalafrio[];
}

export interface CustomizacaoDeEco {
  id: string;
  habilidadeAlvoId: string;
  titulo: string;
  descricaoMudanca: string;
  novoCusto?: number;
  novoRecurso?: RecursoDeAtivacao;
  novoTipoAcao?: TipoAcaoCalafrio;
  efeitosExtras: EfeitoCalafrio[];
}

export type CategoriaItemCalafrio =
  | "arma_curto"
  | "arma_longo"
  | "arma_misto"
  | "ferramenta"
  | "consumivel"
  | "vestimenta"
  | "bugiganga";

export interface ItemNaFichaCalafrio {
  id: string;
  nome: string;
  categoria: CategoriaItemCalafrio;
  paranormal: boolean; // true = Parartefato
  equipado: boolean;
  precoFundos?: number;
  precoEspirions?: number;
  dano?: number;
  espectroDano?: EspectroDeDano;
  alcance?: string;
  usosAtuais?: number;
  usosMax?: number;
  propriedades?: string[];
  descricao?: string;
  efeitos: EfeitoCalafrio[];
}

export interface EfeitoCustomizadoNaFicha {
  id: string;
  rotulo: string;
  consomeEco?: boolean;
  efeito: EfeitoCalafrio;
}

export interface CarteiraCalafrio {
  fundos: number; // F$
  espirions: number; // E$P
}

export interface FichaCalafrio {
  id: string;
  nome: string;
  jogador?: string;
  retratoUrl?: string;
  aptBase: number; // 1 a 6
  carteira: CarteiraCalafrio;
  palavrasChave: PalavraChaveNaFicha[];
  matrizHabilidades: AlocacaoSlotMatriz[];
  habilidadesUnicas: HabilidadeUnicaCalafrio[];
  customizacoesEco: CustomizacaoDeEco[];
  inventario: ItemNaFichaCalafrio[];
  efeitosCustomizados: EfeitoCustomizadoNaFicha[];
  djanhoEscolhidoDado?: number;
  familiarEscolhidoDado?: number;
  lacaioEscolhidoDado?: number;
  anotacoes?: string;
}

export interface EstadoDeJogoCalafrio {
  danoSofrido: number;
  paGasto: number;
  pvTemporario: number;
  paTemporario: number;
  focoAtivoId?: string;
  acoesPadraoRestantes: number; // 2 por turno
  acaoLivreRestante: number; // 1 por turno
  reflexoRestante: number; // 1 por rodada
  quedasSemTratamento: number; // reduz pela metade o tempo de 60s de inconsciência
  habilidadesAtivasIds: string[];
  condicoesAtivas: string[];
}

export interface AlinhamentoAtivo {
  padrao: "horizontal" | "vertical" | "diagonal" | "quadrilatero";
  slots: number[];
  personalidade: PersonalidadeCalafrio;
  bonusTexto: string;
  alvo: "paMax" | "pd" | "pvMax" | "velocidade";
  valor: number;
}

export interface AvisoDeRegraCalafrio {
  codigo:
    | "DOMINIO_MISTO"
    | "LIMITE_HABILIDADES_EXCEDIDO"
    | "LIMITE_PALAVRAS_CHAVE_EXCEDIDO"
    | "LIMITE_ECOS_EXCEDIDO"
    | "FOCO_MULTIPLO";
  mensagem: string;
}

export interface PalavraChaveDerivada {
  id: string;
  nome: string;
  categoria: CategoriaPalavraChave;
  concedidaPor?: string;
  semConsumirLimite: boolean;
  notas?: string;
}

export interface CompanheiroDerivado {
  id: string;
  subtipo: "familiar" | "lacaio" | "djanho" | "customizado";
  nome: string;
  pvMax?: number;
  pd?: number;
  aptBonus?: number;
  velocidade?: number;
  descricao: string;
  origem: string;
}

export interface FichaDerivadaCalafrio {
  apt: number;
  pd: number;
  pvMax: number;
  pvAtual: number;
  paMax: number;
  paAtual: number;
  velocidade: number;
  danoDesarmado: number;
  bonusTesteAcao: number;
  bonusContestacao: number;
  ecosMax: number;
  ecosUsados: number;
  ecosDisponiveis: number;
  limitePalavrasChave: number;
  palavrasChaveOcupadas: number;
  palavrasChaveAtivas: PalavraChaveDerivada[];
  limiteHabilidadesMemorizadas: number;
  habilidadesMemorizadasCount: number;
  dominioAtual: "positivo" | "negativo" | "misto" | "nenhum";
  alinhamentosAtivos: AlinhamentoAtivo[];
  resistencias: Partial<
    Record<EspectroDeDano, "resistente" | "vulneravel" | "imune">
  >;
  companheiros: CompanheiroDerivado[];
  pvUnificadoComPa: boolean;
  permitirDominioMisto: boolean;
  inconsciente: boolean;
  segundosAteMorrer: number;
  modificadores: ModificadorResolvido[];
  avisosDeRegra: AvisoDeRegraCalafrio[];
}
