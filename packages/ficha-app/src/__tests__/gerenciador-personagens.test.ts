import { describe, expect, it } from "vitest";
import {
  adicionarPersonagem,
  atualizarPersonagemNaLista,
  criarNovoPersonagemPadrao,
  duplicarPersonagem,
  excluirPersonagem,
} from "../gerenciador-personagens-core";

describe("Gerenciador de Personagens (Coleção de Investigadores)", () => {
  it("cria um novo personagem padrão com ID único e valores válidos", () => {
    const p = criarNovoPersonagemPadrao("Iara");
    expect(p.nome).toBe("Iara");
    expect(p.id).toBeDefined();
    expect(p.aptBase).toBe(1);
    expect(p.carteira.fundos).toBe(6);
  });

  it("adiciona um personagem à coleção", () => {
    const p1 = criarNovoPersonagemPadrao("Investigador 1");
    const lista = adicionarPersonagem([], p1);
    expect(lista).toHaveLength(1);
    expect(lista[0].id).toBe(p1.id);
  });

  it("duplica um personagem existente gerando um novo ID", () => {
    const p1 = criarNovoPersonagemPadrao("Investigador Original");
    const listaInicial = [p1];
    const { novaLista, duplicado } = duplicarPersonagem(listaInicial, p1.id);

    expect(novaLista).toHaveLength(2);
    expect(duplicado).not.toBeNull();
    expect(duplicado?.id).not.toBe(p1.id);
    expect(duplicado?.nome).toBe("Investigador Original (Cópia)");
  });

  it("exclui um personagem por ID", () => {
    const p1 = criarNovoPersonagemPadrao("P1");
    const p2 = criarNovoPersonagemPadrao("P2");
    const lista = [p1, p2];

    const aposExclusao = excluirPersonagem(lista, p1.id);
    expect(aposExclusao).toHaveLength(1);
    expect(aposExclusao[0].id).toBe(p2.id);
  });

  it("atualiza um personagem na lista", () => {
    const p1 = criarNovoPersonagemPadrao("Nome Antigo");
    const lista = [p1];

    const atualizado = { ...p1, nome: "Nome Novo", aptBase: 3 };
    const listaAtualizada = atualizarPersonagemNaLista(lista, atualizado);

    expect(listaAtualizada[0].nome).toBe("Nome Novo");
    expect(listaAtualizada[0].aptBase).toBe(3);
  });
});
