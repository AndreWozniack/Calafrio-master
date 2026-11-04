import { ArrowLeft, Copy, Shield, Users } from "lucide-react";
import Link from "next/link";
import { BannerEscudo } from "@/components/navegacao/banner-escudo";

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
    <BannerEscudo>
      <div className="space-y-1">
        <Link
          href="/mesa"
          className="inline-flex items-center gap-1 text-xs text-white/70 hover:text-white font-bold mb-1 transition-colors"
        >
          <ArrowLeft className="size-3.5" /> Voltar às Mesas
        </Link>
        <div className="flex items-center gap-2.5 flex-wrap">
          <h1 className="text-2xl sm:text-3xl font-black font-heading text-white uppercase tracking-wide">
            {nome}
          </h1>
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-extrabold uppercase bg-amber-400/20 text-amber-300 border border-amber-400/40">
            <Shield className="size-3" /> Mestre
          </span>
        </div>
        <p className="text-xs text-white/70">
          Código de acesso:{" "}
          <span className="font-mono font-bold text-white">
            {codigoConvite}
          </span>{" "}
          · {totalPlayers} Investigador(es) na equipe
        </p>
      </div>
    </BannerEscudo>
  );
}
