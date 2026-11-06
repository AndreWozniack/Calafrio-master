import type { HabilidadeCatalogoV1 } from "../modelo-v1";
import { type CartasArvoreV1, montarArvoreV1 } from "./montar-arvore";

const CARTAS: CartasArvoreV1 = {
  grauZero: {
    id: "arsenal-psionico",
    nome: "Arsenal psiônico",
    custoPA: 2,
    descricao:
      "Toque um objeto mundano em sua posse. Aprimore-o com sua aura por 1 hora, a fim de: (A) Imbuí-lo com as propriedades de uma arma mundana coerente com seu formato e potencialidades; e (B) Que seus ataques causem dano psíquico e inflijam o dobro de dano à estruturas.",
  },
  grauI: [
    {
      id: "impeto",
      nome: "Ímpeto",
      custoPA: 2,
      descricao:
        "Por 30 minutos, receba os efeitos a seguir: (A) Sua velocidade é dobrada; (B) Seus saltos alcançam até 3 metros; e (C) Movimente-se sem restrições em terrenos difíceis (tais como lama, entulho e neve).",
    },
    {
      id: "ectobalistica",
      nome: "Ectobalística",
      custoPA: 2,
      descricao:
        "Ataque um alvo com uma arma de longo alcance. Seus projéteis poderão causar: (A) Dano psíquico; e (B) Metade do dano atual a outro alvo em uma distância de até 6 metros (Esse efeito repete-se caso aplicável).",
    },
    {
      id: "campo-de-forca",
      nome: "Campo de força",
      custoPA: 2,
      descricao:
        "Receba +3 PA totais passivamente. Escolha um local visível em até 6 metros de distância para manifestar uma estrutura: (A) De formato livre e dimensões de até 3 metros; e (B) Que compartilha de seus PA.",
    },
    {
      id: "telecinese",
      nome: "Telecinese",
      custoPA: 2,
      descricao:
        "Escolha um objeto visível de até 6 vezes o seu peso para: (A) Movê-lo em qualquer direção para até 6 metros de distância; e (B) Causar 6 de dano castanho a qualquer alvo que se chocar com o mesmo.",
    },
  ],
  grauII: [
    {
      id: "levitacao",
      nome: "Levitação",
      custoPA: 3,
      descricao:
        "Receba +1 de Velocidade total passivamente. Por até 30 minutos, movimente-se pelo espaço ignorando a ação da gravidade, com a mesma velocidade utilizada convencionalmente.",
    },
    {
      id: "manifestacao-castanha",
      nome: "Manifestação castanha",
      custoPA: 3,
      marcadores: ["cadeado", "interrogacao"],
      descricao:
        "Manipule o espectro castanho dos elementos, relativo à solidez (ex. terra, metal e poeira), a fim de criar um efeito extraordinário: (A) Com duração de até 30 minutos; e (B) Que pode causar até 12 de dano castanho a um ou mais alvos.",
    },
    {
      id: "ressonancia",
      nome: "Ressonância",
      custoPA: 3,
      descricao:
        "Receba +6 PA totais passivamente. Por até 30 minutos, oscile a frequência de sua aura, a fim de que: (A) Ataques corpo-a-corpo que tenham você como alvo sejam feitos com desvantagem, e ataques com projéteis sejam feitos com vantagem; ou (B) Vice-versa.",
    },
    {
      id: "fluxo-anti-animatico",
      nome: "Fluxo anti-animático",
      custoPA: 3,
      marcadores: ["cadeado"],
      descricao:
        "Manifeste um domo metafísico e fixo de 3 metros de diâmetro onde residir. Por 1 minuto, seu interior: (A) Anula qualquer efeito de origem paranormal; e (B) Causa 12 de dano psíquico a outras monstruosidades / anomalias paranormais no final de seus turnos.",
    },
    {
      id: "absorcao-eterea",
      nome: "Absorção etérea",
      custoPA: "passivo",
      descricao:
        "Ao ser alvo de uma ação nociva que falhar: (A) Regenere 1d6 PA; e (B) O autor da tentativa recebe 3 de dano psíquico.",
    },
  ],
  grauIII: [
    {
      id: "modo-divino",
      nome: "Modo divino",
      custoPA: 6,
      descricao:
        "Receba +1 reflexo passivamente. Por 1 minuto, seus reflexos podem ser utilizados para: (A) Anular qualquer dano recebido; (B) Deslocar-se para um lugar visível; ou (C) Identificar a posição de todas as criaturas em um raio de 60 metros. Após a duração, torne-se incapaz de realizar ações por 1 minuto.",
    },
    {
      id: "conduite",
      nome: "Conduíte",
      custoPA: "passivo",
      descricao:
        "Materialize sua alma em um objeto, que: (A) Adquire uma configuração de combate alternativa (assemelhando-se a uma arma mundana, mas com dano variável), através de uma ação livre; (B) Torna-se indestrutível e inseparável de seu criador; e (C) Recebe uma Habilidade Única própria.",
    },
  ],
};

export const HABILIDADES_MANEIRAS: HabilidadeCatalogoV1[] = montarArvoreV1(
  "maneiras",
  CARTAS
);
