"use client";

import React, { useState } from "react";
import type { CriaturaCalafrio } from "@calafrio/core";
import { Plus } from "lucide-react";

interface FormularioCriarCriaturaProps {
  onCriar: (nome: string, apt: number, categoria: CriaturaCalafrio["categoria"]) => void;
}

export function FormularioCriarCriatura({ onCriar }: FormularioCriarCriaturaProps) {
  const [nomeNovo, setNomeNovo] = useState("");
  const [aptNova, setAptNova] = useState(2);
  const [categoriaNova, setCategoriaNova] = useState<CriaturaCalafrio["categoria"]>("ameaca");

  const lidarSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nomeNovo.trim()) return;
    onCriar(nomeNovo.trim(), aptNova, categoriaNova);
    setNomeNovo("");
  };

  return (
    <form onSubmit={lidarSubmit} className="calafrio-card p-4 space-y-3">
      <span className="calafrio-tag-sm">CRIAR NOVA AMEAÇA</span>
      <input
        type="text"
        value={nomeNovo}
        onChange={(e) => setNomeNovo(e.target.value)}
        placeholder="Nome da criatura..."
        className="w-full bg-muted/60 text-xs p-2 rounded border border-border"
        required
      />
      <div className="grid grid-cols-2 gap-2 text-xs">
        <div>
          <label className="block text-muted-foreground mb-1">Aptidão (APT):</label>
          <input
            type="number"
            min={1}
            max={6}
            value={aptNova}
            onChange={(e) => setAptNova(Number(e.target.value))}
            className="w-full bg-muted p-1.5 rounded border border-border font-bold text-center"
          />
        </div>
        <div>
          <label className="block text-muted-foreground mb-1">Categoria:</label>
          <select
            value={categoriaNova}
            onChange={(e) => setCategoriaNova(e.target.value as any)}
            className="w-full bg-muted p-1.5 rounded border border-border text-xs"
          >
            <option value="ameaca">Ameaça</option>
            <option value="npc">NPC</option>
            <option value="lacaio">Lacaio</option>
            <option value="familiar">Familiar</option>
            <option value="estrutura">Estrutura</option>
          </select>
        </div>
      </div>
      <button
        type="submit"
        className="w-full flex items-center justify-center gap-1.5 bg-amber-400 hover:bg-amber-300 text-black font-bold text-xs py-2 rounded cursor-pointer"
      >
        <Plus className="size-3.5" /> Forjar Criatura (Auto APT)
      </button>
    </form>
  );
}
