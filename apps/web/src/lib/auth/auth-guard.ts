import { auth } from "@/auth";

export async function requireAuth() {
  const session = await auth();
  if (!session?.user) throw new Error("Não autenticado.");
  return session;
}

/**
 * Id da conta logada. Estoura quando não há sessão — nunca devolve `undefined`,
 * pra que quem escreve query não tenha a opção de montar um filtro vazio.
 */
export async function requireUserId(): Promise<string> {
  const session = await requireAuth();
  return (session.user as { id: string }).id;
}
