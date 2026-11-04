"use server";

import type { FichaCalafrio } from "@calafrio/core";
import { revalidatePath } from "next/cache";
import {
  criarPlayer,
  excluirPlayer,
  salvarFichaPlayer,
} from "@/services/armazenamento-calafrio";

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
