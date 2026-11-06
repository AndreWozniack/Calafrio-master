"use client";

import type { FichaCalafrioV1 } from "@calafrio/core";
import { useFichaCalafrioV1 } from "@calafrio/ficha-app";
import { ArrowLeft, Sparkles } from "lucide-react";
import Link from "next/link";
import { FichaV1 } from "@/components/ficha/ficha-v1";
import { salvarFichaPlayerAction } from "../../actions";

interface FichaLiveClientV1Props {
  mesaId: string;
  playerId: string;
  fichaInicial: FichaCalafrioV1;
}

export function FichaLiveClientV1({
  mesaId,
  playerId,
  fichaInicial,
}: FichaLiveClientV1Props) {
  const f = useFichaCalafrioV1(fichaInicial, (nova) => {
    salvarFichaPlayerAction(playerId, nova);
  });

  return (
    <div className="min-h-screen bg-background text-foreground pb-16">
      {/* Barra Superior */}
      <div className="sticky top-0 z-40 bg-background/95 backdrop-blur-sm border-b border-border/80 px-4 py-3">
        <div className="max-w-5xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Link
              href={`/mesa/${mesaId}`}
              className="flex items-center gap-1.5 text-xs font-bold text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="size-4" />
              <span>Voltar à Mesa</span>
            </Link>
            <span className="text-muted-foreground/40">•</span>
            <div className="flex items-center gap-2">
              <span className="text-sm font-black text-foreground">
                {f.ficha.nome || "Personagem sem nome"}
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-amber-500/10 text-amber-400 border border-amber-500/20 flex items-center gap-1">
                <Sparkles className="size-3" />
                Calafrio 1e
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Conteúdo da Ficha */}
      <main className="max-w-5xl mx-auto px-4 pt-6">
        <FichaV1 {...f} />
      </main>
    </div>
  );
}
