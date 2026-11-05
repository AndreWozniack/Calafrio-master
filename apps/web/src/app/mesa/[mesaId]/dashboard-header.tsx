import { ArrowLeft, Shield, User } from "lucide-react";
import Link from "next/link";
import { BannerEscudo } from "@/components/navegacao/banner-escudo";

interface DashboardHeaderProps {
  mesaId: string;
  nome: string;
  codigoConvite: string;
  totalPlayers: number;
  mestre: boolean;
}

export function DashboardHeader({
  nome,
  codigoConvite,
  totalPlayers,
  mestre,
}: DashboardHeaderProps) {
  return (
    <BannerEscudo>
      <div className="space-y-1">
        <Link
          href="/mesa"
          className="inline-flex items-center gap-1 text-sm text-white/80 hover:text-white font-bold mb-1 transition-colors"
        >
          <ArrowLeft className="size-4" /> Voltar às Mesas
        </Link>
        <div className="flex items-center gap-2.5 flex-wrap">
          <h1 className="text-2xl sm:text-3xl font-black font-heading text-white uppercase tracking-wide">
            {nome}
          </h1>
          {mestre ? (
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-xs font-extrabold uppercase bg-amber-400/20 text-amber-300 border border-amber-400/40">
              <Shield className="size-3.5" /> Mestre
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-xs font-extrabold uppercase bg-sky-400/20 text-sky-300 border border-sky-400/40">
              <User className="size-3.5" /> Jogador
            </span>
          )}
        </div>
        <p className="text-sm text-white/80">
          {mestre && (
            <>
              Código de acesso:{" "}
              <span className="font-mono font-bold text-white">
                {codigoConvite}
              </span>{" "}
              ·{" "}
            </>
          )}
          {totalPlayers} Player(s) na equipe
        </p>
      </div>
    </BannerEscudo>
  );
}
