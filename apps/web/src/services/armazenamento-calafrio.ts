import fs from "node:fs/promises";
import path from "node:path";
import type { FichaCalafrio } from "@calafrio/core";

export interface MesaCalafrio {
  id: string;
  nome: string;
  codigoConvite: string;
  criadaEm: string;
}

export interface PlayerCalafrio {
  id: string;
  mesaId: string;
  nome: string;
  jogador?: string;
  aptBase: number;
  pvMax: number;
  paMax: number;
  pd: number;
  velocidade: number;
  carteira: { fundos: number; espirions: number };
  ficha: FichaCalafrio;
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

function gerarCodigoConvite(): string {
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
      mesas: lido.mesas ?? [],
      players: lido.players ?? [],
      rolagens: lido.rolagens ?? [],
      anotacoes: lido.anotacoes ?? [],
    };
    return storeEmMemoria;
  } catch {
    // Inicializar store padrão
    storeEmMemoria = {
      mesas: [
        {
          id: "mesa-curitiba-1",
          nome: "Investigações Paranormais — Curitiba",
          codigoConvite: "CALA26",
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
    console.error("Erro ao persistir store Calafrio:", err);
  }
}

// === MESAS ===

export async function listarMesas(): Promise<MesaCalafrio[]> {
  const s = await carregarStore();
  return s.mesas;
}

export async function obterMesa(id: string): Promise<MesaCalafrio | null> {
  const s = await carregarStore();
  return s.mesas.find((m) => m.id === id) ?? null;
}

export async function criarMesa(nome: string): Promise<MesaCalafrio> {
  const s = await carregarStore();
  const nova: MesaCalafrio = {
    id: `mesa-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    nome: nome.trim(),
    codigoConvite: gerarCodigoConvite(),
    criadaEm: new Date().toISOString(),
  };
  s.mesas.push(nova);
  await salvarStore(s);
  return nova;
}

export async function excluirMesa(id: string): Promise<void> {
  const s = await carregarStore();
  s.mesas = s.mesas.filter((m) => m.id !== id);
  s.players = s.players.filter((p) => p.mesaId !== id);
  s.rolagens = s.rolagens.filter((r) => r.mesaId !== id);
  s.anotacoes = s.anotacoes.filter((a) => a.mesaId !== id);
  await salvarStore(s);
}

// === PLAYERS / INVESTIGADORES ===

export async function listarPlayers(mesaId: string): Promise<PlayerCalafrio[]> {
  const s = await carregarStore();
  return s.players.filter((p) => p.mesaId === mesaId);
}

export async function obterPlayer(
  playerId: string,
): Promise<PlayerCalafrio | null> {
  const s = await carregarStore();
  return s.players.find((p) => p.id === playerId) ?? null;
}

export async function criarPlayer(
  mesaId: string,
  ficha: FichaCalafrio,
): Promise<PlayerCalafrio> {
  const s = await carregarStore();
  const apt = ficha.aptBase || 1;
  const novo: PlayerCalafrio = {
    id:
      ficha.id ||
      `player-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    mesaId,
    nome: ficha.nome,
    jogador: ficha.jogador,
    aptBase: apt,
    pvMax: 3 + 3 * apt,
    paMax: 3 + 3 * apt,
    pd: 3 * apt,
    velocidade: 6,
    carteira: ficha.carteira,
    ficha,
    criadaEm: new Date().toISOString(),
  };
  s.players.push(novo);
  await salvarStore(s);
  return novo;
}

export async function salvarFichaPlayer(
  playerId: string,
  ficha: FichaCalafrio,
): Promise<PlayerCalafrio | null> {
  const s = await carregarStore();
  const idx = s.players.findIndex((p) => p.id === playerId);
  if (idx === -1) return null;

  const apt = ficha.aptBase || 1;
  const atualizado: PlayerCalafrio = {
    ...s.players[idx],
    nome: ficha.nome,
    jogador: ficha.jogador,
    aptBase: apt,
    pvMax: 3 + 3 * apt,
    paMax: 3 + 3 * apt,
    pd: 3 * apt,
    carteira: ficha.carteira,
    ficha,
  };
  s.players[idx] = atualizado;
  await salvarStore(s);
  return atualizado;
}

export async function excluirPlayer(
  mesaId: string,
  playerId: string,
): Promise<void> {
  const s = await carregarStore();
  s.players = s.players.filter(
    (p) => !(p.mesaId === mesaId && p.id === playerId),
  );
  await salvarStore(s);
}
