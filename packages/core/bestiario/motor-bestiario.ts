import type { EspectroDeDano } from "@calafrio/tema";

export type CategoriaCriaturaCalafrio =
  | "ameaca"
  | "npc"
  | "familiar"
  | "lacaio"
  | "estrutura";

export interface AcaoDeCriatura {
  id: string;
  nome: string;
  tipoAcao: "padrao" | "livre" | "reflexo" | "preparada" | "passiva";
  custoPA?: number;
  espectroDano?: EspectroDeDano;
  dano?: number;
  descricao: string;
}

export interface CriaturaCalafrio {
  id: string;
  nome: string;
  categoria: CategoriaCriaturaCalafrio;
  apt: number;
  pvMax: number;
  pvAtual?: number;
  pd: number;
  paMax: number;
  paAtual?: number;
  velocidade: number;
  palavrasChave: string[];
  resistencias: Partial<
    Record<EspectroDeDano, "resistente" | "vulneravel" | "imune">
  >;
  acoes: AcaoDeCriatura[];
  notas?: string;
}

export interface MotorBestiario {
  id: string;
  nome: string;
  gerarPadraoPorApt(
    apt: number,
    papel?: string,
  ): Omit<CriaturaCalafrio, "id" | "nome">;
  validarCriatura(criatura: CriaturaCalafrio): string[];
}

export function calcularDanoContraCriatura(
  criatura: Pick<CriaturaCalafrio, "resistencias">,
  danoBruto: number,
  espectro: EspectroDeDano,
): number {
  const grau = criatura.resistencias[espectro];
  if (grau === "imune") return 0;
  if (grau === "resistente") return Math.floor(danoBruto / 2);
  if (grau === "vulneravel") return danoBruto * 2;
  return danoBruto;
}

export const motorBestiarioUnificado: MotorBestiario = {
  id: "calafrio-unificado",
  nome: "Motor Unificado Calafrio 2e",
  gerarPadraoPorApt(apt: number) {
    const aptClamped = Math.max(1, Math.min(6, apt));
    return {
      categoria: "ameaca",
      apt: aptClamped,
      pvMax: 3 + 3 * aptClamped,
      pd: 3 * aptClamped,
      paMax: 3 + 3 * aptClamped,
      velocidade: 6,
      palavrasChave: [],
      resistencias: {},
      acoes: [
        {
          id: "ataque-padrao",
          nome: "Ataque",
          tipoAcao: "padrao",
          espectroDano: "fisico",
          dano: aptClamped,
          descricao: `Ataque corpo-a-corpo causando ${aptClamped} de dano físico.`,
        },
      ],
      notas: "",
    };
  },
  validarCriatura(criatura: CriaturaCalafrio): string[] {
    const erros: string[] = [];
    if (!criatura.nome.trim()) erros.push("A criatura precisa de um nome.");
    if (criatura.apt < 0) erros.push("APT não pode ser negativa.");
    if (criatura.pvMax <= 0) erros.push("PV Máximo deve ser maior que zero.");
    return erros;
  },
};
