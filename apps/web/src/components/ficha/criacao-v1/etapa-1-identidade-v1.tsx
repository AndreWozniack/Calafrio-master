"use client";

import type { FichaCalafrioV1 } from "@calafrio/core";

interface Etapa1IdentidadeV1Props {
  ficha: FichaCalafrioV1;
  onDefinirNome: (nome: string) => void;
  onDefinirJogador: (jogador: string) => void;
  onDefinirQuemSouEu: (texto: string) => void;
}

export function Etapa1IdentidadeV1({
  ficha,
  onDefinirNome,
  onDefinirJogador,
  onDefinirQuemSouEu,
}: Etapa1IdentidadeV1Props) {
  return (
    <div className="space-y-4">
      <div>
        <h4 className="text-base font-black text-foreground">
          Identidade do Investigador
        </h4>
        <p className="text-xs text-muted-foreground mt-0.5">
          Defina o nome de quem irá encarar os horrores paranormais de Calafrio.
        </p>
      </div>

      <div className="space-y-3">
        <div>
          <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground block mb-1">
            Nome do Personagem <span className="text-red-400">*</span>
          </label>
          <input
            type="text"
            value={ficha.nome}
            onChange={(e) => onDefinirNome(e.target.value)}
            placeholder="Ex: Arthur Pendelton"
            className="w-full bg-muted/40 border border-border rounded-xl px-3.5 py-2.5 text-sm font-bold text-foreground focus:border-amber-400 outline-none transition-colors"
          />
        </div>

        <div>
          <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground block mb-1">
            Jogador (Opcional)
          </label>
          <input
            type="text"
            value={ficha.jogador ?? ""}
            onChange={(e) => onDefinirJogador(e.target.value)}
            placeholder="Seu nome ou apelido"
            className="w-full bg-muted/40 border border-border rounded-xl px-3.5 py-2.5 text-sm text-foreground focus:border-amber-400 outline-none transition-colors"
          />
        </div>

        <div>
          <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground block mb-1">
            Quem sou eu? (Conceito inicial)
          </label>
          <textarea
            value={ficha.quemSouEu}
            onChange={(e) => onDefinirQuemSouEu(e.target.value)}
            rows={3}
            placeholder="Breve história, aparência ou motivos para investigar o oculto..."
            className="w-full bg-muted/40 border border-border rounded-xl p-3 text-xs text-foreground focus:border-amber-400 outline-none resize-none transition-colors"
          />
        </div>
      </div>
    </div>
  );
}
