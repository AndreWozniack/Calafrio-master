import type { DjanhoCatalogo, FamiliarCatalogo, LacaioCatalogo } from "./tipos";

export const TABELA_FAMILIARES: readonly FamiliarCatalogo[] = [
  {
    dado: 1,
    nome: "Arma senciente",
    descricao:
      "Uma ferramenta com consciência própria, encantada para ser utilizada como arma.",
    propriedades:
      "Pode ser comandada para realizar ações de ataque contra alvos visíveis (conforme as especificações da arma, presentes na tabela de armas mundanas).",
  },
  {
    dado: 2,
    nome: "Faérico",
    descricao:
      "Um ser pequenino cheio de personalidade, especialmente pensado para peripécias e sabotagem.",
    propriedades:
      "Pode ser comandado para roubar objetos e persuadir criaturas através de contestações bem-sucedidas.",
  },
  {
    dado: 3,
    nome: "Serviçal",
    descricao:
      "Um ajudante leal que não consegue causar dano, mas é extremamente cordial e prestativo.",
    propriedades:
      "Pode ser comandado para, ao longo de uma preparação de 1 hora, investigar fenômenos ou buscar objetos específicos.",
  },
  {
    dado: 4,
    nome: "Espectro",
    descricao:
      "Uma manifestação etérea que lembra a vaga figura de um humanóide.",
    propriedades:
      "Movimenta-se ignorando quaisquer obstáculos e a gravidade. Pode ser comandado para trocar de lugar com seu criador de forma instantânea.",
  },
  {
    dado: 5,
    nome: "Besta",
    descricao:
      "Uma criação feral que combina múltiplos aspectos animalescos em sua composição.",
    propriedades:
      "Comunica-se de forma simples, através de grunhidos pouco inteligíveis. Pode ser comandada para atacar um alvo em curto alcance, causando seu APT como dano.",
  },
  {
    dado: 6,
    nome: "Elemental",
    descricao:
      "Uma criação sintetizada a partir de um elemento específico dos espectros castanho, rubro, cerúleo ou alvo.",
    propriedades:
      "Não pode se comunicar diretamente. Pode ser comandado para ativar uma variação da habilidade 'Manifestação Castanha/Rubra/Cerúlea/Alva' (conforme seu domínio elemental), que não pode causar dano.",
  },
];

export const TABELA_LACAIOS: readonly LacaioCatalogo[] = [
  {
    dado: 1,
    nome: "Esqueletético",
    descricao:
      "Restos de ossos animados com o intuito de assimilar-se a uma criatura.",
    pv: 6,
    pd: 6,
    aptBonus: 3,
    velocidade: 6,
    propriedades: "6 PV; 6 PD; +3 APT; 6 VEL. É resistente a dano rubro.",
  },
  {
    dado: 2,
    nome: "Cadavérico",
    descricao: "Restos mortais humanóides recentemente obtidos.",
    pv: 12,
    pd: 6,
    aptBonus: 3,
    velocidade: 3,
    propriedades:
      "12 PV; 6 PD; +3 APT; 3 VEL. Ao ser destruído, causa 2 de dano cerúleo aos alvos adjacentes.",
  },
  {
    dado: 3,
    nome: "Feral",
    descricao: "Restos mortais de um ou mais animais.",
    pv: 6,
    pd: 3,
    aptBonus: 3,
    velocidade: 12,
    propriedades:
      "6 PV; 3 PD; +3 APT; 12 VEL. Pode se movimentar através de terreno difícil sem restrições.",
  },
  {
    dado: 4,
    nome: "Enxamático",
    descricao:
      "Restos mortais de múltiplas criaturas pequeninas que agem em conjunto.",
    pv: 6,
    pd: 6,
    aptBonus: 1,
    velocidade: 9,
    propriedades:
      "6 PV; 6 PD; +1 APT; 9 VEL. Pode ocupar e se movimentar através de espaços já ocupados por outras criaturas.",
  },
  {
    dado: 5,
    nome: "Autômato",
    descricao:
      "Uma amálgama de sucata, retorcida de forma a lembrar vagamente a forma humanóide.",
    pv: 6,
    pd: 12,
    aptBonus: 2,
    velocidade: 3,
    propriedades:
      "6 PV; 12 PD; +2 APT; 3 VEL. É considerado uma estrutura para todos os efeitos.",
  },
  {
    dado: 6,
    nome: "Vegetal",
    descricao: "Sobras apodrecidas de plantas diversas.",
    pv: 6,
    pd: 3,
    aptBonus: 6,
    velocidade: 0,
    propriedades:
      "6 PV; 3 PD; +6 APT; 0 VEL. Não pode se mover, mas pode atacar alvos em até 6 metros de distância.",
  },
];

export const TABELA_DJANHOS: readonly DjanhoCatalogo[] = [
  {
    dado: 1,
    nome: "Tato",
    propriedades:
      "Receba chifres, escamas e/ou garras afiadas. Seus golpes desarmados causam sua APT como dano castanho.",
  },
  {
    dado: 2,
    nome: "Paladar",
    propriedades:
      "Seu corpo não envelhece, não requere (e nem tolera) mais alimentação ou sono para sobreviver.",
  },
  {
    dado: 3,
    nome: "Visão",
    propriedades:
      "Sua visão enxerga todo o espectro da luz e ignora técnicas de ocultação visual.",
  },
  {
    dado: 4,
    nome: "Audição",
    propriedades:
      "Seus sentidos percebem com facilidade os anseios, desejos e sentimentos de outras criaturas ao seu redor.",
  },
  {
    dado: 5,
    nome: "Olfato",
    propriedades:
      "Seu corpo não precisa mais respirar para sobreviver. Torne-se imune à dor e doenças.",
  },
  {
    dado: 6,
    nome: "Sexto sentido",
    propriedades:
      "Seus PV são considerados como PA para todos os efeitos (Descansos, uso em habilidades, etc.).",
  },
];
