import { notFound } from "next/navigation";
import { auth } from "@/auth";
import { obterMesa, obterPlayer } from "@/services/armazenamento-calafrio";
import { NovoPlayerClient } from "./novo-player-client";

export default async function NovoPlayerPage({
  params,
  searchParams,
}: {
  params: Promise<{ mesaId: string }>;
  searchParams: Promise<{ rascunho?: string }>;
}) {
  const { mesaId } = await params;
  const { rascunho } = await searchParams;
  const mesa = await obterMesa(mesaId);
  if (!mesa) notFound();

  // Só aceita o rascunho se pertencer ao usuário logado nesta mesa.
  let rascunhoId: string | undefined;
  if (rascunho) {
    const session = await auth();
    const userId = (session?.user as { id?: string } | undefined)?.id;
    const player = await obterPlayer(rascunho);
    if (
      player &&
      player.mesaId === mesaId &&
      userId &&
      player.userId === userId
    ) {
      rascunhoId = player.id;
    }
  }

  return <NovoPlayerClient mesaId={mesaId} rascunhoId={rascunhoId} />;
}
