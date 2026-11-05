import { redirect } from "next/navigation";
import { auth } from "@/auth";
import {
  listarPlayers,
  type MesaCalafrio,
  obterMesa,
  type PlayerCalafrio,
} from "@/services/armazenamento-calafrio";
import { ehMembroDaMesa, ehMestreDaMesa } from "@/services/convite-regras";

export interface AcessoMesa {
  userId: string;
  mesa: MesaCalafrio;
  players: PlayerCalafrio[];
  mestre: boolean;
}

/** Usuário logado + papel dele na mesa; `null` se a mesa não existe. */
export async function obterAcessoMesa(
  mesaId: string,
): Promise<{ acesso: AcessoMesa | null; membro: boolean }> {
  const session = await auth();
  const userId = (session?.user as { id?: string } | undefined)?.id;
  if (!userId) redirect("/login");

  const mesa = await obterMesa(mesaId);
  if (!mesa) return { acesso: null, membro: false };

  const players = await listarPlayers(mesaId);
  return {
    acesso: { userId, mesa, players, mestre: ehMestreDaMesa(mesa, userId) },
    membro: ehMembroDaMesa(mesa, players, userId),
  };
}

/** Para server actions: lança se o usuário não for mestre nem jogador da mesa. */
export async function exigirAcessoMesa(mesaId: string): Promise<AcessoMesa> {
  const { acesso, membro } = await obterAcessoMesa(mesaId);
  if (!acesso || !membro) throw new Error("Sem acesso a esta mesa.");
  return acesso;
}

/** Para server actions exclusivas do mestre. */
export async function exigirMestreDaMesa(mesaId: string): Promise<AcessoMesa> {
  const acesso = await exigirAcessoMesa(mesaId);
  if (!acesso.mestre) throw new Error("Apenas o mestre pode fazer isso.");
  return acesso;
}
