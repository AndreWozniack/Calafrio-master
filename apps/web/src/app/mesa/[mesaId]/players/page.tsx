import { ArrowLeft, BookOpen, Users } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { listarPlayers, obterMesa } from "@/services/armazenamento-calafrio";
import { excluirPlayerAction } from "./actions";
import { PlayerRow } from "./player-row";
import { ZonaGeradorAleatorio } from "./zona-gerador-aleatorio";

export default async function PlayersPage({
  params,
}: {
  params: Promise<{ mesaId: string }>;
}) {
  const { mesaId } = await params;
  const mesa = await obterMesa(mesaId);
  if (!mesa) notFound();

  const players = await listarPlayers(mesaId);

  return (
    <main className="mx-auto max-w-4xl p-4 sm:p-6 md:p-8 space-y-6">
      <div className="mb-2">
        <Link
          href={`/mesa/${mesaId}`}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-muted-foreground hover:text-accent-ink transition-colors"
        >
          <ArrowLeft className="size-4" /> Voltar ao Painel da Mesa
        </Link>
      </div>

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-border pb-4">
        <div>
          <h1 className="text-2xl font-black font-heading tracking-wide text-foreground uppercase flex items-center gap-2">
            <Users className="size-6 text-accent-ink" /> Players (
            {players.length})
          </h1>
          <p className="text-xs text-muted-foreground font-semibold mt-1">
            Mesa: <strong className="text-foreground">{mesa.nome}</strong> ·
            Gerencie as fichas dos jogadores desta mesa.
          </p>
        </div>

        <div className="flex items-center gap-2 self-stretch sm:self-auto justify-end">
          <Link
            href={`/mesa/${mesaId}/players/novo`}
            className="flex items-center gap-1.5 px-4 py-2 bg-amber-400 hover:bg-amber-300 text-black font-black text-xs uppercase tracking-wider rounded-lg shadow-sm cursor-pointer transition-colors"
          >
            <BookOpen className="size-4" /> Criar Ficha Completa
          </Link>
        </div>
      </div>

      {/* Zona Especial de Geração Aleatória de Fichas */}
      <ZonaGeradorAleatorio mesaId={mesaId} />

      <div className="entrada-lista space-y-3">
        {players.map((p) => (
          <PlayerRow
            key={p.id}
            player={p}
            mesaId={mesaId}
            onExcluir={excluirPlayerAction}
          />
        ))}

        {players.length === 0 && (
          <div className="py-12 text-center border-2 border-dashed border-border rounded-xl bg-card/20 space-y-2">
            <Users className="size-8 mx-auto text-muted-foreground/60" />
            <p className="text-sm font-bold text-foreground">
              Nenhum player cadastrado nesta mesa.
            </p>
            <p className="text-xs text-muted-foreground">
              Clique em &ldquo;Criar Ficha Completa&rdquo; para forjar seu
              personagem do zero.
            </p>
          </div>
        )}
      </div>
    </main>
  );
}
