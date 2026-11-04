import { notFound } from "next/navigation";
import { obterMesa } from "@/services/armazenamento-calafrio";
import { NovoPlayerClient } from "./novo-player-client";

export default async function NovoPlayerPage({
  params,
}: {
  params: Promise<{ mesaId: string }>;
}) {
  const { mesaId } = await params;
  const mesa = await obterMesa(mesaId);
  if (!mesa) notFound();

  return <NovoPlayerClient mesaId={mesaId} />;
}
