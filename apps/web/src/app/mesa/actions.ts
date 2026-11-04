"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { criarMesa, excluirMesa } from "@/services/armazenamento-calafrio";

export async function criarMesaAction(formData: FormData) {
  const nome = String(formData.get("nome") ?? "").trim();
  if (!nome) return;

  const nova = await criarMesa(nome);
  revalidatePath("/mesa");
  redirect(`/mesa/${nova.id}`);
}

export async function excluirMesaAction(mesaId: string) {
  await excluirMesa(mesaId);
  revalidatePath("/mesa");
}
