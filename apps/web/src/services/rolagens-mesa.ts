import {
  carregarStore,
  type RolagemMesa,
  salvarStore,
} from "./armazenamento-calafrio";

const LIMITE_ROLAGENS = 200;

export type NovaRolagemMesa = Omit<RolagemMesa, "id" | "criadaEm">;

export async function listarRolagens(mesaId: string): Promise<RolagemMesa[]> {
  const s = await carregarStore();
  return s.rolagens
    .filter((r) => r.mesaId === mesaId)
    .sort((a, b) => b.criadaEm.localeCompare(a.criadaEm));
}

export async function registrarRolagem(
  nova: NovaRolagemMesa,
): Promise<RolagemMesa> {
  const s = await carregarStore();
  const rolagem: RolagemMesa = {
    ...nova,
    id: `rol-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    criadaEm: new Date().toISOString(),
  };
  s.rolagens.push(rolagem);
  const daMesa = s.rolagens.filter((r) => r.mesaId === nova.mesaId);
  if (daMesa.length > LIMITE_ROLAGENS) {
    const excedentes = new Set(
      daMesa.slice(0, daMesa.length - LIMITE_ROLAGENS).map((r) => r.id),
    );
    s.rolagens = s.rolagens.filter((r) => !excedentes.has(r.id));
  }
  await salvarStore(s);
  return rolagem;
}

export async function limparRolagens(mesaId: string): Promise<void> {
  const s = await carregarStore();
  s.rolagens = s.rolagens.filter((r) => r.mesaId !== mesaId);
  await salvarStore(s);
}
