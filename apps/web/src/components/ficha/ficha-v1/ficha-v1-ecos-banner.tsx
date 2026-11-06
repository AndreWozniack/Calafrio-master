import type { FichaDerivadaV1 } from "@calafrio/core";
import { AlertTriangle, Sparkles } from "lucide-react";

interface FichaV1EcosBannerProps {
  derivada: FichaDerivadaV1;
}

export function FichaV1EcosBanner({ derivada }: FichaV1EcosBannerProps) {
  const avisos = derivada.avisos;

  return (
    <div className="space-y-3">
      {/* Resumo de Ecos e Memória */}
      <div className="calafrio-card p-4 flex flex-wrap items-center justify-between gap-4 border-amber-500/30 bg-amber-950/10">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-amber-500/20 text-amber-400">
            <Sparkles className="size-6" />
          </div>
          <div>
            <div className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
              Ecos Paranormais (EP)
            </div>
            <div className="text-xl font-black text-amber-300">
              {derivada.ecosGastos}{" "}
              <span className="text-sm font-normal text-muted-foreground">
                / {derivada.ecosMax}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <div>
            <div className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
              Memória (PM)
            </div>
            <div className="text-base font-black text-purple-300">
              {derivada.pmGasto}{" "}
              <span className="text-xs font-normal text-muted-foreground">
                / {derivada.pmMax}
              </span>
            </div>
          </div>
          <div>
            <div className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
              PM Restante
            </div>
            <div
              className={`text-base font-black ${
                derivada.pmRestante < 0 ? "text-red-400" : "text-emerald-400"
              }`}
            >
              {derivada.pmRestante}
            </div>
          </div>
        </div>
      </div>

      {/* Avisos de Regras */}
      {avisos.length > 0 && (
        <div className="p-3 rounded-lg border border-red-500/40 bg-red-950/30 text-xs text-red-200 space-y-1">
          <div className="font-bold flex items-center gap-1.5 text-red-300">
            <AlertTriangle className="size-4 shrink-0" />
            Inconsistências de Regras:
          </div>
          <ul className="list-disc list-inside space-y-0.5 pl-2">
            {avisos.map((av, idx) => (
              <li key={idx}>{av.mensagem}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
