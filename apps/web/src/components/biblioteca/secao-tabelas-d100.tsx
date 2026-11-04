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
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2 calafrio-card p-4">
        <span className="calafrio-tag">SORTEADOR D100:</span>
        <button
          type="button"
          onClick={() => sortearTabela("ocupacoes")}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-400 text-black font-bold text-xs rounded cursor-pointer"
        >
          <Dices className="size-3.5" /> Sortear Ocupação
        </button>
        <button
          type="button"
          onClick={() => sortearTabela("palavras")}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-400 text-black font-bold text-xs rounded cursor-pointer"
        >
          <Dices className="size-3.5" /> Sortear Palavra-chave
        </button>
        <button
          type="button"
          onClick={() => sortearTabela("bugigangas")}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-400 text-black font-bold text-xs rounded cursor-pointer"
        >
          <Dices className="size-3.5" /> Sortear Bugiganga
        </button>
      </div>

      {itemSorteado && (
        <div className="p-3 bg-amber-500/15 border border-amber-500/50 rounded font-black text-sm text-amber-300 animate-in fade-in">
          {itemSorteado}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Ocupações */}
        <div className="calafrio-card p-4 space-y-2">
          <span className="calafrio-tag-sm">100 OCUPAÇÕES</span>
          <div className="max-h-96 overflow-y-auto space-y-1 text-xs pr-1">
            {catalogo.ocupacoes.map((item) => (
              <div
                key={item.numero}
                className="flex gap-2 py-1 border-b border-border/40"
              >
                <span className="w-7 font-black text-amber-400 shrink-0">
                  {item.numero}.
                </span>
                <span>{item.nome}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Palavras-chave Genéricas */}
        <div className="calafrio-card p-4 space-y-2">
          <span className="calafrio-tag-sm">100 PALAVRAS-CHAVE</span>
          <div className="max-h-96 overflow-y-auto space-y-1 text-xs pr-1">
            {catalogo.palavrasChaveGenericas.map((item) => (
              <div
                key={item.numero}
                className="flex gap-2 py-1 border-b border-border/40"
              >
                <span className="w-7 font-black text-amber-400 shrink-0">
                  {item.numero}.
                </span>
                <span>{item.nome}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Bugigangas */}
        <div className="calafrio-card p-4 space-y-2">
          <span className="calafrio-tag-sm">100 BUGIGANGAS</span>
          <div className="max-h-96 overflow-y-auto space-y-1 text-xs pr-1">
            {catalogo.bugigangas.map((item) => (
              <div
                key={item.numero}
                className="flex gap-2 py-1 border-b border-border/40"
              >
                <span className="w-7 font-black text-amber-400 shrink-0">
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
