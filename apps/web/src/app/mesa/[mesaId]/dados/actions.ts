"use server";

import { revalidatePath } from "next/cache";
import {
  limparRolagens,
  listarRolagens,
  type NovaRolagemMesa,
  registrarRolagem,
} from "@/services/rolagens-mesa";

export async function registrarRolagemAction(nova: NovaRolagemMesa) {
  const rolagem = await registrarRolagem(nova);
  revalidatePath(`/mesa/${nova.mesaId}/dados`);
  return rolagem;
}

export async function listarRolagensAction(mesaId: string) {
  return listarRolagens(mesaId);
}

export async function limparRolagensAction(mesaId: string) {
  await limparRolagens(mesaId);
  revalidatePath(`/mesa/${mesaId}/dados`);
}
