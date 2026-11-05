import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { listarPlayers, obterMesa } from "@/services/armazenamento-calafrio";
import { ehMestreDaMesa } from "@/services/convite-regras";
import { DashboardHeader } from "./dashboard-header";
import { OperationsPanel } from "./operations-panel";
import { PlayersPanel } from "./players-panel";

export default async function MesaDashboardPage({
  params,
}: {
  params: Promise<{ mesaId: string }>;
}) {
  const { mesaId } = await params;
  const mesa = await obterMesa(mesaId);
  if (!mesa) {
    redirect("/mesa");
  }

  const players = await listarPlayers(mesaId);
  const session = await auth();
  const userId = (session?.user as { id?: string } | undefined)?.id;

  return (
    <main className="mx-auto w-full max-w-6xl space-y-7 p-4 sm:p-6 lg:p-8">
      <DashboardHeader
        mesaId={mesaId}
        nome={mesa.nome}
        codigoConvite={mesa.codigoConvite}
        totalPlayers={players.length}
        mestre={ehMestreDaMesa(mesa, userId)}
      />

      <div className="grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_19rem]">
        <div className="space-y-8 min-w-0">
          <PlayersPanel mesaId={mesaId} players={players} />
        </div>

        <OperationsPanel mesaId={mesaId} />
      </div>
    </main>
  );
}
