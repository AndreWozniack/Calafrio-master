"use client";

import { BookOpen, DoorOpen } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { entrarSemFichaAction } from "../actions";

export function EntrarLanding({ codigo }: { codigo: string }) {
  const router = useRouter();
  const [pendente, iniciar] = useTransition();
  const [erro, setErro] = useState<string | null>(null);

  const entrar = (destino: (mesaId: string, playerId: string) => string) => {
    setErro(null);
    iniciar(async () => {
      try {
        const { mesaId, playerId } = await entrarSemFichaAction(codigo);
        router.push(destino(mesaId, playerId));
      } catch {
        setErro("Não foi possível entrar na mesa. Tente novamente.");
      }
    });
  };

  return (
    <div className="calafrio-card p-5 space-y-3">
      <button
        type="button"
        disabled={pendente}
        onClick={() =>
          entrar(
            (mesaId, playerId) =>
              `/mesa/${mesaId}/players/novo?rascunho=${playerId}`,
          )
        }
        className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-amber-400 hover:bg-amber-300 disabled:opacity-60 text-black font-black text-sm uppercase tracking-wider rounded-lg cursor-pointer transition-colors shadow-sm"
      >
        <BookOpen className="size-4" /> Ver / Criar minha Ficha
      </button>
      <button
        type="button"
        disabled={pendente}
        onClick={() => entrar((mesaId) => `/mesa/${mesaId}`)}
        className="w-full flex items-center justify-center gap-2 px-4 py-3 border border-border hover:border-amber-400/50 disabled:opacity-60 text-foreground font-bold text-sm rounded-lg cursor-pointer transition-colors"
      >
        <DoorOpen className="size-4" /> Entrar sem criar ficha agora
      </button>
      {erro && <p className="text-xs font-semibold text-red-400">{erro}</p>}
    </div>
  );
}
