import type { EspectroDeDano, PersonalidadeCalafrio } from "@calafrio/tema";

export type AlvoAtributoCalafrio =
  | "apt"
  | "pvMax"
  | "paMax"
  | "pd"
  | "velocidade"
  | "ecosMax"
  | "limitePalavrasChave"
  | "limiteHabilidadesMemorizadas"
  | "bonusTesteAcao"
  | "bonusContestacao"
  | "danoDesarmado";

export type CategoriaPalavraChave = "ocupacao" | "talento" | "falha" | "extra";

export type RegraEspecialId =
  | "pvUnificadoComPa"
  | "permitirDominioMisto"
  | "habilidadeUnicaContaParaAlinhamento"
  | "customizada";

export type EfeitoCalafrio =
  | {
      tipo: "modificadorAtributo";
      alvo: AlvoAtributoCalafrio;
      valor: number | { escalaPorApt: number; base?: number };
      condicaoTexto?: string;
      ativo?: boolean;
    }
  | {
      tipo: "concederPalavraChave";
      nome: string;
      categoria?: CategoriaPalavraChave;
      semConsumirLimite: boolean;
    }
  | {
      tipo: "resistenciaOuVulnerabilidade";
      espectro: EspectroDeDano;
      grau: "resistente" | "vulneravel" | "imune";
    }
  | {
      tipo: "companheiro";
      subtipo: "familiar" | "lacaio" | "customizado";
      nome: string;
      pvMax?: number;
      pd?: number;
      aptBonus?: number;
      velocidade?: number;
      descricao: string;
    }
  | {
      tipo: "regraEspecial";
      regra: RegraEspecialId;
      descricao: string;
    };

export type OrigemDoModificador =
  | { tipo: "baseApt"; rotulo: string }
  | {
      tipo: "alinhamentoMatriz";
      padrao: "horizontal" | "vertical" | "diagonal" | "quadrilatero";
      slots: number[];
      personalidade: PersonalidadeCalafrio;
      rotulo: string;
    }
  | { tipo: "palavraChave"; id: string; nome: string }
  | { tipo: "item"; id: string; nome: string; paranormal: boolean }
  | { tipo: "eco"; id: string; nome: string }
  | { tipo: "habilidadeAtiva"; id: string; nome: string }
  | { tipo: "mestre"; id: string; rotulo: string };

export interface ModificadorResolvido {
  alvo: AlvoAtributoCalafrio;
  valor: number;
  condicaoTexto?: string;
  origem: OrigemDoModificador;
}
