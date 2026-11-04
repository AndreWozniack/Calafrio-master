import { describe, expect, it } from "vitest";
import { carregarCatalogoCalafrio } from "../../catalogo";
import {
  aplicarAtividadeHabilidade,
  aplicarDanoCalafrio,
  aplicarDescansoCalafrio,
  criarEstadoDeJogoInicial,
  criarFichaCalafrioVazia,
  montarFichaCalafrio,
} from "../index";

describe("montarFichaCalafrio e Motor de Efeitos Abertos", () => {
  const catalogo = carregarCatalogoCalafrio();

  it("calcula atributos base por APT (PD=3*APT, PV=3+3*APT, PA=3+3*APT, VEL=6, Ecos=APT, Palavras=2+APT)", () => {
    const ficha = { ...criarFichaCalafrioVazia("f1", "Iara"), aptBase: 2 };
    const derivada = montarFichaCalafrio(ficha, catalogo);
    expect(derivada.apt).toBe(2);
    expect(derivada.pd).toBe(6);
    expect(derivada.pvMax).toBe(9);
    expect(derivada.paMax).toBe(9);
    expect(derivada.velocidade).toBe(6);
    expect(derivada.ecosMax).toBe(2);
    expect(derivada.limitePalavrasChave).toBe(4);
    expect(derivada.limiteHabilidadesMemorizadas).toBe(2);
  });

  it("calcula bônus de alinhamento na matriz 3x3 (horizontal +3 PA, vertical +3 PD, diagonal +6 PV, 2x2 +3 VEL) e suporta Habilidade Única com personalidade autorizada", () => {
    const ficha = {
      ...criarFichaCalafrioVazia("f2", "Brendo"),
      aptBase: 6,
      habilidadesUnicas: [
        {
          id: "unica-1",
          nome: "Guarda-Chuva Balístico",
          tipoAcao: "padrao" as const,
          custo: 3,
          recurso: "pa" as const,
          descricao: "Disparo oculto",
          personalidadeAlinhamento: "maneiro" as const,
          efeitos: [],
        },
      ],
      matrizHabilidades: [
        { slot: 0, tipo: "paranormal" as const, id: "ressonancia" },
        { slot: 1, tipo: "paranormal" as const, id: "conduite" },
        { slot: 2, tipo: "unica" as const, id: "unica-1" },
        { slot: 3, tipo: "paranormal" as const, id: "esconjuracao" },
        { slot: 4, tipo: "paranormal" as const, id: "configuracao-petrea" },
        { slot: 8, tipo: "paranormal" as const, id: "levitacao" },
      ],
    };
    const derivada = montarFichaCalafrio(ficha, catalogo);
    expect(derivada.paMax).toBe(3 + 3 * 6 + 3);
    expect(derivada.pvMax).toBe(3 + 3 * 6 + 6);
    expect(derivada.velocidade).toBe(6 + 3);
    expect(derivada.alinhamentosAtivos).toHaveLength(3);
  });

  it("sinaliza conflito de Domínio Positivo + Negativo, exceto quando permitirDominioMisto está ativo", () => {
    const ficha = {
      ...criarFichaCalafrioVazia("f3", "Caio"),
      aptBase: 2,
      matrizHabilidades: [
        { slot: 0, tipo: "paranormal" as const, id: "ressonancia" },
        { slot: 1, tipo: "paranormal" as const, id: "translocacao" },
      ],
    };
    const semPermissao = montarFichaCalafrio(ficha, catalogo);
    expect(
      semPermissao.avisosDeRegra.some((a) => a.codigo === "DOMINIO_MISTO"),
    ).toBe(true);

    const comPermissao = montarFichaCalafrio(
      {
        ...ficha,
        efeitosCustomizados: [
          {
            id: "ef-1",
            rotulo: "Eco Dualidade",
            efeito: {
              tipo: "regraEspecial",
              regra: "permitirDominioMisto",
              descricao: "Liberado pelo MdJ",
            },
          },
        ],
      },
      catalogo,
    );
    expect(
      comPermissao.avisosDeRegra.some((a) => a.codigo === "DOMINIO_MISTO"),
    ).toBe(false);
  });

  it("permite que uma palavra-chave ou item conceda outra palavra-chave sem consumir o limite de 2 + APT", () => {
    const ficha = {
      ...criarFichaCalafrioVazia("f4", "Duda"),
      aptBase: 1,
      palavrasChave: [
        {
          id: "pc-1",
          nome: "Detetive do submundo",
          categoria: "ocupacao" as const,
          semConsumirLimite: false,
          efeitos: [
            {
              tipo: "concederPalavraChave" as const,
              nome: "Contatos no Submundo",
              semConsumirLimite: true,
            },
          ],
        },
        {
          id: "pc-2",
          nome: "Mãos-leves",
          categoria: "talento" as const,
          semConsumirLimite: false,
          efeitos: [],
        },
        {
          id: "pc-3",
          nome: "Paranóico(a)",
          categoria: "falha" as const,
          semConsumirLimite: false,
          efeitos: [],
        },
      ],
    };
    const derivada = montarFichaCalafrio(ficha, catalogo);
    expect(derivada.palavrasChaveOcupadas).toBe(3);
    expect(derivada.limitePalavrasChave).toBe(3);
    expect(derivada.palavrasChaveAtivas.map((p) => p.nome)).toContain(
      "Contatos no Submundo",
    );
  });

  it("suporta pvUnificadoComPa (Djanho Sexto Sentido), gasto em PV (Pirocinese), mitigação 1:1 com PA e descanso", () => {
    const ficha = {
      ...criarFichaCalafrioVazia("f5", "Djanho"),
      aptBase: 2,
      efeitosCustomizados: [
        {
          id: "djanho-6",
          rotulo: "Djanho: Sexto Sentido",
          efeito: {
            tipo: "regraEspecial" as const,
            regra: "pvUnificadoComPa" as const,
            descricao: "PV são considerados como PA",
          },
        },
      ],
    };
    let estado = criarEstadoDeJogoInicial();
    estado = aplicarAtividadeHabilidade(ficha, catalogo, estado, {
      custo: 2,
      recurso: "pa",
    });
    const derivada = montarFichaCalafrio(ficha, catalogo, estado);
    expect(derivada.pvAtual).toBe(7);

    const fichaNormal = {
      ...criarFichaCalafrioVazia("f6", "Normal"),
      aptBase: 2,
    };
    let estNormal = criarEstadoDeJogoInicial();
    estNormal = aplicarDanoCalafrio(fichaNormal, catalogo, estNormal, {
      danoBruto: 5,
      espectro: "rubro",
      paParaMitigar: 3,
    });
    const derDepoisDano = montarFichaCalafrio(fichaNormal, catalogo, estNormal);
    expect(derDepoisDano.paAtual).toBe(6);
    expect(derDepoisDano.pvAtual).toBe(7);

    estNormal = aplicarDescansoCalafrio(fichaNormal, catalogo, estNormal, {
      tipo: "curto",
      horas: 1,
      modo: "fixo",
    });
    expect(montarFichaCalafrio(fichaNormal, catalogo, estNormal).paAtual).toBe(
      9,
    );
  });
});
