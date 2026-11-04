"use client";

import type { CatalogoCalafrio } from "@calafrio/core";
import { Dices } from "lucide-react";
import { useState } from "react";

interface SecaoTabelasD100Props {
  catalogo: CatalogoCalafrio;
}

export function SecaoTabelasD100({ catalogo }: SecaoTabelasD100Props) {
  const [itemSorteado, setItemSorteado] = useState<string | null>(null);

  const sortearTabela = (tipo: "ocupacoes" | "palavras" | "bugigangas") => {
    let lista: readonly { numero: number; nome: string }[];
    let rotulo: string;
    if (tipo === "ocupacoes") {
      lista = catalogo.ocupacoes;
      rotulo = "Ocupação";
    } else if (tipo === "palavras") {
      lista = catalogo.palavrasChaveGenericas;
      rotulo = "Palavra-chave";
    } else {
      lista = catalogo.bugigangas;
      rotulo = "Bugiganga";
    }
    const idx = Math.floor(Math.random() * lista.length);
    const item = lista[idx];
    setItemSorteado(`🎲 [d100 = ${item.numero}] ${rotulo}: "${item.nome}"`);
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center gap-3 calafrio-card p-5">
        <span className="calafrio-tag text-xs sm:text-sm">SORTEADOR D100:</span>
        <button
          type="button"
          onClick={() => sortearTabela("ocupacoes")}
          className="flex items-center gap-2 px-4 py-2 bg-amber-400 text-black font-black text-sm sm:text-base rounded-md cursor-pointer hover:bg-amber-300 transition-all shadow-xs"
        >
          <Dices className="size-4" /> Sortear Ocupação
        </button>
        <button
          type="button"
          onClick={() => sortearTabela("palavras")}
          className="flex items-center gap-2 px-4 py-2 bg-amber-400 text-black font-black text-sm sm:text-base rounded-md cursor-pointer hover:bg-amber-300 transition-all shadow-xs"
        >
          <Dices className="size-4" /> Sortear Palavra-chave
        </button>
        <button
          type="button"
          onClick={() => sortearTabela("bugigangas")}
          className="flex items-center gap-2 px-4 py-2 bg-amber-400 text-black font-black text-sm sm:text-base rounded-md cursor-pointer hover:bg-amber-300 transition-all shadow-xs"
        >
          <Dices className="size-4" /> Sortear Bugiganga
        </button>
      </div>

      {itemSorteado && (
        <div className="p-4 bg-amber-500/15 border-2 border-amber-500/50 rounded-md font-black text-base sm:text-lg text-accent-ink animate-in fade-in shadow-xs">
          {itemSorteado}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Ocupações */}
        <div className="calafrio-card p-5 space-y-3">
          <span className="calafrio-tag text-xs sm:text-sm">100 OCUPAÇÕES</span>
          <div className="max-h-96 overflow-y-auto space-y-1.5 text-sm sm:text-base pr-2">
            {catalogo.ocupacoes.map((item) => (
              <div
                key={item.numero}
                className="flex items-baseline gap-2.5 py-1.5 border-b border-border/40 font-medium text-foreground"
              >
                <span className="w-9 font-black text-accent-ink shrink-0 text-sm sm:text-base">
                  {item.numero}.
                </span>
                <span>{item.nome}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Palavras-chave Genéricas */}
        <div className="calafrio-card p-5 space-y-3">
          <span className="calafrio-tag text-xs sm:text-sm">100 PALAVRAS-CHAVE</span>
          <div className="max-h-96 overflow-y-auto space-y-1.5 text-sm sm:text-base pr-2">
            {catalogo.palavrasChaveGenericas.map((item) => (
              <div
                key={item.numero}
                className="flex items-baseline gap-2.5 py-1.5 border-b border-border/40 font-medium text-foreground"
              >
                <span className="w-9 font-black text-accent-ink shrink-0 text-sm sm:text-base">
                  {item.numero}.
                </span>
                <span>{item.nome}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Bugigangas */}
        <div className="calafrio-card p-5 space-y-3">
          <span className="calafrio-tag text-xs sm:text-sm">100 BUGIGANGAS</span>
          <div className="max-h-96 overflow-y-auto space-y-1.5 text-sm sm:text-base pr-2">
            {catalogo.bugigangas.map((item) => (
              <div
                key={item.numero}
                className="flex items-baseline gap-2.5 py-1.5 border-b border-border/40 font-medium text-foreground"
              >
                <span className="w-9 font-black text-accent-ink shrink-0 text-sm sm:text-base">
                  {item.numero}.
                </span>
                <span>{item.nome}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
