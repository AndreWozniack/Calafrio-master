import type { FichaCalafrioV1 } from "@calafrio/core";

interface FichaV1TriadeProps {
  ficha: FichaCalafrioV1;
  pmResumo: string;
  definirAtributo: (
    atributo: "corpo" | "mente" | "alma",
    valor: number,
  ) => void;
}

export function FichaV1Triade({
  ficha,
  pmResumo,
  definirAtributo,
}: FichaV1TriadeProps) {
  return (
    <div className="calafrio-card p-5 space-y-4">
      <h3 className="text-sm font-black uppercase tracking-wider text-foreground">
        Atributos Principais (Corpo, Mente, Alma)
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Corpo */}
        <div className="p-4 rounded-xl border border-border bg-muted/20 space-y-2">
          <div className="flex items-center justify-between">
            <span className="font-black text-base text-foreground">Corpo</span>
            <input
              type="number"
              min="1"
              value={ficha.atributos.corpo}
              onChange={(e) => definirAtributo("corpo", Number(e.target.value))}
              className="w-16 bg-background border border-border rounded px-2 py-1 text-center font-black text-lg text-foreground"
            />
          </div>
          <p className="text-xs text-muted-foreground leading-snug">
            Potencial físico. Concede <strong>+3 PD</strong> por nível
            atribuído.
          </p>
          <div className="pt-2 border-t border-border/40 text-xs font-bold text-amber-400">
            Defesa (PD): {3 + ficha.atributos.corpo * 3}
          </div>
        </div>

        {/* Mente */}
        <div className="p-4 rounded-xl border border-border bg-muted/20 space-y-2">
          <div className="flex items-center justify-between">
            <span className="font-black text-base text-foreground">Mente</span>
            <input
              type="number"
              min="1"
              value={ficha.atributos.mente}
              onChange={(e) => definirAtributo("mente", Number(e.target.value))}
              className="w-16 bg-background border border-border rounded px-2 py-1 text-center font-black text-lg text-foreground"
            />
          </div>
          <p className="text-xs text-muted-foreground leading-snug">
            Capacidade intelectual. Concede <strong>+6 PM</strong> por nível
            atribuído.
          </p>
          <div className="pt-2 border-t border-border/40 text-xs font-bold text-purple-400">
            Memória (PM): {pmResumo}
          </div>
        </div>

        {/* Alma */}
        <div className="p-4 rounded-xl border border-border bg-muted/20 space-y-2">
          <div className="flex items-center justify-between">
            <span className="font-black text-base text-foreground">Alma</span>
            <input
              type="number"
              min="1"
              value={ficha.atributos.alma}
              onChange={(e) => definirAtributo("alma", Number(e.target.value))}
              className="w-16 bg-background border border-border rounded px-2 py-1 text-center font-black text-lg text-foreground"
            />
          </div>
          <p className="text-xs text-muted-foreground leading-snug">
            Energia paranormal. Concede <strong>+9 PA</strong> por nível
            atribuído.
          </p>
          <div className="pt-2 border-t border-border/40 text-xs font-bold text-cyan-400">
            Energia (PA máx): {ficha.atributos.alma * 9}
          </div>
        </div>
      </div>
    </div>
  );
}
