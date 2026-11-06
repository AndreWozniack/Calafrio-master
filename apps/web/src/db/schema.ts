import type { FichaPersonagem, SistemaVersao } from "@calafrio/core";
import { integer, jsonb, pgTable, text, timestamp } from "drizzle-orm/pg-core";

export type { SistemaVersao };

export const users = pgTable("users", {
  id: text("id").primaryKey(),
  googleId: text("google_id").notNull().unique(),
  nome: text("nome").notNull(),
  email: text("email").notNull().unique(),
  avatarUrl: text("avatar_url"),
  role: text("role").notNull().default("user"),
  criadaEm: timestamp("criada_em", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

export const mesas = pgTable("mesas", {
  id: text("id").primaryKey(),
  userId: text("user_id").references(() => users.id, { onDelete: "cascade" }),
  nome: text("nome").notNull(),
  codigoConvite: text("codigo_convite").notNull().unique(),
  sistemaVersao: text("sistema_versao")
    .$type<SistemaVersao>()
    .notNull()
    .default("2e"),
  criadaEm: timestamp("criada_em", { withTimezone: true })
    .defaultNow()
    .notNull(),
  atualizadaEm: timestamp("atualizada_em", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

export const players = pgTable("players", {
  id: text("id").primaryKey(),
  mesaId: text("mesa_id")
    .notNull()
    .references(() => mesas.id, { onDelete: "cascade" }),
  userId: text("user_id").references(() => users.id, {
    onDelete: "set null",
  }),
  nome: text("nome").notNull(),
  jogador: text("jogador"),
  aptBase: integer("apt_base").notNull().default(1),
  pvMax: integer("pv_max").notNull().default(6),
  paMax: integer("pa_max").notNull().default(6),
  pd: integer("pd").notNull().default(3),
  velocidade: integer("velocidade").notNull().default(6),
  carteira: jsonb("carteira").notNull().default({ fundos: 6, espirions: 0 }),
  ficha: jsonb("ficha").$type<FichaPersonagem>().notNull(),
  criadaEm: timestamp("criada_em", { withTimezone: true })
    .defaultNow()
    .notNull(),
  atualizadaEm: timestamp("atualizada_em", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

export const rolagensMesa = pgTable("rolagens_mesa", {
  id: text("id").primaryKey(),
  mesaId: text("mesa_id")
    .notNull()
    .references(() => mesas.id, { onDelete: "cascade" }),
  autor: text("autor").notNull(),
  dados: jsonb("dados").notNull(),
  criadaEm: timestamp("criada_em", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

export const anotacoesMesa = pgTable("anotacoes_mesa", {
  id: text("id").primaryKey(),
  mesaId: text("mesa_id")
    .notNull()
    .unique()
    .references(() => mesas.id, { onDelete: "cascade" }),
  conteudo: text("conteudo").notNull().default(""),
  atualizadaEm: timestamp("atualizada_em", { withTimezone: true })
    .defaultNow()
    .notNull(),
});
