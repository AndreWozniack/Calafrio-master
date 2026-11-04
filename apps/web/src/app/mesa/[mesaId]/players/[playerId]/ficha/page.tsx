import { notFound } from "next/navigation";
import { obterMesa, obterPlayer } from "@/services/armazenamento-calafrio";
import { FichaLiveClient } from "./ficha-live-client";

export default async function FichaPage({
  params,
}: {
  params: Promise<{ mesaId: string; playerId: string }>;
}) {
  const { mesaId, playerId } = await params;
  const mesa = await obterMesa(mesaId);
  if (!mesa) notFound();

  const player = await obterPlayer(playerId);
  if (!player || player.mesaId !== mesaId) notFound();

  return (
    <div className="space-y-6">
      <FichaLiveClient
        mesaId={mesaId}
        playerId={playerId}
        fichaInicial={player.ficha}
      />
    </div>
  );
}
