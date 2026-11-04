"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { criarMesa, excluirMesa } from "@/services/armazenamento-calafrio";

export async function criarMesaAction(formData: FormData) {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const nome = String(formData.get("nome") ?? "").trim();
  if (!nome) return;

  const userId = (session.user as { id?: string }).id;
  const nova = await criarMesa(nome, userId);
  revalidatePath("/mesa");
  redirect(`/mesa/${nova.id}`);
}

export async function excluirMesaAction(mesaId: string) {
  const session = await auth();
  if (!session?.user) redirect("/login");

  await excluirMesa(mesaId);
  revalidatePath("/mesa");
}
