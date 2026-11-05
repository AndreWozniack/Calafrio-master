"use server";

import type { FichaCalafrio } from "@calafrio/core";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { exigirAcessoMesa } from "@/lib/auth/acesso-mesa";
import {
  criarPlayer,
  excluirPlayer,
  obterPlayer,
  salvarFichaPlayer,
} from "@/services/armazenamento-calafrio";
import { regerarCodigoConvite } from "@/services/armazenamento-convite";
import { podeEditarPlayer } from "@/services/convite-regras";

/** Garante que o usuário logado pode editar o player; devolve null se ele não existe. */
async function exigirEdicaoDoPlayer(playerId: string, mesaId?: string) {
  const player = await obterPlayer(playerId);
  if (!player || (mesaId && player.mesaId !== mesaId)) return null;
  const { userId, mesa } = await exigirAcessoMesa(player.mesaId);
  if (!podeEditarPlayer(mesa, player, userId)) {
    throw new Error("Sem permissão para editar este player.");
  }
  return player;
}

export async function criarPlayerAction(mesaId: string, ficha: FichaCalafrio) {
  const { userId, mestre } = await exigirAcessoMesa(mesaId);
  // Jogador cria a própria ficha (vinculada a ele); mestre cria fichas avulsas.
  const player = await criarPlayer(mesaId, ficha, mestre ? undefined : userId);
  revalidatePath(`/mesa/${mesaId}`);
  revalidatePath(`/mesa/${mesaId}/players`);
  return player;
}

export async function salvarFichaPlayerAction(
  playerId: string,
  ficha: FichaCalafrio,
) {
  if (!(await exigirEdicaoDoPlayer(playerId))) return null;
  const atualizado = await salvarFichaPlayer(playerId, ficha);
  if (atualizado) {
    revalidatePath(`/mesa/${atualizado.mesaId}`);
    revalidatePath(`/mesa/${atualizado.mesaId}/players`);
    revalidatePath(`/mesa/${atualizado.mesaId}/players/${playerId}/ficha`);
  }
  return atualizado;
}

export async function excluirPlayerAction(mesaId: string, playerId: string) {
  if (!(await exigirEdicaoDoPlayer(playerId, mesaId))) return;
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
