import type { HabilidadeCatalogoV1 } from "../modelo-v1";
import { type CartasArvoreV1, montarArvoreV1 } from "./montar-arvore";

const CARTAS: CartasArvoreV1 = {
  grauZero: {
    id: "telepatia",
    nome: "Telepatia",
    custoPA: "passivo",
    descricao:
      "Escolha até 3 outras criaturas propensas e visíveis em um raio de 3 metros. Os seus próprios pensamentos e os de todos os outros alvos podem ser compartilhados livremente entre si.",
  },
  grauI: [
    {
      id: "ruido-amplificacao",
      nome: "Ruído / Amplificação",
      custoPA: 2,
      descricao:
        "Utilize seu reflexo para interagir com as sensações de uma criatura que está prestes a realizar uma ação, fazendo com que esta seja realizada com: (A) Desvantagem; ou (B) Vantagem.",
    },
    {
      id: "linguagem-universal",
      nome: "Linguagem universal",
      custoPA: "passivo",
      descricao:
        "Utilize uma ação livre para tocar/ouvir um objeto, lugar ou ser (como as rochas, o vento ou uma aparição). Compreenda a linguagem sutil do universo, ao: (A) Entender o que está 'sendo dito'; ou (B) Fazer uma pergunta e ouvir sua resposta. Utilize preparações para diálogos de maior extensão.",
    },
    {
      id: "ilusionismo",
      nome: "Ilusionismo",
      custoPA: 2,
      descricao:
        "Manifeste uma anomalia que confunde os sentidos. Por até 1 hora: (A) Crie uma ilusão visual qualquer, com dimensões de até 3 metros (que é dissipada caso tocada); ou (B) Adicione ou remova uma característica sensorial em um objeto que tocar.",
    },
    {
      id: "senciencia",
      nome: "Senciência",
      custoPA: 2,
      marcadores: ["cadeado"],
      descricao:
        "Toque um objeto com dimensões de até 6 metros. Conceda-lhe consciência por até 1 hora, com: (A) Formas de deslocamento e comunicação compatíveis; (B) Personalidade própria que condiz com sua função e conservação; e (C) Memórias, caso já tenha sido animado anteriormente.",
    },
  ],
  grauII: [
    {
      id: "invasao-de-pensamentos",
      nome: "Invasão de pensamentos",
      custoPA: 3,
      descricao:
        "Conteste uma criatura em até 6 metros de distância. Em caso de sucesso: (A) Obrigue-a a executar um comando simples e não diretamente nocivo; (B) Torne-a incapaz de perceber seus arredores por 6 segundos; ou (C) Visualize as últimas 24 horas de suas vivências.",
    },
    {
      id: "manifestacao-alva",
      nome: "Manifestação alva",
      custoPA: 3,
      marcadores: ["cadeado", "interrogacao"],
      descricao:
        "Manipule o espectro alvo dos elementos, relativo à sutileza (ex. ar, som ou fumaça), a fim de criar um efeito extraordinário: (A) Com duração de até 30 minutos; e (B) Que pode causar até 12 de dano alvo a um ou mais alvos.",
    },
    {
      id: "presenca-onirica",
      nome: "Presença onírica",
      custoPA: 3,
      marcadores: ["cadeado"],
      descricao:
        "Escolha até 3 outras criaturas em um raio de 3 metros. Por 12 segundos, todos os alvos: (A) Regeneram +3 PA no início de seus respectivos turnos; e (B) Realizam testes novamente caso seus resultados revelem-se como falhas críticas.",
    },
    {
      id: "miniaturizacao",
      nome: "Miniaturização",
      custoPA: 3,
      descricao:
        "Após uma preparação de 12 minutos, transforme um objeto em um receptáculo, que possui: (A) A aparência de um objeto qualquer; (B) Dimensões até 12 vezes inferiores ao objeto original; e (C) A capacidade de ser revertido à sua forma original (e vice-versa) através de uma ação livre.",
    },
    {
      id: "rejuvenescimento",
      nome: "Rejuvenescimento",
      custoPA: 4,
      descricao:
        "Escolha dois objetos (ou duas criaturas) visíveis que estejam a até 3 metros de distância um do outro. (A) O primeiro alvo recebe 12 (para objetos) ou 6 (para criaturas) de dano físico; e (B) O segundo alvo regenera 2d6 PA e pode se recuperar de uma condição adversa.",
    },
  ],
  grauIII: [
    {
      id: "fundicao-afetiva",
      nome: "Fundição afetiva",
      custoPA: 6,
      descricao:
        "Escolha um sentimento. Ao longo de uma preparação passiva de 6 horas, absorva-o em seu entorno a fim de cristalizá-lo em forma física. Escolha um efeito extraordinário (relacionado a emoção escolhida e aprovado pelo MdJ) para o alvo que o consumir, com duração de 1 hora.",
    },
    {
      id: "presente",
      nome: "Presente",
      custoPA: 12,
      descricao:
        "Após uma preparação de 1 hora, manipule a teia do destino para alterar permanentemente um detalhe do universo, com a intenção de torná-lo melhor. O efeito é livre e tomará rumo em até 24 horas (com o resultado definitivo decidido pelo MdJ).",
    },
  ],
};

export const HABILIDADES_AGRADAVEIS: HabilidadeCatalogoV1[] = montarArvoreV1(
  "agradaveis",
  CARTAS,
);
