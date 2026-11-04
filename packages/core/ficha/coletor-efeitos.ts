import type { CatalogoCalafrio } from "../catalogo/tipos";
import type { EfeitoCalafrio, OrigemDoModificador } from "./efeitos";
import type {
  CompanheiroDerivado,
  EstadoDeJogoCalafrio,
  FichaCalafrio,
  PalavraChaveDerivada,
} from "./modelo";

export interface ItemFilaEfeitos {
  efeito: EfeitoCalafrio;
  origem: OrigemDoModificador;
  rotuloOrigem: string;
}

export function coletarFilaEfeitos(
  ficha: FichaCalafrio,
  catalogo: CatalogoCalafrio,
  estado: EstadoDeJogoCalafrio,
): {
  filaEfeitos: ItemFilaEfeitos[];
  palavrasChaveAtivas: PalavraChaveDerivada[];
  companheiros: CompanheiroDerivado[];
  pvUnificadoComPa: boolean;
  idsParanormaisNaMatriz: string[];
} {
  const filaEfeitos: ItemFilaEfeitos[] = [];
  const palavrasChaveAtivas: PalavraChaveDerivada[] = [];
  const companheiros: CompanheiroDerivado[] = [];
  let pvUnificadoComPa = false;

  for (const pc of ficha.palavrasChave) {
    palavrasChaveAtivas.push({
      id: pc.id,
      nome: pc.nome,
      categoria: pc.categoria,
      semConsumirLimite: pc.semConsumirLimite,
      notas: pc.notas,
    });
    for (const ef of pc.efeitos) {
      filaEfeitos.push({
        efeito: ef,
        origem: { tipo: "palavraChave", id: pc.id, nome: pc.nome },
        rotuloOrigem: `Palavra-chave: ${pc.nome}`,
      });
    }
  }

  for (const item of ficha.inventario) {
    if (!item.equipado) continue;
    for (const ef of item.efeitos) {
      filaEfeitos.push({
        efeito: ef,
        origem: {
          tipo: "item",
          id: item.id,
          nome: item.nome,
          paranormal: item.paranormal,
        },
        rotuloOrigem: `${item.paranormal ? "Parartefato" : "Item"}: ${item.nome}`,
      });
    }
  }

  for (const unica of ficha.habilidadesUnicas) {
    const estaNaMatriz = ficha.matrizHabilidades.some(
      (m) => m.tipo === "unica" && m.id === unica.id,
    );
    if (!estaNaMatriz) continue;
    for (const ef of unica.efeitos) {
      filaEfeitos.push({
        efeito: ef,
        origem: { tipo: "eco", id: unica.id, nome: unica.nome },
        rotuloOrigem: `Habilidade Única: ${unica.nome}`,
      });
    }
  }

  for (const cust of ficha.customizacoesEco) {
    for (const ef of cust.efeitosExtras) {
      filaEfeitos.push({
        efeito: ef,
        origem: { tipo: "eco", id: cust.id, nome: cust.titulo },
        rotuloOrigem: `Eco: ${cust.titulo}`,
      });
    }
  }

  for (const custom of ficha.efeitosCustomizados) {
    filaEfeitos.push({
      efeito: custom.efeito,
      origem: { tipo: "mestre", id: custom.id, rotulo: custom.rotulo },
      rotuloOrigem: custom.rotulo,
    });
  }

  const idsParanormaisNaMatriz = ficha.matrizHabilidades
    .filter((m) => m.tipo === "paranormal")
    .map((m) => m.id);

  if (
    idsParanormaisNaMatriz.includes("configuracao-petrea") &&
    (estado.focoAtivoId === "configuracao-petrea" ||
      estado.habilidadesAtivasIds.includes("configuracao-petrea"))
  ) {
    filaEfeitos.push({
      efeito: { tipo: "modificadorAtributo", alvo: "pd", valor: 3 },
      origem: {
        tipo: "habilidadeAtiva",
        id: "configuracao-petrea",
        nome: "Configuração Pétrea",
      },
      rotuloOrigem: "Habilidade Ativa: Configuração Pétrea",
    });
  }

  if (
    idsParanormaisNaMatriz.includes("frenesi") &&
    estado.habilidadesAtivasIds.includes("frenesi")
  ) {
    filaEfeitos.push({
      efeito: { tipo: "modificadorAtributo", alvo: "danoDesarmado", valor: 1 },
      origem: { tipo: "habilidadeAtiva", id: "frenesi", nome: "Frenesi" },
      rotuloOrigem: "Habilidade Ativa: Frenesi",
    });
  }

  if (idsParanormaisNaMatriz.includes("metabolismo-de-djanho")) {
    const djanho = catalogo.djanhos.find(
      (d) => d.dado === (ficha.djanhoEscolhidoDado ?? 1),
    );
    if (djanho) {
      if (djanho.dado === 1) {
        filaEfeitos.push({
          efeito: {
            tipo: "modificadorAtributo",
            alvo: "danoDesarmado",
            valor: { escalaPorApt: 1, base: -1 },
          },
          origem: {
            tipo: "habilidadeAtiva",
            id: "metabolismo-de-djanho",
            nome: "Djanho: Tato",
          },
          rotuloOrigem: "Djanho: Tato",
        });
      } else if (djanho.dado === 6) {
        pvUnificadoComPa = true;
      }
      companheiros.push({
        id: `djanho-${djanho.dado}`,
        subtipo: "djanho",
        nome: `Djanho (${djanho.nome})`,
        descricao: djanho.propriedades,
        origem: "Metabolismo de Djanho",
      });
    }
  }

  if (idsParanormaisNaMatriz.includes("familiar")) {
    const fam = catalogo.familiares.find(
      (f) => f.dado === (ficha.familiarEscolhidoDado ?? 1),
    );
    if (fam) {
      companheiros.push({
        id: `familiar-${fam.dado}`,
        subtipo: "familiar",
        nome: `Familiar: ${fam.nome}`,
        descricao: `${fam.descricao} ${fam.propriedades}`,
        origem: "Habilidade: Familiar",
      });
    }
  }

  if (idsParanormaisNaMatriz.includes("necromancia")) {
    const lac = catalogo.lacaios.find(
      (l) => l.dado === (ficha.lacaioEscolhidoDado ?? 1),
    );
    if (lac) {
      companheiros.push({
        id: `lacaio-${lac.dado}`,
        subtipo: "lacaio",
        nome: `Lacaio: ${lac.nome}`,
        pvMax: lac.pv,
        pd: lac.pd,
        aptBonus: lac.aptBonus,
        velocidade: lac.velocidade,
        descricao: `${lac.descricao} ${lac.propriedades}`,
        origem: "Habilidade: Necromancia",
      });
    }
  }

  return {
    filaEfeitos,
    palavrasChaveAtivas,
    companheiros,
    pvUnificadoComPa,
    idsParanormaisNaMatriz,
  };
}
