"use server";

import type { FichaCalafrio } from "@calafrio/core";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import {
  criarPlayer,
  excluirPlayer,
  salvarFichaPlayer,
} from "@/services/armazenamento-calafrio";
import { regerarCodigoConvite } from "@/services/armazenamento-convite";

export async function criarPlayerAction(mesaId: string, ficha: FichaCalafrio) {
  const player = await criarPlayer(mesaId, ficha);
  revalidatePath(`/mesa/${mesaId}`);
  revalidatePath(`/mesa/${mesaId}/players`);
  return player;
}

export async function salvarFichaPlayerAction(
  playerId: string,
  ficha: FichaCalafrio,
) {
  const atualizado = await salvarFichaPlayer(playerId, ficha);
  if (atualizado) {
    revalidatePath(`/mesa/${atualizado.mesaId}`);
    revalidatePath(`/mesa/${atualizado.mesaId}/players`);
    revalidatePath(`/mesa/${atualizado.mesaId}/players/${playerId}/ficha`);
  }
  return atualizado;
}

export async function excluirPlayerAction(mesaId: string, playerId: string) {
  await excluirPlayer(mesaId, playerId);
  revalidatePath(`/mesa/${mesaId}`);
  revalidatePath(`/mesa/${mesaId}/players`);
}

export async function regerarConviteAction(mesaId: string): Promise<string> {
  const session = await auth();
  const userId = (session?.user as { id?: string } | undefined)?.id;
  if (!userId) redirect("/login");

  const codigo = await regerarCodigoConvite(mesaId, userId);
  revalidatePath("/mesa");
  revalidatePath(`/mesa/${mesaId}`);
  revalidatePath(`/mesa/${mesaId}/players`);
  return codigo;
}
