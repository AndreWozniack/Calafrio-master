import { criarFichaV1Vazia } from "@calafrio/core";
import { describe, expect, it } from "vitest";
import {
  type AcaoFichaV1,
  fichaCalafrioV1Reducer,
} from "../v1/ficha-v1-reducer";

const base = () => ({
  ...criarFichaV1Vazia("t1", "Teste Reducer"),
  atributos: { corpo: 2, mente: 2, alma: 1 },
});

describe("fichaCalafrioV1Reducer", () => {
  it("definirAtributo respeita mínimo de 1", () => {
    let state = base();
    state = fichaCalafrioV1Reducer(state, {
      tipo: "definirAtributo",
      atributo: "corpo",
      valor: 3,
    });
    expect(state.atributos.corpo).toBe(3);

    state = fichaCalafrioV1Reducer(state, {
      tipo: "definirAtributo",
      atributo: "corpo",
      valor: 0,
    });
    expect(state.atributos.corpo).toBe(1);
  });

  it("definirNivel limita entre 1 e 10", () => {
    let state = base();
    state = fichaCalafrioV1Reducer(state, { tipo: "definirNivel", nivel: 5 });
    expect(state.nivel).toBe(5);

    state = fichaCalafrioV1Reducer(state, { tipo: "definirNivel", nivel: 12 });
    expect(state.nivel).toBe(10);

    state = fichaCalafrioV1Reducer(state, { tipo: "definirNivel", nivel: 0 });
    expect(state.nivel).toBe(1);
  });

  it("definirPvAtual e definirPaAtual limitam entre 0 e máximo", () => {
    let state = base(); // nivel 1 -> pvMax 6, alma 1 -> paMax 9
    state = fichaCalafrioV1Reducer(state, { tipo: "definirPvAtual", valor: 4 });
    expect(state.pvAtual).toBe(4);

    state = fichaCalafrioV1Reducer(state, {
      tipo: "definirPvAtual",
      valor: 10,
    });
    expect(state.pvAtual).toBe(6);

    state = fichaCalafrioV1Reducer(state, {
      tipo: "definirPvAtual",
      valor: -2,
    });
    expect(state.pvAtual).toBe(0);

    state = fichaCalafrioV1Reducer(state, {
      tipo: "definirPaAtual",
      valor: 20,
    });
    expect(state.paAtual).toBe(9);
  });

  it("memorizar respeita regras e esquecer executa cascata", () => {
    let state = base(); // mente 2 -> pmMax 12
    // Memorizar Grau I (Ímpeto, 3 PM)
    state = fichaCalafrioV1Reducer(state, {
      tipo: "memorizarHabilidade",
      id: "impeto",
    });
    expect(state.habilidades.map((h) => h.id)).toContain("impeto");

    // Memorizar Grau II ligado (Levitação, 6 PM)
    state = fichaCalafrioV1Reducer(state, {
      tipo: "memorizarHabilidade",
      id: "levitacao",
    });
    expect(state.habilidades.map((h) => h.id)).toContain("levitacao");

    // Tentar memorizar Grau II sem requisito ligado (Absorção etérea, que requer Telecinese) -> ignorado
    state = fichaCalafrioV1Reducer(state, {
      tipo: "memorizarHabilidade",
      id: "absorcao-eterea",
    });
    expect(state.habilidades.map((h) => h.id)).not.toContain("absorcao-eterea");

    // Esquecer Ímpeto deve remover Levitação em cascata
    state = fichaCalafrioV1Reducer(state, {
      tipo: "esquecerHabilidade",
      id: "impeto",
    });
    expect(state.habilidades).toHaveLength(0);
  });

  it("aprimorar e remover aprimoramento respeita máximo de 2", () => {
    let state = { ...base(), nivel: 3 };
    state = fichaCalafrioV1Reducer(state, {
      tipo: "memorizarHabilidade",
      id: "impeto",
    });

    state = fichaCalafrioV1Reducer(state, {
      tipo: "aprimorarHabilidade",
      id: "impeto",
      descricao: "Dobra alcance",
    });
    state = fichaCalafrioV1Reducer(state, {
      tipo: "aprimorarHabilidade",
      id: "impeto",
      descricao: "Sem custo",
    });
    expect(state.habilidades[0].aprimoramentos).toHaveLength(2);

    // Terceiro aprimoramento é ignorado
    state = fichaCalafrioV1Reducer(state, {
      tipo: "aprimorarHabilidade",
      id: "impeto",
      descricao: "Terceiro",
    });
    expect(state.habilidades[0].aprimoramentos).toHaveLength(2);

    const aprId = state.habilidades[0].aprimoramentos[0].id;
    state = fichaCalafrioV1Reducer(state, {
      tipo: "removerAprimoramentoHabilidade",
      id: "impeto",
      aprimoramentoId: aprId,
    });
    expect(state.habilidades[0].aprimoramentos).toHaveLength(1);
  });

  it("definirPmExtra só aceita múltiplo de 3 em habilidade que permite e dentro do PM livre", () => {
    // Mente 2 → PM máx. 12; Familiar (Grau I) custa 3 → 9 livres.
    let state = fichaCalafrioV1Reducer(base(), {
      tipo: "memorizarHabilidade",
      id: "familiar",
    });
    state = fichaCalafrioV1Reducer(state, {
      tipo: "definirPmExtra",
      id: "familiar",
      pmExtra: 6,
    });
    expect(state.habilidades[0].pmExtra).toBe(6);

    for (const pmExtra of [4, -3, 12]) {
      const r = fichaCalafrioV1Reducer(state, {
        tipo: "definirPmExtra",
        id: "familiar",
        pmExtra,
      });
      expect(r.habilidades[0].pmExtra).toBe(6);
    }

    state = fichaCalafrioV1Reducer(state, {
      tipo: "definirPmExtra",
      id: "familiar",
      pmExtra: 9,
    });
    expect(state.habilidades[0].pmExtra).toBe(9);

    // Habilidade sem permitePmExtra recusa.
    state = fichaCalafrioV1Reducer(base(), {
      tipo: "memorizarHabilidade",
      id: "impeto",
    });
    state = fichaCalafrioV1Reducer(state, {
      tipo: "definirPmExtra",
      id: "impeto",
      pmExtra: 3,
    });
    expect(state.habilidades[0].pmExtra).toBeUndefined();
  });

  it("não gasta mais EP que o nível", () => {
    // Nível 1 → 1 EP.
    let state = fichaCalafrioV1Reducer(base(), {
      tipo: "memorizarHabilidade",
      id: "impeto",
    });
    state = fichaCalafrioV1Reducer(state, {
      tipo: "aprimorarHabilidade",
      id: "impeto",
      descricao: "Primeiro",
    });
    expect(state.habilidades[0].aprimoramentos).toHaveLength(1);

    state = fichaCalafrioV1Reducer(state, {
      tipo: "aprimorarHabilidade",
      id: "impeto",
      descricao: "Sem EP",
    });
    expect(state.habilidades[0].aprimoramentos).toHaveLength(1);

    state = fichaCalafrioV1Reducer(state, {
      tipo: "adicionarHabilidadeUnica",
      unica: {
        id: "u1",
        nome: "Sem EP",
        descricao: "",
        passiva: false,
        aprimoramentos: [],
      },
    });
    expect(state.habilidadesUnicas).toHaveLength(0);
  });

  it("adicionar, aprimorar e remover habilidade única", () => {
    let state = { ...base(), nivel: 2 };
    state = fichaCalafrioV1Reducer(state, {
      tipo: "adicionarHabilidadeUnica",
      unica: {
        id: "u1",
        nome: "Espada de Éter",
        descricao: "Manifesta arma",
        passiva: false,
        aprimoramentos: [],
      },
    });
    expect(state.habilidadesUnicas).toHaveLength(1);

    state = fichaCalafrioV1Reducer(state, {
      tipo: "aprimorarHabilidadeUnica",
      id: "u1",
      descricao: "Mais dano",
    });
    expect(state.habilidadesUnicas[0].aprimoramentos).toHaveLength(1);

    const semAprimoramento = fichaCalafrioV1Reducer(state, {
      tipo: "removerAprimoramentoHabilidadeUnica",
      id: "u1",
      aprimoramentoId: state.habilidadesUnicas[0].aprimoramentos[0].id,
    });
    expect(semAprimoramento.habilidadesUnicas[0].aprimoramentos).toHaveLength(
      0,
    );

    state = fichaCalafrioV1Reducer(state, {
      tipo: "removerHabilidadeUnica",
      id: "u1",
    });
    expect(state.habilidadesUnicas).toHaveLength(0);
  });

  it("palavras-chave, inventário, carteira e dados narrativos", () => {
    let state = base();
    state = fichaCalafrioV1Reducer(state, {
      tipo: "adicionarPalavraChave",
      palavra: { id: "p1", nome: "Policial", categoria: "ocupacao" },
    });
    expect(state.palavrasChave).toHaveLength(1);

    state = fichaCalafrioV1Reducer(state, {
      tipo: "removerPalavraChave",
      id: "p1",
    });
    expect(state.palavrasChave).toHaveLength(0);

    state = fichaCalafrioV1Reducer(state, {
      tipo: "adicionarItem",
      item: { id: "i1", nome: "Revólver", quantidade: 1 },
    });
    expect(state.inventario).toHaveLength(1);

    state = fichaCalafrioV1Reducer(state, {
      tipo: "removerItem",
      id: "i1",
    });
    expect(state.inventario).toHaveLength(0);

    state = fichaCalafrioV1Reducer(state, {
      tipo: "definirCarteira",
      fundos: 12,
      espirions: 5,
    });
    expect(state.carteira).toEqual({ fundos: 12, espirions: 5 });

    state = fichaCalafrioV1Reducer(state, {
      tipo: "definirQuemSouEu",
      texto: "História",
    });
    expect(state.quemSouEu).toBe("História");

    state = fichaCalafrioV1Reducer(state, {
      tipo: "definirAnotacoes",
      texto: "Anotação",
    });
    expect(state.anotacoes).toBe("Anotação");

    state = fichaCalafrioV1Reducer(state, {
      tipo: "definirNome",
      nome: "Agente Silva",
    });
    expect(state.nome).toBe("Agente Silva");

    state = fichaCalafrioV1Reducer(state, {
      tipo: "definirJogador",
      jogador: "Brendo",
    });
    expect(state.jogador).toBe("Brendo");

    state = fichaCalafrioV1Reducer(state, {
      tipo: "definirIlustracaoUrl",
      url: "https://example.com/foto.png",
    });
    expect(state.ilustracaoUrl).toBe("https://example.com/foto.png");
  });
});
