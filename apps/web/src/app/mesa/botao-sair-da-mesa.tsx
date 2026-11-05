"use client";

import { LogOut } from "lucide-react";
import { sairDaMesaAction } from "./actions";

export function BotaoSairDaMesa({ mesaId }: { mesaId: string }) {
  return (
    <form
      action={() => sairDaMesaAction(mesaId)}
      onSubmit={(e) => {
        if (
          !confirm("Sair desta mesa? Seus personagens nela serão removidos.")
        ) {
          e.preventDefault();
        }
      }}
    >
      <button
        type="submit"
        title="Sair da Mesa"
        className="flex items-center gap-1 p-2 text-xs font-bold text-muted-foreground hover:text-red-400 hover:bg-red-950/30 rounded-lg cursor-pointer transition-colors"
      >
        <LogOut className="size-4" /> Sair da Mesa
      </button>
    </form>
  );
}
