import {
  type AnotacaoMesa,
  carregarStore,
  salvarStore,
} from "./armazenamento-calafrio";

export async function listarAnotacoes(mesaId: string): Promise<AnotacaoMesa[]> {
  const s = await carregarStore();
  return s.anotacoes
    .filter((a) => a.mesaId === mesaId)
    .sort(
      (a, b) =>
        Number(b.fixada) - Number(a.fixada) ||
        b.criadaEm.localeCompare(a.criadaEm),
    );
}

export async function criarAnotacao(
  mesaId: string,
  titulo: string,
  texto: string,
): Promise<AnotacaoMesa> {
  const s = await carregarStore();
  const nova: AnotacaoMesa = {
    id: `nota-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    mesaId,
    titulo: titulo.trim() || "Sem título",
    texto,
    fixada: false,
    criadaEm: new Date().toISOString(),
  };
  s.anotacoes.push(nova);
  await salvarStore(s);
  return nova;
}

export async function atualizarAnotacao(
  id: string,
  mudancas: Partial<Pick<AnotacaoMesa, "titulo" | "texto" | "fixada">>,
): Promise<AnotacaoMesa | null> {
  const s = await carregarStore();
  const idx = s.anotacoes.findIndex((a) => a.id === id);
  if (idx === -1) return null;
  s.anotacoes[idx] = { ...s.anotacoes[idx], ...mudancas };
  await salvarStore(s);
  return s.anotacoes[idx];
}

export async function excluirAnotacao(id: string): Promise<void> {
  const s = await carregarStore();
  s.anotacoes = s.anotacoes.filter((a) => a.id !== id);
  await salvarStore(s);
}
