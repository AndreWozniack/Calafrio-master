import { ArrowLeft, Swords } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { VisaoMesaCombate } from "@/components/mesa/visao-mesa-combate";
import { listarPlayers, obterMesa } from "@/services/armazenamento-calafrio";

export default async function MesaCombatePage({
  params,
}: {
  params: Promise<{ mesaId: string }>;
}) {
  const { mesaId } = await params;
  const mesa = await obterMesa(mesaId);
  if (!mesa) notFound();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between border-b border-border pb-3">
        <Link
          href={`/mesa/${mesaId}`}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-muted-foreground hover:text-amber-400 transition-colors"
        >
          <ArrowLeft className="size-4" /> Voltar ao Painel da Mesa ({mesa.nome}
          )
        </Link>
      </div>

      <VisaoMesaCombate />
    </div>
  );
}
