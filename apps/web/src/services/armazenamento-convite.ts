import { criarFichaCalafrioVazia } from "@calafrio/core";
import { and, eq } from "drizzle-orm";
import { db, schema } from "@/db";
import { criarPlayer, obterMesa } from "./armazenamento-calafrio";
import {
  carregarStore,
  gerarCodigoConvite,
  type MesaCalafrio,
  salvarStore,
} from "./armazenamento-store";
import { ehMestreDaMesa, normalizarCodigoConvite } from "./convite-regras";

export class ErroConvite extends Error {
  constructor(public codigo: "INVALIDO" | "MESTRE" | "SEM_PERMISSAO") {
    super(`Erro de convite: ${codigo}`);
    this.name = "ErroConvite";
  }
}

const NOME_RASCUNHO = "Investigador Pendente";
const MAX_TENTATIVAS = 5;

export async function buscarMesaPorCodigoConvite(
  codigo: string,
): Promise<MesaCalafrio | null> {
  const norm = normalizarCodigoConvite(codigo);
  if (!norm) return null;
  if (db) {
    try {
      const res = await db
        .select()
        .from(schema.mesas)
        .where(eq(schema.mesas.codigoConvite, norm));
      const m = res[0];
      return m
        ? {
            id: m.id,
            userId: m.userId,
            nome: m.nome,
            codigoConvite: m.codigoConvite,
            criadaEm: m.criadaEm.toISOString(),
          }
        : null;
    } catch (e) {
      console.warn("Postgres falhou ao buscar convite, usando store local:", e);
    }
  }
  const s = await carregarStore();
  return s.mesas.find((m) => m.codigoConvite === norm) ?? null;
}

export async function regerarCodigoConvite(
  mesaId: string,
  userId?: string,
): Promise<string> {
  const mesa = await obterMesa(mesaId);
  if (!mesa) throw new ErroConvite("INVALIDO");
  if (userId !== undefined && !ehMestreDaMesa(mesa, userId)) {
    throw new ErroConvite("SEM_PERMISSAO");
  }

  for (let i = 0; i < MAX_TENTATIVAS; i++) {
    const novo = gerarCodigoConvite();
    if (await buscarMesaPorCodigoConvite(novo)) continue;

    if (db) {
      try {
        await db
          .update(schema.mesas)
          .set({ codigoConvite: novo, atualizadaEm: new Date() })
          .where(eq(schema.mesas.id, mesaId));
        return novo;
      } catch (e) {
        console.warn(
          "Postgres falhou ao regerar código, usando store local:",
          e,
        );
      }
    }
    const s = await carregarStore();
    const alvo = s.mesas.find((m) => m.id === mesaId);
    if (!alvo) throw new ErroConvite("INVALIDO");
    alvo.codigoConvite = novo;
    await salvarStore(s);
    return novo;
  }
  throw new Error("Não foi possível gerar um código de convite único.");
}

export async function entrarPorConvite(
  userId: string,
  codigo: string,
): Promise<{ mesaId: string; playerId: string }> {
  const mesa = await buscarMesaPorCodigoConvite(codigo);
  if (!mesa) throw new ErroConvite("INVALIDO");
  if (ehMestreDaMesa(mesa, userId)) throw new ErroConvite("MESTRE");

  if (db) {
    try {
      const ja = await db
        .select({ id: schema.players.id })
        .from(schema.players)
        .where(
          and(
            eq(schema.players.mesaId, mesa.id),
            eq(schema.players.userId, userId),
          ),
        );
      if (ja[0]) return { mesaId: mesa.id, playerId: ja[0].id };
    } catch (e) {
      console.warn("Postgres falhou ao buscar player, usando store local:", e);
    }
  } else {
    const s = await carregarStore();
    const ja = s.players.find(
      (p) => p.mesaId === mesa.id && p.userId === userId,
    );
    if (ja) return { mesaId: mesa.id, playerId: ja.id };
  }

  const id = `player-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
  const novo = await criarPlayer(
    mesa.id,
    criarFichaCalafrioVazia(id, NOME_RASCUNHO),
    userId,
  );
  return { mesaId: mesa.id, playerId: novo.id };
}

export async function sairDaMesaComoJogador(
  userId: string,
  mesaId: string,
): Promise<void> {
  if (db) {
    try {
      await db
        .delete(schema.players)
        .where(
          and(
            eq(schema.players.mesaId, mesaId),
            eq(schema.players.userId, userId),
          ),
        );
      return;
    } catch (e) {
      console.warn("Postgres falhou ao sair da mesa, usando store local:", e);
    }
  }
  const s = await carregarStore();
  s.players = s.players.filter(
    (p) => !(p.mesaId === mesaId && p.userId === userId),
  );
  await salvarStore(s);
}
