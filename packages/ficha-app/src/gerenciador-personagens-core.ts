import { criarFichaCalafrioVazia, type FichaCalafrio } from "@calafrio/core";

export function criarNovoPersonagemPadrao(
  nome = "Novo Investigador",
): FichaCalafrio {
  const id = `personagem-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
  const base = criarFichaCalafrioVazia(id, nome);
  return {
    ...base,
    id,
    nome,
    carteira: { fundos: 6, espirions: 0 },
    aptBase: 1,
  };
}

export function adicionarPersonagem(
  lista: FichaCalafrio[],
  novo: FichaCalafrio,
): FichaCalafrio[] {
  return [...lista, novo];
}

export function duplicarPersonagem(
  lista: FichaCalafrio[],
  id: string,
): { novaLista: FichaCalafrio[]; duplicado: FichaCalafrio | null } {
  const alvo = lista.find((p) => p.id === id);
  if (!alvo) {
    return { novaLista: lista, duplicado: null };
  }

  const duplicado: FichaCalafrio = {
    ...alvo,
    id: `personagem-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    nome: `${alvo.nome} (Cópia)`,
  };

  return {
    novaLista: [...lista, duplicado],
    duplicado,
  };
}

export function excluirPersonagem(
  lista: FichaCalafrio[],
  id: string,
): FichaCalafrio[] {
  return lista.filter((p) => p.id !== id);
}

export function atualizarPersonagemNaLista(
  lista: FichaCalafrio[],
  fichaAtualizada: FichaCalafrio,
): FichaCalafrio[] {
  return lista.map((p) => (p.id === fichaAtualizada.id ? fichaAtualizada : p));
}
