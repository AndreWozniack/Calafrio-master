"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import {
  criarMesa,
  excluirMesa,
  obterMesa,
} from "@/services/armazenamento-calafrio";
import { sairDaMesaComoJogador } from "@/services/armazenamento-convite";
import {
  ehMestreDaMesa,
  normalizarCodigoConvite,
} from "@/services/convite-regras";

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

  const mesa = await obterMesa(mesaId);
  const userId = (session.user as { id?: string }).id;
  if (!mesa || !ehMestreDaMesa(mesa, userId)) return;

  await excluirMesa(mesaId);
  revalidatePath("/mesa");
}

export async function sairDaMesaAction(mesaId: string) {
  const session = await auth();
  const userId = (session?.user as { id?: string } | undefined)?.id;
  if (!userId) redirect("/login");

  await sairDaMesaComoJogador(userId, mesaId);
  revalidatePath("/mesa");
}

export async function entrarPorCodigoAction(formData: FormData) {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const codigo = normalizarCodigoConvite(String(formData.get("codigo") ?? ""));
  if (!codigo) return;
  redirect(`/entrar/${codigo}`);
}
