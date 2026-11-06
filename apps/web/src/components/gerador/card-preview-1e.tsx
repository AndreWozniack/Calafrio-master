import {
  calcularFichaV1,
  type FichaCalafrioV1,
  obterHabilidade1e,
} from "@calafrio/core";
import {
  Coins,
  Heart,
  Package,
  Shield,
  Sparkles,
  Tag,
  User,
  Zap,
} from "lucide-react";

export function CardPreview1e({ ficha }: { ficha: FichaCalafrioV1 }) {
  const derivada = calcularFichaV1(ficha);

  const ocupacao =
    ficha.palavrasChave.find((pc) => pc.categoria === "ocupacao")?.nome ??
    "Investigador";

  const palavrasOutras = ficha.palavrasChave.filter(
    (pc) => pc.categoria !== "ocupacao",
  );

  const primeiraHab = ficha.habilidades[0];
  const habilidadeInfo = primeiraHab ? obterHabilidade1e(primeiraHab.id) : null;

  return (
    <div className="space-y-4">
      {/* Identidade & Vitais */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 bg-muted/40 p-3.5 rounded-xl border border-border/60">
        <div className="sm:col-span-2 space-y-1">
          <div className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
            Investigador 1e
          </div>
          <div className="text-lg font-black text-foreground flex items-center gap-2">
            <User className="size-4 text-accent-ink shrink-0" />
            <span className="truncate">{ficha.nome}</span>
          </div>
          <div className="flex items-center gap-2 flex-wrap pt-0.5">
            <span className="text-xs font-black px-2 py-0.5 rounded bg-amber-400/20 text-amber-900 dark:text-amber-300 border border-amber-400/30">
              {ocupacao}
            </span>
            <span className="text-xs text-muted-foreground font-semibold flex items-center gap-1">
              <Coins className="size-3.5 text-amber-500" />
              {ficha.carteira.fundos} F$
            </span>
          </div>
        </div>

        <div className="sm:col-span-2 flex items-center justify-start sm:justify-end gap-2 flex-wrap">
          <div className="px-2.5 py-1.5 rounded-lg bg-card border border-border text-center shadow-2xs">
            <div className="text-[10px] font-black text-muted-foreground uppercase">
              BA
            </div>
            <div className="text-sm font-black text-foreground">
              {derivada.ba}
            </div>
          </div>
          <div className="px-2.5 py-1.5 rounded-lg bg-red-500/10 border border-red-500/30 text-center shadow-2xs">
            <div className="text-[10px] font-black text-red-700 dark:text-red-400 uppercase flex items-center justify-center gap-0.5">
              <Heart className="size-3" /> PV
            </div>
            <div className="text-sm font-black text-red-700 dark:text-red-400">
              {derivada.pvMax}
            </div>
          </div>
          <div className="px-2.5 py-1.5 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-center shadow-2xs">
            <div className="text-[10px] font-black text-cyan-800 dark:text-cyan-400 uppercase flex items-center justify-center gap-0.5">
              <Zap className="size-3" /> PA
            </div>
            <div className="text-sm font-black text-cyan-800 dark:text-cyan-400">
              {derivada.paMax}
            </div>
          </div>
          <div className="px-2.5 py-1.5 rounded-lg bg-card border border-border text-center shadow-2xs">
            <div className="text-[10px] font-black text-muted-foreground uppercase flex items-center justify-center gap-0.5">
              <Shield className="size-3" /> PD
            </div>
            <div className="text-sm font-black text-foreground">
              {derivada.pd}
            </div>
          </div>
          <div className="px-2.5 py-1.5 rounded-lg bg-purple-500/10 border border-purple-500/30 text-center shadow-2xs">
            <div className="text-[10px] font-black text-purple-400 uppercase">
              PM
            </div>
            <div className="text-sm font-black text-purple-300">
              {derivada.pmGasto}/{derivada.pmMax}
            </div>
          </div>
        </div>
      </div>

      {/* Atributos & Habilidade */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div className="bg-card p-3 rounded-xl border border-border space-y-2">
          <span className="text-[11px] font-black text-muted-foreground uppercase tracking-wider">
            Tríade de Atributos
          </span>
          <div className="grid grid-cols-3 gap-2 text-center">
            <div className="p-2 rounded-lg bg-muted/30 border border-border">
              <div className="text-[10px] font-bold text-muted-foreground uppercase">
                Corpo
              </div>
              <div className="text-base font-black text-foreground">
                {ficha.atributos.corpo}
              </div>
            </div>
            <div className="p-2 rounded-lg bg-muted/30 border border-border">
              <div className="text-[10px] font-bold text-muted-foreground uppercase">
                Mente
              </div>
              <div className="text-base font-black text-foreground">
                {ficha.atributos.mente}
              </div>
            </div>
            <div className="p-2 rounded-lg bg-muted/30 border border-border">
              <div className="text-[10px] font-bold text-muted-foreground uppercase">
                Alma
              </div>
              <div className="text-base font-black text-foreground">
                {ficha.atributos.alma}
              </div>
            </div>
          </div>
        </div>

        <div className="bg-card p-3 rounded-xl border border-border space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-black text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="size-3.5 text-accent-ink" /> Habilidade
              Memorizada
            </span>
            {habilidadeInfo && (
              <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full border bg-amber-500/10 text-amber-400 border-amber-500/20">
                Árvore {habilidadeInfo.arvore}
              </span>
            )}
          </div>
          {habilidadeInfo ? (
            <div>
              <div className="text-xs font-black text-foreground flex items-center gap-1.5">
                <span>{habilidadeInfo.nome}</span>
                <span className="text-[10px] text-muted-foreground font-mono">
                  (Grau {habilidadeInfo.grau} • {habilidadeInfo.custoPA} PA)
                </span>
              </div>
              <p className="text-[11px] text-muted-foreground line-clamp-2 mt-0.5">
                {habilidadeInfo.descricao}
              </p>
            </div>
          ) : (
            <p className="text-xs text-muted-foreground italic">
              Nenhuma habilidade memorizada.
            </p>
          )}
        </div>
      </div>

      {/* Palavras-Chave & Equipamento */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div className="bg-card p-3 rounded-xl border border-border space-y-2">
          <span className="text-[11px] font-black text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
            <Tag className="size-3.5 text-accent-ink" /> Palavras-Chave
          </span>
          <div className="flex flex-wrap gap-1.5">
            {palavrasOutras.map((pc) => (
              <span
                key={pc.id}
                className="text-xs px-2 py-0.5 rounded-md bg-muted text-foreground border border-border font-medium"
              >
                {pc.nome}
                <span className="text-[9px] text-muted-foreground ml-1 uppercase">
                  ({pc.categoria})
                </span>
              </span>
            ))}
          </div>
        </div>

        <div className="bg-card p-3 rounded-xl border border-border space-y-2">
          <span className="text-[11px] font-black text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
            <Package className="size-3.5 text-accent-ink" /> Equipamento
          </span>
          <div className="flex flex-wrap gap-1.5 text-xs text-muted-foreground">
            {ficha.inventario.map((item) => (
              <span
                key={item.id}
                className="px-2 py-0.5 rounded-md bg-muted/60 border border-border text-foreground"
              >
                {item.nome} x{item.quantidade}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
