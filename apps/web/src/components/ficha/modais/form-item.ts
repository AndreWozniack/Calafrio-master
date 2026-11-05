import type {
  CategoriaItemCalafrio,
  EfeitoCalafrio,
  EspectroDeDano,
  ItemNaFichaCalafrio,
} from "@calafrio/core";

export interface FormItem {
  nome: string;
  categoria: CategoriaItemCalafrio;
  paranormal: boolean;
  equipado: boolean;
  dano?: number;
  espectro: EspectroDeDano;
  alcance: string;
  usosMax?: number;
  precoFundos?: number;
  precoEspirions?: number;
  propriedades: string;
  descricao: string;
  efeitos: EfeitoCalafrio[];
}

export const CATEGORIAS_ITEM: { id: CategoriaItemCalafrio; rotulo: string }[] =
  [
    { id: "arma_curto", rotulo: "Arma — curto alcance" },
    { id: "arma_longo", rotulo: "Arma — longo alcance" },
    { id: "arma_misto", rotulo: "Arma — misto" },
    { id: "vestimenta", rotulo: "Vestimenta" },
    { id: "consumivel", rotulo: "Consumível" },
    { id: "ferramenta", rotulo: "Ferramenta" },
    { id: "bugiganga", rotulo: "Bugiganga" },
  ];

export const ESPECTROS_DANO: EspectroDeDano[] = [
  "fisico",
  "castanho",
  "rubro",
  "ceruleo",
  "alvo",
  "variavel",
];

export function formularioItemInicial(inicial?: ItemNaFichaCalafrio): FormItem {
  return {
    nome: inicial?.nome ?? "",
    categoria: inicial?.categoria ?? "arma_curto",
    paranormal: inicial?.paranormal ?? false,
    equipado: inicial?.equipado ?? true,
    dano: inicial?.dano,
    espectro: inicial?.espectroDano ?? "fisico",
    alcance: inicial?.alcance ?? "",
    usosMax: inicial?.usosMax,
    precoFundos: inicial?.precoFundos,
    precoEspirions: inicial?.precoEspirions,
    propriedades: inicial?.propriedades?.join("\n") ?? "",
    descricao: inicial?.descricao ?? "",
    efeitos: inicial?.efeitos ?? [],
  };
}

export const ehArma = (categoria: CategoriaItemCalafrio) =>
  categoria.startsWith("arma_");

export function formularioParaItem(
  f: FormItem,
  inicial?: ItemNaFichaCalafrio,
): ItemNaFichaCalafrio {
  const propriedades = f.propriedades
    .split("\n")
    .map((p) => p.trim())
    .filter(Boolean);
  const arma = ehArma(f.categoria);
  return {
    id:
      inicial?.id ??
      `item-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    nome: f.nome.trim(),
    categoria: f.categoria,
    paranormal: f.paranormal,
    equipado: f.equipado,
    precoFundos: f.precoFundos,
    precoEspirions: f.precoEspirions,
    dano: arma ? f.dano : undefined,
    espectroDano: arma ? f.espectro : undefined,
    alcance: f.alcance.trim() || undefined,
    usosAtuais:
      f.usosMax === undefined
        ? undefined
        : Math.min(inicial?.usosAtuais ?? f.usosMax, f.usosMax),
    usosMax: f.usosMax,
    propriedades: propriedades.length ? propriedades : undefined,
    descricao: f.descricao.trim() || undefined,
    efeitos: f.efeitos,
  };
}
