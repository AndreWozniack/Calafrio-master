import type { HabilidadeCatalogoV1 } from "../modelo-v1";
import { type CartasArvoreV1, montarArvoreV1 } from "./montar-arvore";

const CARTAS: CartasArvoreV1 = {
  grauZero: {
    id: "inscricao",
    nome: "Inscrição",
    custoPA: 0,
    descricao:
      "Toque uma estrutura ou objeto para marcá-la com inscrições sobrenaturais indetectáveis, que podem: (A) Possuir qualquer formato e dimensões de até 1 metro; (B) Perdurar por até 24 horas; e (C) Notificar seu criador caso uma condição pré-estabelecida seja satisfeita onde reside.",
  },
  grauI: [
    {
      id: "reorganizacao-de-materia",
      nome: "Reorganização de matéria",
      custoPA: 2,
      descricao:
        "Toque um objeto com dimensões de até 3 metros. Reorganize como estão dispostas suas partes a fim de remodelá-lo (por exemplo, transformando uma torradeira em um revólver) por até 1 hora.",
    },
    {
      id: "encantamento",
      nome: "Encantamento",
      custoPA: 2,
      descricao:
        "Toque um objeto. Após uma preparação de 12 minutos, conceda-o um efeito ou função de caráter paranormal (aprovado pelo MdJ) pelas próximas 24 horas.",
    },
    {
      id: "translocacao",
      nome: "Translocação",
      custoPA: 2,
      descricao:
        "Utilize uma ação livre ou reflexo para fazer com que até 3 criaturas (ou objetos com dimensões de até 3 metros) troquem de lugar umas com as outras em um raio de 3 metros.",
    },
    {
      id: "mecanovidencia",
      nome: "Mecanovidência",
      custoPA: 2,
      descricao:
        "Toque um objeto com dimensões de até 3 metros. Compreenda instantaneamente quais são seus componentes, seu propósito principal e forma pretendida de operação.",
    },
  ],
  grauII: [
    {
      id: "transmutacao-de-materia",
      nome: "Transmutação de matéria",
      custoPA: 3,
      descricao:
        "Escolha uma porção de matéria inorgânica visível com dimensões de até 3 metros. Transforme-a em outro tipo de material por até 1 hora, contanto que ambos possuam uma característica em comum (por exemplo, transformar prata em ouro ou água em álcool).",
    },
    {
      id: "especializacao-de-aura",
      nome: "Especialização de aura",
      custoPA: 3,
      marcadores: ["cadeado", "interrogacao"],
      descricao:
        "Adicione propriedades físicas à sua aura (como tenacidade, elasticidade e magnetismo), a fim de criar um efeito extraordinário: (A) Com duração de até 30 minutos; e (B) Que pode causar até 12 de dano variável a um ou mais alvos.",
    },
    {
      id: "rabdomancia",
      nome: "Rabdomancia",
      custoPA: 3,
      descricao:
        "Escolha um objeto em sua mão. Durante 3 horas, utilize uma ferramenta de navegação para evidenciar sua origem mais próxima. O efeito acaba caso sua concentração seja bruscamente interrompida.",
    },
    {
      id: "teletransporte",
      nome: "Teletransporte",
      custoPA: 4,
      descricao:
        "Escolha até 3 criaturas adjacentes propensas ou incapacitadas. Após uma preparação de 12 segundos, desloque-se (junto com os alvos) instantaneamente para qualquer lugar visível ou memorizado em até 6 quilômetros.",
    },
    {
      id: "neurohacking",
      nome: "Neurohacking",
      custoPA: 3,
      marcadores: ["cadeado"],
      descricao:
        "Toque uma máquina que possua sistemas programáveis de informação (como um computador ou um drone). Por 1 hora: (A) Controle-a com facilidade, conforme seus limites projetuais; e (B) Conteste-a para (em caso de sucesso) visualizar as informações contidas em seus sistemas.",
    },
  ],
  grauIII: [
    {
      id: "genese",
      nome: "Gênese",
      custoPA: 12,
      descricao:
        "Utilizando-se da matéria-prima adequada, crie um parartefato ao longo de uma preparação de 3-24 horas (conforme definição do MdJ), que terá: (A) Aparência livre; (B) Uma Habilidade Única embutida; e (C) Condições específicas de uso.",
    },
    {
      id: "palacio-mental",
      nome: "Palácio mental",
      custoPA: "passivo",
      descricao:
        "Materialize um local anômalo entre as fissuras do espaço-tempo, com dimensões de até 18 metros. (A) Seu interior, posses e configuração são limitados apenas aos seus desejos (mas podem existir apenas nele); e (B) Crie fendas de entrada/saída com uma preparação de 30 segundos.",
    },
  ],
};

export const HABILIDADES_RACIONAIS: HabilidadeCatalogoV1[] = montarArvoreV1(
  "racionais",
  CARTAS
);
