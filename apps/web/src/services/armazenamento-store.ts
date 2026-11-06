import fs from "node:fs/promises";
import path from "node:path";
import {
  type FichaPersonagem,
  normalizarSistemaVersao,
  type SistemaVersao,
} from "@calafrio/core";

export interface MesaCalafrio {
  id: string;
  userId?: string | null;
  nome: string;
  codigoConvite: string;
  sistemaVersao: SistemaVersao;
  criadaEm: string;
}

export function normalizarMesa(
  m: Omit<MesaCalafrio, "sistemaVersao"> & { sistemaVersao?: unknown },
): MesaCalafrio {
  return {
    ...m,
    sistemaVersao: normalizarSistemaVersao(m.sistemaVersao),
  };
}

export interface PlayerCalafrio {
  id: string;
  mesaId: string;
  userId?: string | null;
  nome: string;
  jogador?: string;
  aptBase: number;
  pvMax: number;
  paMax: number;
  pd: number;
  velocidade: number;
  carteira: { fundos: number; espirions: number };
  ficha: FichaPersonagem;
  criadaEm: string;
}

export interface RolagemMesa {
  id: string;
  mesaId: string;
  autor: string;
  acao: string;
  tipo: "acao" | "contestacao";
  total: number;
  detalhe: string;
  veredito: string;
  desfecho: "sucesso" | "falha" | "critico" | "desastre";
  criadaEm: string;
}

export interface AnotacaoMesa {
  id: string;
  mesaId: string;
  titulo: string;
  texto: string;
  fixada: boolean;
  criadaEm: string;
}

export interface DadosStore {
  mesas: MesaCalafrio[];
  players: PlayerCalafrio[];
  rolagens: RolagemMesa[];
  anotacoes: AnotacaoMesa[];
}

const CAMINHO_ARQUIVO = path.join(process.cwd(), "data", "calafrio-store.json");

export function gerarCodigoConvite(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let res = "";
  for (let i = 0; i < 6; i++) {
    res += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return res;
}

let storeEmMemoria: DadosStore | null = null;

export async function carregarStore(): Promise<DadosStore> {
  if (storeEmMemoria) return storeEmMemoria;

  try {
    const conteudo = await fs.readFile(CAMINHO_ARQUIVO, "utf-8");
    const lido = JSON.parse(conteudo) as Partial<DadosStore>;
    storeEmMemoria = {
      mesas: (lido.mesas ?? []).map(normalizarMesa),
      players: lido.players ?? [],
      rolagens: lido.rolagens ?? [],
      anotacoes: lido.anotacoes ?? [],
    };
    return storeEmMemoria;
  } catch {
    storeEmMemoria = {
      mesas: [
        {
          id: "mesa-curitiba-1",
          nome: "Investigações Paranormais — Curitiba",
          codigoConvite: "CALA26",
          sistemaVersao: "2e",
          criadaEm: new Date().toISOString(),
        },
      ],
      players: [],
      rolagens: [],
      anotacoes: [],
    };
    await salvarStore(storeEmMemoria);
    return storeEmMemoria;
  }
}

export async function salvarStore(dados: DadosStore): Promise<void> {
  storeEmMemoria = dados;
  try {
    const dir = path.dirname(CAMINHO_ARQUIVO);
    await fs.mkdir(dir, { recursive: true });
    await fs.writeFile(
      CAMINHO_ARQUIVO,
      JSON.stringify(dados, null, 2),
      "utf-8",
    );
  } catch (err) {
    console.error("Erro ao persistir store local:", err);
  }
}
