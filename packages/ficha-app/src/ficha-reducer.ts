import type {
  AlocacaoSlotMatriz,
  CustomizacaoDeEco,
  EfeitoCustomizadoNaFicha,
  FichaCalafrio,
  HabilidadeUnicaCalafrio,
  ItemNaFichaCalafrio,
  PalavraChaveNaFicha,
} from "@calafrio/core";

export type AcaoFichaCalafrio =
  | { tipo: "definirNome"; nome: string }
  | { tipo: "definirJogador"; jogador: string }
  | { tipo: "definirRetrato"; url: string }
  | { tipo: "definirApt"; apt: number }
  | { tipo: "definirCarteira"; fundos: number; espirions: number }
  | { tipo: "adicionarPalavraChave"; palavra: PalavraChaveNaFicha }
  | { tipo: "atualizarPalavraChave"; id: string; dados: Partial<PalavraChaveNaFicha> }
  | { tipo: "removerPalavraChave"; id: string }
  | { tipo: "alocarSlotMatriz"; slot: number; alocacao: AlocacaoSlotMatriz }
  | { tipo: "limparSlotMatriz"; slot: number }
  | { tipo: "adicionarHabilidadeUnica"; unica: HabilidadeUnicaCalafrio }
  | { tipo: "atualizarHabilidadeUnica"; id: string; dados: Partial<HabilidadeUnicaCalafrio> }
  | { tipo: "removerHabilidadeUnica"; id: string }
  | { tipo: "adicionarCustomizacaoEco"; customizacao: CustomizacaoDeEco }
  | { tipo: "removerCustomizacaoEco"; id: string }
  | { tipo: "adicionarItem"; item: ItemNaFichaCalafrio }
  | { tipo: "atualizarItem"; id: string; dados: Partial<ItemNaFichaCalafrio> }
  | { tipo: "alternarEquipadoItem"; id: string }
  | { tipo: "removerItem"; id: string }
  | { tipo: "adicionarEfeitoCustomizado"; efeito: EfeitoCustomizadoNaFicha }
  | { tipo: "removerEfeitoCustomizado"; id: string }
  | { tipo: "definirSuporteTabela"; tipoTabela: "djanho" | "familiar" | "lacaio"; dado: number }
  | { tipo: "definirAnotacoes"; anotacoes: string }
  | { tipo: "carregarFicha"; ficha: FichaCalafrio };

export function fichaCalafrioReducer(
  state: FichaCalafrio,
  action: AcaoFichaCalafrio,
): FichaCalafrio {
  switch (action.tipo) {
    case "definirNome":
      return { ...state, nome: action.nome };
    case "definirJogador":
      return { ...state, jogador: action.jogador };
    case "definirRetrato":
      return { ...state, retratoUrl: action.url };
    case "definirApt":
      return { ...state, aptBase: Math.max(1, Math.min(6, action.apt)) };
    case "definirCarteira":
      return {
        ...state,
        carteira: {
          fundos: Math.max(0, action.fundos),
          espirions: Math.max(0, action.espirions),
        },
      };
    case "adicionarPalavraChave":
      return {
        ...state,
        palavrasChave: [...state.palavrasChave, action.palavra],
      };
    case "atualizarPalavraChave":
      return {
        ...state,
        palavrasChave: state.palavrasChave.map((pc) =>
          pc.id === action.id ? { ...pc, ...action.dados } : pc,
        ),
      };
    case "removerPalavraChave":
      return {
        ...state,
        palavrasChave: state.palavrasChave.filter((pc) => pc.id !== action.id),
      };
    case "alocarSlotMatriz": {
      const matrizSemSlot = state.matrizHabilidades.filter(
        (m) => m.slot !== action.slot,
      );
      return {
        ...state,
        matrizHabilidades: [...matrizSemSlot, action.alocacao],
      };
    }
    case "limparSlotMatriz":
      return {
        ...state,
        matrizHabilidades: state.matrizHabilidades.filter(
          (m) => m.slot !== action.slot,
        ),
      };
    case "adicionarHabilidadeUnica":
      return {
        ...state,
        habilidadesUnicas: [...state.habilidadesUnicas, action.unica],
      };
    case "atualizarHabilidadeUnica":
      return {
        ...state,
        habilidadesUnicas: state.habilidadesUnicas.map((u) =>
          u.id === action.id ? { ...u, ...action.dados } : u,
        ),
      };
    case "removerHabilidadeUnica":
      return {
        ...state,
        habilidadesUnicas: state.habilidadesUnicas.filter((u) => u.id !== action.id),
        matrizHabilidades: state.matrizHabilidades.filter(
          (m) => !(m.tipo === "unica" && m.id === action.id),
        ),
      };
    case "adicionarCustomizacaoEco":
      return {
        ...state,
        customizacoesEco: [...state.customizacoesEco, action.customizacao],
      };
    case "removerCustomizacaoEco":
      return {
        ...state,
        customizacoesEco: state.customizacoesEco.filter((c) => c.id !== action.id),
      };
    case "adicionarItem":
      return {
        ...state,
        inventario: [...state.inventario, action.item],
      };
    case "atualizarItem":
      return {
        ...state,
        inventario: state.inventario.map((item) =>
          item.id === action.id ? { ...item, ...action.dados } : item,
        ),
      };
    case "alternarEquipadoItem":
      return {
        ...state,
        inventario: state.inventario.map((item) =>
          item.id === action.id ? { ...item, equipado: !item.equipado } : item,
        ),
      };
    case "removerItem":
      return {
        ...state,
        inventario: state.inventario.filter((item) => item.id !== action.id),
      };
    case "adicionarEfeitoCustomizado":
      return {
        ...state,
        efeitosCustomizados: [...state.efeitosCustomizados, action.efeito],
      };
    case "removerEfeitoCustomizado":
      return {
        ...state,
        efeitosCustomizados: state.efeitosCustomizados.filter(
          (e) => e.id !== action.id,
        ),
      };
    case "definirSuporteTabela":
      if (action.tipoTabela === "djanho") {
        return { ...state, djanhoEscolhidoDado: action.dado };
      }
      if (action.tipoTabela === "familiar") {
        return { ...state, familiarEscolhidoDado: action.dado };
      }
      if (action.tipoTabela === "lacaio") {
        return { ...state, lacaioEscolhidoDado: action.dado };
      }
      return state;
    case "definirAnotacoes":
      return { ...state, anotacoes: action.anotacoes };
    case "carregarFicha":
      return { ...action.ficha };
    default:
      return state;
  }
}
