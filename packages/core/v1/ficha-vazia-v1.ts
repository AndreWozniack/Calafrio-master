import type { FichaCalafrioV1 } from "./modelo-v1";

export function criarFichaV1Vazia(id: string, nome: string): FichaCalafrioV1 {
  return {
    edicao: "1e",
    id,
    nome,
    nivel: 1,
    atributos: { corpo: 1, mente: 1, alma: 1 }, // 1 ponto livre pendente
    pvAtual: 6,
    paAtual: 9,
    carteira: { fundos: 6, espirions: 0 },
    palavrasChave: [],
    habilidades: [],
    habilidadesUnicas: [],
    inventario: [],
    quemSouEu: "",
    anotacoes: "",
  };
}
