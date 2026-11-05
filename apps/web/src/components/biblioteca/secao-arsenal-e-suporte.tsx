"use client";

import type { CatalogoCalafrio } from "@calafrio/core";

interface SecaoArsenalESuporteProps {
  catalogo: CatalogoCalafrio;
}

export function SecaoArsenalESuporte({ catalogo }: SecaoArsenalESuporteProps) {
  return (
    <div className="space-y-6">
      <div className="calafrio-card p-5 space-y-4">
        <span className="calafrio-tag text-xs sm:text-sm">
          TABELA DE ARMAS MUNDANAS (ARSENAL)
        </span>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm sm:text-base border-collapse">
            <thead>
              <tr className="border-b-2 border-border text-foreground/80 uppercase text-xs sm:text-sm font-black">
                <th className="py-2.5 pr-4">Categoria</th>
                <th className="py-2.5 pr-4">Tipo</th>
                <th className="py-2.5 pr-4">Preço</th>
                <th className="py-2.5 pr-4">Dano</th>
                <th className="py-2.5 pr-4">Exemplos</th>
                <th className="py-2.5">Propriedades</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {catalogo.armasMundanas.map((arma) => (
                <tr
                  key={arma.id}
                  className="hover:bg-muted/40 transition-colors"
                >
                  <td className="py-3 font-black text-foreground">
                    {arma.categoria}
                  </td>
                  <td className="py-3 text-foreground/80 font-medium">
                    {arma.tipoAlcance}
                  </td>
                  <td className="py-3 font-black text-amber-600 dark:text-amber-400">
                    {arma.precoFundos} F$
                  </td>
                  <td className="py-3 font-black text-foreground">
                    {arma.dano}
                  </td>
                  <td className="py-3 text-muted-foreground font-medium">
                    {arma.exemplos}
                  </td>
                  <td className="py-3 text-xs sm:text-sm text-foreground/90 font-medium leading-snug">
                    {arma.propriedades.join(" ")}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="calafrio-card p-5 space-y-3">
          <span className="calafrio-tag text-xs sm:text-sm">
            FAMILIARES (1d6)
          </span>
          <div className="space-y-2.5 text-sm">
            {catalogo.familiares.map((f) => (
              <div
                key={f.dado}
                className="p-3 rounded-md bg-muted/40 border border-border shadow-xs"
              >
                <div className="font-black text-base text-accent-ink">
                  {f.dado}. {f.nome}
                </div>
                <p className="text-xs sm:text-sm text-foreground/90 mt-1.5 leading-relaxed font-medium">
                  {f.propriedades}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="calafrio-card p-5 space-y-3">
          <span className="calafrio-tag text-xs sm:text-sm">LACAIOS (1d6)</span>
          <div className="space-y-2.5 text-sm">
            {catalogo.lacaios.map((l) => (
              <div
                key={l.dado}
                className="p-3 rounded-md bg-muted/40 border border-border shadow-xs"
              >
                <div className="font-black text-base text-accent-ink">
                  {l.dado}. {l.nome}
                </div>
                <div className="text-xs sm:text-sm text-muted-foreground font-bold mt-0.5">
                  {l.pv} PV · {l.pd} PD · +{l.aptBonus} APT · {l.velocidade}m
                  VEL
                </div>
                <p className="text-xs sm:text-sm text-foreground/90 mt-1.5 leading-relaxed font-medium">
                  {l.propriedades}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="calafrio-card p-5 space-y-3">
          <span className="calafrio-tag text-xs sm:text-sm">DJANHOS (1d6)</span>
          <div className="space-y-2.5 text-sm">
            {catalogo.djanhos.map((d) => (
              <div
                key={d.dado}
                className="p-3 rounded-md bg-muted/40 border border-border shadow-xs"
              >
                <div className="font-black text-base text-accent-ink">
                  {d.dado}. {d.nome}
                </div>
                <p className="text-xs sm:text-sm text-foreground/90 mt-1.5 leading-relaxed font-medium">
                  {d.propriedades}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
