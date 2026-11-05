import type { FichaCalafrio } from "@calafrio/core";
import { eq, isNull, or } from "drizzle-orm";
import { db, schema } from "@/db";
import {
  type AnotacaoMesa,
  carregarStore,
  type DadosStore,
  gerarCodigoConvite,
  type MesaCalafrio,
  type PlayerCalafrio,
  type RolagemMesa,
  salvarStore,
} from "./armazenamento-store";
import { filtrarMesasDoUsuario } from "./convite-regras";

export type {
  AnotacaoMesa,
  DadosStore,
  MesaCalafrio,
  PlayerCalafrio,
  RolagemMesa,
};
export { carregarStore, salvarStore };

// === MESAS ===

export async function listarMesas(userId?: string): Promise<MesaCalafrio[]> {
  if (db) {
    try {
      if (userId) {
        const mesasMestre = await db
          .select()
          .from(schema.mesas)
          .where(
            or(eq(schema.mesas.userId, userId), isNull(schema.mesas.userId)),
          );

        const mesasJogador = await db
          .select({
            id: schema.mesas.id,
            userId: schema.mesas.userId,
            nome: schema.mesas.nome,
            codigoConvite: schema.mesas.codigoConvite,
            criadaEm: schema.mesas.criadaEm,
            atualizadaEm: schema.mesas.atualizadaEm,
          })
          .from(schema.mesas)
          .innerJoin(schema.players, eq(schema.players.mesaId, schema.mesas.id))
          .where(eq(schema.players.userId, userId));

        const todas = [...mesasMestre, ...mesasJogador];
        const vistas = new Set<string>();
        const res: typeof todas = [];
        for (const m of todas) {
          if (!vistas.has(m.id)) {
            vistas.add(m.id);
            res.push(m);
          }
        }
        return res.map((m) => ({
          id: m.id,
          userId: m.userId,
          nome: m.nome,
          codigoConvite: m.codigoConvite,
          criadaEm: m.criadaEm.toISOString(),
        }));
      }

      const res = await db.select().from(schema.mesas);
      return res.map((m) => ({
        id: m.id,
        userId: m.userId,
        nome: m.nome,
        codigoConvite: m.codigoConvite,
        criadaEm: m.criadaEm.toISOString(),
      }));
    } catch (e) {
      console.warn("Postgres falhou, usando store local:", e);
    }
  }
  const s = await carregarStore();
  return userId ? filtrarMesasDoUsuario(s, userId) : s.mesas;
}

export async function obterMesa(id: string): Promise<MesaCalafrio | null> {
  if (db) {
    try {
      const res = await db
        .select()
        .from(schema.mesas)
        .where(eq(schema.mesas.id, id));
      const m = res[0];
      if (m) {
        return {
          id: m.id,
          userId: m.userId,
          nome: m.nome,
          codigoConvite: m.codigoConvite,
          criadaEm: m.criadaEm.toISOString(),
        };
      }
    } catch (e) {
      console.warn("Postgres falhou, usando store local:", e);
    }
  }
  const s = await carregarStore();
  return s.mesas.find((m) => m.id === id) ?? null;
}

export async function criarMesa(
  nome: string,
  userId?: string,
): Promise<MesaCalafrio> {
  const nova: MesaCalafrio = {
    id: `mesa-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    userId: userId ?? null,
    nome: nome.trim(),
    codigoConvite: gerarCodigoConvite(),
    criadaEm: new Date().toISOString(),
  };

  if (db) {
    try {
      await db.insert(schema.mesas).values({
        id: nova.id,
        userId: nova.userId ?? null,
        nome: nova.nome,
        codigoConvite: nova.codigoConvite,
        criadaEm: new Date(nova.criadaEm),
        atualizadaEm: new Date(nova.criadaEm),
      });
      return nova;
    } catch (e) {
      console.warn("Postgres falhou ao criar mesa, usando store local:", e);
    }
  }

  const s = await carregarStore();
  s.mesas.push(nova);
  await salvarStore(s);
  return nova;
}

export async function excluirMesa(id: string): Promise<void> {
  if (db) {
    try {
      await db.delete(schema.mesas).where(eq(schema.mesas.id, id));
      return;
    } catch (e) {
      console.warn("Postgres falhou ao excluir mesa, usando store local:", e);
    }
  }
  const s = await carregarStore();
  s.mesas = s.mesas.filter((m) => m.id !== id);
  s.players = s.players.filter((p) => p.mesaId !== id);
  s.rolagens = s.rolagens.filter((r) => r.mesaId !== id);
  s.anotacoes = s.anotacoes.filter((a) => a.mesaId !== id);
  await salvarStore(s);
}

// === PLAYERS / INVESTIGADORES ===

export async function listarPlayers(mesaId: string): Promise<PlayerCalafrio[]> {
  if (db) {
    try {
      const res = await db
        .select()
        .from(schema.players)
        .where(eq(schema.players.mesaId, mesaId));

      return res.map((p) => ({
        id: p.id,
        mesaId: p.mesaId,
        userId: p.userId,
        nome: p.nome,
        jogador: p.jogador ?? undefined,
        aptBase: p.aptBase,
        pvMax: p.pvMax,
        paMax: p.paMax,
        pd: p.pd,
        velocidade: p.velocidade,
        carteira: p.carteira as { fundos: number; espirions: number },
        ficha: p.ficha,
        criadaEm: p.criadaEm.toISOString(),
      }));
    } catch (e) {
      console.warn("Postgres falhou ao listar players, usando store local:", e);
    }
  }

  const s = await carregarStore();
  return s.players.filter((p) => p.mesaId === mesaId);
}

export async function obterPlayer(
  playerId: string,
): Promise<PlayerCalafrio | null> {
  if (db) {
    try {
      const res = await db
        .select()
        .from(schema.players)
        .where(eq(schema.players.id, playerId));
      const p = res[0];
      if (p) {
        return {
          id: p.id,
          mesaId: p.mesaId,
          userId: p.userId,
          nome: p.nome,
          jogador: p.jogador ?? undefined,
          aptBase: p.aptBase,
          pvMax: p.pvMax,
          paMax: p.paMax,
          pd: p.pd,
          velocidade: p.velocidade,
          carteira: p.carteira as { fundos: number; espirions: number },
          ficha: p.ficha,
          criadaEm: p.criadaEm.toISOString(),
        };
      }
    } catch (e) {
      console.warn("Postgres falhou ao obter player, usando store local:", e);
    }
  }

  const s = await carregarStore();
  return s.players.find((p) => p.id === playerId) ?? null;
}

export async function criarPlayer(
  mesaId: string,
  ficha: FichaCalafrio,
  userId?: string,
): Promise<PlayerCalafrio> {
  const apt = ficha.aptBase || 1;
  const novoId =
    ficha.id && ficha.id !== "sem-ficha"
      ? ficha.id
      : `player-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
  const fichaFinal: FichaCalafrio = { ...ficha, id: novoId };
  const novo: PlayerCalafrio = {
    id: novoId,
    mesaId,
    userId: userId ?? null,
    nome: ficha.nome?.trim() || "Novo Investigador",
    jogador: ficha.jogador,
    aptBase: apt,
    pvMax: 3 + 3 * apt,
    paMax: 3 + 3 * apt,
    pd: 3 * apt,
    velocidade: 6,
    carteira: ficha.carteira || { fundos: 6, espirions: 0 },
    ficha: fichaFinal,
    criadaEm: new Date().toISOString(),
  };

  if (db) {
    try {
      await db.insert(schema.players).values({
        id: novo.id,
        mesaId: novo.mesaId,
        userId: novo.userId,
        nome: novo.nome,
        jogador: novo.jogador,
        aptBase: novo.aptBase,
        pvMax: novo.pvMax,
        paMax: novo.paMax,
        pd: novo.pd,
        velocidade: novo.velocidade,
        carteira: novo.carteira,
        ficha: novo.ficha,
        criadaEm: new Date(novo.criadaEm),
        atualizadaEm: new Date(novo.criadaEm),
      });
      return novo;
    } catch (e) {
      console.warn("Postgres falhou ao criar player, usando store local:", e);
    }
  }

  const s = await carregarStore();
  s.players.push(novo);
  await salvarStore(s);
  return novo;
}

export async function salvarFichaPlayer(
  playerId: string,
  ficha: FichaCalafrio,
): Promise<PlayerCalafrio | null> {
  const apt = ficha.aptBase || 1;

  if (db) {
    try {
      const atualizados = await db
        .update(schema.players)
        .set({
          nome: ficha.nome,
          jogador: ficha.jogador,
          aptBase: apt,
          pvMax: 3 + 3 * apt,
          paMax: 3 + 3 * apt,
          pd: 3 * apt,
          carteira: ficha.carteira,
          ficha,
          atualizadaEm: new Date(),
        })
        .where(eq(schema.players.id, playerId))
        .returning();

      const p = atualizados[0];
      if (p) {
        return {
          id: p.id,
          mesaId: p.mesaId,
          nome: p.nome,
          jogador: p.jogador ?? undefined,
          aptBase: p.aptBase,
          pvMax: p.pvMax,
          paMax: p.paMax,
          pd: p.pd,
          velocidade: p.velocidade,
          carteira: p.carteira as { fundos: number; espirions: number },
          ficha: p.ficha,
          criadaEm: p.criadaEm.toISOString(),
        };
      }
    } catch (e) {
      console.warn("Postgres falhou ao salvar ficha, usando store local:", e);
    }
  }

  const s = await carregarStore();
  const idx = s.players.findIndex((p) => p.id === playerId);
  if (idx === -1) return null;

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
  if (db) {
    try {
      await db.delete(schema.players).where(eq(schema.players.id, playerId));
      return;
    } catch (e) {
      console.warn("Postgres falhou ao excluir player, usando store local:", e);
    }
  }
  const s = await carregarStore();
  s.players = s.players.filter(
    (p) => !(p.mesaId === mesaId && p.id === playerId),
  );
  await salvarStore(s);
}
