import { OCUPACOES_CATALOGO } from "../catalogo/ocupacoes";
import { PALAVRAS_CHAVE_GENERICAS_CATALOGO } from "../catalogo/palavras-chave";
import {
  PRENOMES_INVESTIGADORES,
  SOBRENOMES_INVESTIGADORES,
} from "../ficha/gerador-aleatorio";
import { HABILIDADES_1E } from "./catalogo";
import {
  ARVORES_1E,
  type ArvoreV1,
  CUSTO_PM_POR_GRAU,
  type FichaCalafrioV1,
  type HabilidadeMemorizadaV1,
  type ItemV1,
  type PalavraChaveV1,
} from "./modelo-v1";

export interface OpcoesGeradorFichaV1 {
  nivel?: number; // 1 a 10 (default: 1)
  arvoreFoco?: ArvoreV1;
  jogador?: string;
  randomFn?: () => number; // Permite injeção de PRNG determinístico para testes
}

const ITENS_MUNDANOS_INICIAIS: readonly { nome: string; quantidade: number }[] =
  [
    { nome: "Lanterna tática", quantidade: 1 },
    { nome: "Revólver .38 cano curto", quantidade: 1 },
    { nome: "Caderno de anotações e caneta", quantidade: 1 },
    { nome: "Isqueiro de metal", quantidade: 1 },
    { nome: "Kit de primeiros socorros", quantidade: 1 },
    { nome: "Canivete suíço", quantidade: 1 },
    { nome: "Fita isolante e giz", quantidade: 1 },
    { nome: "Gravador de voz portátil", quantidade: 1 },
  ];

/**
 * Gera uma FichaCalafrioV1 completa e canônica, 100% aderente às regras da 1ª Edição.
 */
export function gerarFichaV1Aleatoria(
  opcoes?: OpcoesGeradorFichaV1,
): FichaCalafrioV1 {
  const rnd = opcoes?.randomFn ?? Math.random;

  const nivel = Math.min(10, Math.max(1, opcoes?.nivel ?? 1));

  // 1. Sorteio de Nome Urbano
  const prenomeIdx = Math.floor(rnd() * PRENOMES_INVESTIGADORES.length);
  const sobrenomeIdx = Math.floor(rnd() * SOBRENOMES_INVESTIGADORES.length);
  const nomeCompleto = `${PRENOMES_INVESTIGADORES[prenomeIdx]} ${SOBRENOMES_INVESTIGADORES[sobrenomeIdx]}`;
  const sufixoId = Math.floor(rnd() * 36 ** 6)
    .toString(36)
    .padStart(6, "0");
  const idUnico = `investigador-1e-${Date.now().toString(36)}-${sufixoId}`;

  // 2. Distribuição de Atributos (Base 1 em cada; nivel pontos extras distribuídos)
  const atributos = { corpo: 1, mente: 1, alma: 1 };
  const attrs: Array<"corpo" | "mente" | "alma"> = ["corpo", "mente", "alma"];
  for (let i = 0; i < nivel; i++) {
    const escolhido = attrs[Math.floor(rnd() * attrs.length)];
    atributos[escolhido]++;
  }

  // 3. Vitais
  const pvMax = 6 * nivel;
  const paMax = 9 * atributos.alma;

  // 4. Carteira Inicial (entre 1 e 12 Fundos conforme regra 1e)
  const fundos = 1 + Math.floor(rnd() * 12);

  // 5. Palavras-Chave (1 Ocupação, 1 Personalidade, 1 Miscelânea)
  const ocupacaoSorteada = OCUPACOES_CATALOGO[
    Math.floor(rnd() * OCUPACOES_CATALOGO.length)
  ] ?? {
    numero: 1,
    nome: "Detetive Particular",
  };

  const genericasDisponiveis = [...PALAVRAS_CHAVE_GENERICAS_CATALOGO];
  // Embaralhar para sortear personalidade e miscelânea distintas
  for (let i = genericasDisponiveis.length - 1; i > 0; i--) {
    const j = Math.floor(rnd() * (i + 1));
    const temp = genericasDisponiveis[i];
    genericasDisponiveis[i] = genericasDisponiveis[j];
    genericasDisponiveis[j] = temp;
  }

  const personalidadeSorteada = genericasDisponiveis[0] ?? {
    numero: 1,
    nome: "Observador(a)",
  };
  const miscelaneaSorteada = genericasDisponiveis[1] ?? {
    numero: 2,
    nome: "Insônia crônica",
  };

  const palavrasChave: PalavraChaveV1[] = [
    {
      id: `pc-ocupacao-${ocupacaoSorteada.numero}`,
      nome: ocupacaoSorteada.nome,
      categoria: "ocupacao",
    },
    {
      id: `pc-personalidade-${personalidadeSorteada.numero}`,
      nome: personalidadeSorteada.nome,
      categoria: "personalidade",
    },
    {
      id: `pc-miscelanea-${miscelaneaSorteada.numero}`,
      nome: miscelaneaSorteada.nome,
      categoria: "miscelanea",
    },
  ];

  // 6. Habilidades Paranormais (Grau 0 é automático e omitido; Grau 1 custa 3 PM cada)
  const arvoreEscolhida: ArvoreV1 =
    opcoes?.arvoreFoco ?? ARVORES_1E[Math.floor(rnd() * ARVORES_1E.length)];

  const pmMax = 6 * atributos.mente;
  let pmRestante = pmMax;
  const habilidades: HabilidadeMemorizadaV1[] = [];

  // Pega habilidades de Grau 1 da árvore
  const habsGrau1 = HABILIDADES_1E.filter(
    (h) => h.arvore === arvoreEscolhida && h.grau === 1,
  );

  // Embaralhar Grau 1
  for (let i = habsGrau1.length - 1; i > 0; i--) {
    const j = Math.floor(rnd() * (i + 1));
    const temp = habsGrau1[i];
    habsGrau1[i] = habsGrau1[j];
    habsGrau1[j] = temp;
  }

  for (const hab of habsGrau1) {
    const custo = CUSTO_PM_POR_GRAU[hab.grau];
    if (pmRestante >= custo) {
      habilidades.push({
        id: hab.id,
        aprimoramentos: [],
      });
      pmRestante -= custo;
      // Para personagens iniciantes de nível 1, 1 ou 2 habilidades de Grau 1 são o ideal
      if (nivel === 1 && habilidades.length >= 2) break;
    }
  }

  // 7. Inventário Inicial
  const inventario: ItemV1[] = [];
  const item1 =
    ITENS_MUNDANOS_INICIAIS[Math.floor(rnd() * ITENS_MUNDANOS_INICIAIS.length)];
  inventario.push({
    id: `item-1-${Date.now().toString(36)}`,
    nome: item1.nome,
    quantidade: item1.quantidade,
  });

  const item2 =
    ITENS_MUNDANOS_INICIAIS[
      (Math.floor(rnd() * ITENS_MUNDANOS_INICIAIS.length) + 1) %
        ITENS_MUNDANOS_INICIAIS.length
    ];
  if (item2.nome !== item1.nome) {
    inventario.push({
      id: `item-2-${Date.now().toString(36)}`,
      nome: item2.nome,
      quantidade: item2.quantidade,
    });
  }

  return {
    edicao: "1e",
    id: idUnico,
    nome: nomeCompleto,
    jogador: opcoes?.jogador ?? "",
    nivel,
    atributos,
    pvAtual: pvMax,
    paAtual: paMax,
    carteira: {
      fundos,
      espirions: 0,
    },
    palavrasChave,
    habilidades,
    habilidadesUnicas: [],
    inventario,
    quemSouEu: `Investigador(a) urbano(a) com passado como ${ocupacaoSorteada.nome}. Conectado aos mistérios da árvore das ${arvoreEscolhida}.`,
    anotacoes: `Pistas preliminares e investigações em andamento no submundo paranormal.`,
  };
}
