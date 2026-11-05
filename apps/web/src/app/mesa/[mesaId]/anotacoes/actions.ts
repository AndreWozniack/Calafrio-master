"use server";

import { revalidatePath } from "next/cache";
import { exigirMestreDaMesa } from "@/lib/auth/acesso-mesa";
import {
  atualizarAnotacao,
  criarAnotacao,
  excluirAnotacao,
} from "@/services/anotacoes-mesa";

function atualizarTela(mesaId: string) {
  revalidatePath(`/mesa/${mesaId}/anotacoes`);
}

export async function criarAnotacaoAction(
  mesaId: string,
  titulo: string,
  texto: string,
) {
  await exigirMestreDaMesa(mesaId);
  const nota = await criarAnotacao(mesaId, titulo, texto);
  atualizarTela(mesaId);
  return nota;
}

export async function atualizarAnotacaoAction(
  mesaId: string,
  id: string,
  mudancas: { titulo?: string; texto?: string; fixada?: boolean },
) {
  await exigirMestreDaMesa(mesaId);
  const nota = await atualizarAnotacao(id, mudancas);
  atualizarTela(mesaId);
  return nota;
}

export async function excluirAnotacaoAction(mesaId: string, id: string) {
  await exigirMestreDaMesa(mesaId);
  await excluirAnotacao(id);
  atualizarTela(mesaId);
}
