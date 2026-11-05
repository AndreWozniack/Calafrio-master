import { eq } from "drizzle-orm";
import { db } from "@/db";
import { users } from "@/db/schema";

export type UsuarioRow = typeof users.$inferSelect;

export async function buscarUsuarioPorId(
  id: string,
): Promise<UsuarioRow | null> {
  if (!db) return null;
  const usuario = await db.query.users.findFirst({
    where: eq(users.id, id),
  });
  return usuario ?? null;
}

export async function buscarUsuarioPorGoogleId(
  googleId: string,
): Promise<UsuarioRow | null> {
  if (!db) return null;
  const usuario = await db.query.users.findFirst({
    where: eq(users.googleId, googleId),
  });
  return usuario ?? null;
}

export async function buscarUsuarioPorEmail(
  email: string,
): Promise<UsuarioRow | null> {
  if (!db) return null;
  const usuario = await db.query.users.findFirst({
    where: eq(users.email, email.toLowerCase().trim()),
  });
  return usuario ?? null;
}

export async function inserirUsuario(
  dados: typeof users.$inferInsert,
): Promise<UsuarioRow | null> {
  if (!db) return null;
  const [usuario] = await db.insert(users).values(dados).returning();
  return usuario ?? null;
}

export async function promoverAdmin(id: string): Promise<void> {
  if (!db) return;
  await db.update(users).set({ role: "admin" }).where(eq(users.id, id));
}
