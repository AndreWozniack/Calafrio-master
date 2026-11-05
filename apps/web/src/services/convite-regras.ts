import type { DadosStore, MesaCalafrio } from "./armazenamento-store";

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
