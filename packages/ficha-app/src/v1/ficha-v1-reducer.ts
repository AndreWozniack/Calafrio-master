import {
  calcularFichaV1,
  esquecerHabilidadeV1,
  type FichaCalafrioV1,
  type HabilidadeUnicaV1,
  type ItemV1,
  MAX_APRIMORAMENTOS_V1,
  NIVEL_MAX_V1,
  NIVEL_MIN_V1,
  obterHabilidade1e,
  type PalavraChaveV1,
  podeMemorizarV1,
} from "@calafrio/core";

export type AcaoFichaV1 =
  | { tipo: "carregarFicha"; ficha: FichaCalafrioV1 }
  | { tipo: "definirNome"; nome: string }
  | { tipo: "definirJogador"; jogador: string }
  | { tipo: "definirNivel"; nivel: number }
  | {
      tipo: "definirAtributo";
      atributo: "corpo" | "mente" | "alma";
      valor: number;
    }
  | { tipo: "definirPvAtual"; valor: number }
  | { tipo: "definirPaAtual"; valor: number }
  | { tipo: "memorizarHabilidade"; id: string }
  | { tipo: "esquecerHabilidade"; id: string }
  | { tipo: "aprimorarHabilidade"; id: string; descricao: string }
  | {
      tipo: "removerAprimoramentoHabilidade";
      id: string;
      aprimoramentoId: string;
    }
  | { tipo: "definirPmExtra"; id: string; pmExtra: number }
  | { tipo: "adicionarHabilidadeUnica"; unica: HabilidadeUnicaV1 }
  | { tipo: "aprimorarHabilidadeUnica"; id: string; descricao: string }
  | {
      tipo: "removerAprimoramentoHabilidadeUnica";
      id: string;
      aprimoramentoId: string;
    }
  | { tipo: "removerHabilidadeUnica"; id: string }
  | { tipo: "adicionarPalavraChave"; palavra: PalavraChaveV1 }
  | { tipo: "removerPalavraChave"; id: string }
  | { tipo: "adicionarItem"; item: ItemV1 }
  | { tipo: "removerItem"; id: string }
  | { tipo: "definirCarteira"; fundos: number; espirions: number }
  | { tipo: "definirQuemSouEu"; texto: string }
  | { tipo: "definirAnotacoes"; texto: string }
  | { tipo: "definirIlustracaoUrl"; url?: string };

function temEcoLivre(state: FichaCalafrioV1): boolean {
  const d = calcularFichaV1(state);
  return d.ecosGastos < d.ecosMax;
}

function pmExtraPermitido(
  state: FichaCalafrioV1,
  id: string,
  pmExtra: number,
): boolean {
  const h = state.habilidades.find((x) => x.id === id);
  if (!h || !obterHabilidade1e(id)?.permitePmExtra) return false;
  if (!Number.isInteger(pmExtra) || pmExtra < 0 || pmExtra % 3 !== 0)
    return false;
  const d = calcularFichaV1(state);
  return pmExtra - (h.pmExtra ?? 0) <= d.pmRestante;
}

export function fichaCalafrioV1Reducer(
  state: FichaCalafrioV1,
  action: AcaoFichaV1,
): FichaCalafrioV1 {
  switch (action.tipo) {
    case "carregarFicha":
      return action.ficha;

    case "definirNome":
      return { ...state, nome: action.nome };

    case "definirJogador":
      return { ...state, jogador: action.jogador };

    case "definirNivel": {
      const nivel = Math.max(
        NIVEL_MIN_V1,
        Math.min(NIVEL_MAX_V1, Math.round(action.nivel)),
      );
      const pvMax = nivel * 6;
      return {
        ...state,
        nivel,
        pvAtual: Math.min(state.pvAtual, pvMax),
      };
    }

    case "definirAtributo": {
      const valor = Math.max(1, Math.round(action.valor));
      const atributos = { ...state.atributos, [action.atributo]: valor };
      const paMax = atributos.alma * 9;
      return {
        ...state,
        atributos,
        paAtual: Math.min(state.paAtual, paMax),
      };
    }

    case "definirPvAtual": {
      const pvMax = state.nivel * 6;
      const pvAtual = Math.max(0, Math.min(pvMax, Math.round(action.valor)));
      return { ...state, pvAtual };
    }

    case "definirPaAtual": {
      const paMax = state.atributos.alma * 9;
      const paAtual = Math.max(0, Math.min(paMax, Math.round(action.valor)));
      return { ...state, paAtual };
    }

    case "memorizarHabilidade": {
      if (!podeMemorizarV1(state, action.id).ok) return state;
      return {
        ...state,
        habilidades: [
          ...state.habilidades,
          { id: action.id, aprimoramentos: [] },
        ],
      };
    }

    case "esquecerHabilidade":
      return esquecerHabilidadeV1(state, action.id);

    case "aprimorarHabilidade": {
      if (!temEcoLivre(state)) return state;
      return {
        ...state,
        habilidades: state.habilidades.map((h) => {
          if (h.id !== action.id) return h;
          if (h.aprimoramentos.length >= MAX_APRIMORAMENTOS_V1) return h;
          const novoAprimoramento = {
            id: `apr-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
            descricao: action.descricao,
          };
          return {
            ...h,
            aprimoramentos: [...h.aprimoramentos, novoAprimoramento],
          };
        }),
      };
    }

    case "removerAprimoramentoHabilidade": {
      return {
        ...state,
        habilidades: state.habilidades.map((h) => {
          if (h.id !== action.id) return h;
          return {
            ...h,
            aprimoramentos: h.aprimoramentos.filter(
              (a) => a.id !== action.aprimoramentoId,
            ),
          };
        }),
      };
    }

    case "definirPmExtra": {
      if (!pmExtraPermitido(state, action.id, action.pmExtra)) return state;
      return {
        ...state,
        habilidades: state.habilidades.map((h) =>
          h.id === action.id ? { ...h, pmExtra: action.pmExtra } : h,
        ),
      };
    }

    case "adicionarHabilidadeUnica":
      if (!temEcoLivre(state)) return state;
      return {
        ...state,
        habilidadesUnicas: [...state.habilidadesUnicas, action.unica],
      };

    case "aprimorarHabilidadeUnica": {
      if (!temEcoLivre(state)) return state;
      return {
        ...state,
        habilidadesUnicas: state.habilidadesUnicas.map((u) => {
          if (u.id !== action.id) return u;
          if (u.aprimoramentos.length >= MAX_APRIMORAMENTOS_V1) return u;
          const novoAprimoramento = {
            id: `apr-u-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
            descricao: action.descricao,
          };
          return {
            ...u,
            aprimoramentos: [...u.aprimoramentos, novoAprimoramento],
          };
        }),
      };
    }

    case "removerAprimoramentoHabilidadeUnica":
      return {
        ...state,
        habilidadesUnicas: state.habilidadesUnicas.map((u) =>
          u.id === action.id
            ? {
                ...u,
                aprimoramentos: u.aprimoramentos.filter(
                  (a) => a.id !== action.aprimoramentoId,
                ),
              }
            : u,
        ),
      };
    case "removerHabilidadeUnica":
      return {
        ...state,
        habilidadesUnicas: state.habilidadesUnicas.filter(
          (u) => u.id !== action.id,
        ),
      };

    case "adicionarPalavraChave":
      return {
        ...state,
        palavrasChave: [...state.palavrasChave, action.palavra],
      };

    case "removerPalavraChave":
      return {
        ...state,
        palavrasChave: state.palavrasChave.filter((p) => p.id !== action.id),
      };

    case "adicionarItem":
      return {
        ...state,
        inventario: [...state.inventario, action.item],
      };

    case "removerItem":
      return {
        ...state,
        inventario: state.inventario.filter((i) => i.id !== action.id),
      };

    case "definirCarteira":
      return {
        ...state,
        carteira: { fundos: action.fundos, espirions: action.espirions },
      };

    case "definirQuemSouEu":
      return { ...state, quemSouEu: action.texto };

    case "definirAnotacoes":
      return { ...state, anotacoes: action.texto };

    case "definirIlustracaoUrl":
      return { ...state, ilustracaoUrl: action.url };

    default:
      return state;
  }
}
