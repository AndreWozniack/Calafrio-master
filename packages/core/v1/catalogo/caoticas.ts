import type { HabilidadeCatalogoV1 } from "../modelo-v1";
import { type CartasArvoreV1, montarArvoreV1 } from "./montar-arvore";

const CARTAS: CartasArvoreV1 = {
  grauZero: {
    id: "frenesi",
    nome: "Frenesi",
    custoPA: 2,
    descricao:
      "Mescle seu corpo e sua aura a fim de se transformar em uma ferramenta de devastação marcial. Durante 1 minuto, seus ataques desarmados: (A) Podem ser realizados como ações livres; e (B) Causam dano adicional igual ao seu BA.",
  },
  grauI: [
    {
      id: "bombardeio",
      nome: "Bombardeio",
      custoPA: 2,
      descricao:
        "Conteste um alvo visível em até 6 metros de distância para atacá-lo com uma infinidade de projéteis energéticos. Em caso de sucesso: (A) Cause-o 6 de dano psíquico; e (B) Opte por reduzir 1 PV de sua reserva para repetir essa contestação.",
    },
    {
      id: "sobrecarga",
      nome: "Sobrecarga",
      custoPA: 2,
      descricao:
        "Consuma a energia elétrica de todas as fontes e dispositivos em um raio de 6 metros, tornando-os inoperantes por 1 minuto, e: (A) Regenere 1d6 PA; ou (B) Cause 3 de dano rubro aos seus portadores.",
    },
    {
      id: "estratagema",
      nome: "Estratagema",
      custoPA: 2,
      descricao:
        "Utilize seu reflexo para contestar uma criatura que o escolheu como alvo de uma ação. Em caso de sucesso: (A) Redirecione o projétil gerado pela ação em questão para outro alvo; ou (B) Movimente-a para 3 metros em qualquer direção, causando-a 6 de dano físico.",
    },
    {
      id: "lampejo",
      nome: "Lampejo",
      custoPA: 2,
      descricao:
        "Utilize uma ação livre ou reflexo para deslocar-se instantaneamente para qualquer local desocupado e visível em um raio de 6 metros, ignorando quaisquer obstáculos presentes nessa trajetória.",
    },
  ],
  grauII: [
    {
      id: "imolacao",
      nome: "Imolação",
      custoPA: 6,
      descricao:
        "Conteste um alvo visível em até 120 metros de distância, alvejando-o com um feixe sobrepujante de antimatéria. Em caso de sucesso: (A) Cause-o 24 de dano psíquico (ou 12 em caso de falha); e (B) Caso o alvo seja um objeto com dimensões de até 3 metros, corte-a ao meio.",
    },
    {
      id: "manifestacao-rubra",
      nome: "Manifestação rubra",
      custoPA: 3,
      marcadores: ["cadeado", "interrogacao"],
      // TODO(fonte): descrição no V8 é cópia de Manifestação castanha
      descricao:
        "Manipule o espectro castanho dos elementos, relativo à solidez (ex. terra, metal e poeira), a fim de criar um efeito extraordinário: (A) Com duração de até 30 minutos; e (B) Que pode causar até 12 de dano castanho a um ou mais alvos.",
    },
    {
      id: "presenca-torturante",
      nome: "Presença torturante",
      custoPA: 4,
      descricao:
        "Conteste todas as criaturas em um raio de 3 metros. Todos os alvos que falharem: (A) Recebem 12 de dano psíquico; e (B) Realizam sua próxima ação com desvantagem.",
    },
    {
      id: "carnificina",
      nome: "Carnificina",
      custoPA: 4,
      marcadores: ["cadeado"],
      descricao:
        "Seja envolto por uma longa corrente etérea e senciente, que espalha-se por um raio de 3 metros. Por 18 segundos: (A) Cause 6 de dano rubro a qualquer outra criatura que finalizar seu turno nessa área; e (B) Impeça-a de se afastar de seu local atual através de ações de movimentação convencional.",
    },
    {
      id: "intangibilidade",
      nome: "Intangibilidade",
      custoPA: 4,
      marcadores: ["cadeado"],
      descricao:
        "Utilize uma ação livre para vibrar em uma frequência sub-atômica. Por 18 segundos: (A) Ignore quaisquer obstáculos físicos; (B) Receba imunidade a dano físico; e (C) Ações que tenham-lhe como alvo são realizadas com desvantagem.",
    },
  ],
  grauIII: [
    {
      id: "desintegracao",
      nome: "Desintegração",
      custoPA: 9,
      descricao:
        "Conteste um alvo visível (com vantagem, caso esteja tocando-o) para tentar apagá-lo da existência. (A) Quem obtiver sucesso recebe 9 de dano físico; e (B) Quem obtiver falha recebe 90 de dano físico.",
    },
    {
      id: "aparato-obliterador",
      nome: "Aparato obliterador",
      custoPA: 9,
      descricao:
        "Materialize a versão suprema de uma arma mundana que desejar por até 1 minuto. Seus ataques utilizando-a: (A) Podem ser realizados como ações livres; (B) Causam dano variável e o dobro da quantia de sua contraparte mundana; e (C) Causam-lhe 3 de dano psíquico caso não sejam bem-sucedidos.",
    },
  ],
};

export const HABILIDADES_CAOTICAS: HabilidadeCatalogoV1[] = montarArvoreV1(
  "caoticas",
  CARTAS
);
