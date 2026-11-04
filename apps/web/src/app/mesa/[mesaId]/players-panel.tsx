import { ArrowRight, BookOpen, Plus, Users } from "lucide-react";
import Link from "next/link";
import type { PlayerCalafrio } from "@/services/armazenamento-calafrio";

interface PlayersPanelProps {
  mesaId: string;
  players: PlayerCalafrio[];
}

export function PlayersPanel({ mesaId, players }: PlayersPanelProps) {
  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between gap-3 border-b border-border pb-3">
        <div>
          <span className="calafrio-tag-sm">PLAYERS DA MESA</span>
          <h2 className="text-lg font-black text-foreground flex items-center gap-2 mt-1">
            <Users className="size-5 text-amber-400" /> Players (
            {players.length})
          </h2>
        </div>

        <Link
          href={`/mesa/${mesaId}/players/novo`}
          className="flex items-center gap-1.5 px-3.5 py-2 bg-amber-400 hover:bg-amber-300 text-black font-black text-xs uppercase tracking-wider rounded-lg shadow-sm cursor-pointer transition-colors"
        >
          <Plus className="size-3.5" /> Criar Ficha Completa
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {players.map((p) => {
          const ocupacao =
            p.ficha.palavrasChave.find((pc) => pc.categoria === "ocupacao")
              ?.nome ?? "Player";

          return (
            <Link
              key={p.id}
              href={`/mesa/${mesaId}/players/${p.id}/ficha`}
              className="p-4 rounded-xl border border-border bg-card/60 hover:bg-card hover:border-amber-400/40 transition-all flex flex-col justify-between space-y-3 group cursor-pointer shadow-sm"
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="font-black text-base text-foreground group-hover:text-amber-700 dark:group-hover:text-amber-300 transition-colors">
                    {p.nome}
                  </div>
                  <div className="text-xs text-muted-foreground mt-0.5">
                    {ocupacao} · APT {p.aptBase}
                  </div>
                </div>
                <ArrowRight className="size-4 text-muted-foreground group-hover:text-foreground group-hover:translate-x-1 transition-transform" />
              </div>

              {/* Badges de recursos */}
              <div className="flex items-center gap-2 pt-1 border-t border-border/40">
                <span className="h-6 px-2.5 rounded text-xs font-black bg-red-50 text-red-700 border border-red-200 dark:bg-red-950/40 dark:text-red-400 dark:border-red-800/40">
                  PV {p.pvMax}
                </span>
                <span className="h-6 px-2.5 rounded text-xs font-black bg-cyan-50 text-cyan-800 border border-cyan-200 dark:bg-cyan-950/40 dark:text-cyan-400 dark:border-cyan-800/40">
                  PA {p.paMax}
                </span>
                <span className="h-6 px-2.5 rounded text-xs font-black bg-muted text-muted-foreground border border-border">
                  PD {p.pd}
                </span>
                <span className="text-[11px] text-muted-foreground ml-auto font-medium">
                  {p.ficha.matrizHabilidades.length} hab.
                </span>
              </div>
            </Link>
          );
        })}

        {players.length === 0 && (
          <div className="col-span-full py-10 px-4 text-center border-2 border-dashed border-border rounded-xl bg-card/20 space-y-2">
            <Users className="size-8 mx-auto text-muted-foreground/60" />
            <p className="text-sm font-bold text-foreground">
              Nenhum player cadastrado nesta mesa.
            </p>
            <p className="text-xs text-muted-foreground max-w-sm mx-auto">
              Clique no botão acima para abrir o Assistente e criar o primeiro
              personagem.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
