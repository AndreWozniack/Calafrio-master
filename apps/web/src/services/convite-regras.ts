import type {
  DadosStore,
  MesaCalafrio,
  PlayerCalafrio,
} from "./armazenamento-store";

/** Remove espaços/hífens e põe em maiúsculas: "ab c-d23" → "ABCD23". */
export function normalizarCodigoConvite(entrada: string): string {
  return entrada.replace(/[\s-]/g, "").toUpperCase();
}

/** Mestre = dono da mesa; mesa sem dono é tratada como de todos (legado). */
export function ehMestreDaMesa(
  mesa: Pick<MesaCalafrio, "userId">,
  userId?: string,
): boolean {
  return mesa.userId == null || mesa.userId === userId;
}

/** Mesas em que o usuário é mestre ou possui algum player. */
export function filtrarMesasDoUsuario(
  store: Pick<DadosStore, "mesas" | "players">,
  userId: string,
): MesaCalafrio[] {
  return store.mesas.filter(
    (m) =>
      ehMestreDaMesa(m, userId) ||
      store.players.some((p) => p.mesaId === m.id && p.userId === userId),
  );
}

/** Membro = mestre ou jogador com ao menos um player na mesa. */
export function ehMembroDaMesa(
  mesa: Pick<MesaCalafrio, "userId">,
  players: Pick<PlayerCalafrio, "userId">[],
  userId?: string,
): boolean {
  if (!userId) return false;
  return (
    ehMestreDaMesa(mesa, userId) || players.some((p) => p.userId === userId)
  );
}

/** Mestre edita qualquer player; jogador só o próprio. */
export function podeEditarPlayer(
  mesa: Pick<MesaCalafrio, "userId">,
  player: Pick<PlayerCalafrio, "userId">,
  userId?: string,
): boolean {
  if (!userId) return false;
  return ehMestreDaMesa(mesa, userId) || player.userId === userId;
}
