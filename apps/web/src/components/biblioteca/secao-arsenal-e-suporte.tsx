"use client";

import type { CatalogoCalafrio } from "@calafrio/core";

interface SecaoArsenalESuporteProps {
  catalogo: CatalogoCalafrio;
}

export function SecaoArsenalESuporte({ catalogo }: SecaoArsenalESuporteProps) {
  return (
    <div className="space-y-6">
      <div className="calafrio-card p-4 space-y-3">
        <span className="calafrio-tag">TABELA DE ARMAS MUNDANAS (ARSENAL)</span>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-border text-muted-foreground uppercase">
                <th className="py-2 pr-3">Categoria</th>
                <th className="py-2 pr-3">Tipo</th>
                <th className="py-2 pr-3">Preço</th>
                <th className="py-2 pr-3">Dano</th>
                <th className="py-2 pr-3">Exemplos</th>
                <th className="py-2">Propriedades</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50">
              {catalogo.armasMundanas.map((arma) => (
                <tr key={arma.id} className="hover:bg-muted/30">
                  <td className="py-2 font-bold text-foreground">
                    {arma.categoria}
                  </td>
                  <td className="py-2 text-muted-foreground">
                    {arma.tipoAlcance}
                  </td>
                  <td className="py-2 font-bold text-accent-ink">
                    {arma.precoFundos} F$
                  </td>
                  <td className="py-2 font-black">{arma.dano}</td>
                  <td className="py-2 text-muted-foreground">
                    {arma.exemplos}
                  </td>
                  <td className="py-2 text-[11px] text-foreground/80">
                    {arma.propriedades.join(" ")}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="calafrio-card p-4 space-y-2">
          <span className="calafrio-tag-sm">FAMILIARES (1d6)</span>
          <div className="space-y-2 text-xs">
            {catalogo.familiares.map((f) => (
              <div
                key={f.dado}
                className="p-2 rounded bg-muted/40 border border-border"
              >
                <div className="font-bold text-accent-ink">
                  {f.dado}. {f.nome}
                </div>
                <p className="text-[11px] text-foreground/80 mt-1">
                  {f.propriedades}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="calafrio-card p-4 space-y-2">
          <span className="calafrio-tag-sm">LACAIOS (1d6)</span>
          <div className="space-y-2 text-xs">
            {catalogo.lacaios.map((l) => (
              <div
                key={l.dado}
                className="p-2 rounded bg-muted/40 border border-border"
              >
                <div className="font-bold text-accent-ink">
                  {l.dado}. {l.nome}
                </div>
                <div className="text-[10px] text-muted-foreground font-bold">
                  {l.pv} PV · {l.pd} PD · +{l.aptBonus} APT · {l.velocidade}m
                  VEL
                </div>
                <p className="text-[11px] text-foreground/80 mt-1">
                  {l.propriedades}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="calafrio-card p-4 space-y-2">
          <span className="calafrio-tag-sm">DJANHOS (1d6)</span>
          <div className="space-y-2 text-xs">
            {catalogo.djanhos.map((d) => (
              <div
                key={d.dado}
                className="p-2 rounded bg-muted/40 border border-border"
              >
                <div className="font-bold text-accent-ink">
                  {d.dado}. {d.nome}
                </div>
                <p className="text-[11px] text-foreground/80 mt-1">
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
