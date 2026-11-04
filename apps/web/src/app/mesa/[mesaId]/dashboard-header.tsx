import { ArrowLeft, Copy, Shield, Users } from "lucide-react";
import Link from "next/link";

interface DashboardHeaderProps {
  mesaId: string;
  nome: string;
  codigoConvite: string;
  totalPlayers: number;
}

export function DashboardHeader({
  nome,
  codigoConvite,
  totalPlayers,
}: DashboardHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-border pb-4">
      <div className="space-y-1">
        <Link
          href="/mesa"
          className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-amber-400 font-bold mb-1 transition-colors"
        >
          <ArrowLeft className="size-3.5" /> Voltar às Mesas
        </Link>
        <div className="flex items-center gap-2.5 flex-wrap">
          <h1 className="text-2xl font-black font-heading text-foreground uppercase tracking-wide">
            {nome}
          </h1>
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-extrabold uppercase bg-amber-400/15 text-amber-300 border border-amber-400/30">
            <Shield className="size-3" /> Mestre
          </span>
        </div>
        <p className="text-xs text-muted-foreground">
          Código de acesso:{" "}
          <span className="font-mono font-bold text-foreground">
            {codigoConvite}
          </span>{" "}
          · {totalPlayers} Player(s) na equipe
        </p>
      </div>
    </div>
  );
}
