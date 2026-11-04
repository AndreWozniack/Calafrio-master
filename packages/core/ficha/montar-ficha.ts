import type { EspectroDeDano } from "@calafrio/tema";
import type { CatalogoCalafrio } from "../catalogo/tipos";
import { coletarFilaEfeitos } from "./coletor-efeitos";
import type {
  AlvoAtributoCalafrio,
  ModificadorResolvido,
} from "./efeitos";
import { calcularAlinhamentosMatriz } from "./matriz-alinhamento";
import type {
  EstadoDeJogoCalafrio,
  FichaCalafrio,
  FichaDerivadaCalafrio,
} from "./modelo";
import { validarAvisosDeRegra } from "./validacao-regras";

export function criarFichaCalafrioVazia(
  id = "ficha-calafrio-1",
  nome = "Novo Neural",
): FichaCalafrio {
  return {
    id,
    nome,
    aptBase: 1,
    carteira: { fundos: 6, espirions: 0 },
    palavrasChave: [],
    matrizHabilidades: [],
    habilidadesUnicas: [],
    customizacoesEco: [],
    inventario: [],
    efeitosCustomizados: [],
    anotacoes: "",
  };
}

export function criarEstadoDeJogoInicial(): EstadoDeJogoCalafrio {
  return {
    danoSofrido: 0,
    paGasto: 0,
    pvTemporario: 0,
    paTemporario: 0,
    acoesPadraoRestantes: 2,
    acaoLivreRestante: 1,
    reflexoRestante: 1,
    quedasSemTratamento: 0,
    habilidadesAtivasIds: [],
    condicoesAtivas: [],
  };
}

function resolverValorEfeito(
  valor: number | { escalaPorApt: number; base?: number },
  apt: number,
): number {
  if (typeof valor === "number") return valor;
  return (valor.base ?? 0) + valor.escalaPorApt * apt;
}

export function montarFichaCalafrio(
  ficha: FichaCalafrio,
  catalogo: CatalogoCalafrio,
  estado: EstadoDeJogoCalafrio = criarEstadoDeJogoInicial(),
): FichaDerivadaCalafrio {
  const modificadores: ModificadorResolvido[] = [];
  const resistencias: Partial<
    Record<EspectroDeDano, "resistente" | "vulneravel" | "imune">
  > = {};
  let permitirDominioMisto = false;

  const {
    filaEfeitos,
    palavrasChaveAtivas,
    companheiros,
    pvUnificadoComPa: pvUnificadoColetor,
    idsParanormaisNaMatriz,
  } = coletarFilaEfeitos(ficha, catalogo, estado);

  let pvUnificadoComPa = pvUnificadoColetor;

  // Primeiro passo: resolver modificadores de APT
  let bonusApt = 0;
  for (const item of filaEfeitos) {
    if (
      item.efeito.tipo === "modificadorAtributo" &&
      item.efeito.alvo === "apt" &&
      item.efeito.ativo !== false
    ) {
      const val = resolverValorEfeito(item.efeito.valor, ficha.aptBase);
      bonusApt += val;
      modificadores.push({
        alvo: "apt",
        valor: val,
        condicaoTexto: item.efeito.condicaoTexto,
        origem: item.origem,
      });
    }
  }

  const apt = Math.max(1, ficha.aptBase + bonusApt);

  // Registrar valores base derivados de APT com proveniência
  const registrarBase = (
    alvo: AlvoAtributoCalafrio,
    valor: number,
    rotulo: string,
  ) => {
    modificadores.push({
      alvo,
      valor,
      origem: { tipo: "baseApt", rotulo },
    });
  };

  registrarBase("pd", 3 * apt, `Base (3 × APT ${apt})`);
  registrarBase("pvMax", 3 + 3 * apt, `Base (3 + 3 × APT ${apt})`);
  registrarBase("paMax", 3 + 3 * apt, `Base (3 + 3 × APT ${apt})`);
  registrarBase("velocidade", 6, "Velocidade inicial (6 metros)");
  registrarBase("ecosMax", apt, `Base (= APT ${apt})`);
  registrarBase("limitePalavrasChave", 2 + apt, `Base (2 + APT ${apt})`);
  registrarBase("limiteHabilidadesMemorizadas", apt, `Base (= APT ${apt})`);
  registrarBase("danoDesarmado", 1, "Golpe desarmado base");

  // Calcular bônus de alinhamento da Matriz 3x3
  const alinhamentosAtivos = calcularAlinhamentosMatriz(
    ficha.matrizHabilidades,
    ficha.habilidadesUnicas,
    catalogo,
  );

  for (const alinhamento of alinhamentosAtivos) {
    modificadores.push({
      alvo: alinhamento.alvo,
      valor: alinhamento.valor,
      origem: {
        tipo: "alinhamentoMatriz",
        padrao: alinhamento.padrao,
        slots: alinhamento.slots,
        personalidade: alinhamento.personalidade,
        rotulo: `Alinhamento ${alinhamento.padrao} (${alinhamento.personalidade})`,
      },
    });
  }

  // Processar demais efeitos da fila
  for (const item of filaEfeitos) {
    const ef = item.efeito;
    if (ef.tipo === "modificadorAtributo") {
      if (ef.alvo === "apt" || ef.ativo === false) continue;
      const val = resolverValorEfeito(ef.valor, apt);
      modificadores.push({
        alvo: ef.alvo,
        valor: val,
        condicaoTexto: ef.condicaoTexto,
        origem: item.origem,
      });
    } else if (ef.tipo === "concederPalavraChave") {
      palavrasChaveAtivas.push({
        id: `concedida-${palavrasChaveAtivas.length + 1}`,
        nome: ef.nome,
        categoria: ef.categoria ?? "extra",
        concedidaPor: item.rotuloOrigem,
        semConsumirLimite: ef.semConsumirLimite,
      });
    } else if (ef.tipo === "resistenciaOuVulnerabilidade") {
      resistencias[ef.espectro] = ef.grau;
    } else if (ef.tipo === "companheiro") {
      companheiros.push({
        id: `comp-${companheiros.length + 1}`,
        subtipo: ef.subtipo,
        nome: ef.nome,
        pvMax: ef.pvMax,
        pd: ef.pd,
        aptBonus: ef.aptBonus,
        velocidade: ef.velocidade,
        descricao: ef.descricao,
        origem: item.rotuloOrigem,
      });
    } else if (ef.tipo === "regraEspecial") {
      if (ef.regra === "pvUnificadoComPa") pvUnificadoComPa = true;
      if (ef.regra === "permitirDominioMisto") permitirDominioMisto = true;
    }
  }

  const somarAlvo = (alvo: AlvoAtributoCalafrio) =>
    modificadores
      .filter((m) => m.alvo === alvo)
      .reduce((acc, m) => acc + m.valor, 0);

  let pd = Math.max(0, somarAlvo("pd"));
  const pvMax = Math.max(1, somarAlvo("pvMax"));
  const paMax = pvUnificadoComPa ? pvMax : Math.max(0, somarAlvo("paMax"));
  let velocidade = Math.max(0, somarAlvo("velocidade"));

  if (
    idsParanormaisNaMatriz.includes("impeto") &&
    (estado.focoAtivoId === "impeto" ||
      estado.habilidadesAtivasIds.includes("impeto"))
  ) {
    velocidade *= 2;
  }

  const danoDesarmado = Math.max(1, somarAlvo("danoDesarmado"));
  const bonusTesteAcao = somarAlvo("bonusTesteAcao");
  const bonusContestacao = somarAlvo("bonusContestacao");
  const ecosMax = Math.max(0, somarAlvo("ecosMax"));
  const limitePalavrasChave = Math.max(1, somarAlvo("limitePalavrasChave"));
  const limiteHabilidadesMemorizadas = Math.max(
    1,
    somarAlvo("limiteHabilidadesMemorizadas"),
  );

  const ecosUsadosEmUnicas = ficha.habilidadesUnicas.reduce(
    (acc, u) => acc + (u.ecosInvestidos ?? 1),
    0,
  );
  const ecosUsadosEmRegras = ficha.efeitosCustomizados.filter(
    (e) => e.consomeEco,
  ).length;
  const ecosUsados =
    ecosUsadosEmUnicas + ficha.customizacoesEco.length + ecosUsadosEmRegras;
  const ecosDisponiveis = ecosMax - ecosUsados;

  const palavrasChaveOcupadas = palavrasChaveAtivas.filter(
    (p) => !p.semConsumirLimite,
  ).length;
  const habilidadesMemorizadasCount = ficha.matrizHabilidades.length;

  // Verificar domínio emocional das habilidades paranormais na matriz
  const dominiosPresentes = new Set<"positivo" | "negativo">();
  for (const aloc of ficha.matrizHabilidades) {
    if (aloc.tipo === "paranormal") {
      const hab = catalogo.habilidadesParanormais.find((h) => h.id === aloc.id);
      if (hab) dominiosPresentes.add(hab.dominio);
    }
  }

  let dominioAtual: FichaDerivadaCalafrio["dominioAtual"] = "nenhum";
  if (dominiosPresentes.size === 1) {
    dominioAtual = dominiosPresentes.has("positivo") ? "positivo" : "negativo";
  } else if (dominiosPresentes.size > 1) {
    dominioAtual = "misto";
  }

  const avisosDeRegra = validarAvisosDeRegra({
    dominioAtual,
    permitirDominioMisto,
    habilidadesMemorizadasCount,
    limiteHabilidadesMemorizadas,
    palavrasChaveOcupadas,
    limitePalavrasChave,
    ecosUsados,
    ecosMax,
  });

  const pvAtual = Math.max(0, pvMax + estado.pvTemporario - estado.danoSofrido);
  const paAtual = pvUnificadoComPa
    ? pvAtual
    : Math.max(0, paMax + estado.paTemporario - estado.paGasto);

  const inconsciente = pvAtual === 0;
  const segundosAteMorrer = Math.max(
    1,
    Math.floor(60 / 2 ** estado.quedasSemTratamento),
  );

  // Se inconsciente, PD = 0
  if (inconsciente) {
    pd = 0;
  }

  return {
    apt,
    pd,
    pvMax,
    pvAtual,
    paMax,
    paAtual,
    velocidade,
    danoDesarmado,
    bonusTesteAcao,
    bonusContestacao,
    ecosMax,
    ecosUsados,
    ecosDisponiveis,
    limitePalavrasChave,
    palavrasChaveOcupadas,
    palavrasChaveAtivas,
    limiteHabilidadesMemorizadas,
    habilidadesMemorizadasCount,
    dominioAtual,
    alinhamentosAtivos,
    resistencias,
    companheiros,
    pvUnificadoComPa,
    permitirDominioMisto,
    inconsciente,
    segundosAteMorrer,
    modificadores,
    avisosDeRegra,
  };
}
