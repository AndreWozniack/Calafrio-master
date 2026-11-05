"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { entrarPorConvite } from "@/services/armazenamento-convite";

export async function entrarSemFichaAction(
  codigo: string,
): Promise<{ mesaId: string; playerId: string }> {
  const session = await auth();
  const userId = (session?.user as { id?: string } | undefined)?.id;
  if (!userId) redirect("/login");

  const res = await entrarPorConvite(userId, codigo);
  revalidatePath("/mesa");
  revalidatePath(`/mesa/${res.mesaId}/players`);
  return res;
}
