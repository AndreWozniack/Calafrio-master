import { ehFichaV1 } from "@calafrio/core";
import { redirect } from "next/navigation";
import { obterAcessoMesa } from "@/lib/auth/acesso-mesa";
import { obterMesa, obterPlayer } from "@/services/armazenamento-calafrio";
import { podeEditarPlayer } from "@/services/convite-regras";
import { FichaLiveClient } from "./ficha-live-client";
import { FichaLiveClientV1 } from "./ficha-live-client-v1";

export default async function FichaPage({
  params,
}: {
  params: Promise<{ mesaId: string; playerId: string }>;
}) {
  const { mesaId, playerId } = await params;
  const mesa = await obterMesa(mesaId);
  if (!mesa) {
    redirect("/mesa");
  }

  const player = await obterPlayer(playerId);
  if (!player || player.mesaId !== mesaId) {
    redirect(`/mesa/${mesaId}`);
  }

  const { acesso } = await obterAcessoMesa(mesaId);
  if (!acesso || !podeEditarPlayer(mesa, player, acesso.userId)) {
    redirect(`/mesa/${mesaId}/players`);
  }

  return (
    <div className="w-full">
      {ehFichaV1(player.ficha) ? (
        <FichaLiveClientV1
          mesaId={mesaId}
          playerId={playerId}
          fichaInicial={player.ficha}
        />
      ) : (
        <FichaLiveClient
          mesaId={mesaId}
          playerId={playerId}
          fichaInicial={player.ficha}
        />
      )}
    </div>
  );
}
