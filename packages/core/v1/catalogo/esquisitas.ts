import type { HabilidadeCatalogoV1 } from "../modelo-v1";
import { type CartasArvoreV1, montarArvoreV1 } from "./montar-arvore";

const CARTAS: CartasArvoreV1 = {
  grauZero: {
    id: "percepcao-eterea",
    nome: "Percepção etérea",
    custoPA: 2,
    descricao:
      "Por 1 hora, enquanto estiver com os olhos fechados: (A) Reconheça a posição de todas as almas (paranormais ou mundanas) em um raio de 12 metros; e (B) Identifique instantaneamente as almas de criaturas já conhecidas.",
  },
  grauI: [
    {
      id: "leitura-do-destino",
      nome: "Leitura do destino",
      custoPA: 2,
      descricao:
        "Sintonize-se com a teia do destino. Após uma preparação de 6 minutos, receba: (A) Um presságio de um evento futuro ou passado não presenciado; ou (B) Uma resposta subjetiva relativa a uma pergunta simples (através da leitura de um deck de cartas, borra de café ou ferramenta similar).",
    },
    {
      id: "metamorfose",
      nome: "Metamorfose",
      custoPA: 3,
      descricao:
        "Após uma preparação de 30 minutos, altere sua fisionomia a fim de adquirir: (A) Suas próprias características em qualquer outra idade cronológica; (B) Qualquer outro conjunto de características físicas, exceto altura. Este efeito é permanente até que seja utilizado novamente.",
    },
    {
      id: "projecao-astral",
      nome: "Projeção astral",
      custoPA: 3,
      marcadores: ["cadeado"],
      descricao:
        "Rompa-se de seu corpo físico e vague como um espectro. Por até 1 hora: (A) Ignore qualquer obstáculo físico; e (B) Conteste qualquer alvo que tocar para possuí-lo (apenas uma vez por dia) por até 30 minutos ou até que receba dano.",
    },
    {
      id: "familiar",
      nome: "Familiar",
      custoPA: "passivo",
      permitePmExtra: true,
      descricao:
        "Manifeste uma criatura paranormal obediente, com 6 PV, 6 PD e +3 BA (que retorna em 24 horas caso abatida). Para cada 3 PM adicionais alocados nesta habilidade, seu familiar recebe: (A) +12 PV, +3PD e +3 BA; ou (B) Um efeito adicional personalizado.",
    },
  ],
  grauII: [
    {
      id: "vislumbre",
      nome: "Vislumbre",
      custoPA: 3,
      descricao:
        "Utilize um reflexo ou ação livre para que suas ações (ou as de um alvo propenso e visível) e seus efeitos neste turno sejam anulados, como se nunca tivessem acontecido. Seu respectivo turno então se inicia novamente, com todas as suas ações disponíveis.",
    },
    {
      id: "manifestacao-cerulea",
      nome: "Manifestação cerúlea",
      custoPA: 3,
      marcadores: ["cadeado", "interrogacao"],
      descricao:
        "Manipule o espectro cerúleo dos elementos, relativo à mudança (ex. água, gelo e corrosão), a fim de criar um efeito extraordinário: (A) Com duração de até 30 minutos; e (B) Que pode causar até 12 de dano cerúleo a um ou mais alvos.",
    },
    {
      id: "ladrao-multidimensional",
      nome: "Ladrão multidimensional",
      custoPA: 3,
      descricao:
        "Conecte-se à uma rede onipresente de consciências que perpassa tudo e todos. Após uma preparação de 1 minuto: (A) Adquira uma informação, memória ou objeto mundano que desejar (com permissão do MdJ); e (B) Pelas próximas 24 horas, sua mente estará suscetível a invasões e roubos de informação.",
    },
    {
      id: "aprisionamento",
      nome: "Aprisionamento",
      custoPA: "passivo",
      descricao:
        "Conteste uma criatura paranormal com zero PV e que tornou-se incapaz de realizar ações no último minuto. Em caso de sucesso: (A) Aprisione-a em um recipiente de sua posse; ou (B) Liberte-a (de maneira permanente) através de uma ação.",
    },
    {
      id: "legiao-do-abismo",
      nome: "Legião do abismo",
      custoPA: 4,
      marcadores: ["cadeado"],
      descricao:
        "Imbua espíritos em até 3 restos mortais visíveis para criar o mesmo número de servos, que possuem, por 1 hora: (A) 6 PV, 12 PD e +3 BA; (B) 6 de dano físico por ataque; e (C) Um efeito adicional que corresponde ao resto mortal pelo qual foram criados.",
    },
  ],
  grauIII: [
    {
      id: "perdicao",
      nome: "Perdição",
      custoPA: 12,
      descricao:
        "Após uma preparação de 1 hora, manipule a teia do destino para alterar permanentemente um detalhe do universo, com a intenção de torná-lo pior. O efeito é livre e tomará rumo em até 24 horas (com o resultado definitivo decidido pelo MdJ).",
    },
    {
      id: "metabolismo-de-dianho",
      nome: "Metabolismo de dianho",
      custoPA: "passivo",
      descricao:
        "Adquira uma anatomia extraordinária e grotesca: (A) Seus PV, PA e PM são compartilháveis entre si; (B) Descansos curtos agora regeneram 12 PA e tornam-se descansos longos a partir de 3 horas de duração; e (C) Adquira uma característica física paranormal e uma Habilidade Única condizente com ela.",
    },
  ],
};

export const HABILIDADES_ESQUISITAS: HabilidadeCatalogoV1[] = montarArvoreV1(
  "esquisitas",
  CARTAS,
);
