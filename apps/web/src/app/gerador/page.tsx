import { auth } from "@/auth";
import { GeradorUniversalClient } from "@/components/gerador/gerador-universal-client";
import { listarMesas } from "@/services/armazenamento-calafrio";

export const metadata = {
  title: "Gerador de Investigadores — Calafrio (1e e 2e)",
  description:
    "Forje fichas completas aleatórias para Calafrio 1ª Edição e 2ª Edição com um clique.",
};

export default async function PaginaGerador() {
  const session = await auth();
  const userId = (session?.user as { id?: string } | undefined)?.id;
  const mesas = await listarMesas(userId);

  return <GeradorUniversalClient mesas={mesas} />;
}
