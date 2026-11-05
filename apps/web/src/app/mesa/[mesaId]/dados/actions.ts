"use server";

import { revalidatePath } from "next/cache";
import { exigirAcessoMesa, exigirMestreDaMesa } from "@/lib/auth/acesso-mesa";
import {
  limparRolagens,
  listarRolagens,
  type NovaRolagemMesa,
  registrarRolagem,
} from "@/services/rolagens-mesa";

export async function registrarRolagemAction(nova: NovaRolagemMesa) {
  await exigirAcessoMesa(nova.mesaId);
  const rolagem = await registrarRolagem(nova);
  revalidatePath(`/mesa/${nova.mesaId}/dados`);
  return rolagem;
}

export async function listarRolagensAction(mesaId: string) {
  await exigirAcessoMesa(mesaId);
  return listarRolagens(mesaId);
}

export async function limparRolagensAction(mesaId: string) {
  await exigirMestreDaMesa(mesaId);
  await limparRolagens(mesaId);
  revalidatePath(`/mesa/${mesaId}/dados`);
}
