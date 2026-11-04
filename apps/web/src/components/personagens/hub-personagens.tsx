"use client";

import type { FichaCalafrio } from "@calafrio/core";
import { Plus, Search, Users } from "lucide-react";
import React, { useState } from "react";
import { CardInvestigadorRow } from "./card-investigador-row";

interface HubPersonagensProps {
  personagens: FichaCalafrio[];
  onCriarNovo: () => void;
  onAbrirFicha: (id: string) => void;
  onDuplicar: (id: string) => void;
  onExcluir: (id: string) => void;
}

export function HubPersonagens({
  personagens,
  onCriarNovo,
  onAbrirFicha,
  onDuplicar,
  onExcluir,
}: HubPersonagensProps) {
  const [busca, setBusca] = useState("");

  const filtrados = personagens.filter((p) => {
    if (!busca.trim()) return true;
    const termo = busca.toLowerCase();
    const matchNome = p.nome.toLowerCase().includes(termo);
    const matchJogador = (p.jogador ?? "").toLowerCase().includes(termo);
    const matchPalavra = p.palavrasChave.some((pc) =>
      pc.nome.toLowerCase().includes(termo),
    );
    return matchNome || matchJogador || matchPalavra;
  });

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      {/* Header do Hub */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-border pb-4">
        <div>
          <h1 className="text-2xl font-black font-heading tracking-wide text-foreground uppercase flex items-center gap-2">
            <Users className="size-6 text-accent-ink" /> Investigadores
          </h1>
          <p className="text-xs text-muted-foreground font-semibold mt-1">
            Gerencie suas fichas e crie novos personagens para o submundo de
            Calafrio.
          </p>
        </div>

        <div className="flex items-center gap-2 self-stretch sm:self-auto justify-end">
          <button
            type="button"
            onClick={onCriarNovo}
            className="flex items-center gap-2 px-5 py-2.5 rounded-lg font-black text-xs uppercase tracking-wider bg-amber-400 hover:bg-amber-300 text-black shadow-md cursor-pointer transition-all"
          >
            <Plus className="size-4" /> Criar Novo Investigador
          </button>
        </div>
      </div>

      {/* Barra de Pesquisa */}
      {personagens.length > 0 && (
        <div className="relative">
          <Search className="size-4 absolute left-3 top-3 text-muted-foreground" />
          <input
            type="text"
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            placeholder="Buscar por nome, jogador ou palavra-chave..."
            className="w-full bg-card/70 pl-9 pr-4 py-2.5 rounded-xl border border-border text-xs focus:border-amber-400 outline-none"
          />
        </div>
      )}

      {/* Lista de Fichas / Empty State */}
      <div className="space-y-3">
        {filtrados.map((p) => (
          <CardInvestigadorRow
            key={p.id}
            personagem={p}
            onAbrir={onAbrirFicha}
            onDuplicar={onDuplicar}
            onExcluir={onExcluir}
          />
        ))}

        {filtrados.length === 0 && (
          <div className="py-12 px-4 text-center border-2 border-dashed border-border rounded-2xl bg-card/30 space-y-3">
            <Users className="size-8 mx-auto text-muted-foreground/60" />
            <p className="text-sm font-bold text-foreground">
              {busca.trim()
                ? "Nenhum investigador corresponde aos filtros."
                : "Nenhum investigador cadastrado ainda."}
            </p>
            <p className="text-xs text-muted-foreground max-w-sm mx-auto">
              Crie seu primeiro personagem para desbravar os mistérios
              paranormais de Curitiba.
            </p>
            {!busca.trim() && (
              <button
                type="button"
                onClick={onCriarNovo}
                className="mt-2 inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-amber-400 text-black font-black text-xs cursor-pointer shadow-sm"
              >
                <Plus className="size-3.5" /> Forjar Primeiro Personagem
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
