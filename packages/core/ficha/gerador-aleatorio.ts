import type {
  DominioEmocional,
  PersonalidadeCalafrio,
} from "@calafrio/tema";
import type { ArmaMundanaCatalogo, CatalogoCalafrio } from "../catalogo/tipos";
import type {
  CategoriaItemCalafrio,
  CategoriaPalavraChave,
  FichaCalafrio,
  ItemNaFichaCalafrio,
  PalavraChaveNaFicha,
} from "./modelo";

export interface OpcoesGeradorFicha {
  apt?: number; // 1 a 6 (default: 1)
  personalidadeFoco?: PersonalidadeCalafrio;
  dominio?: "positivo" | "negativo";
  jogador?: string;
  randomFn?: () => number; // Permite injeção de PRNG determinístico para testes
}

const PRENOMES_INVESTIGADORES: readonly string[] = [
  "Aline",
  "Brendo",
  "Camila",
  "Dante",
  "Eduardo",
  "Fernanda",
  "Gabriel",
  "Helena",
  "Igor",
  "Juliana",
  "Lucas",
  "Mariana",
  "Nicolas",
  "Olivia",
  "Paulo",
  "Rafael",
  "Sabrina",
  "Thiago",
  "Valéria",
  "Yasmin",
  "Artur",
  "Beatriz",
  "Caio",
  "Débora",
  "Enzo",
  "Flávia",
  "Gustavo",
  "Inês",
  "Jorge",
  "Larissa",
  "Mateus",
  "Natália",
  "Otávio",
  "Priscila",
  "Renan",
  "Sara",
  "Tomás",
  "Vinícius",
  "Wagner",
  "Zeca",
];

const SOBRENOMES_INVESTIGADORES: readonly string[] = [
  "Silva",
  "Santos",
  "Oliveira",
  "Souza",
  "Rodrigues",
  "Ferreira",
  "Alves",
  "Pereira",
  "Lima",
  "Gomes",
  "Costa",
  "Ribeiro",
  "Martins",
  "Carvalho",
  "Almeida",
  "Grunevald",
  "Beltrão",
  "Loureiro",
  "Maciel",
  "Kowalski",
  "Nowak",
  "Schulz",
  "Muller",
  "Fontana",
  "Castilho",
  "Nogueira",
  "Siqueira",
  "Macedo",
];

function mapearTipoAlcanceParaCategoria(
  tipoAlcance: ArmaMundanaCatalogo["tipoAlcance"],
): CategoriaItemCalafrio {
  switch (tipoAlcance) {
    case "Alcance misto":
      return "arma_misto";
    case "Alcance corpo-a-corpo":
      return "arma_curto";
    case "Longo-alcance":
      return "arma_longo";
    case "Consumível":
      return "consumivel";
    default:
      return "arma_curto";
  }
}

/**
 * Gera uma FichaCalafrio completa e canônica, 100% aderente às regras da 2ª Edição.
 */
export function gerarFichaAleatoria(
  catalogo: CatalogoCalafrio,
  opcoes?: OpcoesGeradorFicha,
): FichaCalafrio {
  const rnd = opcoes?.randomFn ?? Math.random;

  const apt = Math.min(6, Math.max(1, opcoes?.apt ?? 1));

  // 1. Sorteio de Nome Urbano
  const prenomeIdx = Math.floor(rnd() * PRENOMES_INVESTIGADORES.length);
  const sobrenomeIdx = Math.floor(rnd() * SOBRENOMES_INVESTIGADORES.length);
  const nomeCompleto = `${PRENOMES_INVESTIGADORES[prenomeIdx]} ${SOBRENOMES_INVESTIGADORES[sobrenomeIdx]}`;
  const idUnico = `investigador-${Date.now().toString(36)}-${Math.floor(rnd() * 10000).toString(36)}`;

  // 2. Sorteio de Ocupação (tabela d100)
  const ocupacoes = catalogo.ocupacoes;
  const ocupacaoSorteada =
    ocupacoes[Math.floor(rnd() * ocupacoes.length)] ?? {
      numero: 1,
      nome: "Detetive Particular",
    };

  const palavrasChave: PalavraChaveNaFicha[] = [
    {
      id: `pc-ocupacao-${ocupacaoSorteada.numero}`,
      nome: ocupacaoSorteada.nome,
      categoria: "ocupacao",
      semConsumirLimite: false,
      notas: "Ocupação civil e histórico prévio no submundo",
      efeitos: [],
    },
  ];

  // 3. Sorteio de Palavras-Chave genéricas (limite total é 2 + APT)
  // Portanto, sorteamos (1 + APT) palavras genéricas para somar (2 + APT) com a ocupação.
  const qtdGenericas = 1 + apt;
  const indicesGenericas = new Set<number>();
  const totalGenericas = catalogo.palavrasChaveGenericas.length;

  while (
    indicesGenericas.size < qtdGenericas &&
    indicesGenericas.size < totalGenericas
  ) {
    indicesGenericas.add(Math.floor(rnd() * totalGenericas));
  }

  const categoriasRotativas: CategoriaPalavraChave[] = [
    "talento",
    "aspecto",
    "falha",
  ];
  let catIdx = 0;

  for (const idx of indicesGenericas) {
    const item = catalogo.palavrasChaveGenericas[idx];
    palavrasChave.push({
      id: `pc-generica-${item.numero}`,
      nome: item.nome,
      categoria: categoriasRotativas[catIdx % categoriasRotativas.length],
      semConsumirLimite: false,
      efeitos: [],
    });
    catIdx++;
  }

  // 4. Seleção e Alocação de Habilidades Paranormais na Matriz 3x3
  // Regra fundamental: Todas as habilidades devem compartilhar do MESMO domínio emocional (positivo ou negativo)
  const dominiosPossiveis: DominioEmocional[] = ["positivo", "negativo"];
  const dominioEscolhido =
    opcoes?.dominio ??
    dominiosPossiveis[Math.floor(rnd() * dominiosPossiveis.length)];

  // Filtra habilidades por domínio
  let habilidadesCandidatas = catalogo.habilidadesParanormais.filter(
    (h) => h.dominio === dominioEscolhido,
  );

  // Se houver preferência de personalidade e houver opções suficientes nela, prioriza
  if (opcoes?.personalidadeFoco) {
    const filtradasPorPersonalidade = habilidadesCandidatas.filter(
      (h) => h.personalidade === opcoes.personalidadeFoco,
    );
    if (filtradasPorPersonalidade.length >= apt) {
      habilidadesCandidatas = filtradasPorPersonalidade;
    }
  }

  // Embaralha candidatas com o PRNG
  const habilidadesEmbaralhadas = [...habilidadesCandidatas].sort(
    () => rnd() - 0.5,
  );
  const habilidadesSelecionadas = habilidadesEmbaralhadas.slice(0, apt);

  // Slots da Matriz 3x3 (0 a 8). Slot 4 é o centro.
  // Criamos uma ordem amigável de slots priorizando o centro (4) para APT 1
  const slotsPrioritarios = [4, 0, 2, 6, 8, 1, 3, 5, 7];
  const matrizHabilidades = habilidadesSelecionadas.map((hab, idx) => ({
    slot: slotsPrioritarios[idx % slotsPrioritarios.length],
    tipo: "paranormal" as const,
    id: hab.id,
  }));

  // 5. Equipamentos & Bugigangas
  // Sorteia 1 arma mundana acessível (até 6 F$ para personagens iniciais)
  const armasIniciais = catalogo.armasMundanas.filter(
    (a) => a.precoFundos <= 6,
  );
  const armaEscolhida =
    armasIniciais.length > 0
      ? armasIniciais[Math.floor(rnd() * armasIniciais.length)]
      : catalogo.armasMundanas[0];

  const inventario: ItemNaFichaCalafrio[] = [];

  if (armaEscolhida) {
    inventario.push({
      id: `item-arma-${armaEscolhida.id}`,
      nome: armaEscolhida.categoria,
      categoria: mapearTipoAlcanceParaCategoria(armaEscolhida.tipoAlcance),
      paranormal: false,
      equipado: true,
      precoFundos: armaEscolhida.precoFundos,
      dano: armaEscolhida.dano,
      espectroDano: armaEscolhida.espectroDano,
      propriedades: [...armaEscolhida.propriedades],
      descricao: `Exemplo: ${armaEscolhida.exemplos}`,
      efeitos: [],
    });
  }

  // Sorteia 1 bugiganga da tabela d100
  const bugigangas = catalogo.bugigangas;
  const bugigangaSorteada =
    bugigangas[Math.floor(rnd() * bugigangas.length)] ?? {
      numero: 1,
      nome: "Isqueiro velho",
    };

  inventario.push({
    id: `item-bugiganga-${bugigangaSorteada.numero}`,
    nome: bugigangaSorteada.nome,
    categoria: "bugiganga",
    paranormal: false,
    equipado: false,
    descricao: "Bugiganga pessoal de valor afetivo ou utilidade mundana.",
    efeitos: [],
  });

  // 6. Carteira Inicial (6 a 11 F$ padrão de início)
  const fundosIniciais = 6 + Math.floor(rnd() * 6);

  return {
    id: idUnico,
    nome: nomeCompleto,
    jogador: opcoes?.jogador ?? "",
    aptBase: apt,
    carteira: {
      fundos: fundosIniciais,
      espirions: 0,
    },
    palavrasChave,
    matrizHabilidades,
    habilidadesUnicas: [],
    customizacoesEco: [],
    inventario,
    efeitosCustomizados: [],
    anotacoes: `Personagem forjado no submundo paranormal de Curitiba. Ocupação original: ${ocupacaoSorteada.nome}.`,
  };
}
